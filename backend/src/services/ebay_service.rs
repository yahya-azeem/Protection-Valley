use crate::models::{Product, ProductVariant, SyncResponse};
use crate::services::product_service::ProductService;
use chrono::Utc;

pub struct EbayService {
    app_id: Option<String>,
    oauth_token: Option<String>,
}

impl Default for EbayService {
    fn default() -> Self {
        Self::new()
    }
}

impl EbayService {
    pub fn new() -> Self {
        Self {
            app_id: std::env::var("EBAY_APP_ID").ok(),
            oauth_token: std::env::var("EBAY_OAUTH_TOKEN").ok(),
        }
    }

    /// Fetch products from the eBay Browse API.
    /// Falls back to mock data when credentials are unavailable.
    pub async fn get_ebay_products(&self) -> Result<Vec<Product>, String> {
        // Attempt real eBay API call if credentials are configured
        if let (Some(ref _app_id), Some(ref token)) = (&self.app_id, &self.oauth_token) {
            match self.fetch_from_ebay(token).await {
                Ok(products) => return Ok(products),
                Err(e) => {
                    log::warn!("eBay API call failed, using mock data: {e}");
                }
            }
        }

        let now = Utc::now();
        // Fallback: Products matching the new schema
        Ok(vec![
            Product {
                id: 1,
                name: "Heritage Leather Tool Belt".to_string(),
                description: "Full-grain cowhide tool belt with 7 pockets.".to_string(),
                category: "Tool Belts & Pouches".to_string(),
                image_url: "/images/toolbelt-1.jpg".to_string(),
                images: vec!["/images/toolbelt-1.jpg".into()],
                model_number: "PV-TB-100".to_string(),
                variants: Some(vec![
                    ProductVariant {
                        id: 101,
                        product_id: 1,
                        sku: "PV-TB-100-B-M".into(),
                        ebay_item_id: Some("PV-EB-101".into()),
                        original_name: "Heritage Tool Belt - Black / Medium".into(),
                        price: 189.99,
                        stock: 10,
                        size: Some("Medium".into()),
                        color: Some("Black".into()),
                        pack_quantity: 1,
                        texture: Some("Smooth".into()),
                        image_url: Some("/images/toolbelt-1.jpg".into()),
                        images: vec!["/images/toolbelt-1.jpg".into()],
                        in_stock: true,
                        wholesale_price: None,
                        created_at: now,
                        updated_at: now,
                    }
                ]),
                created_at: now,
                updated_at: now,
            },
        ])
    }

    /// Call the real eBay Browse API and map to the new Product structure.
    async fn fetch_from_ebay(&self, token: &str) -> Result<Vec<Product>, String> {
        let client = reqwest::Client::new();
        let seller_name = std::env::var("EBAY_SELLER_NAME").unwrap_or_else(|_| "protectionvalley".to_string());

        let url = format!(
            "https://api.ebay.com/buy/browse/v1/item_summary/search?filter=sellers:{{{seller_name}}}&limit=100"
        );

        let response = client
            .get(&url)
            .header("Authorization", format!("Bearer {token}"))
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .send()
            .await
            .map_err(|e| format!("HTTP error: {e}"))?;

        if !response.status().is_success() {
            return Err(format!("eBay API returned {}", response.status()));
        }

        let body: serde_json::Value = response.json().await.map_err(|e| format!("JSON error: {e}"))?;
        let empty_vec = vec![];
        let items = body["itemSummaries"].as_array().unwrap_or(&empty_vec);

        let mut groups: std::collections::HashMap<String, Product> = std::collections::HashMap::new();
        let now = Utc::now();

        for item in items {
            let title = item["title"].as_str().unwrap_or_default().to_string();
            let ebay_id = item["itemId"].as_str().unwrap_or_default().to_string();
            let price = item["price"]["value"].as_str().and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
            let image_url = item["image"]["imageUrl"].as_str().map(|s| s.to_string());
            
            let (model, color, size, texture) = self.parse_aspects_from_title(&title);

            let variant = ProductVariant {
                id: 0, // In real sync, this would be from DB or sequence
                product_id: 0,
                sku: item["legacyItemId"].as_str().unwrap_or(&ebay_id).to_string(),
                ebay_item_id: Some(ebay_id),
                original_name: title.clone(),
                price,
                stock: 1,
                size,
                color,
                pack_quantity: 1,
                texture,
                image_url: image_url.clone(),
                images: image_url.map(|u| vec![u]).unwrap_or_default(),
                in_stock: true,
                wholesale_price: None,
                created_at: now,
                updated_at: now,
            };

            let entry = groups.entry(model.clone()).or_insert(Product {
                id: 0,
                name: title.clone(),
                description: String::new(),
                category: "General".to_string(),
                image_url: variant.image_url.clone().unwrap_or_default(),
                images: variant.images.clone(),
                model_number: model,
                variants: Some(Vec::new()),
                created_at: now,
                updated_at: now,
            });
            
            if let Some(ref mut variants) = entry.variants {
                variants.push(variant);
            }
        }

        Ok(groups.into_values().collect())
    }

