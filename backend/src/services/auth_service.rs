use crate::auth::generate_jwt;
use crate::models::{AuthResponse, RegisterRequest, User, UserRole};
use chrono::Utc;
use std::env;
use uuid::Uuid;
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION};

pub struct AuthService {
    client: reqwest::Client,
    supabase_url: String,
    supabase_key: String,
}

impl Default for AuthService {
    fn default() -> Self {
        Self::new()
    }
}

impl AuthService {
    pub fn new() -> Self {
        let supabase_url = env::var("SUPABASE_URL").unwrap_or_else(|_| "https://fnirqccmtjzibjhgzyay.supabase.co".to_string());
        let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY")
            .or_else(|_| env::var("SUPABASE_ANON_KEY"))
            .unwrap_or_default();

        Self {
            client: reqwest::Client::new(),
            supabase_url,
            supabase_key,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        let key = self.supabase_key.trim();
        if let Ok(val) = HeaderValue::from_str(key) {
            headers.insert("apikey", val);
            if let Ok(auth) = HeaderValue::from_str(&format!("Bearer {}", key)) {
                headers.insert(AUTHORIZATION, auth);
            }
        }
        headers
    }

    /// Fetches a user by email from Supabase
    pub async fn get_user_by_email(&self, email: &str) -> Result<Option<User>, String> {
        let url = format!("{}/rest/v1/wholesale_users?email=eq.{}&select=*", self.supabase_url, urlencoding::encode(email));
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {}", error));
        }

        let users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse user: {}", e))?;

        Ok(users.into_iter().next())
    }

    /// Fetches a user by ID from Supabase
    pub async fn get_user_by_id(&self, id: i64) -> Result<Option<User>, String> {
        let url = format!("{}/rest/v1/wholesale_users?id=eq.{}&select=*", self.supabase_url, id);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {}", error));
        }

        let users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse user: {}", e))?;

