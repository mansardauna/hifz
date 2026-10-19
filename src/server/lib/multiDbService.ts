'use strict';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import { Client as PgClient } from 'pg';

export type DatabaseEngine = 'mysql' | 'postgres' | 'supabase';

export interface MysqlConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
}

export interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password?: string;
  ssl?: boolean;
}

export interface SupabaseConfig {
  url: string;
  anonKey?: string;
  serviceRoleKey?: string;
  dbPassword?: string;
  connectionString?: string;
}

export interface DatabaseConfig {
  engine: DatabaseEngine;
  mysql?: MysqlConfig;
  postgres?: PostgresConfig;
  supabase?: SupabaseConfig;
  updatedAt?: string;
}

export interface ConnectionTestResult {
  connected: boolean;
  engine: DatabaseEngine;
  message?: string;
  error?: string;
  latencyMs?: number;
}

let cachedConfig: DatabaseConfig | null | undefined;
const TEST_TIMEOUT_MS = 8000;

function configFilePath(): string {
  return path.join(process.cwd(), 'data', 'database.config.json');
}

/**
 * Load Database Configuration from file or environment variables
 */
export async function loadDatabaseConfig(): Promise<DatabaseConfig | null> {
  if (cachedConfig !== undefined) return cachedConfig;

  // 1. Try reading data/database.config.json
  try {
    const raw = await fs.readFile(configFilePath(), 'utf8');
    const parsed = JSON.parse(raw) as DatabaseConfig;
    if (parsed && (parsed.engine === 'mysql' || parsed.engine === 'postgres' || parsed.engine === 'supabase')) {
      cachedConfig = parsed;
      return cachedConfig;
    }
  } catch (_e) {
    // File not found or unparseable
  }

  // 2. Parse active process.env.DATABASE_URL or specific env vars
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.POSTGRES_URL;
  if (dbUrl && !dbUrl.includes('placeholder')) {
    try {
      const u = new URL(dbUrl);
      const isMysql = u.protocol.startsWith('mysql');
      const isPg = u.protocol.startsWith('postgres');

      if (isMysql) {
        cachedConfig = {
          engine: 'mysql',
          mysql: {
            host: u.hostname || 'localhost',
            port: Number(u.port || 3306),
            database: u.pathname.replace(/^\//, '') || 'ankabit_lms',
            user: decodeURIComponent(u.username || 'root'),
            password: decodeURIComponent(u.password || ''),
          },
          updatedAt: new Date().toISOString(),
        };
        return cachedConfig;
      }

      if (isPg) {
        cachedConfig = {
          engine: 'postgres',
          postgres: {
            host: u.hostname || 'localhost',
            port: Number(u.port || 5432),
            database: u.pathname.replace(/^\//, '') || 'postgres',
            user: decodeURIComponent(u.username || 'postgres'),
            password: decodeURIComponent(u.password || ''),
            ssl: u.searchParams.get('sslmode') === 'require',
          },
          updatedAt: new Date().toISOString(),
        };
        return cachedConfig;
      }
    } catch (_e) {}
  }

  // 3. Fallback defaults to MySQL (standard XAMPP / local development)
  cachedConfig = {
    engine: 'mysql',
    mysql: {
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'ankabit_lms',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
    },
    updatedAt: new Date().toISOString(),
  };

  return cachedConfig;
}

/**
 * Save Database Configuration to persistent JSON storage (data/database.config.json)
 */
export async function saveDatabaseConfig(config: DatabaseConfig): Promise<void> {
  cachedConfig = {
    ...config,
    updatedAt: new Date().toISOString(),
  };

  const dir = path.join(process.cwd(), 'data');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(configFilePath(), JSON.stringify(cachedConfig, null, 2), { mode: 0o600 });
}

export function resetDatabaseConfigCache(): void {
  cachedConfig = undefined;
}

/**
 * Build standard Prisma / connection string URL from config
 */
export function buildDatabaseUrl(cfg: DatabaseConfig): string {
  if (cfg.engine === 'mysql' && cfg.mysql) {
    const { host, port, database, user, password } = cfg.mysql;
    const authPart = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}` : encodeURIComponent(user);
    return `mysql://${authPart}@${host}:${port || 3306}/${database}`;
  }

  if (cfg.engine === 'postgres' && cfg.postgres) {
    const { host, port, database, user, password, ssl } = cfg.postgres;
    const authPart = password ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}` : encodeURIComponent(user);
    const sslParam = ssl ? '?sslmode=require' : '';
    return `postgresql://${authPart}@${host}:${port || 5432}/${database}${sslParam}`;
  }

  if (cfg.engine === 'supabase' && cfg.supabase) {
    // If Supabase project URL is provided, format connection to pooling port 6543 / 5432
    const url = cfg.supabase.url.trim();
    try {
      const u = new URL(url);
      const host = u.hostname; // e.g. [project-ref].supabase.co
      const projectRef = host.split('.')[0];
      const password = cfg.supabase.dbPassword || cfg.supabase.serviceRoleKey || '';
      return `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require`;
    } catch (_e) {
      return cfg.supabase.url;
    }
  }

  return process.env.DATABASE_URL || 'mysql://root:@localhost:3306/ankabit_lms';
}

