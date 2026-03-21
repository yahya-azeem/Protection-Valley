/**
 * Protection Valley — Product Data & eBay API Integration
 * Handles product data loading, filtering, and sorting.
 */

// Hardcoded fallback products (Protection Valley workgear)
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Heritage Leather Tool Belt',
    price: 189.99,
    wholesalePrice: 149.99,
    category: 'Tool Belts',
    type: 'Leather',
    image: 'images/toolbelt-1.jpg',
    images: ['images/toolbelt-1.jpg', 'images/toolbelt-3.jpg', 'images/rig-1.jpg'],
    description: 'Handcrafted from full-grain leather, this tool belt features 7 pockets, hammer loop, and tape measure clip. Built to last a lifetime.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Dark Brown', hex: '#3d2817', image: 'images/toolbelt-1.jpg' },
      { name: 'Tan', hex: '#8b6914', image: 'images/toolbelt-3.jpg' },
      { name: 'Black', hex: '#1a1a1a', image: 'images/suspenders-1.jpg' }
    ],
    stock: 25
  },
  {
    id: 2,
    name: 'Pro Canvas Tool Belt',
    price: 129.99,
    wholesalePrice: 99.99,
    category: 'Tool Belts',
    type: 'Canvas',
    image: 'images/toolbelt-2.jpg',
    images: ['images/toolbelt-2.jpg'],
    description: 'Heavy-duty canvas construction with leather reinforcements. Perfect for electricians and HVAC technicians.',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#1a1a1a', image: 'images/toolbelt-2.jpg' }],
    stock: 40
  },
  {
    id: 3,
    name: 'Master Craftsman Apron',
    price: 159.99,
    wholesalePrice: 124.99,
    category: 'Aprons',
    type: 'Leather',
    image: 'images/apron-1.jpg',
    images: ['images/apron-1.jpg'],
    description: 'Full-coverage leather apron with cross-back straps for all-day comfort. 5 pockets plus towel loop.',
    sizes: ['S/M', 'L/XL'],
    colors: [{ name: 'Dark Brown', hex: '#3d2817', image: 'images/apron-1.jpg' }],
    stock: 18
  },
  {
    id: 4,
    name: 'Quick-Clip Tool Pouch',
    price: 49.99,
    wholesalePrice: 39.99,
    category: 'Pouches',
    type: 'Leather',
    image: 'images/pouch-1.jpg',
    images: ['images/pouch-1.jpg', 'images/pouch-3.jpg'],
    description: 'Compact single-pocket pouch with metal clip. Perfect for tape measure, knife, or small tools.',
    sizes: ['One Size'],
    colors: [
      { name: 'Dark Brown', hex: '#3d2817', image: 'images/pouch-1.jpg' },
      { name: 'Tan', hex: '#8b6914', image: 'images/pouch-3.jpg' }
    ],
    stock: 60
  },
  {
    id: 5,
    name: 'Multi-Pocket Pro Pouch',
    price: 79.99,
    wholesalePrice: 64.99,
    category: 'Pouches',
    type: 'Nylon',
    image: 'images/pouch-2.jpg',
    images: ['images/pouch-2.jpg'],
    description: 'Nylon pouch with 4 compartments and belt loop. Water-resistant and lightweight.',
    sizes: ['One Size'],
    colors: [{ name: 'Black', hex: '#1a1a1a', image: 'images/pouch-2.jpg' }],
    stock: 45
  },
  {
    id: 6,
    name: 'Heavy-Duty Suspenders',
    price: 89.99,
    wholesalePrice: 69.99,
    category: 'Accessories',
    type: 'Leather',
    image: 'images/suspenders-1.jpg',
    images: ['images/suspenders-1.jpg'],
    description: 'Leather suspenders with tool loops to distribute weight evenly. Compatible with all our tool belts.',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#1a1a1a', image: 'images/suspenders-1.jpg' }],
    stock: 30
  },
  {
    id: 7,
    name: 'Magna-Fix Wristband',
    price: 24.99,
    wholesalePrice: 19.99,
    category: 'Accessories',
    type: 'Nylon',
    image: 'images/wristband-1.jpg',
    images: ['images/wristband-1.jpg'],
    description: 'Magnetic wristband holds screws, nails, and small metal parts. Adjustable fit.',
    sizes: ['One Size'],
    colors: [{ name: 'Black/Orange', hex: '#1a1a1a', image: 'images/wristband-1.jpg' }],
    stock: 100
  },
  {
    id: 8,
    name: 'Gel-Pro Knee Pads',
    price: 59.99,
    wholesalePrice: 47.99,
    category: 'Accessories',
    type: 'Nylon',
    image: 'images/kneepads-1.jpg',
    images: ['images/kneepads-1.jpg'],
    description: 'Professional knee pads with gel cushioning and hard caps. All-day comfort protection.',
    sizes: ['S/M', 'L/XL'],
    colors: [{ name: 'Black', hex: '#1a1a1a', image: 'images/kneepads-1.jpg' }],
    stock: 35
  },
  {
    id: 9,
    name: 'Heritage Tool Roll',
    price: 69.99,
    wholesalePrice: 54.99,
    category: 'Accessories',
    type: 'Leather',
    image: 'images/toolroll-1.jpg',
    images: ['images/toolroll-1.jpg'],
    description: 'Leather roll-up tool organizer with 8 slots. Perfect for wrenches, screwdrivers, and hand tools.',
    sizes: ['One Size'],
    colors: [{ name: 'Tan', hex: '#8b6914', image: 'images/toolroll-1.jpg' }],
    stock: 28
  },
  {
    id: 10,
    name: 'Pro Tool Tote',
    price: 149.99,
    wholesalePrice: 119.99,
    category: 'Accessories',
    type: 'Leather',
    image: 'images/toolbag-1.jpg',
    images: ['images/toolbag-1.jpg'],
    description: 'Leather tool tote with brass hardware, shoulder strap, and multiple pockets.',
    sizes: ['One Size'],
    colors: [{ name: 'Brown', hex: '#5c4033', image: 'images/toolbag-1.jpg' }],
    stock: 20
  },
  {
    id: 11,
    name: 'Iron Hand Work Gloves',
    price: 34.99,
    wholesalePrice: 27.99,
    category: 'Accessories',
    type: 'Leather',
    image: 'images/gloves-1.jpg',
    images: ['images/gloves-1.jpg'],
    description: 'Heavy-duty leather work gloves with reinforced palms and adjustable wrist strap.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Brown/Tan', hex: '#8b7355', image: 'images/gloves-1.jpg' }],
    stock: 50
  },
  {
    id: 12,
    name: 'Complete Tool Rig',
    price: 299.99,
    wholesalePrice: 239.99,
    category: 'Tool Belts',
    type: 'Leather',
    image: 'images/rig-1.jpg',
    images: ['images/rig-1.jpg', 'images/toolbelt-1.jpg'],
    description: 'Complete tool belt system with suspenders, 10+ pockets, hammer holder, and tape clip.',
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: [{ name: 'Dark Brown', hex: '#3d2817', image: 'images/rig-1.jpg' }],
    stock: 15
  }
];

