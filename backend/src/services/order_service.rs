use crate::models::{CreateOrderRequest, Order, OrderItem, OrderStatus, Address};
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
        if env::var("SUPABASE_SERVICE_ROLE_KEY").is_err() {
            eprintln!("[WARN] SUPABASE_SERVICE_ROLE_KEY is not configured! Database requests may fail due to Row Level Security (RLS) policies.");
        }
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
        let stripe_secret_key = env::var("STRIPE_SECRET_KEY").unwrap_or_default();
        let stripe_sessions = if !stripe_secret_key.is_empty() {
            let url = "https://api.stripe.com/v1/checkout/sessions?limit=100&expand[]=data.line_items";
            match self.client
                .get(url)
                .bearer_auth(&stripe_secret_key)
                .send()
                .await {
                    Ok(resp) => {
                        if resp.status().is_success() {
                            let json: serde_json::Value = resp.json().await.unwrap_or_default();
                            json["data"].as_array().cloned().unwrap_or_default()
                        } else {
                            eprintln!("[order_service] Stripe error: {}", resp.text().await.unwrap_or_default());
                            Vec::new()
                        }
                    }
                    Err(e) => {
                        eprintln!("[order_service] Stripe request failed: {e}");
                        Vec::new()
                    }
                }
        } else {
            Vec::new()
        };

        let url = format!("{}/rest/v1/orders?select=*", self.supabase_url);
        let supabase_orders: Vec<Order> = match self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await {
                Ok(resp) => {
                    if resp.status().is_success() {
                        resp.json().await.unwrap_or_default()
                    } else {
                        Vec::new()
                    }
                }
                Err(_) => Vec::new()
            };

        let mut supabase_map: std::collections::HashMap<String, Order> = supabase_orders
            .into_iter()
            .map(|o| (o.id.clone(), o))
            .collect();

        let mut orders = Vec::new();
        for session in stripe_sessions {
            if session["payment_status"].as_str() != Some("paid") {
                continue;
            }

            let session_id = session["id"].as_str().unwrap_or_default().to_string();
            if session_id.is_empty() {
                continue;
            }

            if let Some(db_order) = supabase_map.remove(&session_id) {
                orders.push(db_order);
                continue;
            }

            let customer_details = &session["customer_details"];
            let customer_name = customer_details["name"].as_str().unwrap_or("Guest").to_string();
            let customer_email = customer_details["email"].as_str().unwrap_or("").to_string();
            
            let amount_total = session["amount_total"].as_f64().unwrap_or(0.0) / 100.0;
            let amount_subtotal = session["amount_subtotal"].as_f64().unwrap_or(0.0) / 100.0;
            let amount_tax = session["total_details"]["amount_tax"].as_f64().unwrap_or(0.0) / 100.0;
            let shipping_cost = (amount_total - amount_subtotal - amount_tax).max(0.0);

            let mut items = Vec::new();
            if let Some(lines) = session["line_items"]["data"].as_array() {
                for line in lines {
                    let desc = line["description"].as_str().unwrap_or("Product").to_string();
                    let qty = line["quantity"].as_i64().unwrap_or(1) as i32;
                    let price = line["price"]["unit_amount"].as_f64().unwrap_or(0.0) / 100.0;
                    items.push(OrderItem {
                        product_id: "stripe_item".to_string(),
                        product_name: desc,
                        quantity: qty,
                        unit_price: price,
                        total_price: price * qty as f64,
                        sku: None,
                    });
                }
            }

            let shipping = &session["shipping_details"];
            let address_val = &shipping["address"];
            let shipping_address = Address {
                first_name: shipping["name"].as_str().unwrap_or("Guest").to_string(),
                last_name: String::new(),
                address_line1: address_val["line1"].as_str().unwrap_or("").to_string(),
                address_line2: address_val["line2"].as_str().map(|s| s.to_string()),
                city: address_val["city"].as_str().unwrap_or("").to_string(),
                state: address_val["state"].as_str().unwrap_or("").to_string(),
                zip: address_val["postal_code"].as_str().unwrap_or("").to_string(),
                country: address_val["country"].as_str().unwrap_or("US").to_string(),
                phone: None,
            };

            let created_epoch = session["created"].as_i64().unwrap_or(0);
            let created_at = chrono::DateTime::<chrono::Utc>::from_timestamp(created_epoch, 0)
                .unwrap_or_else(|| Utc::now());

            orders.push(Order {
                id: session_id,
                customer_id: 0,
                customer_name,
                customer_email,
                items,
                subtotal: amount_subtotal,
                shipping_cost,
                sales_tax: amount_tax,
                total: amount_total,
                status: OrderStatus::Pending,
                shipping_address,
                payment_method: "Stripe".to_string(),
                carrier: None,
                tracking_number: None,
                shipping_label_url: None,
                shipping_label_printed: false,
                shipping_label_printed_at: None,
                created_at,
                updated_at: created_at,
            });
        }

        for (_, db_order) in supabase_map {
            orders.push(db_order);
        }

        orders.sort_by(|a, b| b.created_at.cmp(&a.created_at));

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
            id: request_id,
            customer_email: request_email,
            shipping_cost,
            sales_tax,
        } = req;

        let product_service = ProductService::new();
        let mut items: Vec<OrderItem> = Vec::new();

        let auth_service = crate::services::auth_service::AuthService::new();
        let user = if customer_id != 0 {
            auth_service.get_user_by_id(customer_id).await.ok().flatten()
        } else {
            None
        };

        let is_wholesale = user.as_ref()
            .map(|u| (u.role == crate::models::UserRole::Wholesale && u.is_wholesale_approved.unwrap_or(false)) || u.role == crate::models::UserRole::Admin)
            .unwrap_or(false);

        let (wholesale_discount, custom_prices) = if is_wholesale {
            let discount = user.as_ref().and_then(|u| u.wholesale_discount).unwrap_or(0.30);
            let prices = product_service.get_customer_specific_prices(customer_id).await.unwrap_or_default();
            (discount, prices)
        } else {
            (0.30, Vec::new())
        };

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
                    let unit_price = if is_wholesale {
                        let custom = custom_prices.iter()
                            .find(|p| p.variant_id == v.id)
                            .map(|p| p.custom_price);
                        
                        if let Some(price) = custom {
                            price
                        } else {
                            v.price * (1.0 - wholesale_discount)
                        }
                    } else {
                        v.price
                    };

                    items.push(OrderItem {
                        product_id: product_id.clone(),
                        product_name: format!("{} - {}", product.name, v.original_name),
                        quantity,
                        unit_price,
                        total_price: unit_price * quantity as f64,
                        sku: Some(v.sku.clone()),
                    });
                }
            }
        }

        if items.is_empty() {
            return Err("No valid products found for order creation".to_string());
        }

        let subtotal: f64 = items.iter().map(|i| i.total_price).sum();
        
        let (shipping_cost_val, sales_tax_val) = if payment_method.to_lowercase() == "stripe" {
            let s_cost = shipping_cost.unwrap_or(0.0);
            let s_tax = sales_tax.unwrap_or(0.0);
            (s_cost, s_tax)
        } else {
            // Zelle or other manual payment methods - recalculate securely
            let shipping_service = ShippingService::new();
            let total_weight_oz = items.iter().map(|i| 16.0 * i.quantity as f64).sum();
            let s_cost = match shipping_service.calculate_shipping_rate(shipping_address.clone(), total_weight_oz).await {
                Ok(cost) => {
                    if subtotal >= 100.0 { 0.0 } else { cost }
                }
                Err(e) => {
                    eprintln!("[create_order] EasyPost failed: {e}");
                    if subtotal >= 100.0 { 0.0 } else { 15.0 }
                }
            };
            let s_tax = calculate_sales_tax(&shipping_address.state, subtotal);
            (s_cost, s_tax)
        };
        let total = subtotal + shipping_cost_val + sales_tax_val;
        let customer_name = format!("{} {}", shipping_address.first_name, shipping_address.last_name).trim().to_string();

        let order_id = request_id.unwrap_or_else(|| format!("ORD-{}", Uuid::new_v4().to_string()[..8].to_uppercase()));

        let order = Order {
            id: order_id,
            customer_id,
            customer_name,
            customer_email: request_email.unwrap_or_default(),
            items,
            subtotal,
            shipping_cost: shipping_cost_val,
            sales_tax: sales_tax_val,
            total,
            status: OrderStatus::Pending,
            shipping_address: shipping_address.clone(),
            payment_method,
            carrier: None,
            tracking_number: None,
            shipping_label_url: None,
            shipping_label_printed: false,
            shipping_label_printed_at: None,
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
                                
                                // Sync with ERPNext
                                let erp_service = crate::services::erpnext_service::ErpNextService::new();
                                if let Err(e) = erp_service.sync_item_stock(&v.sku, new_stock).await {
                                    eprintln!("[erpnext] Failed to sync item stock for SKU {}: {e}", v.sku);
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

        // Send Email Notification
        let email_service = EmailService::new();
        if let Err(e) = email_service.send_order_notification(&order).await {
            eprintln!("[order_service] Failed to send email alert: {e}");
        }

        // Sync Sales Order to ERPNext
        let erp_service = crate::services::erpnext_service::ErpNextService::new();
        if let Err(e) = erp_service.sync_sales_order(&order).await {
            eprintln!("[erpnext] Failed to sync order to ERPNext: {e}");
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

    pub async fn generate_shipping_label(&self, id: &str) -> Result<Order, String> {
        let order = self.get_order_by_id(id).await?
            .ok_or_else(|| "Order not found".to_string())?;

        if order.shipping_label_printed {
            return Ok(order);
        }

        let shipping_service = ShippingService::new();
        let total_weight_oz: f64 = order.items.iter().map(|i| 16.0 * i.quantity as f64).sum();

        let label = shipping_service.create_cheapest_label(order.shipping_address.clone(), total_weight_oz)
            .await
            .map_err(|e| format!("EasyPost error: {e}"))?;

        let update_url = format!("{}/rest/v1/orders?id=eq.{}", self.supabase_url, id);
        let response = self.client
            .patch(&update_url)
            .headers(self.headers())
            .json(&serde_json::json!({
                "carrier": label.carrier,
                "tracking_number": label.tracking_number,
                "shipping_label_url": label.label_url,
                "status": OrderStatus::Processing,
                "shipping_label_printed": true,
                "shipping_label_printed_at": Utc::now(),
                "updated_at": Utc::now()
            }))
            .send()
            .await
            .map_err(|e| format!("Database request failed: {e}"))?;

        if !response.status().is_success() {
            let err = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {err}"));
        }

        let mut updated_order = order;
        updated_order.carrier = Some(label.carrier);
        updated_order.tracking_number = Some(label.tracking_number);
        updated_order.shipping_label_url = Some(label.label_url);
        updated_order.status = OrderStatus::Processing;
        updated_order.shipping_label_printed = true;
        updated_order.shipping_label_printed_at = Some(Utc::now());

        let email_service = EmailService::new();
        if let Err(e) = email_service.send_order_notification(&updated_order).await {
            eprintln!("[order_service] Failed to send email alert: {e}");
        }

        Ok(updated_order)
    }
}

fn calculate_sales_tax(state: &str, subtotal: f64) -> f64 {
    let rate = match state.to_uppercase().as_str() {
        "TX" | "CA" | "NY" | "IL" => 0.0825,
        "FL" => 0.07,
        "OR" | "DE" | "MT" | "NH" | "AK" => 0.0,
        _ => 0.06,
    };
    subtotal * rate
}
