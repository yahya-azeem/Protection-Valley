use crate::models::{Order, CreateOrderRequest, OrderItem, OrderStatus, Address};
use chrono::Utc;
use uuid::Uuid;

pub struct OrderService;

impl Default for OrderService {
    fn default() -> Self {
        Self::new()
    }
}

impl OrderService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_all_orders(&self) -> Result<Vec<Order>, String> {
        // Mock orders data
        let orders = vec![
            Order {
                id: "ORD-2024-001".to_string(),
                customer_id: 1,
                customer_name: "John Smith".to_string(),
                customer_email: "john@example.com".to_string(),
                items: vec![
                    OrderItem {
                        product_id: 1,
                        product_name: "Professional Cordless Drill".to_string(),
                        quantity: 1,
                        unit_price: 149.99,
                        total_price: 149.99,
                    }
                ],
                subtotal: 149.99,
                shipping_cost: 15.00,
                total: 164.99,
                status: OrderStatus::Completed,
                shipping_address: Address {
                    first_name: "John".to_string(),
                    last_name: "Smith".to_string(),
                    address_line1: "123 Main St".to_string(),
                    address_line2: None,
                    city: "New York".to_string(),
                    state: "NY".to_string(),
                    zip: "10001".to_string(),
                    country: "US".to_string(),
                },
                payment_method: "Credit Card".to_string(),
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
        ];
        
        Ok(orders)
    }

    pub async fn get_order_by_id(&self, id: &str) -> Result<Option<Order>, String> {
        let orders = self.get_all_orders().await?;
        Ok(orders.into_iter().find(|o| o.id == id))
    }

    pub async fn create_order(&self, req: CreateOrderRequest) -> Result<Order, String> {
        let items: Vec<OrderItem> = req.items.iter().map(|item| {
            // In a real implementation, fetch product details from database
            OrderItem {
                product_id: item.product_id,
                product_name: "Product Name".to_string(),
                quantity: item.quantity,
                unit_price: 100.00,
                total_price: 100.00 * item.quantity as f64,
            }
        }).collect();

        let subtotal: f64 = items.iter().map(|i| i.total_price).sum();
        let shipping_cost = if subtotal >= 100.0 { 0.0 } else { 15.0 };
        let total = subtotal + shipping_cost;

        let order = Order {
            id: format!("ORD-{}", Uuid::new_v4().to_string()[..8].to_uppercase()),
            customer_id: req.customer_id,
            customer_name: "Customer Name".to_string(),
            customer_email: "customer@example.com".to_string(),
            items,
            subtotal,
            shipping_cost,
            total,
            status: OrderStatus::Pending,
            shipping_address: req.shipping_address,
            payment_method: req.payment_method,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        Ok(order)
    }

    pub async fn update_order_status(&self, id: &str, status: OrderStatus) -> Result<Option<Order>, String> {
        let existing = self.get_order_by_id(id).await?;
        
        if let Some(mut order) = existing {
            order.status = status;
            order.updated_at = Utc::now();
            Ok(Some(order))
        } else {
            Ok(None)
        }
    }
}
