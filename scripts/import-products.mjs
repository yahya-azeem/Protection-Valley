/**
 * import-products.mjs
 * Parse a WooCommerce/eBay CSV export, normalize product titles,
 * group variants, and write a clean grouped JSON dataset.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_CSV_PATH = 'C:\\Users\\shama\\Downloads\\Protection-Valley-products.csv';
const IMAGES_DIR = path.join(PROJECT_ROOT, 'static', 'images', 'products');
const OUTPUT_JSON = path.join(__dirname, 'cleaned-products.json');

const args = process.argv.slice(2);
const csvArgIndex = args.indexOf('--csv');
const CSV_PATH = csvArgIndex >= 0 ? args[csvArgIndex + 1] : DEFAULT_CSV_PATH;

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
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const rows = [];
  let currentRow = '';
  let inQuotes = false;

  for (const line of text.split('\n')) {
    currentRow = currentRow ? `${currentRow}\n${line}` : line;

    let quoteCount = 0;
    for (let i = 0; i < currentRow.length; i++) {
      if (currentRow[i] === '"') {
        if (i + 1 < currentRow.length && currentRow[i + 1] === '"') {
          i++;
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
      ws.on('finish', () => {
        ws.close();
        resolve(true);
      });
      ws.on('error', reject);
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
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
    } catch (error) {
      console.error(`  Failed: ${filename} - ${error.message}`);
      failed++;
      localPaths.push(localUrl);
    }
  }

  return { localPaths, downloaded, skipped, failed };
}

const SIZE_PATTERNS = [
  /\bsize\s+(XXS|XS|S|M|L|XL|XXL|2XL|3XL|XXXL)\b/i,
  /\bsize\s+(\d+)\b/i,
  /\b(XXS|XS|S|M|L|XL|XXL|2XL|3XL|XXXL)\b/i,
  /\bSize\s+(Extra Large|Large|Medium|Small)\b/i,
  /\b(Extra Large)\s*\(XL\)/i,
  /\b(Large)\s*\(L\)/i,
  /\b(Medium)\s*\(M\)/i,
  /\b(Small)\s*\(S\)/i,
  /\b(Extra Large|Large|Medium|Small)\b/i,
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
  /\b(Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural|Chocolate|Tan|Dark Brown|Navy|Purple|Beige)\b/i,
  /\bColor\s+(Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Tan)\b/i,
  /\b(Black|Brown|Tan|Orange|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural)\s*\/\s*(Black|Brown|Tan|Orange|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural)\b/i,
];

const TEXTURE_PATTERNS = [
  { pattern: /\bFull\s*Grain\b/i, value: 'Full Grain' },
  { pattern: /\bTop\s*Grain\b/i, value: 'Top Grain' },
  { pattern: /\bOil\s*Tanned\b/i, value: 'Oil Tanned' },
  { pattern: /\bBrushed\s*Leather\b/i, value: 'Suede' },
  { pattern: /\bSuede\b/i, value: 'Suede' },
  { pattern: /\bGoat\s*Skin\b/i, value: 'Goat Skin' },
  { pattern: /\bCow\s*Hide\b/i, value: 'Cow Hide' },
  { pattern: /\bCowhide\b/i, value: 'Cow Hide' },
  { pattern: /\bSynthetic\s+Leather\b/i, value: 'Synthetic Leather' },
  { pattern: /\bCanvas\b/i, value: 'Canvas' },
  { pattern: /\bNylon\b/i, value: 'Nylon' },
  { pattern: /\bJersey\b/i, value: 'Jersey' },
];

function extractSize(name) {
  for (const pattern of SIZE_PATTERNS) {
    const match = name.match(pattern);
    if (match) {
      let size = match[1];
      const sizeMap = {
        'extra large': 'XL',
        large: 'L',
        medium: 'M',
        small: 'S',
      };
      if (sizeMap[size.toLowerCase()]) size = sizeMap[size.toLowerCase()];
      return size.toUpperCase();
    }
  }

  const endMatch = name.match(/\(([SMLX]{1,3}L?)\)\s*$/i);
  if (endMatch) return endMatch[1].toUpperCase();

  const quotedMatch = name.match(/"([SMLX]{1,3}L?)"/i);
  if (quotedMatch) return quotedMatch[1].toUpperCase();

  return null;
}

function extractPackQuantity(name) {
  for (const pattern of PACK_PATTERNS) {
    const match = name.match(pattern);
    if (match) {
      let quantity = parseInt(match[1], 10);
      if (/doz/i.test(match[0])) quantity *= 12;
      return quantity;
    }
  }
  return 1;
}

function extractColor(name) {
  for (const pattern of COLOR_PATTERNS) {
    const match = name.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractTexture(name) {
  for (const { pattern, value } of TEXTURE_PATTERNS) {
    if (pattern.test(name)) return value;
  }
  return null;
}

function normalizeBaseName(name) {
  let base = name;
  base = base.replace(/\s*\([SMLX]{1,3}L?\)\s*$/i, '');
  base = base.replace(/\s*,?\s*Size\s+\w+/gi, '');
  base = base.replace(/\s*"([SMLX]{1,3}L?)"\s*/gi, '');
  base = base.replace(/\s*\d+\s*(?:Par|Pair|Pairs?)\s*Pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz(?:en)?\s*(?:Pr\s*)?Pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz(?:en)?\s*(?:Pairs?|Case)\b/gi, '');
  base = base.replace(/\s*\d+\s*Doz\s*Case\b/gi, '');
  base = base.replace(/\s*Pack\s*(?:Of|of)\s*\d+\b/gi, '');
  base = base.replace(/\s*\d+\s*pair\s*pack\b/gi, '');
  base = base.replace(/\s*\d+\s*Pairs?\s*Packing\b/gi, '');
  base = base.replace(/\s*\d+\s*Pair\b/gi, '');
  base = base.replace(/\s*\d+\s*pack\b/gi, '');
  base = base.replace(/\b(?:Color|Colour)\s+(?:Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural|Chocolate|Tan|Dark Brown)\b/gi, '');
  base = base.replace(/\b(?:Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural|Chocolate|Tan|Dark Brown)\s+Color\b/gi, '');
  // Strip standalone variant attributes from the generic product name.
  base = base.replace(/\b(?:Orange|Black|Brown|Pink|Red|Blue|Green|Yellow|Gold|White|Gray|Grey|Natural|Chocolate|Tan|Dark Brown|Navy|Purple|Beige)\b/gi, '');
  base = base.replace(/\b(?:Hi[\s-]?Vis|High[\s-]?Vis(?:ibility)?)\b/gi, '');
  base = base.replace(/\b(?:Full\s*Grain|Top\s*Grain|Oil\s*Tanned|Brushed\s*Leather|Suede|Goat\s*Skin|Cow\s*Hide|Cowhide|Synthetic\s+Leather|Canvas|Nylon|Jersey)\b/gi, '');
  base = base.replace(/\(\s*(?:Full\s*Grain|Top\s*Grain|Oil\s*Tanned|Brushed\s*Leather|Suede|Goat\s*Skin|Cow\s*Hide|Cowhide|Synthetic\s+Leather|Canvas|Nylon|Jersey)\s*\)/gi, '');
  base = base.replace(/\(\s*\)/g, '');
  base = base.replace(/,\s*,/g, ',');
  base = base.replace(/\s+,/g, ',');
  base = base.replace(/,\s+/g, ', ');
  base = base.replace(/\s{2,}/g, ' ');
  base = base.replace(/^[\s,]+|[\s,]+$/g, '');
  return base;
}

