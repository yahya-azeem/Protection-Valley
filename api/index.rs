use vercel_runtime::{run, Response, Error, Request, ResponseBody, service_fn};
use http::StatusCode;
use http_body_util::BodyExt;
use serde_json::json;

use backend_v2_lib::handlers::{product_handlers, order_handlers, auth_handlers, ebay_handlers, checkout_handlers, review_handlers, admin_handlers};
use backend_v2_lib::models;

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Workaround for lambda_runtime 0.14.4 panic on missing AWS_LAMBDA_FUNCTION_NAME
    // which is not provided by Vercel's runtime but required by recent versions of lambda_runtime.
    if std::env::var("AWS_LAMBDA_FUNCTION_NAME").is_err() {
        std::env::set_var("AWS_LAMBDA_FUNCTION_NAME", "vercel-function");
    }
    run(service_fn(handler)).await
}

pub async fn handler(req: Request) -> Result<Response<ResponseBody>, Error> {
    match inner_handler(req).await {
        Ok(response) => Ok(response),
        Err(e) => {
            eprintln!("[HANDLER ERROR] {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(ResponseBody::from(json!({ "error": format!("Handler error: {e}") }).to_string()))?)
        }
    }
}

async fn read_body(req: &mut Request) -> Result<Vec<u8>, Error> {
    let body = req.body_mut();
    let collected = body.collect().await?;
    Ok(collected.to_bytes().to_vec())
}

async fn inner_handler(mut req: Request) -> Result<Response<ResponseBody>, Error> {
    let path = req.uri().path().to_string();
    let method = req.method().as_str().to_string();

    // Routing
    match path.as_str() {
        "/api/v1/products" => {
            match method.as_str() {
                "GET" => {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(product_handlers::get_products(auth_header.as_deref()).await)
                }
                "POST" => {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    let bytes = read_body(&mut req).await?;
                    let body: models::CreateProductRequest = serde_json::from_slice(&bytes)?;
                    wrap(product_handlers::create_product(auth_header.as_deref(), body).await)
                }
                _ => method_not_allowed(),
            }
        }
        p if p.starts_with("/api/v1/products/") && p.ends_with("/reviews") => {
            let id_str = &p["/api/v1/products/".len()..p.len() - "/reviews".len()];
            if let Ok(id) = id_str.parse::<i64>() {
                if method == "GET" {
                    wrap(review_handlers::get_product_reviews(id).await)
                } else {
                    method_not_allowed()
                }
            } else {
                not_found()
            }
        }
        p if p.starts_with("/api/v1/products/") => {
            let id_str = &p["/api/v1/products/".len()..];
            if let Ok(id) = id_str.parse::<i64>() {
                match method.as_str() {
                    "GET" => {
                        let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                        wrap(product_handlers::get_product(id, auth_header.as_deref()).await)
                    }
                    "PUT" => {
                        let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                        let bytes = read_body(&mut req).await?;
                        let body: models::UpdateProductRequest = serde_json::from_slice(&bytes)?;
                        wrap(product_handlers::update_product(auth_header.as_deref(), id, body).await)
                    }
                    "DELETE" => {
                        let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                        wrap(product_handlers::delete_product(auth_header.as_deref(), id).await)
                    }
                    _ => method_not_allowed(),
                }
            } else {
                not_found()
            }
        }
        "/api/v1/orders" => {
            match method.as_str() {
                "GET" => {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(order_handlers::get_orders(auth_header.as_deref()).await)
                }
                "POST" => {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    let bytes = read_body(&mut req).await?;
                    let body: models::CreateOrderRequest = serde_json::from_slice(&bytes)?;
                    wrap(order_handlers::create_order(auth_header.as_deref(), body).await)
                }
                _ => method_not_allowed(),
            }
        }
        p if p.starts_with("/api/v1/orders/") => {
            if p.ends_with("/status") {
                let id_str = &p["/api/v1/orders/".len()..p.len() - "/status".len()];
                if method == "PATCH" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    let bytes = read_body(&mut req).await?;
                    let body: models::OrderStatus = serde_json::from_slice(&bytes)?;
                    wrap(order_handlers::update_order_status(auth_header.as_deref(), id_str.to_string(), body).await)
                } else {
                    method_not_allowed()
                }
            } else if p.ends_with("/shipment") {
                let id_str = &p["/api/v1/orders/".len()..p.len() - "/shipment".len()];
                if method == "POST" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(order_handlers::create_order_shipment(auth_header.as_deref(), id_str.to_string()).await)
                } else {
                    method_not_allowed()
                }
            } else if p.ends_with("/shipping-label") {
                let id_str = &p["/api/v1/orders/".len()..p.len() - "/shipping-label".len()];
                if method == "POST" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(order_handlers::create_order_shipment(auth_header.as_deref(), id_str.to_string()).await)
                } else {
                    method_not_allowed()
                }
            } else {
                let id_str = &p["/api/v1/orders/".len()..];
                if method == "GET" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(order_handlers::get_order(auth_header.as_deref(), id_str.to_string()).await)
                } else {
                    method_not_allowed()
                }
            }
        }
        "/api/v1/auth/login" => {
            if method == "POST" {
                let bytes = read_body(&mut req).await?;
                let body: models::LoginRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::login(body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/register" => {
            if method == "POST" {
                let bytes = read_body(&mut req).await?;
                let body: models::RegisterRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::register(body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/google" => {
            if method == "POST" {
                let bytes = read_body(&mut req).await?;
                let body: models::GoogleVerifyRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::google_verify(body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/google/login" => {
            if method == "GET" {
                wrap(auth_handlers::google_login().await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/google/callback" => {
            if method == "GET" {
                let query = req.uri().query().unwrap_or("").to_string();
                let code_raw = query.split('&')
                    .find(|s| s.starts_with("code="))
                    .map(|s| s["code=".len()..].to_string())
                    .unwrap_or_default();
                
                let code = match urlencoding::decode(&code_raw) {
                    Ok(decoded) => decoded.into_owned(),
                    Err(_) => code_raw,
                };
                
                if code.is_empty() {
                    return Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .body(ResponseBody::from("Missing code parameter"))?);
                }
                wrap(auth_handlers::google_callback(code).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/me" => {
            if method == "GET" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                wrap(auth_handlers::get_me(auth_header.as_deref()).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/forgot-password" => {
            if method == "POST" {
                let bytes = read_body(&mut req).await?;
                let body: models::ForgotPasswordRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::forgot_password(body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/reset-password" => {
            if method == "POST" {
                let bytes = read_body(&mut req).await?;
                let body: models::ResetPasswordRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::reset_password(body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/complete-profile" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                let bytes = read_body(&mut req).await?;
                let body: models::CompleteProfileRequest = serde_json::from_slice(&bytes)?;
                wrap(auth_handlers::complete_profile(auth_header.as_deref(), body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/checkout/create-session" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                let bytes = read_body(&mut req).await?;
                let body: models::CreateCheckoutSessionRequest = serde_json::from_slice(&bytes)?;
                wrap(checkout_handlers::create_checkout_session(auth_header.as_deref(), body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/checkout/confirm" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                let bytes = read_body(&mut req).await?;
                let body: models::ConfirmCheckoutSessionRequest = serde_json::from_slice(&bytes)?;
                wrap(checkout_handlers::confirm_checkout_session(auth_header.as_deref(), body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/checkout/calculate" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                let bytes = read_body(&mut req).await?;
                let body: models::CheckoutCalculateRequest = serde_json::from_slice(&bytes)?;
                wrap(checkout_handlers::calculate_checkout(auth_header.as_deref(), body).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/admin/wholesale-users" => {
            if method == "GET" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                wrap(admin_handlers::get_wholesale_users(auth_header.as_deref()).await)
            } else {
                method_not_allowed()
            }
        }
        p if p.starts_with("/api/v1/admin/wholesale-users/") => {
            let id_str = &p["/api/v1/admin/wholesale-users/".len()..];
            if let Ok(id) = id_str.parse::<i64>() {
                if method == "PATCH" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    let bytes = read_body(&mut req).await?;
                    let body: models::UpdateUserDiscountRequest = serde_json::from_slice(&bytes)?;
                    wrap(admin_handlers::update_user_discount(auth_header.as_deref(), id, body).await)
                } else {
                    method_not_allowed()
                }
            } else {
                not_found()
            }
        }
        "/api/v1/admin/customer-prices" => {
            let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
            match method.as_str() {
                "GET" => {
                    let query = req.uri().query().unwrap_or("");
                    let user_id = query.split('&')
                        .find(|s| s.starts_with("user_id="))
                        .and_then(|s| s.split('=').nth(1))
                        .and_then(|s| s.parse::<i64>().ok());
                    
                    if let Some(uid) = user_id {
                        wrap(admin_handlers::get_customer_prices(auth_header.as_deref(), uid).await)
                    } else {
                        Ok(Response::builder()
                            .status(StatusCode::BAD_REQUEST)
                            .body(ResponseBody::from("Missing user_id parameter"))?)
                    }
                }
                "POST" => {
                    let bytes = read_body(&mut req).await?;
                    let body: models::UpsertCustomerPriceRequest = serde_json::from_slice(&bytes)?;
                    wrap(admin_handlers::upsert_customer_price(auth_header.as_deref(), body).await)
                }
                "DELETE" => {
                    let query = req.uri().query().unwrap_or("");
                    let user_id = query.split('&')
                        .find(|s| s.starts_with("user_id="))
                        .and_then(|s| s.split('=').nth(1))
                        .and_then(|s| s.parse::<i64>().ok());
                    let variant_id = query.split('&')
                        .find(|s| s.starts_with("variant_id="))
                        .and_then(|s| s.split('=').nth(1))
                        .and_then(|s| s.parse::<i64>().ok());
                    
                    if let (Some(uid), Some(vid)) = (user_id, variant_id) {
                        wrap(admin_handlers::delete_customer_price(auth_header.as_deref(), uid, vid).await)
                    } else {
                        Ok(Response::builder()
                            .status(StatusCode::BAD_REQUEST)
                            .body(ResponseBody::from("Missing user_id or variant_id parameter"))?)
                    }
                }
                _ => method_not_allowed(),
            }
        }
        "/api/v1/ebay/sync" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                wrap(ebay_handlers::sync_inventory(auth_header.as_deref()).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/ebay/products" => {
            if method == "GET" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                wrap(ebay_handlers::get_ebay_products(auth_header.as_deref()).await)
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/reviews/eligibility" => {
            let query = req.uri().query().unwrap_or("");
            let product_id = query.split('&')
                .find(|s| s.starts_with("product_id="))
                .and_then(|s| s.split('=').nth(1))
                .and_then(|s| s.parse::<i64>().ok());
            
            if let Some(id) = product_id {
                if method == "GET" {
                    let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                    wrap(review_handlers::check_eligibility(auth_header.as_deref(), id).await)
                } else {
                    method_not_allowed()
                }
            } else {
                not_found()
            }
        }
        "/api/v1/reviews" => {
            if method == "POST" {
                let auth_header = req.headers().get("Authorization").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
                let bytes = read_body(&mut req).await?;
                let body: models::CreateReviewRequest = serde_json::from_slice(&bytes)?;
                wrap(review_handlers::create_review(auth_header.as_deref(), body).await)
            } else {
                method_not_allowed()
            }
        }
        p if p.starts_with("/api/v1/admin/erp") => {
            let mut auth_val = req.headers().get("Authorization")
                .or_else(|| req.headers().get("authorization"))
                .and_then(|h| h.to_str().ok())
                .map(|s| s.to_string());
            
            // Extract token from query parameters as fallback (useful for iframe/tab loads)
            let query = req.uri().query().unwrap_or("").to_string();
            if auth_val.is_none() && !query.is_empty() {
                if let Some(token_param) = query.split('&').find(|s| s.starts_with("token=")).and_then(|s| s.split('=').nth(1)) {
                    auth_val = Some(format!("Bearer {}", token_param));
                }
            }

            // Extract token from cookies as secondary fallback (useful for subsequent app/resource loads)
            if auth_val.is_none() {
                if let Some(cookie_header) = req.headers().get("cookie").or_else(|| req.headers().get("Cookie")).and_then(|h| h.to_str().ok()) {
                    if let Some(token_cookie) = cookie_header.split(';').map(|s| s.trim()).find(|s| s.starts_with("authToken=")).and_then(|s| s.split('=').nth(1)) {
                        auth_val = Some(format!("Bearer {}", token_cookie));
                    }
                }
            }

            let sub_path = &p["/api/v1/admin/erp".len()..];
            let method = req.method().clone();
            let headers = req.headers().clone();
            let bytes = read_body(&mut req).await?;
            admin_handlers::erp_proxy(auth_val.as_deref(), method, sub_path, query, headers, bytes).await
        }
        _ => not_found(),
    }
}

/// Convert Response<String> from handlers into Response<ResponseBody>
fn wrap(result: Result<Response<String>, Error>) -> Result<Response<ResponseBody>, Error> {
    match result {
        Ok(resp) => {
            let (parts, body) = resp.into_parts();
            Ok(Response::from_parts(parts, ResponseBody::from(body)))
        }
        Err(e) => Err(e),
    }
}

fn not_found() -> Result<Response<ResponseBody>, Error> {
    Ok(Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("Content-Type", "application/json")
        .body(ResponseBody::from(json!({ "error": "Not Found" }).to_string()))?)
}

fn method_not_allowed() -> Result<Response<ResponseBody>, Error> {
    Ok(Response::builder()
        .status(StatusCode::METHOD_NOT_ALLOWED)
        .header("Content-Type", "application/json")
        .body(ResponseBody::from(json!({ "error": "Method Not Allowed" }).to_string()))?)
}