/** Global product list — populated by loadProducts() */
window.products = [...FALLBACK_PRODUCTS];

/**
 * Attempt to fetch products from the API, falling back to hardcoded data.
 */
async function loadProducts() {
  try {
    const response = await fetch('/api/v1/products');
    if (response.ok) {
      const apiProducts = await response.json();
      if (Array.isArray(apiProducts) && apiProducts.length > 0) {
        // Map API fields to frontend structure
        window.products = apiProducts.map((p, i) => ({
          id: p.id || i + 1,
          name: p.name,
          price: p.price,
          wholesalePrice: p.wholesale_price || p.price * 0.8,
          category: p.category || 'Accessories',
          type: p.type || 'Leather',
          image: p.image_url || p.image || `images/toolbelt-1.jpg`,
          images: p.images || [p.image_url || p.image || 'images/toolbelt-1.jpg'],
          description: p.description || '',
          sizes: p.sizes || ['One Size'],
          colors: p.colors || [{ name: 'Default', hex: '#3d2817', image: p.image_url || 'images/toolbelt-1.jpg' }],
          stock: p.stock || 0
        }));
        console.log(`✓ Loaded ${window.products.length} products from API`);
        return;
      }
    }
  } catch (err) {
    console.warn('API unavailable, using local product data:', err.message);
  }
  // Fallback
  window.products = [...FALLBACK_PRODUCTS];
  console.log(`✓ Using ${window.products.length} local products`);
}

/**
 * Sync inventory from eBay (admin action).
 */
async function syncEbayInventory() {
  try {
    const response = await fetch('/api/v1/ebay/sync', { method: 'POST' });
    if (response.ok) {
      const result = await response.json();
      window.showToast(`eBay sync complete: ${result.synced} synced, ${result.created} created, ${result.updated} updated`);
      await loadProducts();
      window.renderCatalog();
      window.renderFeaturedProducts();
    }
  } catch (err) {
    console.warn('eBay sync failed:', err.message);
    window.showToast('eBay sync unavailable');
  }
}

/**
 * Get filtered products based on current type/category filters.
 */
function getFilteredProducts() {
  return window.products.filter(p => {
    const typeMatch = window.currentType === 'All' || p.type === window.currentType;
    const categoryMatch = window.currentCategory === 'All' || p.category === window.currentCategory;
    return typeMatch && categoryMatch;
  });
}

// Expose globally
window.loadProducts = loadProducts;
window.syncEbayInventory = syncEbayInventory;
window.getFilteredProducts = getFilteredProducts;
