use std::env;
use std::time::Duration;
use serde_json::json;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use anyhow::{anyhow, Result};
use crate::models::Order;

const CONNECT_TIMEOUT_SECS: u64 = 10;
const REQUEST_TIMEOUT_SECS: u64 = 30;
const MAX_RETRIES: u32 = 3;
const RETRY_BASE_DELAY_MS: u64 = 1000;

pub struct ErpNextService {
    client: reqwest::Client,
    base_url: String,
    api_key: String,
    api_secret: String,
}

impl ErpNextService {
    pub fn new() -> Self {
        let base_url = env::var("ERPNEXT_URL")
            .unwrap_or_else(|_| "http://localhost:8080".to_string());
        let api_key = env::var("ERPNEXT_API_KEY").unwrap_or_default();
        let api_secret = env::var("ERPNEXT_API_SECRET").unwrap_or_default();

        let client = reqwest::Client::builder()
            .connect_timeout(Duration::from_secs(CONNECT_TIMEOUT_SECS))
            .timeout(Duration::from_secs(REQUEST_TIMEOUT_SECS))
            .pool_max_idle_per_host(5)
            .pool_idle_timeout(Duration::from_secs(90))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            base_url,
            api_key,
            api_secret,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

        if !self.api_key.is_empty() && !self.api_secret.is_empty() {
            let auth_val = format!("token {}:{}", self.api_key, self.api_secret);
            if let Ok(auth) = HeaderValue::from_str(&auth_val) {
                headers.insert(AUTHORIZATION, auth);
            }
        }
        headers
    }

    fn is_configured(&self) -> bool {
        !self.api_key.is_empty() && !self.api_secret.is_empty()
    }

    /// Execute a request with retry and exponential backoff.
    async fn execute_with_retry<F, Fut>(&self, label: &str, f: F) -> Result<reqwest::Response>
    where
        F: Fn() -> Fut,
        Fut: std::future::Future<Output = Result<reqwest::Response, reqwest::Error>>,
    {
        let mut last_err = None;

        for attempt in 1..=MAX_RETRIES {
            match f().await {
                Ok(resp) if resp.status().is_success() => return Ok(resp),
                Ok(resp) => {
                    let status = resp.status();
                    let body = resp.text().await.unwrap_or_default();

                    // Don't retry client errors (4xx) except 429 (rate limit)
                    if status.is_client_error() && status.as_u16() != 429 {
                        log::error!("[erpnext] {label}: HTTP {status} — {body}");
                        return Err(anyhow!("{label} failed: HTTP {status} — {body}"));
                    }

                    // Retry on 429 or 5xx
                    log::warn!("[erpnext] {label}: HTTP {status} (attempt {attempt}/{MAX_RETRIES}), retrying...");
                    last_err = Some(anyhow!("{label} failed: HTTP {status} — {body}"));
                }
                Err(e) => {
                    log::warn!("[erpnext] {label}: {e} (attempt {attempt}/{MAX_RETRIES}), retrying...");
                    last_err = Some(e.into());
                }
            }

            if attempt < MAX_RETRIES {
                let delay = Duration::from_millis(RETRY_BASE_DELAY_MS * 2u64.pow(attempt - 1));
                tokio::time::sleep(delay).await;
            }
        }

        let err = last_err.unwrap_or_else(|| anyhow!("{label}: all {MAX_RETRIES} retries exhausted"));
        log::error!("[erpnext] {label}: permanently failed — {err}");
        Err(err)
    }

    pub async fn sync_customer(&self, email: &str, name: &str, phone: Option<&str>) -> Result<()> {
        if !self.is_configured() {
            log::warn!("[erpnext] API credentials not set. Skipping customer sync for {email}.");
            return Ok(());
        }

        let url = format!("{}/api/resource/Customer", self.base_url);
        let payload = json!({
            "customer_name": name,
            "customer_type": "Company",
            "email_id": email,
            "mobile_no": phone.unwrap_or("")
        });

        let client = &self.client;
        let headers = self.headers();
        self.execute_with_retry(&format!("sync_customer({email})"), || {
            let url = url.clone();
            let payload = payload.clone();
            let headers = headers.clone();
            async move {
                client.post(&url).headers(headers).json(&payload).send().await
            }
        }).await?;

        log::info!("[erpnext] Customer synced: {email}");
        Ok(())
    }

