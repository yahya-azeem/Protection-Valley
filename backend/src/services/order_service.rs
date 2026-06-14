use crate::models::{CreateOrderRequest, Order, OrderItem, OrderStatus};
use crate::services::product_service::ProductService;
use crate::services::shipping_service::ShippingService;
use crate::services::email_service::EmailService;
use chrono::Utc;
use uuid::Uuid;
use std::env;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use anyhow::Result;

pub struct OrderService {
    client: reqwest::Client,
    supabase_url: String,
    supabase_key: String,
}

impl Default for OrderService {
    fn default() -> Self {
        Self::new()
    }
}

impl OrderService {
    pub fn new() -> Self {
        let supabase_url = env::var("SUPABASE_URL").unwrap_or_else(|_| "https://fnirqccmtjzibjhgzyay.supabase.co".to_string());
        let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY")
            .or_else(|_| env::var("SUPABASE_ANON_KEY"))
            .unwrap_or_default();
        
        Self {
            client: reqwest::Client::new(),
            supabase_url,
            supabase_key,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        let key = self.supabase_key.trim();
        if let Ok(val) = HeaderValue::from_str(key) {
            headers.insert("apikey", val);
            if let Ok(auth) = HeaderValue::from_str(&format!("Bearer {}", key)) {
                headers.insert(AUTHORIZATION, auth);
            }
        }
        headers
    }

    pub async fn get_all_orders(&self) -> Result<Vec<Order>, String> {
        let url = format!("{}/rest/v1/orders?select=*&order=created_at.desc", self.supabase_url);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {}", error));
        }

        let orders: Vec<Order> = response.json()
            .await
            .map_err(|e| format!("Failed to parse orders: {}", e))?;

        Ok(orders)
    }

    pub async fn get_order_by_id(&self, id: &str) -> Result<Option<Order>, String> {
        let url = format!("{}/rest/v1/orders?id=eq.{}&select=*", self.supabase_url, id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        let orders: Vec<Order> = response.json()
            .await
            .map_err(|e| format!("Failed to parse order: {}", e))?;

        Ok(orders.into_iter().next())
    }

    pub async fn create_order(&self, req: CreateOrderRequest) -> Result<Order, String> {
        let CreateOrderRequest {
            customer_id,
            items: request_items,
            shipping_address,
            payment_method,
        } = req;

        let product_service = ProductService::new();
        let mut items: Vec<OrderItem> = Vec::new();
        let mut total_weight_oz = 0.0;

        for item in request_items {
            let product_id = item.product_id;
            let variant_id = item.variant_id;
            let quantity = item.quantity;

            if let Ok(Some(product)) = product_service.get_product(&product_id).await {
                let variant = if let Some(ref vid_str) = variant_id {
                    if let Ok(vid) = vid_str.parse::<i64>() {
                        product.variants.as_ref()
                            .and_then(|vs| vs.iter().find(|v| v.id == vid))
                            .or_else(|| product.variants.as_ref().and_then(|vs| vs.first()))
                    } else {
                        product.variants.as_ref().and_then(|vs| vs.first())
                    }
                } else {
                    product.variants.as_ref().and_then(|vs| vs.first())
                };

                if let Some(v) = variant {
                    items.push(OrderItem {
                        product_id: product_id.clone(),
                        product_name: format!("{} - {}", product.name, v.original_name),
                        quantity,
                        unit_price: v.price,
                        total_price: v.price * quantity as f64,
                    });
                    // Assuming average product weight if not specified in V2 models yet
                    total_weight_oz += 16.0 * quantity as f64; 
                }
            }
        }

        if items.is_empty() {
            return Err("No valid products found for order creation".to_string());
        }

        let subtotal: f64 = items.iter().map(|i| i.total_price).sum();
        let shipping_cost = if subtotal >= 100.0 { 0.0 } else { 15.0 };
        let total = subtotal + shipping_cost;
        let customer_name = format!("{} {}", shipping_address.first_name, shipping_address.last_name).trim().to_string();

        let mut order = Order {
            id: format!("ORD-{}", Uuid::new_v4().to_string()[..8].to_uppercase()),
            customer_id,
            customer_name,
            customer_email: String::new(), // In production, this should be looked up from user profile
            items,
            subtotal,
            shipping_cost,
            total,
            status: OrderStatus::Pending,
            shipping_address: shipping_address.clone(),
            payment_method,
            carrier: None,
            tracking_number: None,
            shipping_label_url: None,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        // 1. Initial Persistence in Supabase
        let url = format!("{}/rest/v1/orders", self.supabase_url);
        let _ = self.client
            .post(&url)
            .headers(self.headers())
            .json(&order)
            .send()
            .await
            .map_err(|e| format!("Failed to create order: {}", e))?;

        // 1b. Decrement local stock and sync to eBay
        let ebay_service = crate::services::ebay_service::EbayService::new();
        for item in &order.items {
            if let Ok(p_id) = item.product_id.parse::<i64>() {
                if let Ok(Some(product)) = product_service.get_product_by_id(p_id).await {
                if let Some(ref variants) = product.variants {
                    for v in variants {
                        let name_with_variant = format!("{} - {}", product.name, v.original_name);
                        if name_with_variant == item.product_name {
                            let new_stock = (v.stock - item.quantity).max(0);
                            
                            // Update database stock
                            if let Err(e) = product_service.update_variant_stock(v.id, new_stock).await {
                                eprintln!("[order_service] Failed to update local stock for variant {}: {e}", v.id);
                            }
                            
                            // Sync with eBay
                            let identifier_to_update = v.ebay_item_id.as_ref().unwrap_or(&v.sku);
                            if let Err(e) = ebay_service.update_ebay_item_quantity(identifier_to_update, new_stock).await {
                                eprintln!("[order_service] Failed to update eBay quantity: {e}");
                            }
                        }
                    }
                }
            }
          }
        }

        // 2. Generate Shipping Label via EasyPost
        let shipping_service = ShippingService::new();
        match shipping_service.create_cheapest_label(shipping_address, total_weight_oz).await {
            Ok(label) => {
                order.carrier = Some(label.carrier);
                order.tracking_number = Some(label.tracking_number);
                order.shipping_label_url = Some(label.label_url);
                order.status = OrderStatus::Processing;
                
                // Update order in Supabase with label info
                let update_url = format!("{}/rest/v1/orders?id=eq.{}", self.supabase_url, order.id);
                let _ = self.client
                    .patch(&update_url)
                    .headers(self.headers())
                    .json(&serde_json::json!({
                        "carrier": order.carrier,
                        "tracking_number": order.tracking_number,
                        "shipping_label_url": order.shipping_label_url,
                        "status": order.status,
                        "updated_at": Utc::now()
                    }))
                    .send()
                    .await;

                // 3. Send Email Notification via SendGrid
                let email_service = EmailService::new();
                if let Err(e) = email_service.send_order_notification(&order).await {
                    eprintln!("[order_service] Failed to send email alert: {e}");
                }
            }
            Err(e) => {
                eprintln!("[order_service] Shipping Label Generation Failed: {e}");
                // Non-fatal error; fulfillment can be handled manually later
            }
        }

        Ok(order)
    }

    pub async fn update_order_status(&self, id: &str, status: OrderStatus) -> Result<Option<Order>, String> {
        let update_url = format!("{}/rest/v1/orders?id=eq.{}", self.supabase_url, id);
        let _ = self.client
            .patch(&update_url)
            .headers(self.headers())
            .json(&serde_json::json!({
                "status": status,
                "updated_at": Utc::now()
            }))
            .send()
            .await;
            
        self.get_order_by_id(id).await
    }
}
