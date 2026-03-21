use crate::models::{Product, CreateProductRequest, UpdateProductRequest};
use chrono::Utc;

pub struct ProductService;

impl ProductService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_all_products(&self) -> Result<Vec<Product>, String> {
        // In a real implementation, this would fetch from a database
        // For now, returning mock data
        let products = vec![
            Product {
                id: 1,
                name: "Professional Cordless Drill".to_string(),
                description: "20V MAX cordless drill with lithium-ion battery".to_string(),
                price: 149.99,
                wholesale_price: 119.99,
                category: "Power Tools".to_string(),
                image_url: "/images/drill.jpg".to_string(),
                stock: 50,
                sku: "DRILL-001".to_string(),
                ebay_id: Some("123456789".to_string()),
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            Product {
                id: 2,
                name: "Circular Saw 7-1/4\"".to_string(),
                description: "High-performance circular saw with laser guide".to_string(),
                price: 89.99,
                wholesale_price: 71.99,
                category: "Power Tools".to_string(),
                image_url: "/images/circular-saw.jpg".to_string(),
                stock: 35,
                sku: "SAW-001".to_string(),
                ebay_id: Some("123456790".to_string()),
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
        ];
        
        Ok(products)
    }

    pub async fn get_product_by_id(&self, id: i64) -> Result<Option<Product>, String> {
        let products = self.get_all_products().await?;
        Ok(products.into_iter().find(|p| p.id == id))
    }

    pub async fn create_product(&self, req: CreateProductRequest) -> Result<Product, String> {
        // In a real implementation, this would insert into a database
        let product = Product {
            id: 3, // Would be auto-generated
            name: req.name,
            description: req.description,
            price: req.price,
            wholesale_price: req.wholesale_price,
            category: req.category,
            image_url: req.image_url,
            stock: req.stock,
            sku: req.sku,
            ebay_id: req.ebay_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };
        
        Ok(product)
    }

    pub async fn update_product(&self, id: i64, req: UpdateProductRequest) -> Result<Option<Product>, String> {
        // In a real implementation, this would update in a database
        let existing = self.get_product_by_id(id).await?;
        
        if let Some(mut product) = existing {
            if let Some(name) = req.name {
                product.name = name;
            }
            if let Some(description) = req.description {
                product.description = description;
            }
            if let Some(price) = req.price {
                product.price = price;
            }
            if let Some(wholesale_price) = req.wholesale_price {
                product.wholesale_price = wholesale_price;
            }
            if let Some(category) = req.category {
                product.category = category;
            }
            if let Some(image_url) = req.image_url {
                product.image_url = image_url;
            }
            if let Some(stock) = req.stock {
                product.stock = stock;
            }
            if let Some(ebay_id) = req.ebay_id {
                product.ebay_id = Some(ebay_id);
            }
            product.updated_at = Utc::now();
            
            Ok(Some(product))
        } else {
            Ok(None)
        }
    }

    pub async fn delete_product(&self, id: i64) -> Result<bool, String> {
        // In a real implementation, this would delete from a database
        let existing = self.get_product_by_id(id).await?;
        Ok(existing.is_some())
    }
}
