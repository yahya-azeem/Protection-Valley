pub mod google_provider;

use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub user_id: i64,
    pub role: String,
    pub exp: usize,
}

pub fn generate_jwt(user_id: i64, email: &str, role: &str) -> Result<String> {
    use jsonwebtoken::{encode, EncodingKey, Header};

    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: email.to_string(),
        user_id,
        role: role.to_string(),
        exp: expiration,
    };

    let secret = std::env::var("JWT_SECRET").map_err(|_| anyhow!("JWT_SECRET is not set"))?;
    if secret.trim().len() < 32 {
        return Err(anyhow!("JWT_SECRET must be at least 32 characters"));
    }

    Ok(encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.trim().as_bytes()),
    )?)
}

pub fn decode_jwt(token: &str) -> Result<Claims> {
    use jsonwebtoken::{decode, DecodingKey, Validation};

    let secret = std::env::var("JWT_SECRET").map_err(|_| anyhow!("JWT_SECRET is not set"))?;
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.trim().as_bytes()),
        &Validation::default(),
    )?;

    Ok(token_data.claims)
}

pub fn extract_token(header: Option<&str>) -> Option<&str> {
    header.and_then(|h| {
        if h.starts_with("Bearer ") {
            Some(&h[7..])
        } else {
            None
        }
    })
}
