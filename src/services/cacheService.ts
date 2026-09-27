import { redisClient } from '../lib/redis';
import { TenantConfig } from '../types';

const TENANT_CACHE_TTL = 60 * 30; // 30 minutes
const USER_SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export const cacheService = {
  // Tenant Configuration Caching
  async getTenant(subdomain: string): Promise<TenantConfig | null> {
    const key = `tenant:${subdomain.toLowerCase()}`;
    return redisClient.getJSON<TenantConfig>(key);
  },

  async setTenant(subdomain: string, config: TenantConfig): Promise<void> {
    const key = `tenant:${subdomain.toLowerCase()}`;
    await redisClient.setJSON(key, config, TENANT_CACHE_TTL);
  },

  async invalidateTenant(subdomain: string): Promise<void> {
    const key = `tenant:${subdomain.toLowerCase()}`;
    await redisClient.del(key);
  },

  // Auth User Session Caching
  async getSession<T>(token: string): Promise<T | null> {
    const key = `session:${token}`;
    return redisClient.getJSON<T>(key);
  },

  async setSession<T>(token: string, userData: T): Promise<void> {
    const key = `session:${token}`;
    await redisClient.setJSON(key, userData, USER_SESSION_TTL);
  },

  async invalidateSession(token: string): Promise<void> {
    const key = `session:${token}`;
    await redisClient.del(key);
  },

  // Global Tenant Invalidation
  async flushAllTenants(): Promise<void> {
    await redisClient.delPrefix('tenant:');
  },
};
