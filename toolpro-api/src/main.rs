use actix_cors::Cors;
use actix_web::{middleware, web, App, HttpServer};
use env_logger;
use log::info;

mod handlers;
mod models;
mod services;
mod auth;

use handlers::{product_handlers, order_handlers, auth_handlers, ebay_handlers};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    info!("Starting ToolPro API server...");
    
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        
        App::new()
            .wrap(middleware::Logger::default())
            .wrap(cors)
            .configure(configure_routes)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

fn configure_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            // Product routes
            .service(
                web::scope("/products")
                    .route("", web::get().to(product_handlers::get_products))
                    .route("/{id}", web::get().to(product_handlers::get_product))
                    .route("", web::post().to(product_handlers::create_product))
                    .route("/{id}", web::put().to(product_handlers::update_product))
                    .route("/{id}", web::delete().to(product_handlers::delete_product))
            )
            // Order routes
            .service(
                web::scope("/orders")
                    .route("", web::get().to(order_handlers::get_orders))
                    .route("/{id}", web::get().to(order_handlers::get_order))
                    .route("", web::post().to(order_handlers::create_order))
                    .route("/{id}/status", web::put().to(order_handlers::update_order_status))
            )
            // Auth routes
            .service(
                web::scope("/auth")
                    .route("/login", web::post().to(auth_handlers::login))
                    .route("/register", web::post().to(auth_handlers::register))
                    .route("/me", web::get().to(auth_handlers::get_me))
            )
            // eBay sync routes
            .service(
                web::scope("/ebay")
                    .route("/sync", web::post().to(ebay_handlers::sync_inventory))
                    .route("/products", web::get().to(ebay_handlers::get_ebay_products))
            )
    );
}
