use vercel_runtime::{Response, Error};
use http::{StatusCode, HeaderMap};
use crate::models::{UpdateUserDiscountRequest, UpsertCustomerPriceRequest};
use crate::services::auth_service::AuthService;
use crate::services::product_service::ProductService;
use crate::auth::{decode_jwt, extract_token};

/// Utility function to check if the caller is an admin
pub fn verify_admin(auth_header: Option<&str>) -> Result<i64, String> {
    let token = extract_token(auth_header).ok_or("Authentication token missing")?;
    let claims = decode_jwt(token).map_err(|e| format!("Invalid token: {}", e))?;
    if claims.role != "admin" {
        return Err("Access denied. Admin role required.".to_string());
    }
    Ok(claims.user_id)
}

pub async fn get_wholesale_users(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = AuthService::new();
    match service.get_all_wholesale_users().await {
        Ok(users) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&users)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn update_user_discount(auth_header: Option<&str>, user_id: i64, req: UpdateUserDiscountRequest) -> Result<Response<String>, Error> {
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = AuthService::new();
    match service.update_user_discount(user_id, req.wholesale_discount).await {
        Ok(user) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&user)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn get_customer_prices(auth_header: Option<&str>, user_id: i64) -> Result<Response<String>, Error> {
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = ProductService::new();
    match service.get_customer_specific_prices(user_id).await {
        Ok(prices) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&prices)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn upsert_customer_price(auth_header: Option<&str>, req: UpsertCustomerPriceRequest) -> Result<Response<String>, Error> {
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = ProductService::new();
    match service.upsert_customer_price(req.user_id, req.variant_id, req.custom_price).await {
        Ok(price) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&price)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn delete_customer_price(auth_header: Option<&str>, user_id: i64, variant_id: i64) -> Result<Response<String>, Error> {
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = ProductService::new();
    match service.delete_customer_price(user_id, variant_id).await {
        Ok(_) => Ok(Response::builder()
            .status(StatusCode::NO_CONTENT)
            .body(String::new())?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn erp_proxy(
    auth_header: Option<&str>,
    method: http::Method,
    sub_path: &str,
    query: String,
    headers: HeaderMap,
    body: Vec<u8>,
) -> Result<Response<vercel_runtime::ResponseBody>, Error> {
    // 1. Verify caller is admin
    if let Err(err) = verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(vercel_runtime::ResponseBody::from(serde_json::json!({ "error": err }).to_string()))?);
    }

    // 2. Fetch the ERPNext URL from environment
    let erp_url = std::env::var("ERPNEXT_URL")
        .unwrap_or_else(|_| "http://localhost:8080".to_string());

    // 3. Build target URL
    let mut target_url = format!("{}/{}", erp_url.trim_end_matches('/'), sub_path.trim_start_matches('/'));
    if !query.is_empty() {
        target_url = format!("{}?{}", target_url, query);
    }

    // 4. Construct reqwest client and forward request
    let client = reqwest::Client::new();
    
    // We copy standard request headers
    let mut req_headers = reqwest::header::HeaderMap::new();
    for (k, v) in headers.iter() {
        if k != "host" && k != "authorization" {
            if let Ok(name) = reqwest::header::HeaderName::from_bytes(k.as_str().as_bytes()) {
                if let Ok(val) = reqwest::header::HeaderValue::from_bytes(v.as_bytes()) {
                    req_headers.insert(name, val);
                }
            }
        }
    }

    // Convert http::Method to reqwest::Method
    let reqwest_method = reqwest::Method::from_bytes(method.as_str().as_bytes())
        .map_err(|e| anyhow::anyhow!("Invalid HTTP method: {}", e))?;

    let req_builder = client.request(reqwest_method, &target_url)
        .headers(req_headers)
        .body(body);

    let resp = req_builder.send().await?;
    
    // 5. Build response back
    let target_status = StatusCode::from_u16(resp.status().as_u16())
        .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);
    let mut resp_builder = Response::builder().status(target_status);
    
    // Forward response headers
    for (k, v) in resp.headers().iter() {
        resp_builder = resp_builder.header(k.as_str(), v.as_bytes());
    }

    let resp_bytes = resp.bytes().await?;
    Ok(resp_builder.body(vercel_runtime::ResponseBody::from(resp_bytes.to_vec()))?)
}