function timeoutReject(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Database connection check timed out after ${ms}ms`)), ms);
  });
}

/**
 * Test Connection against live database target without mutating data
 */
export async function testDatabaseConnection(
  engine: DatabaseEngine,
  params: {
    mysql?: Partial<MysqlConfig>;
    postgres?: Partial<PostgresConfig>;
    supabase?: Partial<SupabaseConfig>;
  }
): Promise<ConnectionTestResult> {
  const start = Date.now();

  // ---- 1. MYSQL ENGINE ----
  if (engine === 'mysql') {
    const cfg = params.mysql || {};
    const host = (cfg.host || 'localhost').trim();
    const port = Number(cfg.port || 3306);
    const database = (cfg.database || 'ankabit_lms').trim();
    const user = (cfg.user || 'root').trim();
    const password = cfg.password || '';

    let conn: mysql.Connection | null = null;
    try {
      try {
        conn = await Promise.race([
          mysql.createConnection({
            host,
            port,
            database,
            user,
            password,
            connectTimeout: TEST_TIMEOUT_MS,
          }),
          timeoutReject(TEST_TIMEOUT_MS),
        ]);
      } catch (connErr: any) {
        // If database does not exist, connect without database to auto-create
        const errMsg = connErr?.message || '';
        if (errMsg.includes('ER_BAD_DB_ERROR') || errMsg.includes('Unknown database')) {
          const rootConn = await Promise.race([
            mysql.createConnection({
              host,
              port,
              user,
              password,
              connectTimeout: TEST_TIMEOUT_MS,
            }),
            timeoutReject(TEST_TIMEOUT_MS),
          ]);
          await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, '')}\``);
          await rootConn.end().catch(() => {});

          conn = await Promise.race([
            mysql.createConnection({
              host,
              port,
              database,
              user,
              password,
              connectTimeout: TEST_TIMEOUT_MS,
            }),
            timeoutReject(TEST_TIMEOUT_MS),
          ]);
        } else {
          throw connErr;
        }
      }

      await Promise.race([conn.query('SELECT 1'), timeoutReject(TEST_TIMEOUT_MS)]);
      const latencyMs = Date.now() - start;

      return {
        connected: true,
        engine: 'mysql',
        latencyMs,
        message: `MySQL connection verified (${host}:${port}/${database}) — ${latencyMs}ms response.`,
      };
    } catch (err: any) {
      return {
        connected: false,
        engine: 'mysql',
        error: err?.message || 'Failed to connect to MySQL database server.',
      };
    } finally {
      await conn?.end().catch(() => {});
    }
  }

  // ---- 2. POSTGRESQL ENGINE ----
  if (engine === 'postgres') {
    const cfg = params.postgres || {};
    const host = (cfg.host || 'localhost').trim();
    const port = Number(cfg.port || 5432);
    const database = (cfg.database || 'postgres').trim();
    const user = (cfg.user || 'postgres').trim();
    const password = cfg.password || '';

    const client = new PgClient({
      host,
      port,
      database,
      user,
      password,
      connectionTimeoutMillis: TEST_TIMEOUT_MS,
      ssl: cfg.ssl ? { rejectUnauthorized: false } : undefined,
    });

    try {
      await Promise.race([client.connect(), timeoutReject(TEST_TIMEOUT_MS)]);
      await Promise.race([client.query('SELECT 1'), timeoutReject(TEST_TIMEOUT_MS)]);
      const latencyMs = Date.now() - start;

      return {
        connected: true,
        engine: 'postgres',
        latencyMs,
        message: `PostgreSQL connection verified (${host}:${port}/${database}) — ${latencyMs}ms response.`,
      };
    } catch (err: any) {
      return {
        connected: false,
        engine: 'postgres',
        error: err?.message || 'Failed to connect to PostgreSQL database server.',
      };
    } finally {
      await client.end().catch(() => {});
    }
  }

  // ---- 3. SUPABASE ENGINE ----
  if (engine === 'supabase') {
    const cfg = params.supabase || {};
    const url = (cfg.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const key = (cfg.serviceRoleKey || cfg.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
    const connStr = cfg.connectionString || process.env.POSTGRES_DATABASE_URL;

    // If connection string is provided, test via PostgreSQL driver first
    if (connStr) {
      const client = new PgClient({
        connectionString: connStr,
        connectionTimeoutMillis: TEST_TIMEOUT_MS,
        ssl: { rejectUnauthorized: false },
      });
      try {
        await Promise.race([client.connect(), timeoutReject(TEST_TIMEOUT_MS)]);
        await Promise.race([client.query('SELECT 1'), timeoutReject(TEST_TIMEOUT_MS)]);
        const latencyMs = Date.now() - start;
        return {
          connected: true,
          engine: 'supabase',
          latencyMs,
          message: `Supabase PostgreSQL connection verified — ${latencyMs}ms response.`,
        };
      } catch (pgErr: any) {
        // If PostgreSQL connection fails, try REST API if url & key exist
        if (!url || !key) {
          return {
            connected: false,
            engine: 'supabase',
            error: pgErr?.message || 'Failed to connect to Supabase PostgreSQL database.',
          };
        }
      } finally {
        await client.end().catch(() => {});
      }
    }

    if (!url) {
      return { connected: false, engine: 'supabase', error: 'Supabase project URL is required.' };
    }
    if (!key) {
      return { connected: false, engine: 'supabase', error: 'Supabase Anon Key or Service Role Key is required.' };
    }

    try {
      const restEndpoint = `${url.replace(/\/$/, '')}/rest/v1/`;
      const res = await Promise.race([
        fetch(restEndpoint, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        }),
        timeoutReject(TEST_TIMEOUT_MS),
      ]);

      const latencyMs = Date.now() - start;
      if (res.ok || res.status === 200 || res.status === 404) {
        return {
          connected: true,
          engine: 'supabase',
          latencyMs,
          message: `Supabase connection verified (${url}) — ${latencyMs}ms response.`,
        };
      } else {
        return {
          connected: false,
          engine: 'supabase',
          error: `Supabase returned HTTP ${res.status}: ${res.statusText}`,
        };
      }
    } catch (err: any) {
      return {
        connected: false,
        engine: 'supabase',
        error: err?.message || 'Failed to reach Supabase project API.',
      };
    }
  }

  return {
    connected: false,
    engine,
    error: `Unsupported database engine: ${engine}`,
  };
}
