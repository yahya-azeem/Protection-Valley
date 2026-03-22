use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use serde_json::json;

use toolpro_api::handlers::{product_handlers, order_handlers, auth_handlers, ebay_handlers, checkout_handlers};
use toolpro_api::models;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let path = req.uri().path();
    let method = req.method().as_str();

    // Routing
    match path {
        "/api/v1/products" => {
            match method {
                "GET" => product_handlers::get_products().await,
                "POST" => {
                    let body: models::CreateProductRequest = serde_json::from_slice(req.body())?;
                    product_handlers::create_product(body).await
                }
                _ => method_not_allowed(),
            }
        }
        p if p.starts_with("/api/v1/products/") => {
            let id_str = &p["/api/v1/products/".len()..];
            if let Ok(id) = id_str.parse::<i64>() {
                match method {
                    "GET" => product_handlers::get_product(id).await,
                    "PUT" => {
                        let body: models::UpdateProductRequest = serde_json::from_slice(req.body())?;
                        product_handlers::update_product(id, body).await
                    }
                    "DELETE" => product_handlers::delete_product(id).await,
                    _ => method_not_allowed(),
                }
            } else {
                not_found()
            }
        }
        "/api/v1/orders" => {
            match method {
                "GET" => order_handlers::get_orders().await,
                "POST" => {
                    let body: models::CreateOrderRequest = serde_json::from_slice(req.body())?;
                    order_handlers::create_order(body).await
                }
                _ => method_not_allowed(),
            }
        }
        p if p.starts_with("/api/v1/orders/") => {
            // Check for status update route first
            if p.ends_with("/status") {
                let id_str = &p["/api/v1/orders/".len()..p.len() - "/status".len()];
                if method == "PATCH" {
                    let body: models::OrderStatus = serde_json::from_slice(req.body())?;
                    order_handlers::update_order_status(id_str.to_string(), body).await
                } else {
                    method_not_allowed()
                }
            } else {
                let id_str = &p["/api/v1/orders/".len()..];
                if method == "GET" {
                    order_handlers::get_order(id_str.to_string()).await
                } else {
                    method_not_allowed()
                }
            }
        }
        "/api/v1/auth/login" => {
            if method == "POST" {
                let body: models::LoginRequest = serde_json::from_slice(req.body())?;
                auth_handlers::login(body).await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/register" => {
            if method == "POST" {
                let body: models::RegisterRequest = serde_json::from_slice(req.body())?;
                auth_handlers::register(body).await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/google/login" => {
            if method == "GET" {
                auth_handlers::google_login().await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/google/callback" => {
            if method == "GET" {
                let query = req.uri().query().unwrap_or("");
                let code = query.split('&')
                    .find(|s| s.starts_with("code="))
                    .map(|s| s["code=".len()..].to_string())
                    .unwrap_or_default();
                
                if code.is_empty() {
                    return Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .body(Body::from("Missing code parameter"))?);
                }
                auth_handlers::google_callback(code).await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/auth/me" => {
            if method == "GET" {
                auth_handlers::get_me().await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/checkout/create-session" => {
            if method == "POST" {
                let body: models::CreateCheckoutSessionRequest = serde_json::from_slice(req.body())?;
                checkout_handlers::create_checkout_session(body).await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/ebay/sync" => {
            if method == "POST" {
                ebay_handlers::sync_inventory().await
            } else {
                method_not_allowed()
            }
        }
        "/api/v1/ebay/products" => {
            if method == "GET" {
                ebay_handlers::get_ebay_products().await
            } else {
                method_not_allowed()
            }
        }
        _ => not_found(),
    }
}

fn not_found() -> Result<Response<Body>, Error> {
    Ok(Response::builder()
        .status(StatusCode::NOT_FOUND)
        .header("Content-Type", "application/json")
        .body(Body::from(json!({ "error": "Not Found" }).to_string()))?)
}

fn method_not_allowed() -> Result<Response<Body>, Error> {
    Ok(Response::builder()
        .status(StatusCode::METHOD_NOT_ALLOWED)
        .header("Content-Type", "application/json")
        .body(Body::from(json!({ "error": "Method Not Allowed" }).to_string()))?)
}
