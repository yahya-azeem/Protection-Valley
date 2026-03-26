/**
 * import-products.mjs
 * Parses the WooCommerce/eBay CSV export, groups products by base name,
 * extracts variant parameters (size, pack quantity, color), downloads images
 * locally, and outputs a clean JSON file.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CSV_PATH = 'C:\\Users\\shama\\Downloads\\Protection-Valley-products.csv';
const IMAGES_DIR = path.join(PROJECT_ROOT, 'static', 'images', 'products');
const OUTPUT_JSON = path.join(__dirname, 'cleaned-products.json');

// ─── CSV Parsing ─────────────────────────────────────────────
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  // The CSV has multi-line fields (HTML descriptions).
  // We need to handle quoted fields that span multiple lines.
  const rows = [];
  let currentRow = '';
  let inQuotes = false;
  
  for (const line of text.split('\n')) {
    if (!currentRow && !inQuotes) {
      currentRow = line;
    } else {
      currentRow += '\n' + line;
    }
    // Count unescaped quotes
    let quoteCount = 0;
    for (let i = 0; i < currentRow.length; i++) {
      if (currentRow[i] === '"') {
        if (i + 1 < currentRow.length && currentRow[i + 1] === '"') {
          i++; // skip escaped quote
        } else {
          quoteCount++;
        }
      }
    }
    inQuotes = quoteCount % 2 !== 0;
    if (!inQuotes) {
      rows.push(currentRow);
      currentRow = '';
    }
  }
  if (currentRow) rows.push(currentRow);
  return rows;
}

// ─── Image Download ──────────────────────────────────────────
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      resolve(true);
      return;
    }
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const ws = fs.createWriteStream(destPath);
      response.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(true); });
      ws.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => { request.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

async function downloadImages(imageUrls) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const localPaths = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of imageUrls) {
    const filename = path.basename(new URL(url).pathname);
    const destPath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/products/${filename}`;
    
    try {
      const existed = fs.existsSync(destPath);
      await downloadFile(url, destPath);
      if (existed) skipped++;
      else downloaded++;
      localPaths.push(localUrl);
    } catch (e) {
      console.error(`  ✗ Failed: ${filename} — ${e.message}`);
      failed++;
      localPaths.push(localUrl); // still reference it
    }
  }
  return { localPaths, downloaded, skipped, failed };
}

// ─── Product Name Normalization & Variant Extraction ─────────
const SIZE_PATTERNS = [
  /\bsize\s+(XXS|XS|S|M|L|XL|XXL|2XL|3XL|XXXL)\b/i,
  /\bsize\s+(\d+)\b/i,
  /\b(XXS|XS|XXL|2XL|3XL|XXXL)\b/i,
  /\bSize\s+(Extra Large|Large|Medium|Small)\b/i,
  /\b(Extra Large)\s*\(XL\)/i,
  /\b(Large)\s*\(L\)/i,
  /\b(Medium)\s*\(M\)/i,
  /\b(Small)\s*\(S\)/i,
];

const PACK_PATTERNS = [
  /\b(\d+)\s*(?:Par|Pair|Pairs?)\s*Pack\b/i,
  /\b(\d+)\s*Pair\s*Pack\b/i,
  /\b(\d+)\s*Doz(?:en)?\s*(?:Pr\s*)?Pack\b/i,
  /\b(\d+)\s*Doz(?:en)?\s*(?:Pairs?|Case)\b/i,
  /\b(\d+)\s*Doz\s*Case\b/i,
  /\bPack\s*(?:Of|of)\s*(\d+)\b/i,
  /\b(\d+)\s*pair\s*pack\b/i,
  /\b(\d+)\s*Pairs?\s*Packing\b/i,
  /\b(\d+)\s*Pair\b/i,
  /\b(\d+)\s*pack\b/i,
];

const COLOR_PATTERNS = [
  /\b(Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural|Chocolate|Dark Brown)\b/i,
  /\bColor\s+(Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White)\b/i,
];

function extractSize(name) {
  // Check for explicit size patterns
  for (const pat of SIZE_PATTERNS) {
    const m = name.match(pat);
    if (m) {
      let size = m[1];
      // Normalize
      const sizeMap = {
        'extra large': 'XL', 'large': 'L', 'medium': 'M', 'small': 'S',
      };
      if (sizeMap[size.toLowerCase()]) size = sizeMap[size.toLowerCase()];
      return size.toUpperCase();
    }
  }
  // Check for (L), (M), (XL) etc at end of name
  const endMatch = name.match(/\(([SMLX]{1,3}L?)\)\s*$/i);
  if (endMatch) return endMatch[1].toUpperCase();

  // Check for quoted size like "L" or "M"
  const quotedMatch = name.match(/\"([SMLX]{1,3}L?)\"/i);
  if (quotedMatch) return quotedMatch[1].toUpperCase();

  return null;
}

function extractPackQuantity(name) {
  for (const pat of PACK_PATTERNS) {
    const m = name.match(pat);
    if (m) {
      let qty = parseInt(m[1], 10);
      // "10 Dozen" means 120 pairs
      if (/doz/i.test(m[0])) qty *= 12;
      return qty;
    }
  }
  return 1;
}

function extractColor(name) {
  for (const pat of COLOR_PATTERNS) {
    const m = name.match(pat);
    if (m) return m[1];
  }
  return null;
}

function normalizeBaseName(name) {
  // Remove size references
  let base = name;
  // Remove trailing (L), (M), (XL), etc.
  base = base.replace(/\s*\([SMLX]{1,3}L?\)\s*$/i, '');
  // Remove "Size L", "Size Large", etc.
  base = base.replace(/\s*,?\s*Size\s+\w+/gi, '');
  // Remove quoted sizes like "L" "M"
  base = base.replace(/\s*\"[SMLX]{1,3}L?\"\s*/gi, '');
  // Remove pack quantities
  base = base.replace(/\s*\d+\s*(?:Par|Pair|Pairs?)\s*Pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz(?:en)?\s*(?:Pr\s*)?Pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz(?:en)?\s*(?:Pairs?|Case)\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz\s*Case\b/gi, '');
  base = base.replace(/\s*Pack\s*(?:Of|of)\s*\d+\b/gi, '');
  base = base.replace(/\s*\d+\s*pair\s*pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Pairs?\s*Packing\b/gi, '');
  base = base.replace(/\s*\d+\s*Pair\b/gi, '');
  base = base.replace(/\s*\d+\s*pack\b/gi, '');
  // Remove specific color words that are variant info, not part of product identity
  // Only remove if product name has color variants
  // (We'll do this in a second pass after grouping)
  // Clean up extra commas and spaces
  base = base.replace(/,\s*,/g, ',');
  base = base.replace(/\s{2,}/g, ' ');
  base = base.replace(/^[\s,]+|[\s,]+$/g, '');
  return base;
}

