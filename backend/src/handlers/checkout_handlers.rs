use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::CreateCheckoutSessionRequest;
use crate::services::product_service::ProductService;
use std::env;

pub async fn create_checkout_session(req: CreateCheckoutSessionRequest) -> Result<Response<String>, Error> {
    let stripe_secret_key = match env::var("STRIPE_SECRET_KEY") {
        Ok(key) if !key.is_empty() && !key.starts_with("sk_test_mock") => key,
        _ => {
            return Ok(Response::builder()
                .status(StatusCode::SERVICE_UNAVAILABLE)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({
                    "error": "Stripe checkout is not configured. Please set the STRIPE_SECRET_KEY environment variable."
                }).to_string())?);
        }
    };

    let client = stripe::Client::new(stripe_secret_key);
    let product_service = ProductService::new();
    let mut line_items = Vec::new();

    for item in req.items {
        if let Ok(Some(product)) = product_service.get_product_by_id(item.product_id).await {
            line_items.push(stripe::CreateCheckoutSessionLineItems {
                quantity: Some(item.quantity as u64),
                price_data: Some(stripe::CreateCheckoutSessionLineItemsPriceData {
                    currency: stripe::Currency::USD,
                    unit_amount: Some((product.price * 100.0) as i64),
                    product_data: Some(stripe::CreateCheckoutSessionLineItemsPriceDataProductData {
                        name: product.name,
                        description: Some(product.description),
                        images: Some(vec![product.image_url]),
                        ..Default::default()
                    }),
                    ..Default::default()
                }),
                ..Default::default()
            });
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

    let params = stripe::CreateCheckoutSession {
        mode: Some(stripe::CheckoutSessionMode::Payment),
        line_items: Some(line_items),
        success_url: Some(&req.success_url),
        cancel_url: Some(&req.cancel_url),
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
                    .body("Failed to generate checkout URL".to_string())?)
            }
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(format!("Stripe error: {e}"))?),
    }
}
