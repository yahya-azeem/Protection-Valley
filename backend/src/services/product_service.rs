use crate::models::{Product, CreateProductRequest, UpdateProductRequest};
use chrono::Utc;

pub struct ProductService;

impl Default for ProductService {
    fn default() -> Self {
        Self::new()
    }
}

impl ProductService {
    pub fn new() -> Self {
        Self
    }

    pub async fn get_all_products(&self) -> Result<Vec<Product>, String> {
        // In a real implementation, this would fetch from a database.
        // Returns Protection Valley workgear catalog.
        let products = vec![
            Product {
                id: 1,
                name: "Heritage Leather Tool Belt".to_string(),
                description: "Handcrafted from full-grain leather. 7 pockets, hammer loop, tape measure clip.".to_string(),
                price: 189.99,
                wholesale_price: 149.99,
                category: "Tool Belts".to_string(),
                image_url: "/images/toolbelt-1.jpg".to_string(),
                stock: 25,
                sku: "PV-TB-001".to_string(),
                ebay_id: Some("PV-EBAY-001".to_string()),
                model_number: "HL-TB-1".to_string(),
                color: Some("Saddle Brown".to_string()),
                size: Some("Adjustable".to_string()),
                texture: Some("Full Grain".to_string()),
                images: vec!["/images/toolbelt-1.jpg".to_string()],
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            Product {
                id: 2,
                name: "Pro Canvas Tool Belt".to_string(),
                description: "Heavy-duty canvas with leather reinforcements. Perfect for electricians.".to_string(),
                price: 129.99,
                wholesale_price: 99.99,
                category: "Tool Belts".to_string(),
                image_url: "/images/toolbelt-2.jpg".to_string(),
                stock: 40,
                sku: "PV-TB-002".to_string(),
                ebay_id: None,
                model_number: "PC-TB-2".to_string(),
                color: Some("Black".to_string()),
                size: Some("M/L".to_string()),
                texture: Some("Canvas".to_string()),
                images: vec!["/images/toolbelt-2.jpg".to_string()],
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            Product {
                id: 3,
                name: "Master Craftsman Apron".to_string(),
                description: "Full-coverage leather apron with cross-back straps and 5 pockets.".to_string(),
                price: 159.99,
                wholesale_price: 124.99,
                category: "Aprons".to_string(),
                image_url: "/images/apron-1.jpg".to_string(),
                stock: 18,
                sku: "PV-APR-001".to_string(),
                ebay_id: Some("PV-EBAY-002".to_string()),
                model_number: "MC-A-1".to_string(),
                color: Some("Dark Brown".to_string()),
                size: Some("One Size".to_string()),
                texture: Some("Top Grain".to_string()),
                images: vec!["/images/apron-1.jpg".to_string()],
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            Product {
                id: 4,
                name: "Quick-Clip Tool Pouch".to_string(),
                description: "Compact single-pocket pouch with metal clip for small tools.".to_string(),
                price: 49.99,
                wholesale_price: 39.99,
                category: "Pouches".to_string(),
                image_url: "/images/pouch-1.jpg".to_string(),
                stock: 60,
                sku: "PV-PCH-001".to_string(),
                ebay_id: Some("PV-EBAY-003".to_string()),
                model_number: "QC-P-1".to_string(),
                color: Some("Black".to_string()),
                size: Some("Small".to_string()),
                texture: Some("Cowhide".to_string()),
                images: vec!["/images/pouch-1.jpg".to_string()],
                created_at: Utc::now(),
                updated_at: Utc::now(),
            },
            Product {
                id: 5,
                name: "Heavy-Duty Suspenders".to_string(),
                description: "Leather suspenders with tool loops. Compatible with all our tool belts.".to_string(),
                price: 89.99,
                wholesale_price: 69.99,
                category: "Accessories".to_string(),
                image_url: "/images/suspenders-1.jpg".to_string(),
                stock: 30,
                sku: "PV-ACC-001".to_string(),
                ebay_id: Some("PV-EBAY-004".to_string()),
                model_number: "HD-S-1".to_string(),
                color: Some("Chestnut".to_string()),
                size: Some("Adjustable".to_string()),
                texture: Some("Bridle Leather".to_string()),
                images: vec!["/images/suspenders-1.jpg".to_string()],
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
        let product = Product {
            id: 100, // Would be auto-generated
            name: req.name,
            description: req.description,
            price: req.price,
            wholesale_price: req.wholesale_price,
            category: req.category,
            image_url: req.image_url,
            stock: req.stock,
            sku: req.sku,
            ebay_id: req.ebay_id,
            model_number: req.model_number,
            color: req.color,
            size: req.size,
            texture: req.texture,
            images: vec![], // Add default or from request
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        Ok(product)
    }

    pub async fn update_product(&self, id: i64, req: UpdateProductRequest) -> Result<Option<Product>, String> {
        let existing = self.get_product_by_id(id).await?;

        if let Some(mut product) = existing {
            if let Some(name) = req.name { product.name = name; }
            if let Some(description) = req.description { product.description = description; }
            if let Some(price) = req.price { product.price = price; }
            if let Some(wholesale_price) = req.wholesale_price { product.wholesale_price = wholesale_price; }
            if let Some(category) = req.category { product.category = category; }
            if let Some(image_url) = req.image_url { product.image_url = image_url; }
            if let Some(stock) = req.stock { product.stock = stock; }
            if let Some(ebay_id) = req.ebay_id { product.ebay_id = Some(ebay_id); }
            product.updated_at = Utc::now();

            Ok(Some(product))
        } else {
            Ok(None)
        }
    }

    pub async fn delete_product(&self, id: i64) -> Result<bool, String> {
        let existing = self.get_product_by_id(id).await?;
        Ok(existing.is_some())
    }
}
