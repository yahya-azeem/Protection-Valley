use crate::models::{Product, ProductVariant, SyncResponse};
use crate::services::product_service::ProductService;
use chrono::Utc;
use std::collections::HashMap;

pub struct EbayService {
    app_id: Option<String>,
    cert_id: Option<String>,
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
            cert_id: std::env::var("EBAY_CERT_ID")
                .or_else(|_| std::env::var("EBAY_CLIENT_SECRET"))
                .ok(),
        }
    }

    fn is_configured(&self) -> bool {
        self.app_id.is_some() && self.cert_id.is_some()
    }

    /// Perform the OAuth 2.0 client credentials token request
    async fn get_token(&self) -> Result<String, String> {
        let app_id = self.app_id.as_ref().ok_or("EBAY_APP_ID not configured")?;
        let cert_id = self.cert_id.as_ref().ok_or("EBAY_CERT_ID not configured")?;

        let client = reqwest::Client::new();

        // Manual base64 encoding for "app_id:cert_id"
        let credentials_raw = format!("{}:{}", app_id, cert_id);
        let credentials = base64_encode(credentials_raw.as_bytes());

        let response = client
            .post("https://api.ebay.com/identity/v1/oauth2/token")
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Authorization", format!("Basic {credentials}"))
            .body("grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope")
            .send()
            .await
            .map_err(|e| format!("eBay token request failed: {e}"))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let err_text = response.text().await.unwrap_or_default();
            return Err(format!("eBay OAuth error {status}: {err_text}"));
        }

        let body: serde_json::Value = response.json().await
            .map_err(|e| format!("Token response parse error: {e}"))?;

        let token = body["access_token"].as_str()
            .ok_or("Missing access_token in eBay OAuth response")?
            .to_string();

        let expires_in = body["expires_in"].as_i64().unwrap_or(7200);
        log::info!("eBay OAuth token obtained, expires in {}s", expires_in);
        Ok(token)
    }

    /// Fetch all inventory items from eBay with pagination
    pub async fn get_ebay_products(&self) -> Result<Vec<Product>, String> {
        if !self.is_configured() {
            return Err("eBay credentials not configured (EBAY_APP_ID and EBAY_CERT_ID required)".into());
        }

        let token = self.get_token().await?;
        let client = reqwest::Client::new();
        let mut all_items = Vec::new();
        let mut offset = 0i64;
        let limit = 200i64;

        loop {
            let url = format!(
                "https://api.ebay.com/sell/inventory/v1/inventory_item?limit={}&offset={}",
                limit, offset
            );

            let response = client
                .get(&url)
                .header("Authorization", format!("Bearer {token}"))
                .header("Content-Type", "application/json")
                .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
                .send()
                .await
                .map_err(|e| format!("eBay Inventory API HTTP error: {e}"))?;

            if !response.status().is_success() {
                let status = response.status().as_u16();
                let err = response.text().await.unwrap_or_default();
                return Err(format!("eBay Inventory API error {status}: {err}"));
            }

            let body: serde_json::Value = response.json().await
                .map_err(|e| format!("JSON parse error: {e}"))?;

            let empty_vec = vec![];
            let items = body["inventoryItems"].as_array().unwrap_or(&empty_vec);

            if items.is_empty() {
                break;
            }

            for item in items {
                all_items.push(item.clone());
            }

            let total = body["total"].as_i64().unwrap_or(0);
            offset += limit;
            if offset >= total {
                break;
            }
        }

        self.build_products_from_inventory(all_items)
    }

    /// Convert raw eBay inventory items into our Product model
    fn build_products_from_inventory(&self, items: Vec<serde_json::Value>) -> Result<Vec<Product>, String> {
        let now = Utc::now();
        let mut groups: HashMap<String, Product> = HashMap::new();

        for item in &items {
            let sku = item["sku"].as_str().unwrap_or_default().to_string();
            let title = item["title"].as_str()
                .or_else(|| item["description"].as_str())
                .unwrap_or(&sku)
                .to_string();

            // Extract stock quantity
            let availability = &item["availability"];
            let quantity = availability["shipToLocationAvailability"]["quantity"]
                .as_i64()
                .or_else(|| availability["pickupAtLocationAvailability"]["quantity"].as_i64())
                .unwrap_or(0) as i32;

            // Extract price from product
            let price = item["product"]["price"]["value"]
                .as_str()
                .and_then(|v| v.parse::<f64>().ok())
                .unwrap_or(0.0);

            // Extract image
            let image_url = item["product"]["image"]["imageUrl"]
                .as_str()
                .map(|s| s.to_string());

            // Extract aspects (color, size, texture)
            let aspects = item["product"]["aspects"].as_object();
            let color = aspects
                .and_then(|a| a.get("Color"))
                .and_then(|v| v.as_array())
                .and_then(|arr| arr.first())
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());

            let size = aspects
                .and_then(|a| a.get("Size"))
                .and_then(|v| v.as_array())
                .and_then(|arr| arr.first())
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());

            let texture = aspects
                .and_then(|a| a.get("Material"))
                .and_then(|v| v.as_array())
                .and_then(|arr| arr.first())
                .and_then(|v| v.as_str())
                .map(|s| s.to_string());

            // Group by model number (derived from SKU or title)
            let model = self.derive_model_number(&sku, &title);

            let variant = ProductVariant {
                id: 0,
                product_id: 0,
                sku: sku.clone(),
                ebay_item_id: Some(sku.clone()),
                original_name: title.clone(),
                price,
                stock: quantity,
                size,
                color,
                pack_quantity: 1,
                texture,
                image_url: image_url.clone(),
                images: image_url.map(|u| vec![u]).unwrap_or_default(),
                in_stock: quantity > 0,
                wholesale_price: None,
                created_at: now,
                updated_at: now,
            };

            let entry = groups.entry(model.clone()).or_insert(Product {
                id: 0,
                name: title.clone(),
                description: item["product"]["description"].as_str().unwrap_or("").to_string(),
                category: item["product"]["productCategories"]
                    .as_object()
                    .and_then(|c| c.values().next())
                    .and_then(|v| v.as_str())
                    .unwrap_or("General")
                    .to_string(),
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

    /// Derive a model number from SKU or title
    fn derive_model_number(&self, sku: &str, title: &str) -> String {
        if let Some(pos) = sku.find("PV-") {
            let rest = &sku[pos..];
            if let Some(end) = rest[3..].find('-') {
                return format!("PV-{}", &rest[3..3 + end]);
            }
            return format!("PV-{}", &rest[3..]);
        }

        for word in title.split_whitespace() {
            if let Some(pos) = word.find("PV-") {
                let rest = &word[pos..];
                if let Some(end) = rest[3..].find('-') {
                    return format!("PV-{}", &rest[3..3 + end]);
                }
                return format!("PV-{}", &rest[3..]);
            }
        }

        let model: String = title.split_whitespace().take(3).collect::<Vec<_>>().join("-");
        if model.is_empty() { "UNKNOWN".to_string() } else { model }
    }

    // ─── Sync: pull eBay stock into local DB ───

    /// Sync eBay inventory quantities into the local database
    pub async fn sync_inventory(&self) -> Result<SyncResponse, String> {
        if !self.is_configured() {
            return Err("eBay credentials not configured".into());
        }

        let products = self.get_ebay_products().await?;
        let product_service = ProductService::new();

        // Build a lookup map of local products by SKU and ebay_item_id
        let local_products = product_service.get_all_products().await
            .map_err(|e| format!("Failed to fetch local products: {e}"))?;

        let mut local_by_sku: HashMap<String, i64> = HashMap::new();
        let mut local_by_ebay_id: HashMap<String, i64> = HashMap::new();

        for lp in &local_products {
            if let Some(ref variants) = lp.variants {
                for lv in variants {
                    local_by_sku.insert(lv.sku.clone(), lv.id);
                    if let Some(ref ebay_id) = lv.ebay_item_id {
                        local_by_ebay_id.insert(ebay_id.clone(), lv.id);
                    }
                }
            }
        }

        let mut updated = 0;
        let mut created = 0;
        let mut errors = Vec::new();

        for ebay_prod in &products {
            if let Some(ref ebay_variants) = ebay_prod.variants {
                for ev in ebay_variants {
                    // Match by SKU first, then by ebay_item_id
                    let local_variant_id = local_by_sku.get(&ev.sku)
                        .or_else(|| ev.ebay_item_id.as_ref().and_then(|id| local_by_ebay_id.get(id)))
                        .copied();

                    if let Some(variant_id) = local_variant_id {
                        match product_service.update_variant_stock(variant_id, ev.stock).await {
                            Ok(_) => updated += 1,
                            Err(e) => errors.push(format!("Failed to update variant {}: {}", variant_id, e)),
                        }
                    } else {
                        created += 1;
                    }
                }
            }
        }

        Ok(SyncResponse {
            synced: updated + created,
            created,
            updated,
            errors,
        })
    }

    // ─── Push stock update to eBay ───

    /// Update quantity for a single item on eBay
    pub async fn update_ebay_item_quantity(&self, sku: &str, new_quantity: i32) -> Result<(), String> {
        if !self.is_configured() {
            log::warn!("eBay credentials not set. Skipping stock update for {sku}");
            return Ok(());
        }

        let token = self.get_token().await?;
        let client = reqwest::Client::new();

        // Use Sell Inventory API
        let url = format!(
            "https://api.ebay.com/sell/inventory/v1/inventory_item/{}",
            urlencoding::encode(sku)
        );

        let payload = serde_json::json!({
            "availability": {
                "shipToLocationAvailability": {
                    "quantity": new_quantity
                }
            }
        });

        let resp = client
            .patch(&url)
            .header("Authorization", format!("Bearer {token}"))
            .header("Content-Type", "application/json")
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("eBay Inventory API request failed: {e}"))?;

        let status = resp.status();
        if status.is_success() {
            log::info!("eBay stock updated: SKU {sku} → {new_quantity}");
            return Ok(());
        }

        let err_text = resp.text().await.unwrap_or_default();

        // If inventory_item doesn't exist, try the legacy Trading API for numeric item IDs
        if sku.chars().all(|c| c.is_ascii_digit()) && (status.as_u16() == 404 || status.as_u16() == 400) {
            return self.update_ebay_legacy_quantity(&token, sku, new_quantity).await;
        }

        Err(format!("eBay stock update failed ({}): {}", status, err_text))
    }

    /// Fallback: update quantity via Trading API for legacy numeric item IDs
    async fn update_ebay_legacy_quantity(&self, token: &str, item_id: &str, new_quantity: i32) -> Result<(), String> {
        let client = reqwest::Client::new();

        let xml_body = format!(
            r#"<?xml version="1.0" encoding="utf-8"?>
<ReviseInventoryStatusRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>{token}</eBayAuthToken>
  </RequesterCredentials>
  <InventoryStatus>
    <ItemID>{item_id}</ItemID>
    <Quantity>{new_quantity}</Quantity>
  </InventoryStatus>
</ReviseInventoryStatusRequest>"#
        );

        let resp = client
            .post("https://api.ebay.com/ws/api.dll")
            .header("X-EBAY-API-COMPATIBILITY-LEVEL", "967")
            .header("X-EBAY-API-CALL-NAME", "ReviseInventoryStatus")
            .header("X-EBAY-API-SITEID", "0")
            .header("Content-Type", "text/xml")
            .body(xml_body)
            .send()
            .await
            .map_err(|e| format!("eBay Trading API request failed: {e}"))?;

        let status = resp.status();
        if status.is_success() {
            log::info!("eBay legacy stock updated: Item ID {item_id} → {new_quantity}");
            return Ok(());
        }

        let err_text = resp.text().await.unwrap_or_default();
        Err(format!("eBay Trading API failed ({}): {}", status, err_text))
    }

    // ─── Push local product to eBay ───

    /// Create a new eBay listing from a local product variant
    pub async fn sync_product_to_ebay(&self, product_id: i64) -> Result<String, String> {
        if !self.is_configured() {
            return Err("eBay credentials not configured".into());
        }

        let product_service = ProductService::new();
        let product = product_service.get_product_by_id(product_id).await
            .map_err(|e| format!("Failed to fetch product: {e}"))?
            .ok_or_else(|| "Product not found".to_string())?;

        let variants = product.variants.as_ref()
            .ok_or("Product has no variants")?;

        let variant = variants.first()
            .ok_or("Product has no variants")?;

        let token = self.get_token().await?;
        let client = reqwest::Client::new();

        // Step 1: Create inventory item
        let inventory_url = format!(
            "https://api.ebay.com/sell/inventory/v1/inventory_item/{}",
            urlencoding::encode(&variant.sku)
        );

        let mut aspects = serde_json::Map::new();
        if let Some(ref color) = variant.color {
            aspects.insert("Color".to_string(), serde_json::json!([color]));
        }
        if let Some(ref size) = variant.size {
            aspects.insert("Size".to_string(), serde_json::json!([size]));
        }
        if let Some(ref texture) = variant.texture {
            aspects.insert("Material".to_string(), serde_json::json!([texture]));
        }

        let inventory_payload = serde_json::json!({
            "product": {
                "title": product.name,
                "description": product.description,
                "aspects": aspects,
                "imageUrls": variant.images,
            },
            "availability": {
                "shipToLocationAvailability": {
                    "quantity": variant.stock
                }
            },
            "condition": "NEW"
        });

        let inv_resp = client
            .put(&inventory_url)
            .header("Authorization", format!("Bearer {token}"))
            .header("Content-Type", "application/json")
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .json(&inventory_payload)
            .send()
            .await
            .map_err(|e| format!("Inventory item creation failed: {e}"))?;

        if !inv_resp.status().is_success() {
            let status = inv_resp.status().as_u16();
            let err = inv_resp.text().await.unwrap_or_default();
            return Err(format!("eBay inventory item creation failed ({status}): {err}"));
        }

        // Step 2: Create offer (listing)
        let offer_url = "https://api.ebay.com/sell/inventory/v1/offer";

        let offer_payload = serde_json::json!({
            "sku": variant.sku,
            "marketplaceId": "EBAY_US",
            "format": "FIXED_PRICE",
            "pricingSummary": {
                "price": {
                    "value": format!("{:.2}", variant.price),
                    "currency": "USD"
                }
            },
            "quantity": variant.stock,
            "listingDescription": product.description,
        });

        let offer_resp = client
            .post(offer_url)
            .header("Authorization", format!("Bearer {token}"))
            .header("Content-Type", "application/json")
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .json(&offer_payload)
            .send()
            .await
            .map_err(|e| format!("Offer creation failed: {e}"))?;

        if !offer_resp.status().is_success() {
            let status = offer_resp.status().as_u16();
            let err = offer_resp.text().await.unwrap_or_default();
            return Err(format!("eBay offer creation failed ({status}): {err}"));
        }

        let offer_body: serde_json::Value = offer_resp.json().await.unwrap_or_default();
        let offer_id = offer_body["offerId"].as_str().unwrap_or("unknown");

        // Step 3: Publish the offer
        let publish_url = format!(
            "https://api.ebay.com/sell/inventory/v1/offer/{}/publish",
            offer_id
        );

        let pub_resp = client
            .post(&publish_url)
            .header("Authorization", format!("Bearer {token}"))
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .send()
            .await
            .map_err(|e| format!("Publish failed: {e}"))?;

        if !pub_resp.status().is_success() {
            let err = pub_resp.text().await.unwrap_or_default();
            log::warn!("eBay listing created but publish failed: {err}. Offer ID: {offer_id}");
        }

        log::info!("eBay listing created for SKU {} — Offer ID: {}", variant.sku, offer_id);
        Ok(offer_id.to_string())
    }
}

/// Minimal base64 encoder (RFC 4648) — avoids adding the `base64` crate dependency
fn base64_encode(input: &[u8]) -> String {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut result = String::with_capacity((input.len() + 2) / 3 * 4);

    for chunk in input.chunks(3) {
        let b0 = chunk[0] as u32;
        let b1 = if chunk.len() > 1 { chunk[1] as u32 } else { 0 };
        let b2 = if chunk.len() > 2 { chunk[2] as u32 } else { 0 };
        let triple = (b0 << 16) | (b1 << 8) | b2;

        result.push(CHARS[((triple >> 18) & 0x3F) as usize] as char);
        result.push(CHARS[((triple >> 12) & 0x3F) as usize] as char);
        if chunk.len() > 1 {
            result.push(CHARS[((triple >> 6) & 0x3F) as usize] as char);
        } else {
            result.push('=');
        }
        if chunk.len() > 2 {
            result.push(CHARS[(triple & 0x3F) as usize] as char);
        } else {
            result.push('=');
        }
    }

    result
}
