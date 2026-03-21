use actix_web::{web, HttpResponse, Responder};
use crate::services::ebay_service::EbayService;

pub async fn sync_inventory() -> impl Responder {
    let service = EbayService::new();
    
    match service.sync_inventory().await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Sync failed: {}", e)
        })),
    }
}

pub async fn get_ebay_products() -> impl Responder {
    let service = EbayService::new();
    
    match service.get_ebay_products().await {
        Ok(products) => HttpResponse::Ok().json(products),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch eBay products: {}", e)
        })),
    }
}
