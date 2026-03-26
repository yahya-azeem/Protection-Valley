/**
 * generate-seed-sql.mjs
 * Generates SQL INSERT statements from cleaned-products.json
 * to seed the Supabase database.
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

function escSQL(s) {
  if (s === null || s === undefined) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function escArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return `ARRAY[${arr.map((s) => escSQL(s)).join(',')}]`;
}

function primaryImage(product, variant) {
  return variant?.images?.[0] || product?.image_url || product?.images?.[0] || '';
}

function variantImages(product, variant) {
  const images = variant?.images?.length ? variant.images : product?.images || [];
  return images.length ? images : primaryImage(product, variant) ? [primaryImage(product, variant)] : [];
}

let sql = `-- Auto-generated seed data
-- Clean existing data first
TRUNCATE product_variants CASCADE;
TRUNCATE products CASCADE;

`;

const activeProducts = products.filter((product) => !isDeadProduct(product));

for (const p of activeProducts) {
  const allImages = p.images?.length ? p.images : [];
  const productImage = allImages[0] || '';

  sql += `INSERT INTO products (id, name, category, description, image_url, images, model_number) VALUES (`;
  sql += `${p.id}, ${escSQL(p.name)}, ${escSQL(p.category)}, ${escSQL(p.description || '')}, ${escSQL(productImage)}, ${escArray(allImages)}, ${escSQL('PV-' + p.id)}`;
  sql += `);\n`;

  for (const v of p.variants) {
    const images = variantImages(p, v);
    const wholesalePrice = (v.price * 0.7).toFixed(2);
    sql += `INSERT INTO product_variants (product_id, sku, ebay_item_id, original_name, price, wholesale_price, stock, size, color, pack_quantity, texture, image_url, images, in_stock) VALUES (`;
    sql += `${p.id}, ${escSQL(v.sku)}, ${v.sku ? escSQL(v.sku) : 'NULL'}, ${escSQL(v.original_name)}, ${v.price}, ${wholesalePrice}, ${v.stock}, ${v.size ? escSQL(v.size) : 'NULL'}, ${v.color ? escSQL(v.color) : 'NULL'}, ${v.pack_quantity || 1}, ${v.texture ? escSQL(v.texture) : 'NULL'}, ${escSQL(images[0] || productImage)}, ${escArray(images)}, ${v.in_stock ? 'true' : 'false'}`;
    sql += `);\n`;
  }
  sql += '\n';
}

sql += `SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));\n`;
sql += `SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));\n`;

const targets = [
  path.join(__dirname, 'seed.sql'),
  path.join(__dirname, '..', 'supabase', 'seed.sql'),
  path.join(__dirname, '..', 'supabase', 'migrations', '20260326035018_seed_data.sql'),
];

for (const target of targets) {
  fs.writeFileSync(target, sql);
}

console.log(`Generated seed SQL for ${activeProducts.length} products and ${activeProducts.reduce((s, p) => s + p.variants.length, 0)} variants`);
console.log(`Files: ${targets.map((target) => path.relative(process.cwd(), target)).join(', ')}`);
