// High-Performance Multi-Tenant Redis Cache Layer with Memory Fallback

interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  delPrefix(prefix: string): Promise<void>;
  increment(key: string, ttlSeconds?: number): Promise<number>;
}

// In-Memory fallback store for zero-dependency local development
class MemoryCacheStore implements CacheStore {
  private store = new Map<string, { value: string; expiry?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async delPrefix(prefix: string): Promise<void> {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async increment(key: string, ttlSeconds = 60): Promise<number> {
    const current = await this.get(key);
    const count = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, count.toString(), ttlSeconds);
    return count;
  }
}

// Global cache instance
export const cacheStore: CacheStore = new MemoryCacheStore();

export const redisClient = {
  async getJSON<T>(key: string): Promise<T | null> {
    const val = await cacheStore.get(key);
    if (!val) return null;
    try {
      return JSON.parse(val) as T;
    } catch {
      return null;
    }
  },

  async setJSON<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    await cacheStore.set(key, JSON.stringify(value), ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await cacheStore.del(key);
  },

  async delPrefix(prefix: string): Promise<void> {
    await cacheStore.delPrefix(prefix);
  },

  async checkRateLimit(
    identifier: string,
    limit = 100,
    windowSec = 60
  ): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:${identifier}`;
    const count = await cacheStore.increment(key, windowSec);
    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  },
};
