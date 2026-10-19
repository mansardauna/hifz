'use strict';
import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Validates if a provided Supabase URL is well-formed and active
 */
export function isValidSupabaseUrl(url?: string): boolean {
  if (!url) return false;
  if (url.includes('placeholder')) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Resolve current active database engine (mysql, postgres, or supabase)
 */
export function getActiveDatabaseEngine(): 'mysql' | 'postgres' | 'supabase' {
  try {
    const configPath = path.join(process.cwd(), 'data', 'database.config.json');
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf8');
      const cfg = JSON.parse(raw);
      if (cfg?.engine === 'supabase') return 'supabase';
      if (cfg?.engine === 'mysql') return 'mysql';
      if (cfg?.engine === 'postgres') return 'postgres';
    }
  } catch (_e) {}

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_DATABASE_URL || process.env.POSTGRES_URL || '';
  if (dbUrl.startsWith('mysql')) return 'mysql';
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    return 'supabase';
  }
  if (dbUrl.startsWith('postgres')) return 'postgres';
  return 'mysql';
}

// Configurable timeout fetch for Supabase (default 15s) to prevent hanging serverless lambdas
function fastFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const timeoutMs = Number(process.env.SUPABASE_FETCH_TIMEOUT_MS) || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const anySignalHelper = AbortSignal as unknown as { any?: (signals: (AbortSignal | null | undefined)[]) => AbortSignal };
  const signal = init?.signal
    ? (anySignalHelper.any ? anySignalHelper.any([init.signal, controller.signal]) : controller.signal)
    : controller.signal;

  return fetch(input, { ...init, signal }).finally(() => clearTimeout(timeoutId));
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tzvvfzpnwlytjpnopwjo.supabase.co';
const rawKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_hAXtQhWjNapeYf9fmGLLSQ_1Pc8LJmU';

export const isSupabaseConfigured = isValidSupabaseUrl(rawUrl) && Boolean(rawKey && !rawKey.includes('placeholder'));

/**
 * Real Supabase Client instance (PostgreSQL cloud runtime)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(rawUrl, rawKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { fetch: fastFetch },
    })
  : null;

export default supabase;
