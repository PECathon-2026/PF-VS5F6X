import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { getDatabasePool, closeDatabasePool } from './pool';

/**
 * Migration runner.
 * Applies all .sql files in backend/migrations in alphabetical order.
 * Tracks applied migrations in a _migrations table to ensure safe re-execution.
 */
export async function runMigrations(customPool?: Pool): Promise<void> {
  console.log('--- Starting SmallWebReader Database Migrations ---');
  let pool: Pool;
  try {
    pool = customPool || getDatabasePool();
  } catch (err) {
    console.error('Cannot connect to database for migrations:', err instanceof Error ? err.message : err);
    if (!customPool) process.exit(1);
    throw err;
  }

  const migrationsDir = path.resolve(__dirname, '../../migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found at: ${migrationsDir}`);
    if (!customPool) process.exit(1);
    throw new Error('Migrations directory not found');
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found.');
    if (!customPool) await closeDatabasePool();
    return;
  }

  const client = await pool.connect();
  try {
    // Ensure migrations ledger table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    for (const file of files) {
      const alreadyApplied = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [file]);
      if (alreadyApplied.rows.length > 0) {
        console.log(`Skipping already applied migration: ${file}`);
        continue;
      }

      console.log(`Executing migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Successfully applied: ${file}`);
    }
    console.log('--- All migrations applied successfully ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed, transaction rolled back:', err);
    if (!customPool) process.exit(1);
    throw err;
  } finally {
    client.release();
    if (!customPool) await closeDatabasePool();
  }
}
