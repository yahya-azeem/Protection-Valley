use crate::models::{User, UserRole, RegisterRequest, AuthResponse};
use chrono::Utc;

pub struct AuthService;

impl AuthService {
    pub fn new() -> Self {
        Self
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<Option<AuthResponse>, String> {
        // In a real implementation, verify password hash against database
        if email == "admin@protectionvalley.com" && password == "password" {
            let user = User {
                id: 1,
                email: email.to_string(),
                name: "Admin".to_string(),
                role: UserRole::Admin,
                company: None,
                created_at: Utc::now(),
            };

            let token = self.generate_token(&user);
            return Ok(Some(AuthResponse { token, user }));
        }

        if email == "wholesale@protectionvalley.com" && password == "password" {
            let user = User {
                id: 2,
                email: email.to_string(),
                name: "Wholesale Customer".to_string(),
                role: UserRole::Wholesale,
                company: Some("ABC Construction".to_string()),
                created_at: Utc::now(),
            };

            let token = self.generate_token(&user);
            return Ok(Some(AuthResponse { token, user }));
        }

        Ok(None)
    }

    pub async fn register(&self, req: RegisterRequest) -> Result<AuthResponse, String> {
        let user = User {
            id: 100, // Would be auto-generated
            email: req.email,
            name: req.name,
            role: req.role.unwrap_or(UserRole::Retail),
            company: req.company,
            created_at: Utc::now(),
        };

        let token = self.generate_token(&user);
        Ok(AuthResponse { token, user })
    }

    fn generate_token(&self, user: &User) -> String {
        // In a real implementation, use JWT via crate::auth::generate_jwt
        format!("pv-token-{}", user.id)
    }
}
