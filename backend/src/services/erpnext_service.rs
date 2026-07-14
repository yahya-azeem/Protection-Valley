use std::env;
use serde_json::json;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use anyhow::{anyhow, Result};
use crate::models::Order;

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

        Self {
            client: reqwest::Client::new(),
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

    pub async fn sync_customer(&self, email: &str, name: &str, phone: Option<&str>) -> Result<()> {
        if self.api_key.is_empty() {
            println!("[erpnext] API credentials not set. Skipping customer sync.");
            return Ok(());
        }

        let url = format!("{}/api/resource/Customer", self.base_url);
        let payload = json!({
            "customer_name": name,
            "customer_type": "Company",
            "email_id": email,
            "mobile_no": phone.unwrap_or("")
        });

        let resp = self.client.post(&url)
            .headers(self.headers())
            .json(&payload)
            .send()
            .await?;

        if !resp.status().is_success() {
            let err = resp.text().await?;
            return Err(anyhow!("Failed to sync Customer to ERPNext: {}", err));
        }

        Ok(())
    }

    pub async fn sync_sales_order(&self, order: &Order) -> Result<()> {
        if self.api_key.is_empty() {
            println!("[erpnext] API credentials not set. Skipping sales order sync.");
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

        let resp = self.client.post(&url)
            .headers(self.headers())
            .json(&payload)
            .send()
            .await?;

        if !resp.status().is_success() {
            let err = resp.text().await?;
            return Err(anyhow!("Failed to sync Sales Order to ERPNext: {}", err));
        }

        Ok(())
    }

    pub async fn sync_item_stock(&self, item_code: &str, qty: i32) -> Result<()> {
        if self.api_key.is_empty() {
            println!("[erpnext] API credentials not set. Skipping stock sync.");
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

        let resp = self.client.post(&url)
            .headers(self.headers())
            .json(&payload)
            .send()
            .await?;

        if !resp.status().is_success() {
            let err = resp.text().await?;
            return Err(anyhow!("Failed to sync Item Stock to ERPNext: {}", err));
        }

        Ok(())
    }
}