// ─── Category Mapping ────────────────────────────────────────
function mapCategory(csvCategories) {
  const cats = csvCategories.split(',').map(c => c.trim());
  const first = cats[0];

  if (/work\s*gloves/i.test(first)) return 'Work Gloves';
  if (/welding\s*gloves/i.test(first)) return 'Welding Gear';
  if (/welding/i.test(first)) return 'Welding Gear';
  if (/boxing/i.test(first)) return 'Boxing & MMA';
  if (/punching/i.test(first)) return 'Boxing & MMA';
  if (/belts?\s*&\s*pouches/i.test(first) || /tool\s*bags?/i.test(first)) return 'Tool Belts & Pouches';
  if (/pouches/i.test(first)) return 'Tool Belts & Pouches';
  if (/pliers/i.test(first)) return 'Tool Belts & Pouches';
  if (/suspenders/i.test(first)) return 'Suspenders';
  if (/chaps/i.test(first) || /saddle/i.test(first)) return 'Outdoor & Equestrian';
  if (/shirts/i.test(first)) return 'Safety & Workwear';
  if (/safety\s*vests/i.test(first)) return 'Safety & Workwear';
  if (/hard\s*hats/i.test(first)) return 'Safety & Workwear';
  if (/gloves\s*&\s*pads/i.test(first)) return 'Safety & Workwear';
  if (/gloves\s*&\s*mittens/i.test(first)) return 'Work Gloves';
  if (/gloves.*hooks/i.test(first) || /belts$/i.test(first)) return 'Fitness & Lifting';
  if (/ropes/i.test(first) || /cords/i.test(first)) return 'Tools & Hardware';
  if (/chalk/i.test(first) || /marking/i.test(first)) return 'Tools & Hardware';
  if (/hand\s*tools/i.test(first)) return 'Tools & Hardware';
  if (/carton/i.test(first) || /tape/i.test(first)) return 'Tools & Hardware';
  if (/key\s*chains/i.test(first)) return 'Accessories';
  if (/bags?\s*&?\s*handbags/i.test(first) || /cell\s*phone/i.test(first)) return 'Accessories';
  if (/leather\s*gold/i.test(first)) return 'Tool Belts & Pouches';
  if (/other\s*personal/i.test(first)) return 'Work Gloves';
  if (/gas\s*welding/i.test(first)) return 'Welding Gear';

  return 'Other';
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  console.log('📄 Reading CSV...');
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const allRows = parseCSV(csvText);
  
  // Header row
  const headers = parseCSVLine(allRows[0]);
  const colIndex = {};
  headers.forEach((h, i) => colIndex[h] = i);

  console.log(`   Found ${allRows.length - 1} data rows`);
  console.log(`   Columns: ${headers.length}`);

  // Parse data rows
  const rawProducts = [];
  for (let i = 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!row.trim()) continue;
    const cols = parseCSVLine(row);
    
    const id = parseInt(cols[colIndex['ID']], 10);
    const name = cols[colIndex['Name']] || '';
    const published = cols[colIndex['Published']];
    const sku = cols[colIndex['SKU']] || '';
    const stock = parseInt(cols[colIndex['Stock']] || '0', 10);
    const price = parseFloat(cols[colIndex['Regular price']] || '0');
    const categories = cols[colIndex['Categories']] || '';
    const imageStr = cols[colIndex['Images']] || '';
    const inStock = cols[colIndex['In stock?']];

    // Skip placeholder/empty products
    if (!name || name === 'placeholder free' || price <= 0) continue;
    if (published !== '1') continue;

    // Parse image URLs
    const imageUrls = imageStr
      .split(',')
      .map(u => u.trim())
      .filter(u => u.startsWith('http'));

    rawProducts.push({
      id, name, sku, stock, price, categories, imageUrls, inStock: inStock === '1',
    });
  }

  console.log(`   ${rawProducts.length} valid products after filtering`);

  // ─── Collect all image URLs ───────────────────────────────
  const allImageUrls = new Set();
  rawProducts.forEach(p => p.imageUrls.forEach(u => allImageUrls.add(u)));
  console.log(`\n📸 Downloading ${allImageUrls.size} unique images...`);
  
  const imageUrlList = [...allImageUrls];
  const batchSize = 10;
  const urlToLocal = {};
  let totalDownloaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (let i = 0; i < imageUrlList.length; i += batchSize) {
    const batch = imageUrlList.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (url) => {
        const filename = path.basename(new URL(url).pathname);
        const destPath = path.join(IMAGES_DIR, filename);
        const localUrl = `/images/products/${filename}`;
        urlToLocal[url] = localUrl;
        
        if (fs.existsSync(destPath)) {
          totalSkipped++;
          return;
        }
        await downloadFile(url, destPath);
        totalDownloaded++;
      })
    );
    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        totalFailed++;
        const url = batch[idx];
        const filename = path.basename(new URL(url).pathname);
        urlToLocal[url] = `/images/products/${filename}`;
        console.error(`  ✗ ${filename}: ${r.reason?.message || r.reason}`);
      }
    });
    process.stdout.write(`\r   Progress: ${Math.min(i + batchSize, imageUrlList.length)}/${imageUrlList.length}`);
  }
  console.log(`\n   ✓ Downloaded: ${totalDownloaded}, Skipped: ${totalSkipped}, Failed: ${totalFailed}`);

  // ─── Map image URLs to local paths ────────────────────────
  rawProducts.forEach(p => {
    p.localImages = p.imageUrls.map(u => urlToLocal[u] || u);
  });

  // ─── Group products by normalized base name ───────────────
  console.log('\n🔗 Grouping products by base name...');
  
  const groups = new Map();
  
  for (const p of rawProducts) {
    const baseName = normalizeBaseName(p.name);
    const size = extractSize(p.name);
    const packQty = extractPackQuantity(p.name);
    const color = extractColor(p.name);
    const category = mapCategory(p.categories);

    // Build a grouping key from base name + category
    const groupKey = `${baseName.toLowerCase()}::${category.toLowerCase()}`;

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        baseName,
        category,
        variants: [],
        allImages: new Set(),
      });
    }
    
    const group = groups.get(groupKey);
    // Collect all unique images
    p.localImages.forEach(img => group.allImages.add(img));

    group.variants.push({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      stock: p.stock,
      size,
      pack_quantity: packQty,
      color,
      images: p.localImages,
      in_stock: p.inStock,
    });
  }

  // ─── Build final product list ─────────────────────────────
  const products = [];
  let prodId = 1;

  for (const [, group] of groups) {
    const allImages = [...group.allImages];
    const firstVariant = group.variants[0];
    
    // Determine if variants are meaningful
    const hasSizeVariants = new Set(group.variants.map(v => v.size).filter(Boolean)).size > 1;
    const hasPackVariants = new Set(group.variants.map(v => v.pack_quantity)).size > 1;
    const hasColorVariants = new Set(group.variants.map(v => v.color).filter(Boolean)).size > 1;
    const hasPriceVariants = new Set(group.variants.map(v => v.price)).size > 1;

    // Build variant label
    let variantType = null;
    if (hasSizeVariants) variantType = 'size';
    else if (hasPackVariants || hasPriceVariants) variantType = 'pack_quantity';
    else if (hasColorVariants) variantType = 'color';

    const product = {
      id: prodId++,
      name: group.baseName,
      category: group.category,
      image_url: allImages[0] || '/images/placeholder.png',
      images: allImages,
      variant_type: variantType,
      variants: group.variants.map(v => ({
        id: v.id,
        sku: v.sku,
        original_name: v.name,
        price: v.price,
        stock: v.stock,
        size: v.size,
        pack_quantity: v.pack_quantity,
        color: v.color,
        images: v.images,
        in_stock: v.in_stock,
      })),
    };
    products.push(product);
  }

  console.log(`   ✓ Grouped ${rawProducts.length} products into ${products.length} product groups`);

  // ─── Summary ──────────────────────────────────────────────
  const categories = {};
  products.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  console.log('\n📊 Categories:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));

  const prices = products.flatMap(p => p.variants.map(v => v.price));
  console.log(`\n💰 Price range: $${Math.min(...prices).toFixed(2)} – $${Math.max(...prices).toFixed(2)}`);

  // ─── Write output ─────────────────────────────────────────
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(products, null, 2));
  console.log(`\n✅ Wrote ${products.length} grouped products to ${OUTPUT_JSON}`);
}

main().catch(console.error);
