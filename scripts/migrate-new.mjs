import fs from 'fs';
import path from 'path';
import https from 'https';

const CSV_PATH = "C:\\Users\\shama\\Downloads\\wc-product-export-19-4-2026-1776632549556.csv";
const IMAGE_DIR = "static/images/products";
const SEED_FILE = "supabase/seed.sql";

if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i+1] === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function stripHtml(html) {
  if (!html) return '';
  let text = html
    .replace(/<[^>]*>?/gm, '')           // strip HTML tags
    .replace(/&nbsp;/gi, ' ')             // HTML entities
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#\d+;/g, '')               // numeric entities
    .replace(/\\r\\n/g, ' ')              // literal \r\n in CSV
    .replace(/\\r/g, ' ')                 // literal \r
    .replace(/\\n/g, ' ')                 // literal \n
    .replace(/\\t/g, ' ')                 // literal \t
    .replace(/[\r\n\t]+/g, ' ')           // actual newlines/tabs
    .replace(/\s{2,}/g, ' ')              // collapse multiple spaces
    .trim();
  // Remove eBay boilerplate chunks
  text = text.replace(/Item specifics.*?Item description from the seller/gi, '').trim();
  text = text.replace(/Item specifics.*$/gi, '').trim();
  text = text.replace(/Condition\s*New with tags:.*?Read moreabout the condition/gi, '').trim();
  text = text.replace(/\s{2,}/g, ' ').trim();
  // If cleaned text is empty or only whitespace, use fallback
  if (!text || text.length < 3) return '';
  return text;
}

async function downloadImage(url, filename) {
  if (!url || !url.startsWith('http')) return null;
  const filePath = path.join(IMAGE_DIR, filename);
  
  if (fs.existsSync(filePath)) return `/images/products/${filename}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      const stream = fs.createWriteStream(filePath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(`/images/products/${filename}`);
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

function sanitizeSql(str) {
  if (!str) return "''";
  return `'${str.toString().replace(/'/g, "''")}'`;
}

async function main() {
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  
  const headers = parseCsvLine(lines[0]);
  const data = lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });

  const products = [];
  const variants = [];

  console.log(`Processing ${data.length} items...`);

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const productId = i + 1;
    const variantId = i + 1;

    const name = item.Name || 'Unnamed Product';
    const description = stripHtml(item.Description) || stripHtml(item['Short description']) || 'Premium handcrafted workgear.';
    const category = item.Categories ? item.Categories.split(',')[0].trim() : 'Other';
    const imageUrls = item.Images ? item.Images.split(',').map(s => s.trim()) : [];
    const mainImageUrl = imageUrls[0] || '';
    const sku = item.SKU || `PV-${1000 + i}`;
    const price = parseFloat(item['Regular price']) || 0.0;
    const stock = parseInt(item.Stock) || 10;

    let localImagePath = '/images/logo.png';
    if (mainImageUrl) {
      try {
        const urlObj = new URL(mainImageUrl);
        const ext = path.extname(urlObj.pathname) || '.jpg';
        const filename = `${sku.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;
        const downloaded = await downloadImage(mainImageUrl, filename);
        if (downloaded) localImagePath = downloaded;
      } catch (e) {
        // invalid URL, keep logo
      }
    }

    products.push({
      id: productId,
      name,
      description,
      category,
      image_url: localImagePath,
      model_number: sku
    });

    variants.push({
      id: variantId,
      product_id: productId,
      sku,
      original_name: name,
      price,
      stock,
      image_url: localImagePath,
      in_stock: stock > 0
    });
  }

  console.log("Generating seed.sql...");
  let sql = `-- Clear existing data\nTRUNCATE products RESTART IDENTITY CASCADE;\n\n`;

  sql += `-- Insert Products\nINSERT INTO products (id, name, description, category, image_url, model_number) VALUES\n`;
  sql += products.map(p => `(${p.id}, ${sanitizeSql(p.name)}, ${sanitizeSql(p.description)}, ${sanitizeSql(p.category)}, ${sanitizeSql(p.image_url)}, ${sanitizeSql(p.model_number)})`).join(',\n') + ';\n\n';

  sql += `-- Insert Variants\nINSERT INTO product_variants (id, product_id, sku, original_name, price, stock, image_url, in_stock) VALUES\n`;
  sql += variants.map(v => `(${v.id}, ${v.product_id}, ${sanitizeSql(v.sku)}, ${sanitizeSql(v.original_name)}, ${v.price}, ${v.stock}, ${sanitizeSql(v.image_url)}, ${v.in_stock})`).join(',\n') + ';\n';

  fs.writeFileSync(SEED_FILE, sql);
  console.log(`Done! ${products.length} products and variants written to ${SEED_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
