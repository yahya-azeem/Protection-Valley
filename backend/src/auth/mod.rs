pub mod google_provider;

pub fn generate_jwt(user_id: i64, email: &str) -> Result<String, jsonwebtoken::errors::Error> {
    use jsonwebtoken::{encode, EncodingKey, Header};
    use serde::{Deserialize, Serialize};
    
    #[derive(Debug, Serialize, Deserialize)]
    struct Claims {
        sub: String,
        user_id: i64,
        exp: usize,
    }
    
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;
    
    let claims = Claims {
        sub: email.to_string(),
        user_id,
        exp: expiration,
    };
    
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "default-secret".to_string());
    
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )
}
