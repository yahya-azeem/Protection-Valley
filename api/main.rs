use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};
use actix_web::web;

mod handlers;
mod models;
mod services;
mod auth;

use handlers::{product_handlers, order_handlers, auth_handlers, ebay_handlers};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    let path = req.uri().path();
    let method = req.method();

    // Simple routing for Vercel
    if path.starts_with("/api/v1/products") {
        // Dispatch to product_handlers
        // Note: For a real migration, we would adapt handlers to take vercel_runtime::Request
        // For now, returning a mock response or adapting the call
    }

    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(Body::from(r#"{"message": "ToolPro API on Vercel"}"#))?)
}
