use crate::models::{Product, ProductVariant, CreateProductRequest, UpdateProductRequest};
use chrono::Utc;
use std::env;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};

pub struct ProductService {
    client: reqwest::Client,
    supabase_url: String,
    supabase_key: String,
}

impl Default for ProductService {
    fn default() -> Self {
        Self::new()
    }
}

impl ProductService {
    pub fn new() -> Self {
        let supabase_url = env::var("SUPABASE_URL").unwrap_or_else(|_| "https://fnirqccmtjzibjhgzyay.supabase.co".to_string());
        let supabase_key = env::var("SUPABASE_ANON_KEY").unwrap_or_default();
        
        Self {
            client: reqwest::Client::new(),
            supabase_url,
            supabase_key,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        if let Ok(val) = HeaderValue::from_str(&self.supabase_key) {
            headers.insert("apikey", val.clone());
            headers.insert(AUTHORIZATION, HeaderValue::from_str(&format!("Bearer {}", self.supabase_key)).unwrap());
        }
        headers
    }

    /// Returns the full product catalog from Supabase.
    pub async fn get_all_products(&self) -> Result<Vec<Product>, String> {
        let url = format!("{}/rest/v1/products?select=*,variants:product_variants(*)", self.supabase_url);
        
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

        let products: Vec<Product> = response.json()
            .await
            .map_err(|e| format!("Failed to parse products: {}", e))?;

        Ok(products)
    }

    pub async fn get_product_by_id(&self, id: i64) -> Result<Option<Product>, String> {
        let url = format!("{}/rest/v1/products?id=eq.{}&select=*,variants:product_variants(*)", self.supabase_url, id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        let products: Vec<Product> = response.json()
            .await
            .map_err(|e| format!("Failed to parse product: {}", e))?;

        Ok(products.into_iter().next())
    }

    pub async fn get_product_by_ebay_id(&self, ebay_id: &str) -> Result<Option<Product>, String> {
        // Querying by variant's ebay_id
        let url = format!("{}/rest/v1/product_variants?ebay_item_id=eq.{}&select=product_id", self.supabase_url, ebay_id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        let variants: Vec<serde_json::Value> = response.json()
            .await
            .map_err(|e| format!("Failed to parse variant: {}", e))?;

        if let Some(v) = variants.first() {
            if let Some(product_id) = v["product_id"].as_i64() {
                return self.get_product_by_id(product_id).await;
            }
        }
        
        Ok(None)
    }

    pub async fn get_product(&self, identifier: &str) -> Result<Option<Product>, String> {
        if let Ok(id) = identifier.parse::<i64>() {
            return self.get_product_by_id(id).await;
        }

        // Fallback to searching by model number
        let url = format!("{}/rest/v1/products?model_number=eq.{}&select=*,variants:product_variants(*)", self.supabase_url, identifier);
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        let products: Vec<Product> = response.json()
            .await
            .map_err(|e| format!("Failed to parse product: {}", e))?;

        Ok(products.into_iter().next())
    }

    pub async fn create_product(&self, _req: CreateProductRequest) -> Result<Product, String> {
        Err("Create product via API not implemented yet. Use Supabase directly.".into())
    }

    pub async fn update_product(&self, _id: i64, _req: UpdateProductRequest) -> Result<Option<Product>, String> {
        Err("Update product via API not implemented yet.".into())
    }

    pub async fn delete_product(&self, _id: i64) -> Result<bool, String> {
        Err("Delete product via API not implemented yet.".into())
    }
}
