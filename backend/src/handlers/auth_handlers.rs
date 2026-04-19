// Auth handlers for the Protection Valley application. Updated: 2026-04-05T04:09Z
use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{LoginRequest, RegisterRequest, GoogleVerifyRequest};
use crate::services::auth_service::AuthService;
use uuid::Uuid;

pub async fn login(req: LoginRequest) -> Result<Response<String>, Error> {
    let service = AuthService::new();
    
    match service.login(&req.email, &req.password).await {
        Ok(Some(response)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&response)?)?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Invalid email or password" }).to_string())?),
        Err(e) => {
            eprintln!("[login] auth error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Authentication failed" }).to_string())?)
        }
    }
}

pub async fn register(req: RegisterRequest) -> Result<Response<String>, Error> {
    let service = AuthService::new();
    
    match service.register(req).await {
        Ok(response) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&response)?)?),
        Err(e) => {
            eprintln!("[register] auth error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Registration failed" }).to_string())?)
        }
    }
}

pub async fn google_login() -> Result<Response<String>, Error> {
    match crate::auth::google_provider::get_auth_url() {
        Ok((url, _csrf_token)) => {
            Ok(Response::builder()
                .status(StatusCode::TEMPORARY_REDIRECT)
                .header("Location", url)
                .body(String::new())?)
        }
        Err(e) => {
            let error_msg = format!("{e}");
            eprintln!("[google_login] OAuth error: {error_msg}");
            Ok(Response::builder()
                .status(StatusCode::SERVICE_UNAVAILABLE)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({
                    "error": "Google OAuth is unavailable"
                }).to_string())?)
        }
    }
}

pub async fn google_callback(code: String) -> Result<Response<String>, Error> {
    match crate::auth::google_provider::handle_callback(code).await {
        Ok(google_user) => {
            let frontend_url = match std::env::var("FRONTEND_URL") {
                Ok(url) => url,
                Err(_) => {
                    return Ok(Response::builder()
                        .status(StatusCode::SERVICE_UNAVAILABLE)
                        .header("Content-Type", "application/json")
                        .body(serde_json::json!({
                            "error": "Frontend redirect is not configured"
                        }).to_string())?);
                }
            };

            let user = crate::models::User {
                id: generate_user_id(),
                email: google_user.email.clone(),
                name: google_user.name,
                role: crate::models::UserRole::Wholesale,
                picture: Some(google_user.picture),
                company: None,
                created_at: chrono::Utc::now(),
            };

            match crate::auth::generate_jwt(user.id, &user.email, "wholesale") {
                Ok(token) => {
                    let redirect_url = format!("{frontend_url}/?token={token}&wholesale=true");

                    Ok(Response::builder()
                        .status(StatusCode::TEMPORARY_REDIRECT)
                        .header("Location", redirect_url)
                        .body(String::new())?)
                }
                Err(e) => {
                    eprintln!("[google_callback] JWT error: {e}");
                    Ok(Response::builder()
                    .status(StatusCode::SERVICE_UNAVAILABLE)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({ "error": "Authentication is temporarily unavailable" }).to_string())?)
                }
            }
        }
        Err(e) => {
            eprintln!("[google_callback] OAuth callback error: {e}");
            Ok(Response::builder()
            .status(StatusCode::INTERNAL_SERVER_ERROR)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "OAuth callback failed" }).to_string())?)
        }
    }
}

pub async fn google_verify(req: GoogleVerifyRequest) -> Result<Response<String>, Error> {
    match crate::auth::google_provider::verify_id_token(&req.token).await {
        Ok(token_info) => {
            let user = crate::models::User {
                id: generate_user_id(),
                email: token_info.email.clone(),
                name: token_info.name,
                role: crate::models::UserRole::Wholesale,
                picture: Some(token_info.picture),
                company: None,
                created_at: chrono::Utc::now(),
            };

            match crate::auth::generate_jwt(user.id, &user.email, "wholesale") {
                Ok(token) => {
                    let response = crate::models::AuthResponse {
                        token,
                        user,
                    };
                    Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/json")
                        .body(serde_json::to_string(&response)?)?)
                }
                Err(e) => {
                    eprintln!("[google_verify] JWT error: {e}");
                    Ok(Response::builder()
                    .status(StatusCode::SERVICE_UNAVAILABLE)
                    .header("Content-Type", "application/json")
                    .body(serde_json::json!({ "error": "Authentication is temporarily unavailable" }).to_string())?)
                }
            }
        }
        Err(e) => {
            eprintln!("[google_verify] Token verification error: {e}");
            Ok(Response::builder()
            .status(StatusCode::UNAUTHORIZED)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "Invalid Google token" }).to_string())?)
        }
    }
}

pub async fn get_me() -> Result<Response<String>, Error> {
    Ok(Response::builder()
        .status(StatusCode::UNAUTHORIZED)
        .header("Content-Type", "application/json")
        .body(serde_json::json!({
            "error": "Authentication required. Please provide a valid token."
        }).to_string())?)
}

fn generate_user_id() -> i64 {
    (Uuid::new_v4().as_u128() & i64::MAX as u128) as i64
}
