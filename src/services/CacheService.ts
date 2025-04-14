
/**
 * A simple in-memory cache service with tag-based invalidation
 */

type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Tags for grouping cache entries for invalidation
};

type CacheEntry<T> = {
  value: T;
  expires: number;
  tags: string[];
};

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private tagMap: Map<string, Set<string>> = new Map(); // Maps tags to cache keys

  /**
   * Get a value from the cache
   * @param key The cache key
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if the entry has expired
    if (entry.expires && entry.expires < Date.now()) {
      this.cache.delete(key);
      this.removeKeyFromTags(key);
      return null;
    }
    
    return entry.value as T;
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param options Optional cache settings
   */
  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || 0; // 0 means no expiration
    const tags = options.tags || [];
    
    const entry: CacheEntry<T> = {
      value,
      expires: ttl ? Date.now() + ttl : 0,
      tags
    };
    
    this.cache.set(key, entry);
    
    // Associate key with tags
    tags.forEach(tag => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)!.add(key);
    });
  }

  /**
   * Get a cached item or set it if not found/expired
   * @param key Cache key
   * @param fn Factory function to generate the value if not in cache
   * @param options Cache options
   */
  async getOrSet<T>(
    key: string, 
    fn: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;
    
    const value = await fn();
    this.set(key, value, options);
    return value;
  }

  /**
   * Remove an item from the cache
   * @param key The cache key
   */
  remove(key: string): boolean {
    if (this.cache.has(key)) {
      this.removeKeyFromTags(key);
      return this.cache.delete(key);
    }
    return false;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.tagMap.clear();
  }

  /**
   * Invalidate cache entries associated with a tag
   * @param tag The tag to invalidate
   */
  invalidateTag(tag: string): void {
    const keys = this.tagMap.get(tag);
    if (!keys) return;
    
    keys.forEach(key => {
      this.cache.delete(key);
    });
    
    // Clear the tag set
    this.tagMap.delete(tag);
  }

  /**
   * Add tags to an existing cache entry
   * @param key The cache key
   * @param tags Tags to add
   */
  addTags(key: string, tags: string[]): void {
    const entry = this.cache.get(key);
    if (!entry) return;
    
    tags.forEach(tag => {
      entry.tags.push(tag);
      
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)!.add(key);
    });
  }
  
  /**
   * Remove a key from all tag mappings it belongs to
   * @param key The cache key
   */
  private removeKeyFromTags(key: string): void {
    const entry = this.cache.get(key);
    if (!entry) return;
    
    entry.tags.forEach(tag => {
      const keys = this.tagMap.get(tag);
      if (keys) {
        keys.delete(key);
        if (keys.size === 0) {
          this.tagMap.delete(tag);
        }
      }
    });
  }
}

export const cacheService = new CacheService();
