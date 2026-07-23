use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub description: String,
    pub category: String,
    pub image_url: String,
    pub images: Vec<String>,
    pub model_number: String,
    pub variants: Option<Vec<ProductVariant>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductVariant {
    pub id: i64,
    pub product_id: i64,
    pub sku: String,
    pub ebay_item_id: Option<String>,
    pub original_name: String,
    pub price: f64,
    pub stock: i32,
    pub size: Option<String>,
    pub color: Option<String>,
    pub pack_quantity: i32,
    pub texture: Option<String>,
    pub image_url: Option<String>,
    pub images: Vec<String>,
    pub in_stock: bool,
    #[serde(default)]
    pub wholesale_price: Option<f64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateProductRequest {
    pub name: String,
    pub description: String,
    pub price: f64,
    pub category: String,
    pub image_url: String,
    pub stock: i32,
    pub sku: String,
    pub ebay_id: Option<String>,
    pub model_number: String,
    pub color: Option<String>,
    pub size: Option<String>,
    pub texture: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateProductRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f64>,
    pub category: Option<String>,
    pub image_url: Option<String>,
    pub stock: Option<i32>,
    pub ebay_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderItem {
    pub product_id: String,
    pub product_name: String,
    pub quantity: i32,
    pub unit_price: f64,
    pub total_price: f64,
    #[serde(default)]
    pub sku: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: String,
    pub customer_id: i64,
    pub customer_name: String,
    pub customer_email: String,
    pub items: Vec<OrderItem>,
    pub subtotal: f64,
    pub shipping_cost: f64,
    pub sales_tax: f64,
    pub total: f64,
    pub status: OrderStatus,
    pub shipping_address: Address,
    pub payment_method: String,
    pub carrier: Option<String>,
    pub tracking_number: Option<String>,
    pub shipping_label_url: Option<String>,
    pub shipping_label_printed: bool,
    pub shipping_label_printed_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum OrderStatus {
    #[serde(rename = "pending")]
    Pending,
    #[serde(rename = "processing")]
    Processing,
    #[serde(rename = "shipped")]
    Shipped,
    #[serde(rename = "completed")]
    Completed,
    #[serde(rename = "cancelled")]
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Address {
    pub first_name: String,
    pub last_name: String,
    pub address_line1: String,
    pub address_line2: Option<String>,
    pub city: String,
    pub state: String,
    pub zip: String,
    pub country: String,
    pub phone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateOrderRequest {
    pub customer_id: i64,
    pub items: Vec<OrderItemRequest>,
    pub shipping_address: Address,
    pub payment_method: String,
    #[serde(default)]
    pub id: Option<String>,
    #[serde(default)]
    pub customer_email: Option<String>,
    #[serde(default)]
    pub shipping_cost: Option<f64>,
    #[serde(default)]
    pub sales_tax: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderItemRequest {
    pub product_id: String,
    pub variant_id: Option<String>,
    pub quantity: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCheckoutSessionRequest {
    pub items: Vec<OrderItemRequest>,
    #[serde(default)]
    pub success_url: Option<String>,
    #[serde(default)]
    pub cancel_url: Option<String>,
    pub shipping_address: Address,
    #[serde(default)]
    pub shipping_cost: Option<f64>,
    #[serde(default)]
    pub sales_tax: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CheckoutCalculateRequest {
    pub items: Vec<OrderItemRequest>,
    pub shipping_address: Address,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CheckoutCalculateResponse {
    pub subtotal: f64,
    pub shipping_cost: f64,
    pub sales_tax: f64,
    pub total: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub name: String,
    pub password_hash: Option<String>,
    pub role: UserRole,
    pub picture: Option<String>,
    pub company: Option<String>,
    pub sales_tax_id: Option<String>,
    pub sales_tax_proof_name: Option<String>,
    pub sales_tax_proof_data: Option<String>,
    pub is_wholesale_approved: Option<bool>,
    pub wholesale_discount: Option<f64>,
    pub google_id: Option<String>,
    pub reset_token: Option<String>,
    pub reset_token_expires_at: Option<DateTime<Utc>>,
    pub phone: Option<String>,
    pub business_type: Option<String>,
    pub website: Option<String>,
    pub created_at: DateTime<Utc>,
}


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum UserRole {
    #[serde(rename = "retail")]
    Retail,
    #[serde(rename = "wholesale")]
    Wholesale,
    #[serde(rename = "admin")]
    Admin,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GoogleVerifyRequest {
    pub token: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub name: String,
    pub role: Option<UserRole>,
    pub company: Option<String>,
    pub sales_tax_id: Option<String>,
    pub sales_tax_proof_name: Option<String>,
    pub sales_tax_proof_data: Option<String>,
    pub phone: Option<String>,
    pub business_type: Option<String>,
    pub website: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ForgotPasswordRequest {
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResetPasswordRequest {
    pub token: String,
    pub new_password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompleteProfileRequest {
    pub company: String,
    pub sales_tax_id: String,
    pub sales_tax_proof_name: String,
    pub sales_tax_proof_data: String,
    pub phone: Option<String>,
    pub business_type: Option<String>,
    pub website: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Review {
    pub id: String,
    pub user_id: i64,
    pub product_id: i64,
    pub user_name: String,
    pub rating: i32,
    pub comment: String,
    pub is_verified: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateReviewRequest {
    pub product_id: i64,
    pub rating: i32,
    pub comment: String,
}

// SyncResponse remains for inventory sync status
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncResponse {
    pub synced: i32,
    pub created: i32,
    pub updated: i32,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomerSpecificPrice {
    pub id: i64,
    pub user_id: i64,
    pub variant_id: i64,
    pub custom_price: f64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpsertCustomerPriceRequest {
    pub user_id: i64,
    pub variant_id: i64,
    pub custom_price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateUserDiscountRequest {
    pub wholesale_discount: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConfirmCheckoutSessionRequest {
    pub session_id: String,
}

pub fn calculate_sales_tax(state: &str, subtotal: f64) -> f64 {
    let rate = match state.to_uppercase().as_str() {
        "TX" | "CA" | "NY" | "IL" => 0.0825,
        "FL" => 0.07,
        "OR" | "DE" | "MT" | "NH" | "AK" => 0.0,
        _ => 0.06,
    };
    subtotal * rate
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhoneIdentity {
    pub id: String,
    pub phone: String,
    pub wholesale_user_id: i64,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhoneIdentityWithUser {
    pub id: String,
    pub phone: String,
    pub wholesale_user_id: i64,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
    pub wholesale_users: User,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Deal {
    pub id: String,
    pub title: String,
    pub description: String,
    pub discount_percent: Option<f64>,
    pub flat_discount: Option<f64>,
    pub min_purchase: Option<f64>,
    pub applies_to: String,
    pub category_slug: Option<String>,
    pub active: bool,
    pub starts_at: DateTime<Utc>,
    pub ends_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Appointment {
    pub id: String,
    pub caller_name: String,
    pub caller_phone: Option<String>,
    pub caller_email: Option<String>,
    pub reason: Option<String>,
    pub preferred_date: String,
    pub preferred_time: String,
    pub duration_min: i32,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateAppointmentRequest {
    pub caller_name: String,
    pub caller_phone: Option<String>,
    pub caller_email: Option<String>,
    pub reason: Option<String>,
    pub preferred_date: String,
    pub preferred_time: String,
    pub duration_min: i32,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VoiceSession {
    pub id: String,
    pub caller_phone: String,
    pub caller_name: Option<String>,
    pub session_data: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateVoiceSessionRequest {
    pub caller_phone: String,
    pub caller_name: Option<String>,
    pub session_data: serde_json::Value,
}

/// Vapi tool call request body
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VapiToolCallMessage {
    pub message: VapiToolCallEnvelope,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VapiToolCallEnvelope {
    #[serde(rename = "type")]
    pub msg_type: String,
    pub toolCallList: Vec<VapiToolCall>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VapiToolCall {
    pub id: String,
    pub name: String,
    pub arguments: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VapiToolResult {
    pub toolCallId: String,
    pub result: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VapiToolResponse {
    pub results: Vec<VapiToolResult>,
}

/// Voice tool argument payloads
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentifyCallerArgs {
    pub phone: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductLookupArgs {
    pub query: String,
    pub caller_phone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GetDealsArgs {
    pub caller_phone: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CheckOrderStatusArgs {
    pub caller_phone: Option<String>,
    pub email: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookMeetingArgs {
    pub caller_name: String,
    pub caller_phone: Option<String>,
    pub caller_email: Option<String>,
    pub date: String,
    pub time: String,
    pub reason: Option<String>,
    pub duration_min: Option<i32>,
}

