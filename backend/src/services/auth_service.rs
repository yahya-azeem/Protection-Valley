use crate::auth::generate_jwt;
use crate::models::{AuthResponse, RegisterRequest, User, UserRole};
use chrono::Utc;
use uuid::Uuid;

pub struct AuthService;

impl Default for AuthService {
    fn default() -> Self {
        Self::new()
    }
}

impl AuthService {
    pub fn new() -> Self {
        Self
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<Option<AuthResponse>, String> {
        let _ = (email, password);
        Ok(None)
    }

    pub async fn register(&self, req: RegisterRequest) -> Result<AuthResponse, String> {
        let user = User {
            id: generate_user_id(),
            email: req.email,
            name: req.name,
            role: req.role.unwrap_or(UserRole::Retail),
            picture: None,
            company: req.company,
            created_at: Utc::now(),
        };

        let role_str = match &user.role {
            UserRole::Retail => "retail",
            UserRole::Wholesale => "wholesale",
            UserRole::Admin => "admin",
        };

        let token = generate_jwt(user.id, &user.email, role_str).map_err(|e| e.to_string())?;
        Ok(AuthResponse { token, user })
    }
}

fn generate_user_id() -> i64 {
    (Uuid::new_v4().as_u128() & i64::MAX as u128) as i64
}
