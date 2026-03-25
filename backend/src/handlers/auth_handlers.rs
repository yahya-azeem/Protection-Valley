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
            .body(Body::from(serde_json::json!({ "error": format!("{e}") }).to_string()))?),
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
            .body(Body::from(serde_json::json!({ "error": format!("{e}") }).to_string()))?),
    }
}

pub async fn google_login() -> Result<Response<Body>, Error> {
    // Use catch_unwind to capture panics
    let result = std::panic::catch_unwind(|| {
        crate::auth::google_provider::get_auth_url()
    });

    match result {
        Ok(Ok((url, _csrf_token))) => {
            Ok(Response::builder()
                .status(StatusCode::TEMPORARY_REDIRECT)
                .header("Location", url)
                .body(Body::Empty)?)
        }
        Ok(Err(e)) => {
            let error_msg = format!("{e}");
            eprintln!("[google_login] OAuth error: {error_msg}");
            if error_msg.contains("not set") {
                Ok(Response::builder()
                    .status(StatusCode::SERVICE_UNAVAILABLE)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::json!({
                        "error": "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URL environment variables.",
                        "detail": error_msg
                    }).to_string()))?)
            } else {
                Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::json!({ 
                        "error": "OAuth configuration error",
                        "detail": error_msg 
                    }).to_string()))?)
            }
        }
        Err(panic_info) => {
            let panic_msg = panic_info
                .downcast_ref::<String>()
                .cloned()
                .or_else(|| panic_info.downcast_ref::<&str>().map(|s| s.to_string()))
                .unwrap_or_else(|| "Unknown panic".to_string());
            eprintln!("[google_login] PANIC: {panic_msg}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(Body::from(serde_json::json!({
                    "error": "Internal server error (panic)",
                    "detail": panic_msg
                }).to_string()))?)
        }
    }
}

pub async fn google_callback(code: String) -> Result<Response<Body>, Error> {
    match crate::auth::google_provider::handle_callback(code).await {
        Ok(google_user) => {
            let user = crate::models::User {
                id: 101,
                email: google_user.email.clone(),
                name: google_user.name,
                role: crate::models::UserRole::Wholesale,
                company: None,
                created_at: chrono::Utc::now(),
            };

            match crate::auth::generate_jwt(user.id, &user.email) {
                Ok(token) => {
                    let frontend_url = std::env::var("FRONTEND_URL").unwrap_or_else(|_| "https://protection-valley.vercel.app".to_string());
                    let redirect_url = format!("{frontend_url}/?token={token}&wholesale=true");
                    
                    Ok(Response::builder()
                        .status(StatusCode::TEMPORARY_REDIRECT)
                        .header("Location", redirect_url)
                        .body(Body::Empty)?)
                }
                Err(e) => Ok(Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(Body::from(serde_json::json!({ "error": format!("{e}") }).to_string()))?),
            }
        }
        Err(e) => Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(Body::from(serde_json::json!({ "error": format!("{e}") }).to_string()))?),
    }
}

pub async fn get_me() -> Result<Response<Body>, Error> {
    Ok(Response::builder()
        .status(StatusCode::UNAUTHORIZED)
        .header("Content-Type", "application/json")
        .body(Body::from(serde_json::json!({
            "error": "Authentication required. Please provide a valid token."
        }).to_string()))?)
}
