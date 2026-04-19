use oauth2::basic::BasicClient;
use oauth2::{
    AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl, 
    AuthorizationCode, CsrfToken, Scope,
    TokenResponse,
};
use oauth2::reqwest::async_http_client;
use serde::{Deserialize, Serialize};
use anyhow::{Result, anyhow};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleUser {
    #[serde(rename = "sub")]
    pub id: String,
    pub email: String,
    #[serde(rename = "email_verified")]
    pub verified_email: bool,
    pub name: String,
    #[serde(default)]
    pub given_name: String,
    #[serde(default)]
    pub family_name: String,
    #[serde(default)]
    pub picture: String,
    #[serde(default)]
    pub locale: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleIdToken {
    pub iss: String,
    pub sub: String,
    pub azp: String,
    pub aud: String,
    pub iat: String,
    pub exp: String,
    pub email: String,
    pub email_verified: String,
    pub name: String,
    pub picture: String,
    pub given_name: String,
    pub family_name: String,
    pub locale: String,
}

pub fn get_google_client() -> Result<BasicClient> {
    let client_id = env::var("GOOGLE_CLIENT_ID")
        .map_err(|_| anyhow!("GOOGLE_CLIENT_ID not set"))?;
    let client_secret = env::var("GOOGLE_CLIENT_SECRET")
        .map_err(|_| anyhow!("GOOGLE_CLIENT_SECRET not set"))?;
    let redirect_url = env::var("GOOGLE_REDIRECT_URL")
        .map_err(|_| anyhow!("GOOGLE_REDIRECT_URL not set"))?;

    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
        .map_err(|e| anyhow!("Invalid auth URL: {e}"))?;
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v4/token".to_string())
        .map_err(|e| anyhow!("Invalid token URL: {e}"))?;

    Ok(BasicClient::new(
        ClientId::new(client_id),
        Some(ClientSecret::new(client_secret)),
        auth_url,
        Some(token_url),
    )
    .set_redirect_uri(RedirectUrl::new(redirect_url).map_err(|e| anyhow!("Invalid redirect URL: {e}"))?))
}

pub fn get_auth_url() -> Result<(String, String)> {
    let client = get_google_client()?;
    
    // Google supports PKCE, but it's optional for server-side flows. 
    // We'll use CSRF protection.
    let (auth_url, csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.email".to_string()))
        .add_scope(Scope::new("https://www.googleapis.com/auth/userinfo.profile".to_string()))
        .url();

    Ok((auth_url.to_string(), csrf_token.secret().to_string()))
}

pub async fn handle_callback(code: String) -> Result<GoogleUser> {
    let client = get_google_client()?;
    
    let token_response = client
        .exchange_code(AuthorizationCode::new(code))
        .request_async(async_http_client)
        .await
        .map_err(|e| anyhow!("Failed to exchange token: {e}"))?;

    let access_token = token_response.access_token().secret();
    
    let user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo";
    let client = reqwest::Client::new();
    let user_info_text = client
        .get(user_info_url)
        .bearer_auth(access_token)
        .send()
        .await?
        .text()
        .await?;

    let user_info = serde_json::from_str::<GoogleUser>(&user_info_text)
        .map_err(|e| anyhow!("Failed to parse Google user info: {e}. Raw: {user_info_text}"))?;

    Ok(user_info)
}

pub async fn verify_id_token(token: &str) -> Result<GoogleIdToken> {
    let client = reqwest::Client::new();
    let url = format!("https://oauth2.googleapis.com/tokeninfo?id_token={}", token);
    
    let response = client.get(&url).send().await?;
    
    if !response.status().is_success() {
        let err_text = response.text().await?;
        return Err(anyhow!("Google token verification failed: {}", err_text));
    }
    
    let id_token_info = response.json::<GoogleIdToken>().await?;
    
    // Basic verification: check audience matches our client ID
    let client_id = env::var("GOOGLE_CLIENT_ID").unwrap_or_default();
    if !client_id.is_empty() && id_token_info.aud != client_id {
        return Err(anyhow!("Token audience mismatch. Expected {}, got {}", client_id, id_token_info.aud));
    }
    
    Ok(id_token_info)
}
