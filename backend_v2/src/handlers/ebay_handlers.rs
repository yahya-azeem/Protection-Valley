use vercel_runtime::{Body, Response, StatusCode, Error};
use crate::services::ebay_service::EbayService;

pub async fn sync_inventory() -> Result<Response<Body>, Error> {
    let service = EbayService::new();
    
    match service.sync_inventory().await {
        Ok(result) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&result)?))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn get_ebay_products() -> Result<Response<Body>, Error> {
    let service = EbayService::new();
    
    match service.get_ebay_products().await {
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
