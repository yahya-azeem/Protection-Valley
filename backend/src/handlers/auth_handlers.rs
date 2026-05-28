use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::{LoginRequest, RegisterRequest, GoogleVerifyRequest, ForgotPasswordRequest, ResetPasswordRequest, CompleteProfileRequest, AuthResponse};
use crate::services::auth_service::AuthService;
use crate::services::email_service::EmailService;

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
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
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
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
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

            let service = AuthService::new();
            match service.google_login_or_register(&google_user.id, &google_user.email, &google_user.name, Some(google_user.picture)).await {
                Ok(user) => {
                    let role_str = match &user.role {
                        crate::models::UserRole::Retail => "retail",
                        crate::models::UserRole::Wholesale => "wholesale",
                        crate::models::UserRole::Admin => "admin",
                    };

                    match crate::auth::generate_jwt(user.id, &user.email, role_str) {
                        Ok(token) => {
                            // If they have not completed wholesale profile, redirect them to complete-profile on frontend
                            let redirect_url = if user.sales_tax_id.is_none() {
                                format!("{frontend_url}/complete-profile?token={token}")
                            } else {
                                format!("{frontend_url}/?token={token}&wholesale=true")
                            };

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
                    eprintln!("[google_callback] DB mapping error: {e}");
                    Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body(serde_json::json!({ "error": e }).to_string())?)
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
            let service = AuthService::new();
            match service.google_login_or_register(&token_info.sub, &token_info.email, &token_info.name, Some(token_info.picture)).await {
                Ok(user) => {
                    let role_str = match &user.role {
                        crate::models::UserRole::Retail => "retail",
                        crate::models::UserRole::Wholesale => "wholesale",
                        crate::models::UserRole::Admin => "admin",
                    };

                    match crate::auth::generate_jwt(user.id, &user.email, role_str) {
                        Ok(token) => {
                            let response = AuthResponse {
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
                    eprintln!("[google_verify] DB mapping error: {e}");
                    Ok(Response::builder()
                        .status(StatusCode::BAD_REQUEST)
                        .header("Content-Type", "application/json")
                        .body(serde_json::json!({ "error": e }).to_string())?)
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

pub async fn get_me(auth_header: Option<&str>) -> Result<Response<String>, Error> {
    let token = match crate::auth::extract_token(auth_header) {
        Some(t) => t,
        None => {
            return Ok(Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Authentication required" }).to_string())?);
        }
    };

    let claims = match crate::auth::decode_jwt(token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Invalid token" }).to_string())?);
        }
    };

    let service = AuthService::new();
    match service.get_user_by_id(claims.user_id).await {
        Ok(Some(user)) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&user)?)?),
        Ok(None) => Ok(Response::builder()
            .status(StatusCode::NOT_FOUND)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "error": "User not found" }).to_string())?),
        Err(e) => {
            eprintln!("[get_me] db error: {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Internal error" }).to_string())?)
        }
    }
}

pub async fn forgot_password(req: ForgotPasswordRequest) -> Result<Response<String>, Error> {
    let service = AuthService::new();
    
    match service.forgot_password(&req.email).await {
        Ok(token) => {
            let email_service = EmailService::new();
            if let Err(e) = email_service.send_password_reset_email(&req.email, &token).await {
                eprintln!("[forgot_password] email sending error: {e}");
            }
            Ok(Response::builder()
                .status(StatusCode::OK)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "message": "Password reset instructions sent to email." }).to_string())?)
        }
        Err(e) => {
            eprintln!("[forgot_password] error: {e}");
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
        }
    }
}

pub async fn reset_password(req: ResetPasswordRequest) -> Result<Response<String>, Error> {
    let service = AuthService::new();
    
    match service.reset_password(&req.token, &req.new_password).await {
        Ok(_) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "message": "Password updated successfully." }).to_string())?),
        Err(e) => {
            eprintln!("[reset_password] error: {e}");
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
        }
    }
}

pub async fn complete_profile(auth_header: Option<&str>, req: CompleteProfileRequest) -> Result<Response<String>, Error> {
    let token = match crate::auth::extract_token(auth_header) {
        Some(t) => t,
        None => {
            return Ok(Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Authentication required" }).to_string())?);
        }
    };

    let claims = match crate::auth::decode_jwt(token) {
        Ok(c) => c,
        Err(_) => {
            return Ok(Response::builder()
                .status(StatusCode::UNAUTHORIZED)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Invalid token" }).to_string())?);
        }
    };

    let service = AuthService::new();
    match service.complete_profile(claims.user_id, &req.company, &req.sales_tax_id, &req.sales_tax_proof_name, &req.sales_tax_proof_data).await {
        Ok(user) => {
            // Generate updated JWT with role = "wholesale"
            match crate::auth::generate_jwt(user.id, &user.email, "wholesale") {
                Ok(new_token) => {
                    let response = AuthResponse {
                        token: new_token,
                        user,
                    };
                    Ok(Response::builder()
                        .status(StatusCode::OK)
                        .header("Content-Type", "application/json")
                        .body(serde_json::to_string(&response)?)?)
                }
                Err(e) => {
                    eprintln!("[complete_profile] JWT error: {e}");
                    Ok(Response::builder()
                        .status(StatusCode::SERVICE_UNAVAILABLE)
                        .header("Content-Type", "application/json")
                        .body(serde_json::json!({ "error": "Token generation failed" }).to_string())?)
                }
            }
        }
        Err(e) => {
            eprintln!("[complete_profile] DB error: {e}");
            Ok(Response::builder()
                .status(StatusCode::BAD_REQUEST)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e }).to_string())?)
        }
    }
}