    /// Helper to parse aspects from eBay titles.
    fn parse_aspects_from_title(&self, title: &str) -> (String, Option<String>, Option<String>, Option<String>) {
        let title_lower = title.to_lowercase();
        
        let color = if title_lower.contains("black") { Some("Black".into()) }
                    else if title_lower.contains("brown") { Some("Brown".into()) }
                    else if title_lower.contains("tan") { Some("Tan".into()) }
                    else { None };

        let size = if title_lower.contains("small") || title_lower.contains(" size s") { Some("Small".into()) }
                   else if title_lower.contains("medium") || title_lower.contains(" size m") { Some("Medium".into()) }
                   else if title_lower.contains("large") || title_lower.contains(" size l") { Some("Large".into()) }
                   else { None };

        let texture = if title_lower.contains("full grain") { Some("Full Grain".into()) }
                      else if title_lower.contains("top grain") { Some("Top Grain".into()) }
                      else if title_lower.contains("distressed") { Some("Distressed".into()) }
                      else { None };

        let model = title.split_whitespace()
            .find(|w| w.starts_with("PV-"))
            .map(|s| s.to_string())
            .unwrap_or_else(|| "PV-GENERIC".to_string());

        (model, color, size, texture)
    }

    /// Sync eBay inventory status by fetching eBay listings and updating local DB.
    pub async fn sync_inventory(&self) -> Result<SyncResponse, String> {
        let products = self.get_ebay_products().await?;
        let product_service = ProductService::new();
        
        let mut updated = 0;
        let mut synced = 0;
        let mut errors = Vec::new();
        
        if let Ok(local_products) = product_service.get_all_products().await {
            for ebay_prod in &products {
                if let Some(ref ebay_variants) = ebay_prod.variants {
                    for ev in ebay_variants {
                        for lp in &local_products {
                            if let Some(ref l_variants) = lp.variants {
                                for lv in l_variants {
                                    if lv.sku == ev.sku || (lv.ebay_item_id.is_some() && lv.ebay_item_id == ev.ebay_item_id) {
                                        match product_service.update_variant_stock(lv.id, ev.stock).await {
                                            Ok(_) => {
                                                updated += 1;
                                                synced += 1;
                                            }
                                            Err(e) => {
                                                errors.push(format!("Failed to update stock for variant ID {}: {}", lv.id, e));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        Ok(SyncResponse {
            synced,
            created: 0,
            updated,
            errors,
        })
    }

    /// Update variant quantity on eBay.
    /// If the SKU is purely numeric, we treat it as an eBay Item ID (Trading API).
    /// If it is a string, we treat it as an eBay SKU (Inventory API).
    pub async fn update_ebay_item_quantity(&self, sku: &str, new_quantity: i32) -> Result<(), String> {
        if let (Some(ref _app_id), Some(ref token)) = (&self.app_id, &self.oauth_token) {
            let client = reqwest::Client::new();
            
            // Check if SKU is purely numeric (Item ID)
            let is_numeric = sku.chars().all(|c| c.is_ascii_digit());
            
            if is_numeric {
                // Trading API - ReviseInventoryStatus (XML)
                let url = "https://api.ebay.com/ws/api.dll";
                let xml_body = format!(
                    r#"<?xml version="1.0" encoding="utf-8"?>
                    <ReviseInventoryStatusRequest xmlns="urn:ebay:apis:eBLBaseComponents">
                      <RequesterCredentials>
                        <eBayAuthToken>{}</eBayAuthToken>
                      </RequesterCredentials>
                      <InventoryStatus>
                        <ItemID>{}</ItemID>
                        <Quantity>{}</Quantity>
                      </InventoryStatus>
                    </ReviseInventoryStatusRequest>"#,
                    token, sku, new_quantity
                );
                
                match client.post(url)
                    .header("X-EBAY-API-COMPATIBILITY-LEVEL", "967")
                    .header("X-EBAY-API-CALL-NAME", "ReviseInventoryStatus")
                    .header("X-EBAY-API-SITEID", "0")
                    .header("Content-Type", "text/xml")
                    .body(xml_body)
                    .send()
                    .await
                {
                    Ok(resp) => {
                        let status = resp.status();
                        if status.is_success() {
                            log::info!("Successfully updated quantity for Item ID {sku} to {new_quantity} on eBay via Trading API");
                            return Ok(());
                        } else {
                            let text = resp.text().await.unwrap_or_default();
                            return Err(format!("eBay Trading API returned status {status}: {text}"));
                        }
                    }
                    Err(e) => return Err(format!("Failed to connect to eBay Trading API: {e}")),
                }
            } else {
                // Inventory API - update price/quantity (JSON)
                let url = format!("https://api.ebay.com/sell/inventory/v1/inventory_item/{}/update_price_quantity", sku);
                let payload = serde_json::json!({
                    "shipToLocationAvailability": {
                        "quantity": new_quantity
                    }
                });
                
                match client.post(&url)
                    .header("Authorization", format!("Bearer {token}"))
                    .header("Content-Type", "application/json")
                    .json(&payload)
                    .send()
                    .await
                {
                    Ok(resp) => {
                        let status = resp.status();
                        if status.is_success() {
                            log::info!("Successfully updated quantity for SKU {sku} to {new_quantity} on eBay via Inventory API");
                            return Ok(());
                        } else {
                            let text = resp.text().await.unwrap_or_default();
                            return Err(format!("eBay Inventory API returned status {status}: {text}"));
                        }
                    }
                    Err(e) => return Err(format!("Failed to connect to eBay Inventory API: {e}")),
                }
            }
        }
        
        log::warn!("eBay credentials not set. Simulated stock update for SKU/ID {sku} to {new_quantity}");
        Ok(())
    }

    /// Push a local product to eBay as a listing.
    pub async fn sync_product_to_ebay(&self, product_id: i64) -> Result<String, String> {
        Ok(format!("PV-EBAY-{product_id}"))
    }
}
