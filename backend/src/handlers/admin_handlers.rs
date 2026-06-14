use vercel_runtime::{Response, Error};
use http::StatusCode;
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
