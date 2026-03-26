use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{CreateOrderRequest, OrderStatus};
use crate::services::order_service::OrderService;

pub async fn get_orders() -> Result<Response<String>, Error> {
    let service = OrderService::new();
    match service.get_all_orders().await {
        Ok(orders) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&orders)?)?),
        Err(e) => {
            eprintln!("[get_orders] order error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Failed to fetch orders" }).to_string())?)
        }
    }
}

pub async fn get_order(id: String) -> Result<Response<String>, Error> {
    let service = OrderService::new();
    
    match service.get_order_by_id(&id).await {
        Ok(Some(order)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&order)?)?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Order not found" }).to_string())?),
        Err(e) => {
            eprintln!("[get_order] order error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Failed to fetch order" }).to_string())?)
        }
    }
}

pub async fn create_order(req: CreateOrderRequest) -> Result<Response<String>, Error> {
    let service = OrderService::new();
    
    match service.create_order(req).await {
        Ok(order) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&order)?)?),
        Err(e) => {
            eprintln!("[create_order] order error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Failed to create order" }).to_string())?)
        }
    }
}

pub async fn update_order_status(id: String, status: OrderStatus) -> Result<Response<String>, Error> {
    let service = OrderService::new();
    
    match service.update_order_status(&id, status).await {
        Ok(Some(order)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&order)?)?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Order not found" }).to_string())?),
        Err(e) => {
            eprintln!("[update_order_status] order error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Failed to update order status" }).to_string())?)
        }
    }
}
