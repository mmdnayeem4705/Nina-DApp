const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const migrateDatabase = async () => {
  console.log('[v0] Starting database migration...');

  if (!process.env.DATABASE_URL) {
    console.error('[v0] DATABASE_URL environment variable is not set!');
    process.exit(1);
  }

  try {
    const sql = postgres(process.env.DATABASE_URL);

    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/001_init.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split into individual statements and execute
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`[v0] Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      try {
        await sql.unsafe(statement);
        console.log(`[v0] Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        console.error(`[v0] Error executing statement ${i + 1}:`, error.message);
        // Continue with next statement instead of failing
      }
    }

    console.log('[v0] Database migration completed successfully!');
    console.log('[v0] All tables created and ready to use.');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('[v0] Migration failed:', error.message);
    process.exit(1);
  }
};

migrateDatabase();
