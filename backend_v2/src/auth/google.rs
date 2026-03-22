use oauth2::basic::BasicClient;
use oauth2::{
    AuthUrl, ClientId, ClientSecret, RedirectUrl, TokenUrl, 
    AuthorizationCode, CsrfToken, Scope, PkceCodeChallenge,
    TokenResponse,
};
use oauth2::reqwest::async_http_client;
use serde::{Deserialize, Serialize};
use anyhow::{Result, anyhow};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct GoogleUser {
    pub id: String,
    pub email: String,
    pub verified_email: bool,
    pub name: String,
    pub given_name: String,
    pub family_name: String,
    pub picture: String,
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
        .map_err(|e| anyhow!("Invalid auth URL: {}", e))?;
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v4/token".to_string())
        .map_err(|e| anyhow!("Invalid token URL: {}", e))?;

    Ok(BasicClient::new(
        ClientId::new(client_id),
        Some(ClientSecret::new(client_secret)),
        auth_url,
        Some(token_url),
    )
    .set_redirect_uri(RedirectUrl::new(redirect_url).map_err(|e| anyhow!("Invalid redirect URL: {}", e))?))
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
        .map_err(|e| anyhow!("Failed to exchange token: {}", e))?;

    let access_token = token_response.access_token().secret();
    
    let user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo";
    let client = reqwest::Client::new();
    let user_info = client
        .get(user_info_url)
        .bearer_auth(access_token)
        .send()
        .await?
        .json::<GoogleUser>()
        .await?;

    Ok(user_info)
}
