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

pub async fn google_login() -> Result<Response<Body>, Error> {
    match crate::auth::google::get_auth_url() {
        Ok((url, _csrf_token)) => {
            Ok(Response::builder()
                .status(StatusCode::TEMPORARY_REDIRECT)
                .header("Location", url)
                .body(Body::Empty)?)
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}

pub async fn google_callback(code: String) -> Result<Response<Body>, Error> {
    match crate::auth::google::handle_callback(code).await {
        Ok(google_user) => {
            let service = AuthService::new();
            // In a real app, we'd find or create a user in the DB.
            // For now, we'll mock a successful login as a wholesale user if it's a "authorized" email, 
            // or just a retail user otherwise.
            let user = crate::models::User {
                id: 101, // Mock ID
                email: google_user.email.clone(),
                name: google_user.name,
                role: crate::models::UserRole::Wholesale, // Defaulting to wholesale for this demo as requested
                company: None,
                created_at: chrono::Utc::now(),
            };

            match crate::auth::generate_jwt(user.id, &user.email) {
                Ok(token) => {
                    // Redirect back to frontend with token
                    let frontend_url = std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:5173".to_string());
                    let redirect_url = format!("{}/?token={}&wholesale=true", frontend_url, token);
                    
                    Ok(Response::builder()
                        .status(StatusCode::TEMPORARY_REDIRECT)
                        .header("Location", redirect_url)
                        .body(Body::Empty)?)
                }
                Err(e) => Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
            }
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{}", e) }).to_string()))?),
    }
}
