import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, 'cleaned-products.json');
const outputPath = path.join(__dirname, 'organized-products.csv');

const products = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const headers = [
  'product_id',
  'variant_id',
  'generic_product_name',
  'category',
  'size',
  'color',
  'texture',
  'image',
  'sku',
  'pack_quantity',
  'price',
  'stock',
  'original_name'
];

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

const rows = [headers.join(',')];

for (const product of products) {
  for (const variant of product.variants || []) {
    const image = variant.images?.[0] || product.image_url || product.images?.[0] || '';
    const row = [
      product.id,
      variant.id,
      product.name,
      product.category,
      variant.size || '',
      variant.color || '',
      variant.texture || product.texture || '',
      image,
      variant.sku || '',
      variant.pack_quantity || 1,
      variant.price,
      variant.stock,
      variant.original_name || ''
    ].map(csvEscape).join(',');

    rows.push(row);
  }
}

fs.writeFileSync(outputPath, rows.join('\n') + '\n');
console.log(`Wrote ${rows.length - 1} rows to ${path.relative(process.cwd(), outputPath)}`);
