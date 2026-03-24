use vercel_runtime::{Body, Response, StatusCode, Error};
use stripe::{Client, CheckoutSession, CheckoutSessionMode, Currency, CreateCheckoutSession, CreateCheckoutSessionLineItems, CreateCheckoutSessionLineItemsPriceData, CreateCheckoutSessionLineItemsPriceDataProductData};
use crate::models::CreateCheckoutSessionRequest;
use crate::services::product_service::ProductService;
use std::env;

pub async fn create_checkout_session(req: CreateCheckoutSessionRequest) -> Result<Response<Body>, Error> {
    let stripe_secret_key = env::var("STRIPE_SECRET_KEY")
        .unwrap_or_else(|_| "sk_test_mock".to_string());
    let client = Client::new(stripe_secret_key);

    let product_service = ProductService::new();
    let mut line_items = Vec::new();

    for item in req.items {
        if let Ok(Some(product)) = product_service.get_product_by_id(item.product_id).await {
            line_items.push(CreateCheckoutSessionLineItems {
                quantity: Some(item.quantity as u64),
                price_data: Some(CreateCheckoutSessionLineItemsPriceData {
                    currency: Currency::USD,
                    unit_amount: Some((product.price * 100.0) as i64),
                    product_data: Some(CreateCheckoutSessionLineItemsPriceDataProductData {
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

    let params = CreateCheckoutSession {
        mode: Some(CheckoutSessionMode::Payment),
        line_items: Some(line_items),
        success_url: Some(&req.success_url),
        cancel_url: Some(&req.cancel_url),
        ..Default::default()
    };

    match CheckoutSession::create(&client, params).await {
        Ok(session) => {
            if let Some(url) = session.url {
                Ok(Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::json!({ "url": url }).to_string()))?)
            } else {
                Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .body(Body::from("Failed to generate checkout URL"))?)
            }
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .body(Body::from(format!("Stripe error: {e}")))?)
    }
}
