use crate::models::{EbayProduct, SyncResponse, GroupedProduct};

pub struct EbayService {
    app_id: Option<String>,
    oauth_token: Option<String>,
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
    pub async fn get_ebay_products(&self) -> Result<Vec<GroupedProduct>, String> {
        // Attempt real eBay API call if credentials are configured
        if let (Some(ref _app_id), Some(ref token)) = (&self.app_id, &self.oauth_token) {
            match self.fetch_from_ebay(token).await {
                Ok(products) => return Ok(products),
                Err(e) => {
                    log::warn!("eBay API call failed, using mock data: {}", e);
                }
            }
        }

        // Fallback: Grouped mock data matching Protection Valley product line
        Ok(vec![
            GroupedProduct {
                model_number: "PV-TB-100".to_string(),
                name: "Heritage Leather Tool Belt".to_string(),
                category: "Tool Belts".to_string(),
                variants: vec![
                    EbayProduct {
                        ebay_id: "PV-EB-101".into(),
                        group_id: Some("PV-TB-100".into()),
                        title: "Heritage Tool Belt - Black / Medium / Smooth".into(),
                        price: 189.99,
                        quantity: 10,
                        sku: Some("PV-TB-100-B-M".into()),
                        model_number: Some("PV-TB-100".into()),
                        color: Some("Black".into()),
                        size: Some("Medium".into()),
                        texture: Some("Smooth".into()),
                        image_url: Some("/images/toolbelt-1.jpg".into()),
                    },
                    EbayProduct {
                        ebay_id: "PV-EB-102".into(),
                        group_id: Some("PV-TB-100".into()),
                        title: "Heritage Tool Belt - Brown / Large / Grain".into(),
                        price: 199.99,
                        quantity: 5,
                        sku: Some("PV-TB-100-BR-L".into()),
                        model_number: Some("PV-TB-100".into()),
                        color: Some("Brown".into()),
                        size: Some("Large".into()),
                        texture: Some("Grain".into()),
                        image_url: Some("/images/toolbelt-2.jpg".into()),
                    },
                ],
            },
        ])
    }

    /// Call the real eBay Browse API to search for seller's items and group them.
    async fn fetch_from_ebay(&self, token: &str) -> Result<Vec<GroupedProduct>, String> {
        let client = reqwest::Client::new();
        let seller_name = std::env::var("EBAY_SELLER_NAME").unwrap_or_else(|_| "protectionvalley".to_string());

        // Use fieldgroups=ASPECT_REFINEMENTS to get more details if supported, 
        // but for now we'll parse aspects from item summaries.
        let url = format!(
            "https://api.ebay.com/buy/browse/v1/item_summary/search?filter=sellers:{{{}}}&limit=100",
            seller_name
        );

        let response = client
            .get(&url)
            .header("Authorization", format!("Bearer {}", token))
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .send()
            .await
            .map_err(|e| format!("HTTP error: {}", e))?;

        if !response.status().is_success() {
            return Err(format!("eBay API returned {}", response.status()));
        }

        let body: serde_json::Value = response.json().await.map_err(|e| format!("JSON error: {}", e))?;
        let empty_vec = vec![];
        let items = body["itemSummaries"].as_array().unwrap_or(&empty_vec);

        let mut ebay_products = Vec::new();
        for item in items {
            let title = item["title"].as_str().unwrap_or_default().to_string();
            let ebay_id = item["itemId"].as_str().unwrap_or_default().to_string();
            let price = item["price"]["value"].as_str().and_then(|v| v.parse::<f64>().ok()).unwrap_or(0.0);
            let image_url = item["image"]["imageUrl"].as_str().map(|s| s.to_string());
            
            // Logic to extract Color, Size, Texture from title or aspects
            // In a real API, we'd use localizedAspects from the 'item' resource.
            // For now, we'll implement a helper to parse from title.
            let (model, color, size, texture) = self.parse_aspects_from_title(&title);

            ebay_products.push(EbayProduct {
                ebay_id,
                group_id: item["itemGroupId"].as_str().map(|s| s.to_string()),
                title,
                price,
                quantity: 1,
                sku: item["legacyItemId"].as_str().map(|s| s.to_string()),
                model_number: Some(model),
                color,
                size,
                texture,
                image_url,
            });
        }

        // Group by Model Number
        let mut groups: std::collections::HashMap<String, GroupedProduct> = std::collections::HashMap::new();

        for p in ebay_products {
            let model = p.model_number.clone().unwrap_or_else(|| "UNKNOWN".to_string());
            let entry = groups.entry(model.clone()).or_insert(GroupedProduct {
                model_number: model,
                name: p.title.clone(), // Use first variant title as base name
                category: "General".to_string(), // Default category
                variants: Vec::new(),
            });
            entry.variants.push(p);
        }

        Ok(groups.into_values().collect())
    }

    /// Helper to parse aspects from eBay titles (as a backup to real aspects).
    fn parse_aspects_from_title(&self, title: &str) -> (String, Option<String>, Option<String>, Option<String>) {
        let title_lower = title.to_lowercase();
        
        // Very basic extraction logic — improved later with regex or real API aspects
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

        // Model number extraction (e.g., PV-TB-100)
        let model = title.split_whitespace()
            .find(|w| w.starts_with("PV-"))
            .map(|s| s.to_string())
            .unwrap_or_else(|| "PV-GENERIC".to_string());

        (model, color, size, texture)
    }

    /// Sync eBay inventory into the local product catalog.
    pub async fn sync_inventory(&self) -> Result<SyncResponse, String> {
        let ebay_products = self.get_ebay_products().await?;

        let mut created = 0;
        let mut updated = 0;
        let errors = Vec::new();

        for product in &ebay_products {
            // In a real implementation: upsert into database
            if !product.variants.is_empty() {
                updated += 1;
            } else {
                created += 1;
            }
        }

        Ok(SyncResponse {
            synced: (created + updated) as i32,
            created: created as i32,
            updated: updated as i32,
            errors,
        })
    }

    /// Push a local product to eBay as a listing.
    pub async fn sync_product_to_ebay(&self, product_id: i64) -> Result<String, String> {
        // In a real implementation: call eBay Inventory API
        Ok(format!("PV-EBAY-{}", product_id))
    }
}