        Ok(users.into_iter().next())
    }

    /// Logs in a user with email and password
    pub async fn login(&self, email: &str, password: &str) -> Result<Option<AuthResponse>, String> {
        let email_trimmed = email.trim().to_lowercase();
        let user = match self.get_user_by_email(&email_trimmed).await? {
            Some(u) => u,
            None => return Ok(None),
        };

        let password_hash = match &user.password_hash {
            Some(hash) => hash,
            None => return Err("This account uses Google Sign-in. Please log in with Google.".to_string()),
        };

        if !bcrypt::verify(password, password_hash).unwrap_or(false) {
            return Ok(None);
        }

        let role_str = match &user.role {
            UserRole::Retail => "retail",
            UserRole::Wholesale => "wholesale",
            UserRole::Admin => "admin",
        };

        let token = generate_jwt(user.id, &user.email, role_str).map_err(|e| e.to_string())?;

        Ok(Some(AuthResponse { token, user }))
    }

    /// Registers a new user or links password auth to an existing Google user
    pub async fn register(&self, req: RegisterRequest) -> Result<AuthResponse, String> {
        let email_trimmed = req.email.trim().to_lowercase();
        let hashed_password = bcrypt::hash(&req.password, bcrypt::DEFAULT_COST)
            .map_err(|e| format!("Failed to hash password: {}", e))?;

        let existing_user = self.get_user_by_email(&email_trimmed).await?;

        if let Some(user) = existing_user {
            // Check if names match as requested
            if user.name.trim().to_lowercase() != req.name.trim().to_lowercase() {
                return Err("An account with this email already exists but the name does not match.".to_string());
            }

            // Link password authentication to the existing account
            let url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user.id);
            
            let mut payload = serde_json::json!({
                "password_hash": hashed_password,
                "updated_at": Utc::now()
            });

            if let Some(company) = req.company {
                payload["company"] = serde_json::json!(company);
            }
            if let Some(sales_tax_id) = req.sales_tax_id {
                payload["sales_tax_id"] = serde_json::json!(sales_tax_id);
                payload["role"] = serde_json::json!("wholesale");
            }
            if let Some(proof_name) = req.sales_tax_proof_name {
                payload["sales_tax_proof_name"] = serde_json::json!(proof_name);
            }
            if let Some(proof_data) = req.sales_tax_proof_data {
                payload["sales_tax_proof_data"] = serde_json::json!(proof_data);
            }
            if let Some(phone) = req.phone {
                payload["phone"] = serde_json::json!(phone);
            }
            if let Some(business_type) = req.business_type {
                payload["business_type"] = serde_json::json!(business_type);
            }
            if let Some(website) = req.website {
                payload["website"] = serde_json::json!(website);
            }

            let response = self.client
                .patch(&url)
                .headers(self.headers())
                .header("Prefer", "return=representation")
                .json(&payload)
                .send()
                .await
                .map_err(|e| format!("Request failed: {}", e))?;

            if !response.status().is_success() {
                let error = response.text().await.unwrap_or_default();
                return Err(format!("Supabase update error: {}", error));
            }

            let updated_users: Vec<User> = response.json()
                .await
                .map_err(|e| format!("Failed to parse updated user: {}", e))?;

            let updated_user = updated_users.into_iter().next()
                .ok_or_else(|| "Failed to retrieve updated user".to_string())?;

            let role_str = match &updated_user.role {
                UserRole::Retail => "retail",
                UserRole::Wholesale => "wholesale",
                UserRole::Admin => "admin",
            };

            let token = generate_jwt(updated_user.id, &updated_user.email, role_str).map_err(|e| e.to_string())?;
            return Ok(AuthResponse { token, user: updated_user });
        }

        // Create new user account
        let user_id = generate_user_id();
        let role = if req.sales_tax_id.is_some() { UserRole::Wholesale } else { req.role.unwrap_or(UserRole::Retail) };

        let user = User {
            id: user_id,
            email: email_trimmed,
            name: req.name,
            password_hash: Some(hashed_password),
            role: role.clone(),
            picture: None,
            company: req.company,
            sales_tax_id: req.sales_tax_id,
            sales_tax_proof_name: req.sales_tax_proof_name,
            sales_tax_proof_data: req.sales_tax_proof_data,
            is_wholesale_approved: Some(true),
            wholesale_discount: if let UserRole::Wholesale = role { Some(0.30) } else { None },
            google_id: None,
            reset_token: None,
            reset_token_expires_at: None,
            phone: req.phone,
            business_type: req.business_type,
            website: req.website,
            created_at: Utc::now(),
        };

        let url = format!("{}/rest/v1/wholesale_users", self.supabase_url);
        let response = self.client
            .post(&url)
            .headers(self.headers())
            .header("Prefer", "return=representation")
            .json(&user)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase create error: {}", error));
        }

        let created_users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse created user: {}", e))?;

        let created_user = created_users.into_iter().next()
            .ok_or_else(|| "Failed to retrieve created user".to_string())?;

        let role_str = match &created_user.role {
            UserRole::Retail => "retail",
            UserRole::Wholesale => "wholesale",
            UserRole::Admin => "admin",
        };

        let token = generate_jwt(created_user.id, &created_user.email, role_str).map_err(|e| e.to_string())?;
        Ok(AuthResponse { token, user: created_user })
    }

    /// Handles Google authentication login or registration and automatic account merging/linking
    pub async fn google_login_or_register(
        &self,
        google_id: &str,
        email: &str,
        name: &str,
        picture: Option<String>,
    ) -> Result<User, String> {
        let email_trimmed = email.trim().to_lowercase();
        let existing_user = self.get_user_by_email(&email_trimmed).await?;

        if let Some(user) = existing_user {
            // Check if names match as requested
            if user.name.trim().to_lowercase() != name.trim().to_lowercase() {
                return Err("An account with this email already exists but the name does not match.".to_string());
            }

            // Link Google auth to the existing account
            let url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user.id);
            let response = self.client
                .patch(&url)
                .headers(self.headers())
                .header("Prefer", "return=representation")
                .json(&serde_json::json!({
                    "google_id": google_id,
                    "picture": picture,
                    "updated_at": Utc::now()
                }))
                .send()
                .await
                .map_err(|e| format!("Request failed: {}", e))?;

            if !response.status().is_success() {
                let error = response.text().await.unwrap_or_default();
                return Err(format!("Supabase update error: {}", error));
            }

            let updated_users: Vec<User> = response.json()
                .await
                .map_err(|e| format!("Failed to parse updated user: {}", e))?;

            return updated_users.into_iter().next()
                .ok_or_else(|| "Failed to retrieve updated user".to_string());
        }

        // Create new user account via Google signup (initially Retail until sales tax info is submitted)
        let user_id = generate_user_id();
        let user = User {
            id: user_id,
            email: email_trimmed,
            name: name.to_string(),
            password_hash: None,
            role: UserRole::Retail,
            picture,
            company: None,
            sales_tax_id: None,
            sales_tax_proof_name: None,
            sales_tax_proof_data: None,
            is_wholesale_approved: Some(false),
            wholesale_discount: None,
            google_id: Some(google_id.to_string()),
            reset_token: None,
            reset_token_expires_at: None,
            phone: None,
            business_type: None,
            website: None,
            created_at: Utc::now(),
        };

        let url = format!("{}/rest/v1/wholesale_users", self.supabase_url);
        let response = self.client
            .post(&url)
            .headers(self.headers())
            .header("Prefer", "return=representation")
            .json(&user)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase create error: {}", error));
        }

        let created_users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse created user: {}", e))?;

        created_users.into_iter().next()
            .ok_or_else(|| "Failed to retrieve created user".to_string())
    }

    /// Sets a password reset token for a user
    pub async fn forgot_password(&self, email: &str) -> Result<String, String> {
        let email_trimmed = email.trim().to_lowercase();
        let user = match self.get_user_by_email(&email_trimmed).await? {
            Some(u) => u,
            None => return Err("No account found with this email address.".to_string()),
        };

        let token = Uuid::new_v4().to_string();
        let expires_at = Utc::now() + chrono::Duration::hours(1);

        let url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user.id);
        let response = self.client
            .patch(&url)
            .headers(self.headers())
            .json(&serde_json::json!({
                "reset_token": token,
                "reset_token_expires_at": expires_at,
                "updated_at": Utc::now()
            }))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase update error: {}", error));
        }

        Ok(token)
    }

    /// Resets the user password using a valid reset token
    pub async fn reset_password(&self, token: &str, new_password: &str) -> Result<(), String> {
        let url = format!("{}/rest/v1/wholesale_users?reset_token=eq.{}&select=*", self.supabase_url, token);
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {}", error));
        }

        let users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse user: {}", e))?;

        let user = match users.into_iter().next() {
            Some(u) => u,
            None => return Err("Invalid or expired password reset link.".to_string()),
        };

        if let Some(expires_at) = user.reset_token_expires_at {
            if expires_at < Utc::now() {
                return Err("The password reset link has expired.".to_string());
            }
        } else {
            return Err("Invalid password reset link.".to_string());
        }

        let hashed_password = bcrypt::hash(new_password, bcrypt::DEFAULT_COST)
            .map_err(|e| format!("Failed to hash password: {}", e))?;

        let update_url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user.id);
        let update_response = self.client
            .patch(&update_url)
            .headers(self.headers())
            .json(&serde_json::json!({
                "password_hash": hashed_password,
                "reset_token": null,
                "reset_token_expires_at": null,
                "updated_at": Utc::now()
            }))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !update_response.status().is_success() {
            let error = update_response.text().await.unwrap_or_default();
            return Err(format!("Supabase update error: {}", error));
        }

        Ok(())
    }

    /// Submits proof of sales tax and company details to upgrade to wholesale role
    pub async fn complete_profile(
        &self,
        user_id: i64,
        company: &str,
        sales_tax_id: &str,
        proof_name: &str,
        proof_data: &str,
        phone: Option<&str>,
        business_type: Option<&str>,
        website: Option<&str>,
    ) -> Result<User, String> {
        let url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user_id);
        
        let mut payload = serde_json::json!({
            "company": company.trim(),
            "sales_tax_id": sales_tax_id.trim(),
            "sales_tax_proof_name": proof_name.trim(),
            "sales_tax_proof_data": proof_data.trim(),
            "role": "wholesale",
            "is_wholesale_approved": true,
            "updated_at": Utc::now()
        });

        if let Some(p) = phone {
            payload["phone"] = serde_json::json!(p.trim());
        }
        if let Some(bt) = business_type {
            payload["business_type"] = serde_json::json!(bt.trim());
        }
        if let Some(w) = website {
            payload["website"] = serde_json::json!(w.trim());
        }

        let response = self.client
            .patch(&url)
            .headers(self.headers())
            .header("Prefer", "return=representation")
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase update error: {}", error));
        }

        let updated_users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse updated user: {}", e))?;

        updated_users.into_iter().next()
            .ok_or_else(|| "Failed to retrieve updated user".to_string())
    }

    /// Fetches all wholesale users
    pub async fn get_all_wholesale_users(&self) -> Result<Vec<User>, String> {
        let url = format!("{}/rest/v1/wholesale_users?select=*", self.supabase_url);
        
        let response = self.client
            .get(&url)
            .headers(self.headers())
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase error: {}", error));
        }

        let users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse users: {}", e))?;

        Ok(users)
    }

    /// Updates a user's wholesale discount rate
    pub async fn update_user_discount(&self, user_id: i64, discount: f64) -> Result<User, String> {
        let url = format!("{}/rest/v1/wholesale_users?id=eq.{}", self.supabase_url, user_id);
        
        let response = self.client
            .patch(&url)
            .headers(self.headers())
            .header("Prefer", "return=representation")
            .json(&serde_json::json!({
                "wholesale_discount": discount,
                "updated_at": Utc::now()
            }))
            .send()
            .await
            .map_err(|e| format!("Request failed: {}", e))?;

        if !response.status().is_success() {
            let error = response.text().await.unwrap_or_default();
            return Err(format!("Supabase update error: {}", error));
        }

        let updated_users: Vec<User> = response.json()
            .await
            .map_err(|e| format!("Failed to parse updated user: {}", e))?;

        updated_users.into_iter().next()
            .ok_or_else(|| "Failed to retrieve updated user".to_string())
    }
}

fn generate_user_id() -> i64 {
    (Uuid::new_v4().as_u128() & i64::MAX as u128) as i64
}
