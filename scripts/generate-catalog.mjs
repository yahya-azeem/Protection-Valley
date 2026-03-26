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

function isDeadProduct(product) {
  const variants = product?.variants || [];
  const hasAnyImage =
    (product?.images || []).length > 0 || variants.some((variant) => (variant.images || []).length > 0);
  const allOutOfStock = variants.length > 0 && variants.every((variant) => (variant.stock || 0) <= 0);
  return !hasAnyImage && allOutOfStock;
}

function primaryImage(product, variant) {
  return variant?.images?.[0] || product?.image_url || product?.images?.[0] || '/images/placeholder.png';
}

function variantImages(product, variant) {
  const images = variant?.images?.length ? variant.images : product?.images || [];
  return images.length ? images : [primaryImage(product, variant)];
}

function rustStr(s) {
  if (!s) return '""';
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function generateRustCatalog() {
  let code = '';

  for (const p of products) {
    if (isDeadProduct(p)) continue;

    for (const v of p.variants) {
      const images = variantImages(p, v).map((i) => `${rustStr(i)}.into()`).join(', ');
      code += `            Product {\n`;
      code += `                id: ${v.id},\n`;
      code += `                name: ${rustStr(p.name)}.into(),\n`;
      code += `                description: ${rustStr(p.description || '')}.into(),\n`;
      code += `                price: ${v.price},\n`;
      code += `                wholesale_price: ${(v.price * 0.7).toFixed(2)},\n`;
      code += `                category: ${rustStr(p.category)}.into(),\n`;
      code += `                image_url: ${rustStr(primaryImage(p, v))}.into(),\n`;
      code += `                stock: ${v.stock},\n`;
      code += `                sku: ${rustStr(v.sku)}.into(),\n`;
      code += `                ebay_id: ${v.sku ? `Some(${rustStr(v.sku)}.into())` : 'None'},\n`;
      code += `                model_number: ${rustStr(`PV-${p.id}`)}.into(),\n`;
      code += `                color: ${v.color ? `Some(${rustStr(v.color)}.into())` : 'None'},\n`;
      code += `                size: ${v.size ? `Some(${rustStr(v.size)}.into())` : 'None'},\n`;
      code += `                texture: ${v.texture ? `Some(${rustStr(v.texture)}.into())` : 'None'},\n`;
      code += `                images: vec![${images}],\n`;
      code += `                created_at: now, updated_at: now,\n`;
      code += `            },\n`;
    }
  }

  return code;
}

function generateFrontendGroupedProducts() {
  return products
    .filter((p) => !isDeadProduct(p))
    .map((p) => ({
      model_number: `PV-${p.id}`,
      name: p.name,
      category: p.category,
      description: p.description || '',
      texture: p.texture || null,
      variants: p.variants.map((v) => ({
        id: String(v.id),
        ebay_id: v.sku || String(v.id),
        name: v.original_name,
        price: v.price,
        quantity: v.stock,
        image_url: primaryImage(p, v),
        images: variantImages(p, v),
        color: v.color || null,
        size: v.size || null,
        pack_quantity: v.pack_quantity || 1,
        texture: v.texture || null,
        model_number: `PV-${p.id}`,
        sku: v.sku,
        in_stock: v.in_stock,
      })),
    }));
}

const rustCode = generateRustCatalog();
fs.writeFileSync(path.join(__dirname, 'catalog-rust-fragment.rs'), rustCode);
console.log(
  `Wrote Rust catalog fragment (${products.filter((p) => !isDeadProduct(p)).length} groups, ${products
    .filter((p) => !isDeadProduct(p))
    .reduce((s, p) => s + p.variants.length, 0)} variants)`
);

const frontendData = generateFrontendGroupedProducts();
fs.writeFileSync(path.join(__dirname, 'frontend-products.json'), JSON.stringify(frontendData, null, 2));
console.log('Wrote frontend grouped products JSON');

const categories = {};
products
  .filter((p) => !isDeadProduct(p))
  .forEach((p) => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
console.log('\nCategories for constants.ts:');
const sortedCats = Object.entries(categories).sort((a, b) => b[1] - a[1]);
console.log(`['All', ${sortedCats.map(([c]) => `'${c}'`).join(', ')}]`);

const allPrices = products
  .filter((p) => !isDeadProduct(p))
  .flatMap((p) => p.variants.map((v) => v.price));
if (allPrices.length) {
  console.log(`\nPrice range: ${Math.min(...allPrices).toFixed(2)} - ${Math.max(...allPrices).toFixed(2)}`);
}

const allSizes = new Set(
  products
    .filter((p) => !isDeadProduct(p))
    .flatMap((p) => p.variants.map((v) => v.size).filter(Boolean))
);
console.log(`\nSizes found: ${[...allSizes].join(', ')}`);
