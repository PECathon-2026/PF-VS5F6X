import { Pool, PoolConfig } from 'pg';
import { validateDatabaseConfig, DatabaseConfig } from './config';

let pool: Pool | null = null;

export function getDatabasePool(customConfig?: DatabaseConfig): Pool {
  if (pool) {
    return pool;
  }

  const validation = customConfig ? { configured: true, config: customConfig } : validateDatabaseConfig();

  if (!validation.configured || !validation.config) {
    throw new Error(validation.error || 'Database is not configured. Please supply DATABASE_URL or PostgreSQL credentials.');
  }

  const cfg = validation.config;
  const poolConfig: PoolConfig = {
    max: cfg.maxPoolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (cfg.connectionString) {
    poolConfig.connectionString = cfg.connectionString;
  } else {
    poolConfig.host = cfg.host;
    poolConfig.port = cfg.port;
    poolConfig.user = cfg.user;
    poolConfig.password = cfg.password;
    poolConfig.database = cfg.database;
  }

  if (cfg.ssl) {
    poolConfig.ssl = cfg.ssl;
  }

  pool = new Pool(poolConfig);

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
  });

  return pool;
}

export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Deletes expired rate-limit records (older than their 24h retention limit).
 */
export async function cleanupExpiredRateLimits(clientPool?: Pool): Promise<number> {
  const p = clientPool || getDatabasePool();
  const res = await p.query('DELETE FROM rate_limits WHERE expires_at < NOW()');
  return res.rowCount ?? 0;
}
