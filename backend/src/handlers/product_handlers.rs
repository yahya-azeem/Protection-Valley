use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{CreateProductRequest, UpdateProductRequest};
use crate::services::product_service::ProductService;

use crate::services::auth_service::AuthService;

pub async fn get_products(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    let service = ProductService::new();
    match service.get_all_products().await {
        Ok(mut products) => {
            // Apply customer-specific wholesale pricing if authenticated as wholesale/admin
            if let Some(user_info) = get_wholesale_user_info(auth_header).await {
                apply_wholesale_pricing(&mut products, &user_info.0, &user_info.1).await;
            }

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(serde_json::to_string(&products)?)?)
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn get_product(id: i64, auth_header: Option<&str>) -> Result<Response<String>, Error> {
    let service = ProductService::new();
    
    match service.get_product_by_id(id).await {
        Ok(Some(mut product)) => {
            if let Some(user_info) = get_wholesale_user_info(auth_header).await {
                let mut products_vec = vec![product];
                apply_wholesale_pricing(&mut products_vec, &user_info.0, &user_info.1).await;
                product = products_vec.into_iter().next().unwrap();
            }

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(serde_json::to_string(&product)?)?)
        }
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Product not found" }).to_string())?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn create_product(req: CreateProductRequest) -> Result<Response<String>, Error> {
    let service = ProductService::new();
    
    match service.create_product(req).await {
        Ok(product) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&product)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn update_product(id: i64, req: UpdateProductRequest) -> Result<Response<String>, Error> {
    let service = ProductService::new();
    
    match service.update_product(id, req).await {
        Ok(Some(product)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&product)?)?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Product not found" }).to_string())?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn delete_product(id: i64) -> Result<Response<String>, Error> {
    let service = ProductService::new();
    
    match service.delete_product(id).await {
        Ok(true) => Ok(Response::builder()
            .status(StatusCode::NO_CONTENT)
            .body(String::new())?),
        Ok(false) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Product not found" }).to_string())?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

async fn get_wholesale_user_info(auth_header: Option<&str>) -> Option<(crate::models::User, Vec<crate::models::CustomerSpecificPrice>)> {
    let token = crate::auth::extract_token(auth_header)?;
    let claims = crate::auth::decode_jwt(token).ok()?;
    if claims.role != "wholesale" && claims.role != "admin" {
        return None;
    }
    
    let auth_service = AuthService::new();
    let user = auth_service.get_user_by_id(claims.user_id).await.ok()??;
    
    let product_service = ProductService::new();
    let prices = product_service.get_customer_specific_prices(claims.user_id).await.unwrap_or_default();
    
    Some((user, prices))
}

async fn apply_wholesale_pricing(
    products: &mut [crate::models::Product],
    user: &crate::models::User,
    custom_prices: &[crate::models::CustomerSpecificPrice]
) {
    let discount = user.wholesale_discount.unwrap_or(0.30);
    
    for product in products {
        if let Some(ref mut variants) = product.variants {
            for v in variants {
                let custom = custom_prices.iter()
                    .find(|p| p.variant_id == v.id)
                    .map(|p| p.custom_price);
                
                if let Some(price) = custom {
                    v.wholesale_price = Some(price);
                } else {
                    v.wholesale_price = Some(v.price * (1.0 - discount));
                }
            }
        }
    }
}

