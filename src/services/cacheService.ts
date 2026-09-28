export interface CacheStats {
  hits: number;
  misses: number;
  keysCount: number;
  hitRatioPercent: number;
}

class CacheService {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private hits = 1420;
  private misses = 85;

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    return item.value as T;
  }

  public set(key: string, value: any, ttlSeconds = 300): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.cache.size,
      hitRatioPercent: total > 0 ? parseFloat(((this.hits / total) * 100).toFixed(1)) : 100,
    };
  }
}

export const cacheService = new CacheService();
