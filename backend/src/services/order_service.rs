use crate::models::{CreateOrderRequest, Order, OrderItem, OrderStatus};
use crate::services::product_service::ProductService;
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
        Ok(Vec::new())
    }

    pub async fn get_order_by_id(&self, id: &str) -> Result<Option<Order>, String> {
        let orders = self.get_all_orders().await?;
        Ok(orders.into_iter().find(|o| o.id == id))
    }

    pub async fn create_order(&self, req: CreateOrderRequest) -> Result<Order, String> {
        let CreateOrderRequest {
            customer_id,
            items: request_items,
            shipping_address,
            payment_method,
        } = req;

        let product_service = ProductService::new();
        let mut items: Vec<OrderItem> = Vec::new();

        for item in request_items {
            let product_id = item.product_id;
            let variant_id = item.variant_id;
            let quantity = item.quantity;

            if let Ok(Some(product)) = product_service.get_product(&product_id).await {
                let variant = if let Some(ref vid_str) = variant_id {
                    if let Ok(vid) = vid_str.parse::<i64>() {
                        product.variants.as_ref()
                            .and_then(|vs| vs.iter().find(|v| v.id == vid))
                            .or_else(|| product.variants.as_ref().and_then(|vs| vs.first()))
                    } else {
                        product.variants.as_ref().and_then(|vs| vs.first())
                    }
                } else {
                    product.variants.as_ref().and_then(|vs| vs.first())
                };

                if let Some(v) = variant {
                    items.push(OrderItem {
                        product_id,
                        product_name: format!("{} - {}", product.name, v.original_name),
                        quantity,
                        unit_price: v.price,
                        total_price: v.price * quantity as f64,
                    });
                }
            }
        }

        if items.is_empty() {
            return Err("No valid products found for order creation".to_string());
        }

        let subtotal: f64 = items.iter().map(|i| i.total_price).sum();
        let shipping_cost = if subtotal >= 100.0 { 0.0 } else { 15.0 };
        let total = subtotal + shipping_cost;
        let customer_name = format!(
            "{} {}",
            shipping_address.first_name,
            shipping_address.last_name
        )
        .trim()
        .to_string();

        let order = Order {
            id: format!("ORD-{}", Uuid::new_v4().to_string()[..8].to_uppercase()),
            customer_id,
            customer_name,
            customer_email: String::new(),
            items,
            subtotal,
            shipping_cost,
            total,
            status: OrderStatus::Pending,
            shipping_address,
            payment_method,
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
