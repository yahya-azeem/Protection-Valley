use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::CreateCheckoutSessionRequest;
use crate::services::product_service::ProductService;
use std::env;

pub async fn create_checkout_session(req: CreateCheckoutSessionRequest) -> Result<Response<String>, Error> {
    let CreateCheckoutSessionRequest {
        items,
        success_url,
        cancel_url,
    } = req;

    let frontend_url = match env::var("FRONTEND_URL") {
        Ok(url) => url.trim().to_string(),
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::SERVICE_UNAVAILABLE)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({
                    "error": "Checkout is not configured"
                }).to_string())?);
        }
    };

    let stripe_secret_key = match env::var("STRIPE_SECRET_KEY") {
        Ok(key) => {
            let trimmed = key.trim().to_string();
            if trimmed.is_empty() || trimmed.starts_with("sk_test_mock") {
                return Ok(Response::builder()
                    .status(StatusCode::SERVICE_UNAVAILABLE)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({
                        "error": "Checkout is not configured"
                    }).to_string())?);
            }
            trimmed
        }
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::SERVICE_UNAVAILABLE)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({
                    "error": "Checkout is not configured"
                }).to_string())?);
        }
    };

    let client = stripe::Client::new(stripe_secret_key);
    let product_service = ProductService::new();
    let mut line_items = Vec::new();

    for item in items {
        if let Ok(Some(product)) = product_service.get_product(&item.product_id).await {
            // Find specific variant or default to first
            let variant = if let Some(ref vid_str) = item.variant_id {
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
                line_items.push(stripe::CreateCheckoutSessionLineItems {
                    quantity: Some(item.quantity as u64),
                    price_data: Some(stripe::CreateCheckoutSessionLineItemsPriceData {
                        currency: stripe::Currency::USD,
                        unit_amount: Some((v.price * 100.0) as i64),
                        product_data: Some(stripe::CreateCheckoutSessionLineItemsPriceDataProductData {
                            name: format!("{} - {}", product.name, v.original_name),
                            description: Some(product.description.clone()),
                            images: Some(vec![v.image_url.clone().unwrap_or(product.image_url.clone())]),
                            ..Default::default()
                        }),
                        ..Default::default()
                    }),
                    ..Default::default()
                });
            }
        }
    }

    if line_items.is_empty() {
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({
                "error": "No valid products found for checkout"
            }).to_string())?);
    }

    let allowed_origin = frontend_url.trim_end_matches('/').to_string();
    let success_url = success_url.trim();
    let cancel_url = cancel_url.trim();
    if !is_allowed_redirect(success_url, &allowed_origin) || !is_allowed_redirect(cancel_url, &allowed_origin) {
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({
                "error": "Checkout redirect URLs must stay on the configured frontend"
            }).to_string())?);
    }

    let params = stripe::CreateCheckoutSession {
        mode: Some(stripe::CheckoutSessionMode::Payment),
        line_items: Some(line_items),
        success_url: Some(success_url),
        cancel_url: Some(cancel_url),
        ..Default::default()
    };

    match stripe::CheckoutSession::create(&client, params).await {
        Ok(session) => {
            if let Some(url) = session.url {
                Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({ "url": url }).to_string())?)
            } else {
                Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({
                        "error": "Failed to generate checkout URL"
                    }).to_string())?)
            }
        }
        Err(e) => {
            eprintln!("[checkout] stripe error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({
                "error": "Stripe checkout failed"
            }).to_string())?)
        }
    }
}

fn is_allowed_redirect(candidate: &str, allowed_origin: &str) -> bool {
    if candidate.starts_with("http://localhost") || candidate.starts_with("http://127.0.0.1") {
        return true;
    }
    // Always allow the production Vercel domain
    let prod = "https://protection-valley.vercel.app";
    if candidate == prod || candidate.starts_with(&format!("{prod}/")) {
        return true;
    }
    candidate == allowed_origin || candidate.starts_with(&format!("{allowed_origin}/"))
}

