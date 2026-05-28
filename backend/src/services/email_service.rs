use std::env;
use crate::models::Order;
use anyhow::{Result, anyhow};
use lettre::transport::smtp::authentication::Credentials;
use lettre::message::SinglePart;
use lettre::{Message, AsyncSmtpTransport, AsyncTransport, Tokio1Executor};

pub struct EmailService {
    smtp_host: String,
    smtp_port: u16,
    smtp_user: String,
    smtp_pass: String,
    smtp_from: String,
    admin_emails: Vec<String>,
}

impl EmailService {
    pub fn new() -> Self {
        let smtp_host = env::var("SMTP_HOST").unwrap_or_else(|_| "localhost".to_string());
        let smtp_port = env::var("SMTP_PORT")
            .unwrap_or_else(|_| "587".to_string())
            .parse::<u16>()
            .unwrap_or(587);
        let smtp_user = env::var("SMTP_USERNAME").unwrap_or_default();
        let smtp_pass = env::var("SMTP_PASSWORD").unwrap_or_default();
        let smtp_from = env::var("SMTP_FROM_EMAIL").unwrap_or_else(|_| "notifications@protectionvalley.com".to_string());
        
        let admin_emails_str = env::var("ADMIN_NOTIFICATION_EMAILS")
            .unwrap_or_else(|_| "admin@protectionvalley.com".to_string());
        
        let admin_emails: Vec<String> = admin_emails_str
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        Self {
            smtp_host,
            smtp_port,
            smtp_user,
            smtp_pass,
            smtp_from,
            admin_emails,
        }
    }

    pub async fn send_order_notification(&self, order: &Order) -> Result<()> {
        if self.smtp_host.is_empty() || self.smtp_user.is_empty() {
            return Err(anyhow!("SMTP credentials or host not configured"));
        }

        if self.admin_emails.is_empty() {
            return Err(anyhow!("No admin notification emails configured"));
        }

        let carrier = order.carrier.as_deref().unwrap_or("Unknown");
        let tracking = order.tracking_number.as_deref().unwrap_or("Pending");
        let label_url = order.shipping_label_url.as_deref().unwrap_or("#");

        let mut items_html = String::new();
        for item in &order.items {
            items_html.push_str(&format!(
                "<li>{} x {} (@ ${:.2}) - Total: ${:.2}</li>",
                item.quantity, item.product_name, item.unit_price, item.total_price
            ));
        }

        let html_content = format!(
            r#"
            <html>
            <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #FF8800;">New Order Received: {order_id}</h2>
                    <p><strong>Customer:</strong> {customer_name} ({customer_email})</p>
                    <p><strong>Total Amount:</strong> ${total:.2}</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Shipping Information</h3>
                        <p><strong>Carrier:</strong> {carrier}</p>
                        <p><strong>Tracking:</strong> {tracking}</p>
                        <p><a href="{label_url}" style="background-color: #FF8800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Label</a></p>
                    </div>
                    
                    <h3>Order Details</h3>
                    <ul style="padding-left: 20px;">
                        {items_html}
                    </ul>
                    
                    <h3>Shipping Destination</h3>
                    <p style="background-color: #eee; padding: 10px;">
                        {address_line1}<br>
                        {address_line2}
                        {city}, {state} {zip}<br>
                        {country}
                    </p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">This is an automated alert from Protection Valley Production System.</p>
                </div>
            </body>
            </html>
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

        // Build the email message
        let mut builder = Message::builder()
            .from(self.smtp_from.parse()?)
            .subject(format!("Order Alert: {} (Label Generated)", order.id));

        for admin_email in &self.admin_emails {
            builder = builder.to(admin_email.parse()?);
        }

        let email = builder.singlepart(SinglePart::html(html_content))?;

        // Configure SMTP transport
        let creds = Credentials::new(self.smtp_user.clone(), self.smtp_pass.clone());

        let mailer: AsyncSmtpTransport<Tokio1Executor> = 
            AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&self.smtp_host)?
                .credentials(creds)
                .port(self.smtp_port)
                .build();

        // Send the email
        mailer.send(email).await.map_err(|e| anyhow!("SMTP Error: {}", e))?;

        Ok(())
    }

    pub async fn send_password_reset_email(&self, to_email: &str, token: &str) -> Result<()> {
        let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "https://protectionvalley.com".to_string());
        let reset_link = format!("{}/reset-password?token={}", frontend_url.trim_end_matches('/'), token);

        println!("==========================================");
        println!("PASSWORD RESET LINK FOR: {}", to_email);
        println!("LINK: {}", reset_link);
        println!("==========================================");

        if self.smtp_host.is_empty() || self.smtp_user.is_empty() {
            eprintln!("[email_service] SMTP not configured. Logged password reset link to console.");
            return Ok(());
        }

        let html_content = format!(
            r#"
            <html>
            <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #FF8800;">Password Reset Request</h2>
                    <p>We received a request to reset the password for your Protection Valley wholesale account.</p>
                    <p>Please click the button below to set a new password. This link is valid for 1 hour.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" style="background-color: #FF8800; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    
                    <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                    <p style="word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 3px;">{reset_link}</p>
                    
                    <hr>
                    <p style="font-size: 12px; color: #888;">If you did not request this reset, you can safely ignore this email.</p>
                </div>
            </body>
            </html>
            "#,
            reset_link = reset_link
        );

        let email = Message::builder()
            .from(self.smtp_from.parse()?)
            .to(to_email.parse()?)
            .subject("Reset Your Protection Valley Password")
            .singlepart(SinglePart::html(html_content))?;

        let creds = Credentials::new(self.smtp_user.clone(), self.smtp_pass.clone());
        let mailer: AsyncSmtpTransport<Tokio1Executor> = 
            AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&self.smtp_host)?
                .credentials(creds)
                .port(self.smtp_port)
                .build();

        mailer.send(email).await.map_err(|e| anyhow!("SMTP Error: {}", e))?;
        Ok(())
    }
}
