use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::services::ebay_service::EbayService;

pub async fn sync_inventory(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    if let Err(err) = crate::handlers::admin_handlers::verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = EbayService::new();
    
    match service.sync_inventory().await {
        Ok(result) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&result)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}

pub async fn get_ebay_products(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    if let Err(err) = crate::handlers::admin_handlers::verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = EbayService::new();
    
    match service.get_ebay_products().await {
        Ok(products) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&products)?)?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": format!("{}", e) }).to_string())?),
    }
}
