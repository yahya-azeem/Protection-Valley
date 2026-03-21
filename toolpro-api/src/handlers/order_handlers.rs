use actix_web::{web, HttpResponse, Responder};
use crate::models::{CreateOrderRequest, OrderStatus};
use crate::services::order_service::OrderService;

pub async fn get_orders() -> impl Responder {
    let service = OrderService::new();
    match service.get_all_orders().await {
        Ok(orders) => HttpResponse::Ok().json(orders),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch orders: {}", e)
        })),
    }
}

pub async fn get_order(path: web::Path<String>) -> impl Responder {
    let service = OrderService::new();
    let id = path.into_inner();
    
    match service.get_order_by_id(&id).await {
        Ok(Some(order)) => HttpResponse::Ok().json(order),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Order not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to fetch order: {}", e)
        })),
    }
}

pub async fn create_order(body: web::Json<CreateOrderRequest>) -> impl Responder {
    let service = OrderService::new();
    
    match service.create_order(body.into_inner()).await {
        Ok(order) => HttpResponse::Created().json(order),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to create order: {}", e)
        })),
    }
}

pub async fn update_order_status(
    path: web::Path<String>,
    body: web::Json<OrderStatus>,
) -> impl Responder {
    let service = OrderService::new();
    let id = path.into_inner();
    let status = body.into_inner();
    
    match service.update_order_status(&id, status).await {
        Ok(Some(order)) => HttpResponse::Ok().json(order),
        Ok(None) => HttpResponse::NotFound().json(serde_json::json!({
            "error": "Order not found"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Failed to update order status: {}", e)
        })),
    }
}
