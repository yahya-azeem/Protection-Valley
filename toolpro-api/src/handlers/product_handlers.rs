use actix_web::{web, HttpResponse, Responder};
use crate::models::{CreateProductRequest, UpdateProductRequest};
use crate::services::product_service::ProductService;

pub async fn get_products() -> impl Responder {
    let service = ProductService::new();
    match service.get_all_products().await {
        Ok(products) => HttpResponse::Ok().json(products),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch products: {}", e)
        })),
    }
}

pub async fn get_product(path: web::Path<i64>) -> impl Responder {
    let service = ProductService::new();
    let id = path.into_inner();
    
    match service.get_product_by_id(id).await {
        Ok(Some(product)) => HttpResponse::Ok().json(product),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Product not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch product: {}", e)
        })),
    }
}

pub async fn create_product(body: web::Json<CreateProductRequest>) -> impl Responder {
    let service = ProductService::new();
    
    match service.create_product(body.into_inner()).await {
        Ok(product) => HttpResponse::Created().json(product),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create product: {}", e)
        })),
    }
}

pub async fn update_product(
    path: web::Path<i64>,
    body: web::Json<UpdateProductRequest>,
) -> impl Responder {
    let service = ProductService::new();
    let id = path.into_inner();
    
    match service.update_product(id, body.into_inner()).await {
        Ok(Some(product)) => HttpResponse::Ok().json(product),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Product not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to update product: {}", e)
        })),
    }
}

pub async fn delete_product(path: web::Path<i64>) -> impl Responder {
    let service = ProductService::new();
    let id = path.into_inner();
    
    match service.delete_product(id).await {
        Ok(true) => HttpResponse::NoContent().finish(),
        Ok(false) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Product not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to delete product: {}", e)
        })),
    }
}
