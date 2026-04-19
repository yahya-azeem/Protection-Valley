import fs from 'fs';

const SUPABASE_URL = 'https://fnirqccmtjzibjhgzyay.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuaXJxY2NtdGp6aWJqaGd6eWF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjkwNzk5NCwiZXhwIjoyMDg4NDgzOTk0fQ.mn-ntcqgUxheKkhYiS_tCvVXsYgeax9wf2j_aDLwYbM';

const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');

// Split into individual statements
const statements = seedSql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Executing ${statements.length} SQL statements...`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i] + ';';
  const label = stmt.substring(0, 60).replace(/\n/g, ' ');
  
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: stmt })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      console.log(`[${i+1}] WARN (${res.status}): ${label}...`);
      // Try alternate approach for this statement
    } else {
      console.log(`[${i+1}] OK: ${label}...`);
    }
  } catch (e) {
    console.log(`[${i+1}] ERR: ${e.message}`);
  }
}

// Use the Supabase REST API to delete all products first, then insert
console.log('\n--- Using REST API approach ---');

// Step 1: Delete all existing products (CASCADE will handle variants)
console.log('Deleting all existing products...');
const delRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants?id=gt.0`, {
  method: 'DELETE',
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Prefer': 'return=minimal'
  }
});
console.log(`  Variants delete: ${delRes.status}`);

const delProducts = await fetch(`${SUPABASE_URL}/rest/v1/products?id=gt.0`, {
  method: 'DELETE',
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Prefer': 'return=minimal'
  }
});
console.log(`  Products delete: ${delProducts.status}`);

// Step 2: Parse seed.sql to extract product data
const productMatch = seedSql.match(/INSERT INTO products \(id, name, description, category, image_url, model_number\) VALUES\n([\s\S]*?);/);
const variantMatch = seedSql.match(/INSERT INTO product_variants \(id, product_id, sku, original_name, price, stock, image_url, in_stock\) VALUES\n([\s\S]*?);/);

if (!productMatch || !variantMatch) {
  console.error('Could not parse seed.sql');
  process.exit(1);
}

// Parse product rows from SQL VALUES
function parseSqlValues(valuesStr) {
  const rows = [];
  let depth = 0;
  let current = '';
  
  for (let i = 0; i < valuesStr.length; i++) {
    const ch = valuesStr[i];
    if (ch === '(') {
      depth++;
      if (depth === 1) { current = ''; continue; }
    }
    if (ch === ')') {
      depth--;
      if (depth === 0) { rows.push(current); continue; }
    }
    if (depth > 0) current += ch;
  }
  return rows;
}

function parseSqlString(raw) {
  // Remove surrounding quotes and unescape
  raw = raw.trim();
  if (raw.startsWith("'") && raw.endsWith("'")) {
    raw = raw.slice(1, -1).replace(/''/g, "'");
  }
  return raw;
}

function splitSqlRow(row) {
  const parts = [];
  let current = '';
  let inQuote = false;
  
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === "'" && !inQuote) {
      inQuote = true;
      current += ch;
    } else if (ch === "'" && inQuote) {
      if (row[i+1] === "'") {
        current += "''";
        i++;
      } else {
        inQuote = false;
        current += ch;
      }
    } else if (ch === ',' && !inQuote) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current.trim());
  return parts;
}

const productRows = parseSqlValues(productMatch[1]);
console.log(`\nParsed ${productRows.length} products from seed.sql`);

// Insert products in batches of 50
const BATCH = 50;
for (let i = 0; i < productRows.length; i += BATCH) {
  const batch = productRows.slice(i, i + BATCH).map(row => {
    const parts = splitSqlRow(row);
    return {
      id: parseInt(parts[0]),
      name: parseSqlString(parts[1]),
      description: parseSqlString(parts[2]),
      category: parseSqlString(parts[3]),
      image_url: parseSqlString(parts[4]),
      model_number: parseSqlString(parts[5])
    };
  });
  
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(batch)
  });
  
  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error(`  Products batch ${i}-${i+batch.length} FAILED: ${err}`);
  } else {
    console.log(`  Inserted products ${i+1}-${i+batch.length}`);
  }
}

// Insert variants
const variantRows = parseSqlValues(variantMatch[1]);
console.log(`\nParsed ${variantRows.length} variants from seed.sql`);

for (let i = 0; i < variantRows.length; i += BATCH) {
  const batch = variantRows.slice(i, i + BATCH).map(row => {
    const parts = splitSqlRow(row);
    return {
      id: parseInt(parts[0]),
      product_id: parseInt(parts[1]),
      sku: parseSqlString(parts[2]),
      original_name: parseSqlString(parts[3]),
      price: parseFloat(parts[4]),
      stock: parseInt(parts[5]),
      image_url: parseSqlString(parts[6]),
      in_stock: parts[7].trim() === 'true'
    };
  });
  
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/product_variants`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(batch)
  });
  
  if (!insertRes.ok) {
    const err = await insertRes.text();
    console.error(`  Variants batch ${i}-${i+batch.length} FAILED: ${err}`);
  } else {
    console.log(`  Inserted variants ${i+1}-${i+batch.length}`);
  }
}

// Verify
const countRes = await fetch(`${SUPABASE_URL}/rest/v1/products?select=count`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    'Prefer': 'count=exact'
  }
});
const countHeader = countRes.headers.get('content-range');
console.log(`\n✅ Verification: ${countHeader}`);

// Check product 1 description
const p1 = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.1&select=description`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  }
});
const p1Data = await p1.json();
console.log(`Product 1 description: "${p1Data[0]?.description}"`);
