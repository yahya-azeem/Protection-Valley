use std::env;
use serde::{Deserialize, Serialize};
use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};
use crate::models::Order;
use anyhow::{Result, anyhow};

#[derive(Debug, Serialize, Deserialize)]
struct SendGridEmail {
    pub personalizations: Vec<Personalization>,
    pub from: EmailAddress,
    pub subject: String,
    pub content: Vec<EmailContent>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Personalization {
    pub to: Vec<EmailAddress>,
}

#[derive(Debug, Serialize, Deserialize)]
struct EmailAddress {
    pub email: String,
    pub name: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct EmailContent {
    pub r#type: String,
    pub value: String,
}

pub struct EmailService {
    client: reqwest::Client,
    api_key: String,
    admin_email: String,
}

impl EmailService {
    pub fn new() -> Self {
        let api_key = env::var("SENDGRID_API_KEY").unwrap_or_default();
        let admin_email = env::var("ADMIN_NOTIFICATION_EMAIL").unwrap_or_else(|_| "admin@protectionvalley.com".to_string());
        Self {
            client: reqwest::Client::new(),
            api_key,
            admin_email,
        }
    }

    fn headers(&self) -> HeaderMap {
        let mut headers = HeaderMap::new();
        let auth = format!("Bearer {}", self.api_key);
        if let Ok(val) = HeaderValue::from_str(&auth) {
            headers.insert(AUTHORIZATION, val);
        }
        headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
        headers
    }

    pub async fn send_order_notification(&self, order: &Order) -> Result<()> {
        if self.api_key.is_empty() {
            return Err(anyhow!("SENDGRID_API_KEY not configured"));
        }

        let carrier = order.carrier.as_deref().unwrap_or("Unknown");
        let tracking = order.tracking_number.as_deref().unwrap_or("Pending");
        let label_url = order.shipping_label_url.as_deref().unwrap_or("#");

        let mut items_html = String::new();
        for item in &order.items {
            items_html.push_str(&format!(
                "<li>{} x {} (@ ${:.2})</li>",
                item.quantity, item.product_name, item.unit_price
            ));
        }

        let html_content = format!(
            r#"
            <h2>New Order Received: {order_id}</h2>
            <p><strong>Customer:</strong> {customer_name} ({customer_email})</p>
            <p><strong>Total:</strong> ${total:.2}</p>
            
            <h3>Shipping Label Information</h3>
            <p><strong>Carrier:</strong> {carrier}</p>
            <p><strong>Tracking Number:</strong> {tracking}</p>
            <p><a href="{label_url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Shipping Label</a></p>
            
            <h3>Order Items</h3>
            <ul>{items_html}</ul>
            
            <h3>Shipping Address</h3>
            <p>
                {address_line1}<br>
                {address_line2}
                {city}, {state} {zip}<br>
                {country}
            </p>
            "#,
            order_id = order.id,
            customer_name = order.customer_name,
            customer_email = order.customer_email,
            total = order.total,
            carrier = carrier,
            tracking = tracking,
            label_url = label_url,
            items_html = items_html,
            address_line1 = order.shipping_address.address_line1,
            address_line2 = order.shipping_address.address_line2.as_deref().unwrap_or(""),
            city = order.shipping_address.city,
            state = order.shipping_address.state,
            zip = order.shipping_address.zip,
            country = order.shipping_address.country,
        );

        let email_payload = SendGridEmail {
            personalizations: vec![Personalization {
                to: vec![EmailAddress {
                    email: self.admin_email.clone(),
                    name: Some("Protection Valley Admin".to_string()),
                }],
            }],
            from: EmailAddress {
                email: "notifications@protectionvalley.com".to_string(), // Must be verified in SendGrid
                name: Some("Protection Valley Alerts".to_string()),
            },
            subject: format!("New Order - Shipping Label Generated ({})", order.id),
            content: vec![EmailContent {
                r#type: "text/html".to_string(),
                value: html_content,
            }],
        };

        let response = self.client
            .post("https://api.sendgrid.com/v3/mail/send")
            .headers(self.headers())
            .json(&email_payload)
            .send()
            .await?;

        if !response.status().is_success() {
            let err = response.text().await?;
            eprintln!("[email_service] SendGrid Error: {err}");
            return Err(anyhow!("Failed to send email notification"));
        }

        Ok(())
    }
}
