
import { DocumentInsight } from './types';

// Simple cache implementation for document insights
const insightCache = new Map<string, {
  data: any;
  timestamp: number;
}>();

export const DocumentInsightCache = {
  get(key: string, maxAge: number = 5 * 60 * 1000): any {
    const cached = insightCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      console.log(`Cache hit for ${key}`);
      return cached.data;
    }
    console.log(`Cache miss for ${key}`);
    return null;
  },
  
  set(key: string, data: any): void {
    insightCache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  clear(key?: string): void {
    if (key) {
      insightCache.delete(key);
    } else {
      insightCache.clear();
    }
    console.log('Cache cleared', key ? `for key: ${key}` : 'completely');
  },
  
  getStatus(): { keys: string[], size: number } {
    return {
      keys: Array.from(insightCache.keys()),
      size: insightCache.size
    };
  }
};
