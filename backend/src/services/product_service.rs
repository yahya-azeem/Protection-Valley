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

    /// Returns the full product catalog.
    /// In production, this would be backed by a database.
    pub async fn get_all_products(&self) -> Result<Vec<Product>, String> {
        Ok(Self::catalog())
    }

    pub async fn get_product_by_id(&self, id: i64) -> Result<Option<Product>, String> {
        Ok(Self::catalog().into_iter().find(|p| p.id == id))
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

    // ─── Product Catalog ─────────────────────────────────────
    // Centralized product definitions. Each entry includes:
    //   SKU, model_number, name, description, price, wholesale_price,
    //   category, color, size, texture (leather type), stock, image_url
    fn catalog() -> Vec<Product> {
        let now = Utc::now();
        vec![
            // ── Tool Belts ───────────────────────────────────
            Product {
                id: 1,
                name: "Heritage Leather Tool Belt".into(),
                description: "Full-grain cowhide tool belt with 7 pockets, hammer loop, and tape measure clip. Built to last a lifetime.".into(),
                price: 289.99, wholesale_price: 202.99,
                category: "Tool Belts".into(),
                image_url: "/images/toolbelt-1.jpg".into(),
                stock: 25,
                sku: "PV-TB-001".into(),
                ebay_id: Some("PV-EBAY-001".into()),
                model_number: "PV-TB-100".into(),
                color: Some("Saddle Brown".into()),
                size: Some("Large".into()),
                texture: Some("Full Grain Cowhide".into()),
                images: vec!["/images/toolbelt-1.jpg".into(), "/images/toolbelt-3.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 2,
                name: "Heritage Leather Tool Belt".into(),
                description: "Full-grain cowhide tool belt with 7 pockets, hammer loop, and tape measure clip. Built to last a lifetime.".into(),
                price: 289.99, wholesale_price: 202.99,
                category: "Tool Belts".into(),
                image_url: "/images/toolbelt-2.jpg".into(),
                stock: 18,
                sku: "PV-TB-002".into(),
                ebay_id: Some("PV-EBAY-002".into()),
                model_number: "PV-TB-100".into(),
                color: Some("Black".into()),
                size: Some("Medium".into()),
                texture: Some("Full Grain Cowhide".into()),
                images: vec!["/images/toolbelt-2.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 3,
                name: "Pro Canvas Tool Belt".into(),
                description: "Heavy-duty canvas with leather reinforcements. Ideal for electricians and HVAC technicians.".into(),
                price: 129.99, wholesale_price: 90.99,
                category: "Tool Belts".into(),
                image_url: "/images/toolbelt-3.jpg".into(),
                stock: 40,
                sku: "PV-TB-003".into(),
                ebay_id: None,
                model_number: "PV-TB-200".into(),
                color: Some("Black".into()),
                size: Some("Adjustable".into()),
                texture: Some("Canvas".into()),
                images: vec!["/images/toolbelt-3.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 4,
                name: "Complete Tool Rig".into(),
                description: "Full system with suspenders, 10+ pockets, hammer holder, and tape clip. The ultimate setup.".into(),
                price: 399.99, wholesale_price: 279.99,
                category: "Tool Belts".into(),
                image_url: "/images/rig-1.jpg".into(),
                stock: 12,
                sku: "PV-TB-004".into(),
                ebay_id: Some("PV-EBAY-010".into()),
                model_number: "PV-RIG-100".into(),
                color: Some("Dark Brown".into()),
                size: Some("XL".into()),
                texture: Some("Full Grain Cowhide".into()),
                images: vec!["/images/rig-1.jpg".into()],
                created_at: now, updated_at: now,
            },

            // ── Aprons ──────────────────────────────────────
            Product {
                id: 5,
                name: "Master Craftsman Apron".into(),
                description: "Premium split-leg goatskin apron with cross-back straps for all-day comfort and full coverage.".into(),
                price: 159.99, wholesale_price: 111.99,
                category: "Aprons".into(),
                image_url: "/images/apron-1.jpg".into(),
                stock: 22,
                sku: "PV-APR-001".into(),
                ebay_id: Some("PV-EBAY-003".into()),
                model_number: "PV-APR-100".into(),
                color: Some("Tobacco".into()),
                size: Some("One Size".into()),
                texture: Some("Goatskin".into()),
                images: vec!["/images/apron-1.jpg".into()],
                created_at: now, updated_at: now,
            },

            // ── Pouches ─────────────────────────────────────
            Product {
                id: 6,
                name: "Quick-Clip Tool Pouch".into(),
                description: "Compact single-pocket cowhide pouch with quick-release metal clip for rapid tool access.".into(),
                price: 49.99, wholesale_price: 34.99,
                category: "Pouches".into(),
                image_url: "/images/pouch-1.jpg".into(),
                stock: 60,
                sku: "PV-PCH-001".into(),
                ebay_id: Some("PV-EBAY-004".into()),
                model_number: "PV-PCH-100".into(),
                color: Some("Black".into()),
                size: Some("Small".into()),
                texture: Some("Top Grain Cowhide".into()),
                images: vec!["/images/pouch-1.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 7,
                name: "Multi-Pocket Pro Pouch".into(),
                description: "Ballistic nylon pouch with 4 compartments and belt loop. Water-resistant and lightweight.".into(),
                price: 79.99, wholesale_price: 55.99,
                category: "Pouches".into(),
                image_url: "/images/pouch-2.jpg".into(),
                stock: 45,
                sku: "PV-PCH-002".into(),
                ebay_id: None,
                model_number: "PV-PCH-200".into(),
                color: Some("Black".into()),
                size: Some("Medium".into()),
                texture: Some("Ballistic Nylon".into()),
                images: vec!["/images/pouch-2.jpg".into()],
                created_at: now, updated_at: now,
            },

            // ── Accessories ─────────────────────────────────
            Product {
                id: 8,
                name: "Heavy-Duty Suspenders".into(),
                description: "Buffalo leather suspenders with tool loops. Distributes weight evenly across shoulders.".into(),
                price: 89.99, wholesale_price: 62.99,
                category: "Accessories".into(),
                image_url: "/images/suspenders-1.jpg".into(),
                stock: 30,
                sku: "PV-ACC-001".into(),
                ebay_id: Some("PV-EBAY-005".into()),
                model_number: "PV-SUS-100".into(),
                color: Some("Chestnut".into()),
                size: Some("Adjustable".into()),
                texture: Some("Buffalo".into()),
                images: vec!["/images/suspenders-1.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 9,
                name: "Magna-Fix Wristband".into(),
                description: "Magnetic wristband holds screws, nails, and small metal parts. Adjustable fit with strong neodymium magnets.".into(),
                price: 24.99, wholesale_price: 17.49,
                category: "Accessories".into(),
                image_url: "/images/wristband-1.jpg".into(),
                stock: 100,
                sku: "PV-ACC-002".into(),
                ebay_id: None,
                model_number: "PV-MAG-100".into(),
                color: Some("Black/Orange".into()),
                size: Some("One Size".into()),
                texture: Some("Ballistic Nylon".into()),
                images: vec!["/images/wristband-1.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 10,
                name: "Heritage Tool Roll".into(),
                description: "Full-grain cowhide roll-up organizer with 8 slots. Perfect for wrenches, screwdrivers, and hand tools.".into(),
                price: 69.99, wholesale_price: 48.99,
                category: "Accessories".into(),
                image_url: "/images/toolroll-1.jpg".into(),
                stock: 28,
                sku: "PV-ACC-003".into(),
                ebay_id: None,
                model_number: "PV-TRL-100".into(),
                color: Some("Tan".into()),
                size: Some("One Size".into()),
                texture: Some("Full Grain Cowhide".into()),
                images: vec!["/images/toolroll-1.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 11,
                name: "Iron Hand Work Gloves".into(),
                description: "Goatskin work gloves with reinforced palms and adjustable wrist strap. Precision grip.".into(),
                price: 39.99, wholesale_price: 27.99,
                category: "Accessories".into(),
                image_url: "/images/gloves-1.jpg".into(),
                stock: 50,
                sku: "PV-ACC-004".into(),
                ebay_id: None,
                model_number: "PV-GLV-100".into(),
                color: Some("Brown/Tan".into()),
                size: Some("Large".into()),
                texture: Some("Goatskin".into()),
                images: vec!["/images/gloves-1.jpg".into()],
                created_at: now, updated_at: now,
            },
            Product {
                id: 12,
                name: "Gel-Pro Knee Pads".into(),
                description: "Professional knee pads with gel cushioning and hard caps. All-day comfort protection.".into(),
                price: 59.99, wholesale_price: 41.99,
                category: "Accessories".into(),
                image_url: "/images/kneepads-1.jpg".into(),
                stock: 35,
                sku: "PV-ACC-005".into(),
                ebay_id: None,
                model_number: "PV-KNP-100".into(),
                color: Some("Black".into()),
                size: Some("Adjustable".into()),
                texture: Some("Ballistic Nylon".into()),
                images: vec!["/images/kneepads-1.jpg".into()],
                created_at: now, updated_at: now,
            },
        ]
    }
}
