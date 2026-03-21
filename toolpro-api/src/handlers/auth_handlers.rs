use actix_web::{web, HttpResponse, Responder};
use crate::models::{LoginRequest, RegisterRequest};
use crate::services::auth_service::AuthService;

pub async fn login(body: web::Json<LoginRequest>) -> impl Responder {
    let service = AuthService::new();
    
    match service.login(&body.email, &body.password).await {
        Ok(Some(response)) => HttpResponse::Ok().json(response),
        Ok(None) => HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid email or password"
        })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Login failed: {}", e)
        })),
    }
}

pub async fn register(body: web::Json<RegisterRequest>) -> impl Responder {
    let service = AuthService::new();
    
    match service.register(body.into_inner()).await {
        Ok(response) => HttpResponse::Created().json(response),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": format!("Registration failed: {}", e)
        })),
    }
}

pub async fn get_me() -> impl Responder {
    // In a real implementation, this would extract the user from the JWT token
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Get current user endpoint - implement JWT validation"
    }))
}
