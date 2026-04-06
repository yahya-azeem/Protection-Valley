use vercel_runtime::{Response, Error};
use http::StatusCode;
use crate::models::CreateReviewRequest;
use crate::services::review_service::ReviewService;
use crate::auth::decode_jwt;

pub async fn get_product_reviews(product_id: i64) -> Result<Response<String>, Error> {
    let service = ReviewService::new();
    match service.get_product_reviews(product_id).await {
        Ok(reviews) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&reviews)?)?),
        Err(e) => {
            eprintln!("[get_product_reviews] error: {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Failed to fetch reviews" }).to_string())?)
        }
    }
}

pub async fn check_eligibility(auth_header: Option<&str>, product_id: i64) -> Result<Response<String>, Error> {
    let token = match extract_token(auth_header) {
        Some(t) => t,
        None => return Ok(unauthorized_response()),
    };

    let claims = match decode_jwt(token) {
        Ok(c) => c,
        Err(_) => return Ok(unauthorized_response()),
    };

    let service = ReviewService::new();
    match service.check_eligibility(claims.user_id, product_id).await {
        Ok(eligible) => Ok(Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .body(serde_json::json!({ "eligible": eligible }).to_string())?),
        Err(e) => {
            eprintln!("[check_eligibility] error: {e}");
            Ok(Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": "Failed to check eligibility" }).to_string())?)
        }
    }
}

pub async fn create_review(auth_header: Option<&str>, req: CreateReviewRequest) -> Result<Response<String>, Error> {
    let token = match extract_token(auth_header) {
        Some(t) => t,
        None => return Ok(unauthorized_response()),
    };

    let claims = match decode_jwt(token) {
        Ok(c) => c,
        Err(_) => return Ok(unauthorized_response()),
    };

    let service = ReviewService::new();
    match service.create_review(claims.user_id, claims.sub.clone(), req).await {
        Ok(review) => Ok(Response::builder()
            .status(StatusCode::CREATED)
            .header("Content-Type", "application/json")
            .body(serde_json::to_string(&review)?)?),
        Err(e) => {
            eprintln!("[create_review] error: {e}");
            let status = if e.to_string().contains("Only users who have purchased") {
                StatusCode::FORBIDDEN
            } else {
                StatusCode::INTERNAL_SERVER_ERROR
            };
            Ok(Response::builder()
                .status(status)
                .header("Content-Type", "application/json")
                .body(serde_json::json!({ "error": e.to_string() }).to_string())?)
        }
    }
}

fn extract_token(header: Option<&str>) -> Option<&str> {
    header.and_then(|h| {
        if h.starts_with("Bearer ") {
            Some(&h[7..])
        } else {
            None
        }
    })
}

fn unauthorized_response() -> Response<String> {
    Response::builder()
        .status(StatusCode::UNAUTHORIZED)
        .header("Content-Type", "application/json")
        .body(serde_json::json!({ "error": "Authentication required" }).to_string())
        .unwrap()
}