function mapCategory(csvCategories) {
  const cats = csvCategories.split(',').map((c) => c.trim());
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

function preferredImage(images) {
  return images?.[0] || '/images/placeholder.png';
}

function isDeadGroup(group) {
  const hasAnyImage = group.allImages.size > 0 || group.variants.some((variant) => variant.images.length > 0);
  const allOutOfStock = group.variants.length > 0 && group.variants.every((variant) => variant.stock <= 0);
  return !hasAnyImage && allOutOfStock;
}

async function main() {
  console.log('Reading CSV...');
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const allRows = parseCSV(csvText);

  const headers = parseCSVLine(allRows[0]);
  const colIndex = {};
  headers.forEach((header, index) => {
    colIndex[header] = index;
  });

  console.log(`Found ${allRows.length - 1} data rows`);
  console.log(`Columns: ${headers.length}`);

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

    if (!name || name === 'placeholder free' || price <= 0) continue;
    if (published !== '1') continue;

    const imageUrls = imageStr
      .split(',')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http'));

    rawProducts.push({
      id,
      name,
      sku,
      stock,
      price,
      categories,
      imageUrls,
      inStock: inStock === '1',
    });
  }

  console.log(`Valid products after filtering: ${rawProducts.length}`);

  const allImageUrls = new Set();
  rawProducts.forEach((product) => product.imageUrls.forEach((url) => allImageUrls.add(url)));
  console.log(`Downloading ${allImageUrls.size} unique images...`);

  const urlToLocal = {};
  const imageUrlList = [...allImageUrls];
  const batchSize = 10;
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

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        totalFailed++;
        const url = batch[index];
        const filename = path.basename(new URL(url).pathname);
        urlToLocal[url] = `/images/products/${filename}`;
        console.error(`Failed: ${filename} - ${result.reason?.message || result.reason}`);
      }
    });

    process.stdout.write(`\rProgress: ${Math.min(i + batchSize, imageUrlList.length)}/${imageUrlList.length}`);
  }
  console.log(`\nDownloaded: ${totalDownloaded}, Skipped: ${totalSkipped}, Failed: ${totalFailed}`);

  rawProducts.forEach((product) => {
    product.localImages = product.imageUrls.map((url) => urlToLocal[url] || url);
  });

  console.log('Grouping products by base name...');
  const groups = new Map();

  for (const product of rawProducts) {
    const baseName = normalizeBaseName(product.name);
    const size = extractSize(product.name);
    const packQty = extractPackQuantity(product.name);
    const color = extractColor(product.name);
    const texture = extractTexture(product.name);
    const category = mapCategory(product.categories);
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
    product.localImages.forEach((img) => group.allImages.add(img));
    group.variants.push({
      id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      stock: product.stock,
      size,
      pack_quantity: packQty,
      color,
      texture,
      images: product.localImages,
      in_stock: product.inStock,
    });
  }

  const products = [];
  for (const group of groups.values()) {
    if (isDeadGroup(group)) continue;

    const images = [...group.allImages];
    const productImages = images.length ? images : ['/images/placeholder.png'];
    const textures = [...new Set(group.variants.map((variant) => variant.texture).filter(Boolean))];
    const variantType = new Set(group.variants.map((variant) => variant.size).filter(Boolean)).size > 1
      ? 'size'
      : new Set(group.variants.map((variant) => variant.pack_quantity)).size > 1 ||
        new Set(group.variants.map((variant) => variant.price)).size > 1
      ? 'pack_quantity'
      : new Set(group.variants.map((variant) => variant.color).filter(Boolean)).size > 1
      ? 'color'
      : null;

    products.push({
      id: group.variants[0].id,
      name: group.baseName,
      category: group.category,
      description: '',
      image_url: preferredImage(productImages),
      images: productImages,
      texture: textures.length === 1 ? textures[0] : null,
      variant_type: variantType,
      variants: group.variants.map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        original_name: variant.name,
        price: variant.price,
        stock: variant.stock,
        size: variant.size,
        pack_quantity: variant.pack_quantity,
        color: variant.color,
        texture: variant.texture,
        images: variant.images.length ? variant.images : productImages,
        in_stock: variant.in_stock,
      })),
    });
  }

  console.log(`Grouped ${rawProducts.length} products into ${products.length} product groups`);

  const categories = {};
  products.forEach((product) => {
    categories[product.category] = (categories[product.category] || 0) + 1;
  });

  console.log('Categories:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => console.log(`  ${category}: ${count}`));

  const prices = products.flatMap((product) => product.variants.map((variant) => variant.price));
  if (prices.length) {
    console.log(`Price range: $${Math.min(...prices).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`);
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(products, null, 2));
  console.log(`Wrote ${products.length} grouped products to ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
