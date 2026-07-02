use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{CreateOrderRequest, OrderStatus};
use crate::services::order_service::OrderService;

pub async fn get_orders(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    if let Err(err) = crate::handlers::admin_handlers::verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

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

pub async fn get_order(auth_header: Option<&str>, id: String) -> Result<Response<String>, Error> {
    let token = crate::auth::extract_token(auth_header);
    let claims = token.and_then(|t| crate::auth::decode_jwt(t).ok());

    let service = OrderService::new();
    match service.get_order_by_id(&id).await {
        Ok(Some(order)) => {
            let authorized = if let Some(ref c) = claims {
                c.role == "admin" || (order.customer_id != 0 && order.customer_id == c.user_id) || (!order.customer_email.is_empty() && order.customer_email == c.sub)
            } else {
                false
            };

            if !authorized {
                return Ok(Response::builder()
                    .status(StatusCode::FORBIDDEN)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({ "error": "Access denied. You are not authorized to view this order." }).to_string())?);
            }

            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(serde_json::to_string(&order)?)?)
        }
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

pub async fn update_order_status(auth_header: Option<&str>, id: String, status: OrderStatus) -> Result<Response<String>, Error> {
    if let Err(err) = crate::handlers::admin_handlers::verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

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

pub async fn create_order_shipment(auth_header: Option<&str>, id: String) -> Result<Response<String>, Error> {
    if let Err(err) = crate::handlers::admin_handlers::verify_admin(auth_header) {
        return Ok(Response::builder()
            .status(StatusCode::FORBIDDEN)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": err }).to_string())?);
    }

    let service = OrderService::new();
    match service.generate_shipping_label(&id).await {
        Ok(order) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&order)?)?),
        Err(e) => {
            eprintln!("[create_order_shipment] shipping label error: {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
        }
    }
}
