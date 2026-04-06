use std::env;
use anyhow::{Result, anyhow};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};
use crate::models::{Review, CreateReviewRequest};

pub struct ReviewService {
    client: reqwest::Client,
    supabase_url: String,
    supabase_key: String,
}

impl ReviewService {
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
        let key = self.supabase_key.trim();
        if let Ok(val) = HeaderValue::from_str(key) {
            headers.insert("apikey", val);
            if let Ok(auth) = HeaderValue::from_str(&format!("Bearer {}", key)) {
                headers.insert(AUTHORIZATION, auth);
            }
        }
        headers
    }

    pub async fn get_product_reviews(&self, product_id: i64) -> Result<Vec<Review>> {
        let url = format!("{}/rest/v1/product_reviews?product_id=eq.{}&select=*", self.supabase_url, product_id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await?;

        if !response.status().is_success() {
            let err = response.text().await?;
            return Err(anyhow!("Supabase error: {}", err));
        }

        let reviews: Vec<Review> = response.json().await?;
        Ok(reviews)
    }

    pub async fn check_eligibility(&self, user_id: i64, product_id: i64) -> Result<bool> {
        // Query orders for this user
        let url = format!("{}/rest/v1/orders?customer_id=eq.{}&status=eq.completed&select=items", self.supabase_url, user_id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await?;

        if !response.status().is_success() {
            return Ok(false);
        }

        let orders: Vec<serde_json::Value> = response.json().await?;
        let product_id_str = product_id.to_string();

        for order in orders {
            if let Some(items) = order.get("items").and_then(|i| i.as_array()) {
                for item in items {
                    if let Some(p_id) = item.get("product_id").and_then(|p| p.as_str()) {
                        if p_id == product_id_str {
                            return Ok(true);
                        }
                    }
                }
            }
        }

        Ok(false)
    }

    pub async fn create_review(&self, user_id: i64, user_name: String, req: CreateReviewRequest) -> Result<Review> {
        // 1. Check eligibility
        let eligible = self.check_eligibility(user_id, req.product_id).await?;
        if !eligible {
            return Err(anyhow!("Only users who have purchased this product can leave a review."));
        }

        // 2. Insert Review
        let url = format!("{}/rest/v1/product_reviews", self.supabase_url);
        let payload = serde_json::json!({
            "user_id": user_id,
            "product_id": req.product_id,
            "user_name": user_name,
            "rating": req.rating,
            "comment": req.comment,
            "is_verified": true
        });

        let response = self.client
            .post(&url)
            .headers(self.headers())
            .header("Prefer", "return=representation")
            .json(&payload)
            .send()
            .await?;

        if !response.status().is_success() {
            let err = response.text().await?;
            return Err(anyhow!("Failed to post review: {}", err));
        }

        let mut reviews: Vec<Review> = response.json().await?;
        reviews.pop().ok_or_else(|| anyhow!("Failed to parse created review"))
    }
}
