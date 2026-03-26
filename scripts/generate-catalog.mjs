/**
 * generate-catalog.mjs
 * Reads cleaned-products.json and generates:
 *   1. Rust code for product_service.rs catalog()
 *   2. Frontend data for stores.ts and constants.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'cleaned-products.json'), 'utf8'));

// ─── Escape string for Rust ─────────────────────────────────
function rustStr(s) {
  if (!s) return '""';
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

// ─── Generate Rust catalog ──────────────────────────────────
function generateRustCatalog() {
  let code = '';
  
  for (const p of products) {
    // For each grouped product, create one Product entry per variant
    for (const v of p.variants) {
      const images = v.images.map(i => `${rustStr(i)}.into()`).join(', ');
      code += `            Product {\n`;
      code += `                id: ${v.id},\n`;
      code += `                name: ${rustStr(p.name)}.into(),\n`;
      code += `                description: String::new(),\n`;
      code += `                price: ${v.price},\n`;
      code += `                wholesale_price: ${(v.price * 0.7).toFixed(2)},\n`;
      code += `                category: ${rustStr(p.category)}.into(),\n`;
      code += `                image_url: ${rustStr(v.images[0] || p.image_url)}.into(),\n`;
      code += `                stock: ${v.stock},\n`;
      code += `                sku: ${rustStr(v.sku)}.into(),\n`;
      code += `                ebay_id: ${v.sku ? `Some(${rustStr(v.sku)}.into())` : 'None'},\n`;
      code += `                model_number: ${rustStr(`PV-${p.id}`)}.into(),\n`;
      code += `                color: ${v.color ? `Some(${rustStr(v.color)}.into())` : 'None'},\n`;
      code += `                size: ${v.size ? `Some(${rustStr(v.size)}.into())` : 'None'},\n`;
      code += `                texture: None,\n`;
      code += `                images: vec![${images}],\n`;
      code += `                created_at: now, updated_at: now,\n`;
      code += `            },\n`;
    }
  }
  return code;
}

// ─── Generate Frontend GroupedProduct data ───────────────────
function generateFrontendGroupedProducts() {
  return products.map(p => ({
    model_number: `PV-${p.id}`,
    name: p.name,
    category: p.category,
    description: '',
    variants: p.variants.map(v => ({
      id: String(v.id),
      ebay_id: v.sku || String(v.id),
      name: v.original_name,
      price: v.price,
      quantity: v.stock,
      image_url: v.images[0] || p.image_url,
      images: v.images,
      color: v.color || null,
      size: v.size || null,
      pack_quantity: v.pack_quantity || 1,
      texture: null,
      model_number: `PV-${p.id}`,
      sku: v.sku,
      in_stock: v.in_stock,
    })),
  }));
}

// ─── Write outputs ──────────────────────────────────────────
const rustCode = generateRustCatalog();
fs.writeFileSync(path.join(__dirname, 'catalog-rust-fragment.rs'), rustCode);
console.log(`✅ Wrote Rust catalog fragment (${products.length} groups, ${products.reduce((s,p)=>s+p.variants.length,0)} variants)`);

const frontendData = generateFrontendGroupedProducts();
fs.writeFileSync(path.join(__dirname, 'frontend-products.json'), JSON.stringify(frontendData, null, 2));
console.log(`✅ Wrote frontend grouped products JSON`);

// ─── Print category summary for constants.ts ────────────────
const categories = {};
products.forEach(p => { categories[p.category] = (categories[p.category] || 0) + 1; });
console.log('\n📊 CATEGORIES for constants.ts:');
const sortedCats = Object.entries(categories).sort((a,b) => b[1]-a[1]);
console.log(`['All', ${sortedCats.map(([c]) => `'${c}'`).join(', ')}]`);

// Price ranges
const allPrices = products.flatMap(p => p.variants.map(v => v.price));
console.log(`\n💰 ${Math.min(...allPrices).toFixed(2)} – ${Math.max(...allPrices).toFixed(2)}`);

// Sizes
const allSizes = new Set(products.flatMap(p => p.variants.map(v => v.size).filter(Boolean)));
console.log(`\n📏 Sizes found: ${[...allSizes].join(', ')}`);
