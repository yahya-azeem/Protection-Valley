// Assembles the final product_service.rs from the catalog fragment
const fs = require('fs');
const fragment = fs.readFileSync('scripts/catalog-rust-fragment.rs', 'utf8');

const header = `use crate::models::{Product, CreateProductRequest, UpdateProductRequest};
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

    /// Returns the full product catalog.
    pub async fn get_all_products(&self) -> Result<Vec<Product>, String> {
        Ok(Self::catalog())
    }

    pub async fn get_product_by_id(&self, id: i64) -> Result<Option<Product>, String> {
        Ok(Self::catalog().into_iter().find(|p| p.id == id))
    }

    pub async fn get_product_by_ebay_id(&self, ebay_id: &str) -> Result<Option<Product>, String> {
        Ok(Self::catalog().into_iter().find(|p| p.ebay_id.as_deref() == Some(ebay_id)))
    }

    pub async fn get_product(&self, identifier: &str) -> Result<Option<Product>, String> {
        let catalog = Self::catalog();
        if let Ok(id) = identifier.parse::<i64>() {
            if let Some(p) = catalog.iter().find(|p| p.id == id) {
                return Ok(Some(p.clone()));
            }
        }
        Ok(catalog.into_iter().find(|p| p.ebay_id.as_deref() == Some(identifier)))
    }

    pub async fn create_product(&self, req: CreateProductRequest) -> Result<Product, String> {
        let product = Product {
            id: 100,
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
            images: vec![],
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

    fn catalog() -> Vec<Product> {
        let now = Utc::now();
        vec![
`;

const footer = `        ]
    }
}
`;

fs.writeFileSync('backend/src/services/product_service.rs', header + fragment + footer);
console.log('Done: wrote product_service.rs');
