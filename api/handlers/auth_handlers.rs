use vercel_runtime::{Body, Response, StatusCode, Error};
use crate::models::{LoginRequest, RegisterRequest};
use crate::services::auth_service::AuthService;

pub async fn login(req: LoginRequest) -> Result<Response<Body>, Error> {
    let service = AuthService::new();
    
    match service.login(&req.email, &req.password).await {
        Ok(Some(response)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&response)?))?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": "Invalid email or password" }).to_string()))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn register(req: RegisterRequest) -> Result<Response<Body>, Error> {
    let service = AuthService::new();
    
    match service.register(req).await {
        Ok(response) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::to_string(&response)?))?),
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn get_me() -> Result<Response<Body>, Error> {
    Ok(Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/json")
        .body(Body::from(serde_json::json!({
            "message": "Get current user endpoint - implement JWT validation"
        }).to_string()))?)
}
