pub mod google_provider;

use anyhow::{anyhow, Result};

pub fn generate_jwt(user_id: i64, email: &str) -> Result<String> {
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

    let secret = std::env::var("JWT_SECRET").map_err(|_| anyhow!("JWT_SECRET is not set"))?;
    if secret.trim().len() < 32 {
        return Err(anyhow!("JWT_SECRET must be at least 32 characters"));
    }

    Ok(encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?)
}
