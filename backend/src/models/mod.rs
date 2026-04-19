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
    pub total: f64,
    pub status: OrderStatus,
    pub shipping_address: Address,
    pub payment_method: String,
    pub carrier: Option<String>,
    pub tracking_number: Option<String>,
    pub shipping_label_url: Option<String>,
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
    pub success_url: String,
    pub cancel_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub name: String,
    pub role: UserRole,
    pub picture: Option<String>,
    pub company: Option<String>,
    pub created_at: DateTime<Utc>,
}


#[derive(Debug, Clone, Serialize, Deserialize)]
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
