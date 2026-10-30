import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Ensure backend/.env is loaded reliably regardless of current working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface DatabaseConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean | { rejectUnauthorized: boolean; ca?: string };
  maxPoolSize: number;
}

export function validateDatabaseConfig(env: NodeJS.ProcessEnv = process.env): {
  configured: boolean;
  config?: DatabaseConfig;
  error?: string;
} {
  const connectionString = env.DATABASE_URL;

  // If DATABASE_URL is not set and individual host/user variables aren't set, DB is unconfigured
  if (!connectionString && !env.PGHOST && !env.PGDATABASE) {
    return { configured: false };
  }

  const maxPoolSize = parseInt(env.DATABASE_MAX_POOL_SIZE || '10', 10);
  if (isNaN(maxPoolSize) || maxPoolSize <= 0) {
    return { configured: false, error: 'DATABASE_MAX_POOL_SIZE must be a positive integer' };
  }

  const useSsl = env.DATABASE_SSL === 'true';
  let ssl: boolean | { rejectUnauthorized: boolean; ca?: string } = false;

  if (useSsl) {
    const rejectUnauthorized = env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
    const caCertPath = env.DATABASE_SSL_CA_CERT_PATH;

    if (caCertPath) {
      // Resolve path relative to backend root if relative
      const resolvedCertPath = path.isAbsolute(caCertPath)
        ? caCertPath
        : path.resolve(__dirname, '../../', caCertPath);

      if (!fs.existsSync(resolvedCertPath)) {
        return {
          configured: false,
          error: `Specified SSL CA certificate file not found: ${caCertPath}`,
        };
      }

      const ca = fs.readFileSync(resolvedCertPath, 'utf8');
      ssl = {
        rejectUnauthorized: true,
        ca,
      };
    } else {
      ssl = {
        rejectUnauthorized,
      };
    }
  }

  if (connectionString) {
    return {
      configured: true,
      config: {
        connectionString,
        ssl,
        maxPoolSize,
      },
    };
  }

  return {
    configured: true,
    config: {
      host: env.PGHOST,
      port: env.PGPORT ? parseInt(env.PGPORT, 10) : 5432,
      user: env.PGUSER,
      password: env.PGPASSWORD,
      database: env.PGDATABASE,
      ssl,
      maxPoolSize,
    },
  };
}

/**
 * Derives a privacy-preserving SHA-256 HMAC representation of an IP address.
 * Never stores or logs raw client IPs.
 */
export function hashClientIp(rawIp: string, secret: string): string {
  if (!secret) {
    throw new Error('HMAC secret is required to hash client IP');
  }
  return crypto.createHmac('sha256', secret).update(rawIp).digest('hex');
}
