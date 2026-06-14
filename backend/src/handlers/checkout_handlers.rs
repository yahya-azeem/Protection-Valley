use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{CreateCheckoutSessionRequest, ConfirmCheckoutSessionRequest, CreateOrderRequest, Address, OrderItemRequest};
use crate::services::product_service::ProductService;
use crate::services::order_service::OrderService;
use crate::auth::{decode_jwt, extract_token};
use std::env;

pub async fn create_checkout_session(auth_header: Option<&str>, req: CreateCheckoutSessionRequest) -> Result<Response<String>, Error> {
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
    
    // Decode claims
    let claims = extract_token(auth_header)
        .and_then(|t| decode_jwt(t).ok());

    let is_wholesale = claims.as_ref()
        .map(|c| c.role == "wholesale" || c.role == "admin")
        .unwrap_or(false);

    let (wholesale_discount, custom_prices) = if is_wholesale {
        if let Some(ref c) = claims {
            let auth_service = crate::services::auth_service::AuthService::new();
            let product_service = ProductService::new();
            
            let user = auth_service.get_user_by_id(c.user_id).await.ok().flatten();
            let discount = user.and_then(|u| u.wholesale_discount).unwrap_or(0.30);
            let prices = product_service.get_customer_specific_prices(c.user_id).await.unwrap_or_default();
            
            (discount, prices)
        } else {
            (0.30, Vec::new())
        }
    } else {
        (0.30, Vec::new())
    };

    let mut line_items = Vec::new();

    for item in &req.items {
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
                let description = {
                    let d = product.description.trim().to_string();
                    if d.is_empty() { None } else { Some(d) }
                };
                let image = v.image_url.as_deref()
                    .filter(|s| !s.is_empty())
                    .or_else(|| {
                        let u = product.image_url.trim();
                        if u.is_empty() { None } else { Some(u) }
                    })
                    .map(|url| {
                        if url.starts_with('/') {
                            format!("{}{}", frontend_url.trim_end_matches('/'), url)
                        } else {
                            url.to_string()
                        }
                    });
                let images = image.map(|url| vec![url]);

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

                line_items.push(stripe::CreateCheckoutSessionLineItems {
                    quantity: Some(item.quantity as u64),
                    price_data: Some(stripe::CreateCheckoutSessionLineItemsPriceData {
                        currency: stripe::Currency::USD,
                        unit_amount: Some((unit_price * 100.0) as i64),
                        product_data: Some(stripe::CreateCheckoutSessionLineItemsPriceDataProductData {
                            name: format!("{} - {}", product.name, v.original_name),
                            description,
                            images,
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
    let success_url_trimmed = req.success_url.trim();
    let cancel_url_trimmed = req.cancel_url.trim();
    if !is_allowed_redirect(success_url_trimmed, &allowed_origin) || !is_allowed_redirect(cancel_url_trimmed, &allowed_origin) {
        return Ok(Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({
                "error": "Checkout redirect URLs must stay on the configured frontend"
            }).to_string())?);
    }

    let customer_id_str = claims.as_ref().map(|c| c.user_id.to_string()).unwrap_or_else(|| "0".to_string());
    let mut metadata = std::collections::HashMap::new();
    metadata.insert("items".to_string(), serde_json::to_string(&req.items).unwrap_or_default());
    metadata.insert("customer_id".to_string(), customer_id_str);

    let params = stripe::CreateCheckoutSession {
        mode: Some(stripe::CheckoutSessionMode::Payment),
        line_items: Some(line_items),
        success_url: Some(success_url_trimmed),
        cancel_url: Some(cancel_url_trimmed),
        allow_promotion_codes: Some(true),
        metadata: Some(metadata),
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
    candidate == allowed_origin || candidate.starts_with(&format!("{allowed_origin}/"))
}

pub async fn confirm_checkout_session(_auth_header: Option<&str>, req: ConfirmCheckoutSessionRequest) -> Result<Response<String>, Error> {
    let stripe_secret_key = match env::var("STRIPE_SECRET_KEY") {
        Ok(key) => {
            let trimmed = key.trim().to_string();
            if trimmed.is_empty() || trimmed.starts_with("sk_test_mock") {
                return create_mock_order_for_confirmation();
            }
            trimmed
        }
        Err(_) => {
            return create_mock_order_for_confirmation();
        }
    };

    let client = stripe::Client::new(stripe_secret_key);
    
    // Retrieve checkout session from Stripe
    let parsed_session_id = match req.session_id.parse::<stripe::CheckoutSessionId>() {
        Ok(id) => id,
        Err(e) => {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": format!("Invalid session ID format: {e}") }).to_string())?);
        }
    };

    let session = match stripe::CheckoutSession::retrieve(&client, &parsed_session_id, &[]).await {
        Ok(s) => s,
        Err(e) => {
            eprintln!("[checkout confirm] Stripe retrieve error: {e}");
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": format!("Invalid checkout session: {e}") }).to_string())?);
        }
    };

    // Extract customer_id and items from metadata
    let metadata = match session.metadata {
        Some(m) => m,
        None => {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Missing metadata in Stripe session" }).to_string())?);
        }
    };

    let items_raw = metadata.get("items").cloned().unwrap_or_default();
    let customer_id_raw = metadata.get("customer_id").cloned().unwrap_or_default();

    let items: Vec<OrderItemRequest> = match serde_json::from_str(&items_raw) {
        Ok(i) => i,
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Malformed items metadata" }).to_string())?);
        }
    };

    let customer_id = customer_id_raw.parse::<i64>().unwrap_or(0);

    // Extract shipping address
    let shipping_details = session.shipping_details;

    let shipping_address = match shipping_details {
        Some(sd) => {
            let address = sd.address.unwrap_or_default();
            let name = sd.name.unwrap_or_default();
            let name_parts: Vec<&str> = name.split_whitespace().collect();
            let first_name = name_parts.first().cloned().unwrap_or("Guest").to_string();
            let last_name = if name_parts.len() > 1 { name_parts[1..].join(" ") } else { "Customer".to_string() };

            Address {
                first_name,
                last_name,
                address_line1: address.line1.unwrap_or_default(),
                address_line2: address.line2,
                city: address.city.unwrap_or_default(),
                state: address.state.unwrap_or_default(),
                zip: address.postal_code.unwrap_or_default(),
                country: address.country.unwrap_or_default(),
                phone: None,
            }
        }
        None => {
            Address {
                first_name: "Guest".to_string(),
                last_name: "Customer".to_string(),
                address_line1: "123 Main St".to_string(),
                address_line2: None,
                city: "Dallas".to_string(),
                state: "TX".to_string(),
                zip: "75201".to_string(),
                country: "US".to_string(),
                phone: None,
            }
        }
    };

    let order_req = CreateOrderRequest {
        customer_id,
        items,
        shipping_address,
        payment_method: "Stripe".to_string(),
    };

    let order_service = OrderService::new();
    match order_service.create_order(order_req).await {
        Ok(order) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&order)?)?),
        Err(e) => {
            eprintln!("[checkout confirm] Order creation error: {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": format!("Failed to create order: {e}") }).to_string())?)
        }
    }
}

fn create_mock_order_for_confirmation() -> Result<Response<String>, Error> {
    let mock_order = serde_json::json!({
        "id": format!("ORD-MOCK-{}", uuid::Uuid::new_v4().to_string()[..8].to_uppercase()),
        "status": "processing",
        "total": 120.00
    });
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(mock_order.to_string())?)
}

