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

function escSQL(s) {
  if (s === null || s === undefined) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function escArray(arr) {
  if (!arr || arr.length === 0) return "'{}'";
  return `ARRAY[${arr.map(s => escSQL(s)).join(',')}]`;
}

let sql = `-- Auto-generated seed data from CSV
-- Clean existing data first
TRUNCATE product_variants CASCADE;
TRUNCATE products CASCADE;

`;

for (const p of products) {
  const allImages = p.images || [];
  
  sql += `INSERT INTO products (id, name, category, description, image_url, images, model_number) VALUES (`;
  sql += `${p.id}, ${escSQL(p.name)}, ${escSQL(p.category)}, '', ${escSQL(allImages[0] || '')}, ${escArray(allImages)}, ${escSQL('PV-' + p.id)}`;
  sql += `);\n`;

  for (const v of p.variants) {
    const wholesalePrice = (v.price * 0.7).toFixed(2);
    sql += `INSERT INTO product_variants (product_id, sku, ebay_item_id, original_name, price, wholesale_price, stock, size, color, pack_quantity, texture, image_url, images, in_stock) VALUES (`;
    sql += `${p.id}, ${escSQL(v.sku)}, ${v.sku ? escSQL(v.sku) : 'NULL'}, ${escSQL(v.original_name)}, ${v.price}, ${wholesalePrice}, ${v.stock}, ${v.size ? escSQL(v.size) : 'NULL'}, ${v.color ? escSQL(v.color) : 'NULL'}, ${v.pack_quantity || 1}, NULL, ${escSQL(v.images?.[0] || '')}, ${escArray(v.images || [])}, ${v.in_stock ? 'true' : 'false'}`;
    sql += `);\n`;
  }
  sql += '\n';
}

// Reset sequences
sql += `SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));\n`;
sql += `SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));\n`;

fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql);
console.log(`✅ Generated seed.sql with ${products.length} products and ${products.reduce((s,p)=>s+p.variants.length,0)} variants`);
console.log(`   File size: ${(sql.length / 1024).toFixed(1)} KB`);
