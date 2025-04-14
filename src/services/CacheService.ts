
type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

interface CacheOptions {
  ttl?: number; // time to live in milliseconds
  tags?: string[]; // tags for invalidating related entries
}

interface CacheMap {
  [key: string]: {
    entry: CacheEntry<any>;
    options: CacheOptions;
  };
}

interface TagMap {
  [tag: string]: string[]; // keys associated with this tag
}

/**
 * Enhanced cache service with tag-based invalidation and TTL support
 */
export class CacheService {
  private static instance: CacheService;
  private cache: CacheMap = {};
  private tagMap: TagMap = {};
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default TTL
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }
  
  /**
   * Set cache entry
   */
  public set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now()
    };
    
    this.cache[key] = {
      entry,
      options: {
        ttl: options.ttl || this.defaultTTL,
        tags: options.tags || []
      }
    };
    
    // Update tag mappings
    if (options.tags) {
      options.tags.forEach(tag => {
        if (!this.tagMap[tag]) {
          this.tagMap[tag] = [];
        }
        
        if (!this.tagMap[tag].includes(key)) {
          this.tagMap[tag].push(key);
        }
      });
    }
  }
  
  /**
   * Get cache entry if it exists and hasn't expired
   */
  public get<T>(key: string): T | null {
    const cacheItem = this.cache[key];
    
    if (!cacheItem) {
      return null;
    }
    
    const { entry, options } = cacheItem;
    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > options.ttl!) {
      // Remove expired entry
      delete this.cache[key];
      
      // Clean up tag mappings
      if (options.tags) {
        options.tags.forEach(tag => {
          if (this.tagMap[tag]) {
            this.tagMap[tag] = this.tagMap[tag].filter(k => k !== key);
            if (this.tagMap[tag].length === 0) {
              delete this.tagMap[tag];
            }
          }
        });
      }
      
      return null;
    }
    
    return entry.data as T;
  }
  
  /**
   * Check if key exists in cache and hasn't expired
   */
  public has(key: string): boolean {
    return this.get(key) !== null;
  }
  
  /**
   * Delete a specific cache entry
   */
  public delete(key: string): void {
    const cacheItem = this.cache[key];
    if (!cacheItem) return;
    
    // Clean up tag mappings
    const { options } = cacheItem;
    if (options.tags) {
      options.tags.forEach(tag => {
        if (this.tagMap[tag]) {
          this.tagMap[tag] = this.tagMap[tag].filter(k => k !== key);
          if (this.tagMap[tag].length === 0) {
            delete this.tagMap[tag];
          }
        }
      });
    }
    
    // Delete the entry
    delete this.cache[key];
  }
  
  /**
   * Invalidate all cache entries with a specific tag
   */
  public invalidateTag(tag: string): void {
    const keys = this.tagMap[tag] || [];
    keys.forEach(key => this.delete(key));
  }
  
  /**
   * Clear all cache entries
   */
  public clear(): void {
    this.cache = {};
    this.tagMap = {};
  }
  
  /**
   * Set default TTL for cache entries
   */
  public setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }
  
  /**
   * Get or set cache entry (if not exists)
   */
  public async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const cachedData = this.get<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    const data = await fetcher();
    this.set(key, data, options);
    return data;
  }
  
  /**
   * Remove all expired entries
   */
  public cleanup(): void {
    const now = Date.now();
    
    Object.keys(this.cache).forEach(key => {
      const { entry, options } = this.cache[key];
      
      if (now - entry.timestamp > options.ttl!) {
        this.delete(key);
      }
    });
  }
}

export const cacheService = CacheService.getInstance();
