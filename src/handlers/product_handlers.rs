use vercel_runtime::{Body, Response, StatusCode, Error};
use crate::models::{CreateProductRequest, UpdateProductRequest};
use crate::services::product_service::ProductService;

pub async fn get_products() -> Result<Response<Body>, Error> {
    let service = ProductService::new();
    match service.get_all_products().await {
        Ok(products) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&products)?))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn get_product(id: i64) -> Result<Response<Body>, Error> {
    let service = ProductService::new();
    
    match service.get_product_by_id(id).await {
        Ok(Some(product)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&product)?))?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": "Product not found" }).to_string()))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn create_product(req: CreateProductRequest) -> Result<Response<Body>, Error> {
    let service = ProductService::new();
    
    match service.create_product(req).await {
        Ok(product) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&product)?))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn update_product(id: i64, req: UpdateProductRequest) -> Result<Response<Body>, Error> {
    let service = ProductService::new();
    
    match service.update_product(id, req).await {
        Ok(Some(product)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&product)?))?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": "Product not found" }).to_string()))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn delete_product(id: i64) -> Result<Response<Body>, Error> {
    let service = ProductService::new();
    
    match service.delete_product(id).await {
        Ok(true) => Ok(Response::builder()
            .status(StatusCode::NO_CONTENT)
            .body(Body::Empty)?),
        Ok(false) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": "Product not found" }).to_string()))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}