    pub async fn sync_sales_order(&self, order: &Order) -> Result<()> {
        if !self.is_configured() {
            log::warn!("[erpnext] API credentials not set. Skipping sales order sync for order {}.", order.id);
            return Ok(());
        }

        let url = format!("{}/api/resource/Sales Order", self.base_url);

        let mut items = Vec::new();
        for item in &order.items {
            let item_code = item.sku.as_deref().unwrap_or(&item.product_id);
            items.push(json!({
                "item_code": item_code,
                "qty": item.quantity,
                "rate": item.unit_price
            }));
        }

        let payload = json!({
            "customer": order.customer_name,
            "delivery_date": chrono::Utc::now().to_rfc3339(),
            "items": items,
            "net_total": order.subtotal,
            "grand_total": order.total,
            "shipping_address": format!(
                "{} {}\n{}\n{}, {} {}\n{}",
                order.shipping_address.first_name,
                order.shipping_address.last_name,
                order.shipping_address.address_line1,
                order.shipping_address.city,
                order.shipping_address.state,
                order.shipping_address.zip,
                order.shipping_address.country
            )
        });

        let client = &self.client;
        let headers = self.headers();
        self.execute_with_retry(&format!("sync_sales_order({})", order.id), || {
            let url = url.clone();
            let payload = payload.clone();
            let headers = headers.clone();
            async move {
                client.post(&url).headers(headers).json(&payload).send().await
            }
        }).await?;

        log::info!("[erpnext] Sales order synced: {}", order.id);
        Ok(())
    }

    pub async fn sync_item_stock(&self, item_code: &str, qty: i32) -> Result<()> {
        if !self.is_configured() {
            log::warn!("[erpnext] API credentials not set. Skipping stock sync for SKU {item_code}.");
            return Ok(());
        }

        let url = format!("{}/api/resource/Stock Reconciliation", self.base_url);
        let payload = json!({
            "purpose": "Stock Reconciliation",
            "company": "Protection Valley",
            "items": [
                {
                    "item_code": item_code,
                    "qty": qty,
                    "warehouse": "Stores - PV"
                }
            ]
        });

        let client = &self.client;
        let headers = self.headers();
        self.execute_with_retry(&format!("sync_item_stock({item_code})"), || {
            let url = url.clone();
            let payload = payload.clone();
            let headers = headers.clone();
            async move {
                client.post(&url).headers(headers).json(&payload).send().await
            }
        }).await?;

        log::info!("[erpnext] Stock synced: SKU {item_code} → {qty}");
        Ok(())
    }

    pub async fn sync_item(&self, sku: &str, name: &str, rate: f64) -> Result<()> {
        if !self.is_configured() {
            log::warn!("[erpnext] API credentials not set. Skipping item sync for SKU {sku}.");
            return Ok(());
        }

        // Check if item already exists
        let check_url = format!("{}/api/resource/Item/{}", self.base_url, urlencoding::encode(sku));
        if let Ok(resp) = self.client.get(&check_url).headers(self.headers()).send().await {
            if resp.status().is_success() {
                return Ok(());
            }
        }

        let url = format!("{}/api/resource/Item", self.base_url);
        let payload = json!({
            "item_code": sku,
            "item_name": name,
            "item_group": "All Items",
            "stock_uom": "Nos",
            "standard_rate": rate,
            "company": "Protection Valley"
        });

        let client = &self.client;
        let headers = self.headers();
        self.execute_with_retry(&format!("sync_item({sku})"), || {
            let url = url.clone();
            let payload = payload.clone();
            let headers = headers.clone();
            async move {
                client.post(&url).headers(headers).json(&payload).send().await
            }
        }).await?;

        log::info!("[erpnext] Item synced: SKU {sku}");
        Ok(())
    }

    pub async fn sync_order_status(&self, order_id: &str, status: &str, tracking: Option<&str>) -> Result<()> {
        if !self.is_configured() {
            log::warn!("[erpnext] API credentials not set. Skipping order status sync for order {order_id}.");
            return Ok(());
        }

        let erp_status = match status {
            "processing" => "To Deliver and Bill",
            "shipped" => "To Bill",
            "completed" => "Completed",
            "cancelled" => "Cancelled",
            _ => "Draft",
        };

        let url = format!("{}/api/resource/Sales Order/{}", self.base_url, urlencoding::encode(order_id));
        let mut payload = serde_json::Map::new();
        payload.insert("status".to_string(), serde_json::to_value(erp_status).unwrap());
        if let Some(trk) = tracking {
            payload.insert("tracking_info".to_string(), serde_json::to_value(json!([{"carrier": "", "tracking_number": trk}])).unwrap());
        }

        let client = &self.client;
        let headers = self.headers();
        self.execute_with_retry(&format!("sync_order_status({order_id})"), || {
            let url = url.clone();
            let payload = payload.clone();
            let headers = headers.clone();
            async move {
                client.put(&url).headers(headers).json(&payload).send().await
            }
        }).await?;

        log::info!("[erpnext] Order status synced: {order_id} → {erp_status}");
        Ok(())
    }
}
