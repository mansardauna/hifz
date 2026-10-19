import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Resolve active database URL from data/database.config.json or environment variables
 * Supports MySQL (XAMPP / AWS Aurora), PostgreSQL, and Supabase Cloud.
 */
function resolveActiveDatabaseUrl(): string | undefined {
  // Ensure DIRECT_URL is set if POSTGRES_DIRECT_URL is available
  if (!process.env.DIRECT_URL && process.env.POSTGRES_DIRECT_URL) {
    process.env.DIRECT_URL = process.env.POSTGRES_DIRECT_URL;
  }

  try {
    const configPath = path.join(process.cwd(), 'data', 'database.config.json');
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      const cfg = JSON.parse(raw);
      if (cfg.engine === 'mysql' && cfg.mysql) {
        const { host, port, database, user, password } = cfg.mysql;
        const auth = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}` : encodeURIComponent(user);
        return `mysql://${auth}@${host}:${port || 3306}/${database}`;
      }
      if (cfg.engine === 'postgres' && cfg.postgres) {
        const { host, port, database, user, password, ssl } = cfg.postgres;
        const auth = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}` : encodeURIComponent(user);
        return `postgresql://${auth}@${host}:${port || 5432}/${database}${ssl ? '?sslmode=require' : ''}`;
      }
      if (cfg.engine === 'supabase') {
        if (cfg.supabase?.connectionString) return cfg.supabase.connectionString;
        if (process.env.POSTGRES_DATABASE_URL) return process.env.POSTGRES_DATABASE_URL;
        if (cfg.supabase?.url && cfg.supabase?.dbPassword) {
          try {
            const u = new URL(cfg.supabase.url);
            const projectRef = u.hostname.split('.')[0];
            return `postgresql://postgres.${projectRef}:${encodeURIComponent(cfg.supabase.dbPassword)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require`;
          } catch (_e) {}
        }
      }
    }
  } catch (_e) {
    // Fall back to environment variable
  }

  // Prioritize PostgreSQL / Supabase if specified or if running on Vercel with Postgres env
  if (process.env.DATABASE_ENGINE === 'supabase' || process.env.DATABASE_ENGINE === 'postgres') {
    return process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;
  }
  if (process.env.VERCEL && process.env.POSTGRES_DATABASE_URL) {
    return process.env.POSTGRES_DATABASE_URL;
  }

  return process.env.DATABASE_URL || process.env.POSTGRES_DATABASE_URL;
}

const activeUrl = resolveActiveDatabaseUrl();

// Enterprise Prisma Client Singleton with resilient multi-database connection lifecycle
export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    datasources: activeUrl ? { db: { url: activeUrl } } : undefined,
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Dynamically reconfigure Prisma with a new target database URL (MySQL, PostgreSQL, Supabase)
 */
export async function reconfigurePrismaDatabase(newDatabaseUrl: string): Promise<PrismaClient> {
  if (globalThis.prismaGlobal) {
    await globalThis.prismaGlobal.$disconnect().catch(() => {});
  }
  process.env.DATABASE_URL = newDatabaseUrl;
  const newClient = new PrismaClient({
    datasources: { db: { url: newDatabaseUrl } },
    log: ['error', 'warn'],
  });
  globalThis.prismaGlobal = newClient;
  return newClient;
}

export default prisma;
