import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('Error: DATABASE_URL environment variable is not defined.');
  console.log('To run migrations, set DATABASE_URL (e.g. postgres://postgres:password@db.project.supabase.co:5432/postgres) and run this script.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files.`);

    for (const file of files) {
      console.log(`Applying migration: ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
      console.log(`  Successfully applied ${file}`);
    }

    console.log('\n✅ All migrations applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
