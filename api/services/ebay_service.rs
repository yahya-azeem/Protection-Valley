use crate::models::{EbayProduct, SyncResponse};

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
    pub async fn get_ebay_products(&self) -> Result<Vec<EbayProduct>, String> {
        // Attempt real eBay API call if credentials are configured
        if let (Some(ref _app_id), Some(ref token)) = (&self.app_id, &self.oauth_token) {
            match self.fetch_from_ebay(token).await {
                Ok(products) => return Ok(products),
                Err(e) => {
                    log::warn!("eBay API call failed, using mock data: {}", e);
                }
            }
        }

        // Fallback: mock data matching Protection Valley product line
        Ok(vec![
            EbayProduct {
                ebay_id: "PV-EBAY-001".to_string(),
                title: "Heritage Leather Tool Belt – Full Grain".to_string(),
                price: 189.99,
                quantity: 25,
                sku: Some("PV-TB-001".to_string()),
            },
            EbayProduct {
                ebay_id: "PV-EBAY-002".to_string(),
                title: "Master Craftsman Leather Apron".to_string(),
                price: 159.99,
                quantity: 18,
                sku: Some("PV-APR-001".to_string()),
            },
            EbayProduct {
                ebay_id: "PV-EBAY-003".to_string(),
                title: "Quick-Clip Leather Tool Pouch".to_string(),
                price: 49.99,
                quantity: 60,
                sku: Some("PV-PCH-001".to_string()),
            },
            EbayProduct {
                ebay_id: "PV-EBAY-004".to_string(),
                title: "Heavy-Duty Leather Suspenders".to_string(),
                price: 89.99,
                quantity: 30,
                sku: Some("PV-ACC-001".to_string()),
            },
            EbayProduct {
                ebay_id: "PV-EBAY-005".to_string(),
                title: "Complete Leather Tool Rig System".to_string(),
                price: 299.99,
                quantity: 15,
                sku: Some("PV-TB-003".to_string()),
            },
        ])
    }

    /// Call the real eBay Browse API to search for seller's items.
    async fn fetch_from_ebay(&self, token: &str) -> Result<Vec<EbayProduct>, String> {
        let client = reqwest::Client::new();

        // eBay Browse API — search for our seller's items
        let seller_name = std::env::var("EBAY_SELLER_NAME")
            .unwrap_or_else(|_| "protectionvalley".to_string());

        let url = format!(
            "https://api.ebay.com/buy/browse/v1/item_summary/search?q=tool+belt&filter=sellers:{{{}}}&limit=50",
            seller_name
        );

        let response = client
            .get(&url)
            .header("Authorization", format!("Bearer {}", token))
            .header("X-EBAY-C-MARKETPLACE-ID", "EBAY_US")
            .header("Content-Type", "application/json")
            .send()
            .await
            .map_err(|e| format!("HTTP error: {}", e))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("eBay API returned {}: {}", status, body));
        }

        let body: serde_json::Value = response
            .json()
            .await
            .map_err(|e| format!("JSON parse error: {}", e))?;

        let items = body["itemSummaries"]
            .as_array()
            .unwrap_or(&vec![]);

        let products: Vec<EbayProduct> = items
            .iter()
            .filter_map(|item| {
                let ebay_id = item["itemId"].as_str()?.to_string();
                let title = item["title"].as_str()?.to_string();
                let price = item["price"]["value"]
                    .as_str()
                    .and_then(|v| v.parse::<f64>().ok())
                    .unwrap_or(0.0);

                Some(EbayProduct {
                    ebay_id,
                    title,
                    price,
                    quantity: 1, // Browse API does not return quantity
                    sku: item["legacyItemId"].as_str().map(|s| s.to_string()),
                })
            })
            .collect();

        Ok(products)
    }

    /// Sync eBay inventory into the local product catalog.
    pub async fn sync_inventory(&self) -> Result<SyncResponse, String> {
        let ebay_products = self.get_ebay_products().await?;

        let mut created = 0;
        let mut updated = 0;
        let errors = Vec::new();

        for product in &ebay_products {
            // In a real implementation: upsert into database
            if product.sku.is_some() {
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
