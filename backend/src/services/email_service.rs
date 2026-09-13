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

    pub async fn send_customer_order_confirmation(&self, order: &Order) -> Result<()> {
        if order.customer_email.is_empty() {
            eprintln!("[email_service] No customer email for order confirmation: {}", order.id);
            return Ok(());
        }

        if self.smtp_host.is_empty() || self.smtp_user.is_empty() {
            eprintln!("[email_service] SMTP not configured. Skipping customer order confirmation for {}", order.id);
            return Ok(());
        }

        let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "https://protectionvalley.com".to_string());

        let mut items_html = String::new();
        for item in &order.items {
            items_html.push_str(&format!(
                r#"<tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F;">
                        <div style="color: #FFFFFF; font-size: 14px; font-weight: 500;">{name}</div>
                        <div style="color: #A1A1AA; font-size: 12px; margin-top: 4px;">Qty: {qty} &times; ${price:.2}</div>
                    </td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #1F1F1F; text-align: right; color: #FFFFFF; font-size: 14px;">${total:.2}</td>
                </tr>"#,
                name = item.product_name,
                qty = item.quantity,
                price = item.unit_price,
                total = item.total_price
            ));
        }

        let address_html = format!(
            r#"{first} {last}<br>{line1}{line2}{city}, {state} {zip}<br>{country}"#,
            first = order.shipping_address.first_name,
            last = order.shipping_address.last_name,
            line1 = order.shipping_address.address_line1,
            line2 = order.shipping_address.address_line2.as_deref()
                .map(|l| format!("<br>{}", l))
                .unwrap_or_default(),
            city = order.shipping_address.city,
            state = order.shipping_address.state,
            zip = order.shipping_address.zip,
            country = order.shipping_address.country,
        );

        let html_content = format!(
            r#"
            <html>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Inter', system-ui, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #1F1F1F;">
                    <!-- Header -->
                    <div style="padding: 32px 24px; border-bottom: 1px solid #1F1F1F; text-align: center;">
                        <h1 style="color: #FF8800; font-size: 20px; margin: 0; letter-spacing: 0.05em;">PROTECTION VALLEY</h1>
                        <p style="color: #A1A1AA; font-size: 11px; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Order Confirmation</p>
                    </div>

                    <!-- Order Info -->
                    <div style="padding: 24px;">
                        <p style="color: #FFFFFF; font-size: 14px; margin: 0 0 8px;">Thank you for your order, {customer_name}.</p>
                        <p style="color: #A1A1AA; font-size: 13px; margin: 0 0 24px;">Your order <strong style="color: #FF8800;">{order_id}</strong> has been received and is being processed.</p>

                        <!-- Items Table -->
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                            <thead>
                                <tr>
                                    <th style="padding: 0 0 12px; border-bottom: 1px solid #FF8800; text-align: left; color: #FF8800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Item</th>
                                    <th style="padding: 0 0 12px; border-bottom: 1px solid #FF8800; text-align: right; color: #FF8800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items_html}
                            </tbody>
                        </table>

                        <!-- Totals -->
                        <div style="border-top: 1px solid #1F1F1F; padding-top: 16px; margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                                <span style="color: #A1A1AA; font-size: 13px;">Subtotal</span>
                                <span style="color: #FFFFFF; font-size: 13px;">${subtotal:.2}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                                <span style="color: #A1A1AA; font-size: 13px;">Shipping</span>
                                <span style="color: #FFFFFF; font-size: 13px;">{shipping_display}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                                <span style="color: #A1A1AA; font-size: 13px;">Tax</span>
                                <span style="color: #FFFFFF; font-size: 13px;">${tax:.2}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; padding: 8px 0 0; margin-top: 8px; border-top: 1px solid #1F1F1F;">
                                <span style="color: #FFFFFF; font-size: 14px; font-weight: 600;">Total</span>
                                <span style="color: #FF8800; font-size: 16px; font-weight: 700;">${total:.2}</span>
                            </div>
                        </div>

                        <!-- Shipping Address -->
                        <div style="background-color: #000000; border: 1px solid #1F1F1F; border-radius: 2px; padding: 16px; margin-bottom: 24px;">
                            <h3 style="color: #FF8800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; font-weight: 600;">Shipping To</h3>
                            <p style="color: #FFFFFF; font-size: 13px; line-height: 1.6; margin: 0;">{address_html}</p>
                        </div>

                        <!-- Tracking Info -->
                        <div style="background-color: #000000; border: 1px solid #FF8800; border-radius: 2px; padding: 16px; margin-bottom: 24px; text-align: center;">
                            <h3 style="color: #FF8800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; font-weight: 600;">Tracking Information</h3>
                            <p style="color: #A1A1AA; font-size: 13px; margin: 0;">You will receive a separate email with your tracking number once your order ships.</p>
                        </div>

                        <div style="text-align: center; margin: 24px 0;">
                            <a href="{track_url}" style="display: inline-block; background-color: #FF8800; color: #000000; padding: 12px 28px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Track Your Order</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 16px 24px; border-top: 1px solid #1F1F1F; text-align: center;">
                        <p style="color: #A1A1AA; font-size: 11px; margin: 0;">Questions? Contact us at <a href="mailto:support@protectionvalley.com" style="color: #FF8800; text-decoration: none;">support@protectionvalley.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            "#,
            order_id = order.id,
            customer_name = order.customer_name,
            subtotal = order.subtotal,
            shipping_display = if order.shipping_cost == 0.0 { "Free".to_string() } else { format!("${:.2}", order.shipping_cost) },
            tax = order.sales_tax,
            total = order.total,
            address_html = address_html,
            items_html = items_html,
            track_url = format!("{}/orders/{}", frontend_url.trim_end_matches('/'), order.id),
        );

        let email = Message::builder()
            .from(self.smtp_from.parse()?)
            .to(order.customer_email.parse()?)
            .subject(format!("Order Confirmed — {} — Protection Valley", order.id))
            .singlepart(SinglePart::html(html_content))?;

        let creds = Credentials::new(self.smtp_user.clone(), self.smtp_pass.clone());
        let mailer: AsyncSmtpTransport<Tokio1Executor> =
            AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&self.smtp_host)?
                .credentials(creds)
                .port(self.smtp_port)
                .build();

        mailer.send(email).await.map_err(|e| anyhow!("SMTP Error (customer confirmation): {}", e))?;
        println!("[email_service] Order confirmation sent to {} for order {}", order.customer_email, order.id);
        Ok(())
    }

    pub async fn send_customer_shipping_notification(&self, order: &Order) -> Result<()> {
        if order.customer_email.is_empty() {
            eprintln!("[email_service] No customer email for shipping notification: {}", order.id);
            return Ok(());
        }

        if self.smtp_host.is_empty() || self.smtp_user.is_empty() {
            eprintln!("[email_service] SMTP not configured. Skipping shipping notification for {}", order.id);
            return Ok(());
        }

        let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "https://protectionvalley.com".to_string());

        let carrier = order.carrier.as_deref().unwrap_or("USPS");
        let tracking = order.tracking_number.as_deref().unwrap_or("Pending");
        let tracking_url = match carrier.to_uppercase().as_str() {
            "USPS" => format!("https://tools.usps.com/go/TrackConfirmAction?tLabels={}", tracking),
            "UPS" => format!("https://www.ups.com/track?tracknum={}", tracking),
            "FEDEX" | "FedEx" => format!("https://www.fedex.com/fedextrack/?trknbr={}", tracking),
            _ => format!("https://www.google.com/search?q=track+{}+{}", carrier, tracking),
        };

        let label_section = if let Some(ref label_url) = order.shipping_label_url {
            format!(
                r#"<div style="text-align: center; margin: 24px 0;">
                    <a href="{label_url}" style="display: inline-block; background-color: #1F1F1F; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid #FF8800;">Download Shipping Label</a>
                </div>"#
            )
        } else {
            String::new()
        };

        let items_html = {
            let mut html = String::new();
            for item in &order.items {
                html.push_str(&format!(
                    "<li style=\"padding: 4px 0; color: #FFFFFF; font-size: 13px;\">{name} &times; {qty} — ${total:.2}</li>",
                    name = item.product_name,
                    qty = item.quantity,
                    total = item.total_price
                ));
            }
            html
        };

        let html_content = format!(
            r#"
            <html>
            <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Inter', system-ui, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #0A0A0A; border: 1px solid #1F1F1F;">
                    <!-- Header -->
                    <div style="padding: 32px 24px; border-bottom: 1px solid #1F1F1F; text-align: center;">
                        <h1 style="color: #FF8800; font-size: 20px; margin: 0; letter-spacing: 0.05em;">PROTECTION VALLEY</h1>
                        <p style="color: #A1A1AA; font-size: 11px; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 0.1em;">Your Order Has Shipped</p>
                    </div>

                    <div style="padding: 24px;">
                        <!-- Tracking Banner -->
                        <div style="background-color: #000000; border: 2px solid #FF8800; border-radius: 2px; padding: 24px; margin-bottom: 24px; text-align: center;">
                            <p style="color: #A1A1AA; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px;">Tracking Number</p>
                            <p style="color: #FF8800; font-size: 22px; font-weight: 700; margin: 0 0 8px; letter-spacing: 0.05em;">{tracking}</p>
                            <p style="color: #FFFFFF; font-size: 14px; margin: 0 0 16px;">Shipped via <strong>{carrier}</strong></p>
                            <a href="{tracking_url}" style="display: inline-block; background-color: #FF8800; color: #000000; padding: 12px 28px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Track Shipment</a>
                        </div>

                        {label_section}

                        <!-- Order Details -->
                        <div style="margin-bottom: 24px;">
                            <p style="color: #A1A1AA; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; font-weight: 600;">Order {order_id}</p>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                {items_html}
                            </ul>
                        </div>

                        <!-- Shipping Address -->
                        <div style="background-color: #000000; border: 1px solid #1F1F1F; border-radius: 2px; padding: 16px; margin-bottom: 24px;">
                            <h3 style="color: #FF8800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px; font-weight: 600;">Shipping To</h3>
                            <p style="color: #FFFFFF; font-size: 13px; line-height: 1.6; margin: 0;">
                                {first} {last}<br>
                                {line1}{line2}
                                {city}, {state} {zip}<br>
                                {country}
                            </p>
                        </div>

                        <div style="text-align: center; margin: 24px 0;">
                            <a href="{track_url}" style="display: inline-block; background-color: transparent; color: #FF8800; padding: 12px 28px; text-decoration: none; border-radius: 2px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid #FF8800;">View Order Details</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="padding: 16px 24px; border-top: 1px solid #1F1F1F; text-align: center;">
                        <p style="color: #A1A1AA; font-size: 11px; margin: 0;">Questions? Contact us at <a href="mailto:support@protectionvalley.com" style="color: #FF8800; text-decoration: none;">support@protectionvalley.com</a></p>
                    </div>
                </div>
            </body>
            </html>
            "#,
            order_id = order.id,
            carrier = carrier,
            tracking = tracking,
            tracking_url = tracking_url,
            label_section = label_section,
            items_html = items_html,
            first = order.shipping_address.first_name,
            last = order.shipping_address.last_name,
            line1 = order.shipping_address.address_line1,
            line2 = order.shipping_address.address_line2.as_deref()
                .map(|l| format!("<br>{}", l))
                .unwrap_or_default(),
            city = order.shipping_address.city,
            state = order.shipping_address.state,
            zip = order.shipping_address.zip,
            country = order.shipping_address.country,
            track_url = format!("{}/orders/{}", frontend_url.trim_end_matches('/'), order.id),
        );

        let email = Message::builder()
            .from(self.smtp_from.parse()?)
            .to(order.customer_email.parse()?)
            .subject(format!("Your Order Has Shipped — {} — Protection Valley", order.id))
            .singlepart(SinglePart::html(html_content))?;

        let creds = Credentials::new(self.smtp_user.clone(), self.smtp_pass.clone());
        let mailer: AsyncSmtpTransport<Tokio1Executor> =
            AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&self.smtp_host)?
                .credentials(creds)
                .port(self.smtp_port)
                .build();

        mailer.send(email).await.map_err(|e| anyhow!("SMTP Error (customer shipping): {}", e))?;
        println!("[email_service] Shipping notification sent to {} for order {}", order.customer_email, order.id);
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
