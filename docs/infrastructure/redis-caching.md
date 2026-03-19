# Redis Caching System
# UPSTASH FREE TIER (10,000 commands/day)

## Setup Upstash Redis
1. Go to https://upstash.com/
2. Sign up for FREE plan
3. Create Redis database
4. Get connection details (REST URL & Token)

## Environment Variables
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Redis Client Configuration
# src/shared/utils/redis.ts
```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class CacheService {
  // Simple key-value cache
  static async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  static async set(key: string, value: string, ttl: number = 3600): Promise<boolean> {
    try {
      await redis.set(key, value, { ex: ttl });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }
  
  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }
  
  // Pattern-based deletion
  static async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return keys.length;
    } catch (error) {
      console.error('Cache pattern delete error:', error);
      return 0;
    }
  }
  
  // Hash operations for complex data
  static async hget(key: string, field: string): Promise<string | null> {
    try {
      return await redis.hget(key, field);
    } catch (error) {
      console.error('Cache hget error:', error);
      return null;
    }
  }
  
  static async hset(key: string, field: string, value: string, ttl: number = 3600): Promise<boolean> {
    try {
      await redis.hset(key, field, value);
      await redis.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Cache hset error:', error);
      return false;
    }
  }
  
  // List operations for queues
  static async lpush(key: string, value: string): Promise<number> {
    try {
      return await redis.lpush(key, value);
    } catch (error) {
      console.error('Cache lpush error:', error);
      return 0;
    }
  }
  
  static async rpop(key: string): Promise<string | null> {
    try {
      return await redis.rpop(key);
    } catch (error) {
      console.error('Cache rpop error:', error);
      return null;
    }
  }
  
  // Cache warming
  static async warmup(): Promise<void> {
    console.log('🔥 Warming up cache...');
    
    // Cache popular properties
    await this.set('popular:properties', JSON.stringify([]), 1800);
    
    // Cache search suggestions
    await this.set('search:suggestions', JSON.stringify([]), 3600);
    
    // Cache user preferences
    await this.set('user:preferences:default', JSON.stringify({
      theme: 'light',
      language: 'en',
      notifications: true
    }), 86400);
    
    console.log('✅ Cache warmed up');
  }
}

export default redis;
```

## Cache Middleware
# src/shared/middleware/cache.ts
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from '@/shared/utils/redis';

interface CacheConfig {
  ttl?: number;
  keyGenerator?: (req: NextRequest) => string;
  varyHeaders?: string[];
}

export function withCache(config: CacheConfig = {}) {
  return async (request: NextRequest, handler: () => Promise<NextResponse>) => {
    // Skip cache for non-GET requests
    if (request.method !== 'GET') {
      return handler();
    }
    
    // Generate cache key
    const cacheKey = config.keyGenerator 
      ? config.keyGenerator(request)
      : generateDefaultCacheKey(request);
    
    // Try to get from cache
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      const response = NextResponse.json(JSON.parse(cached));
      response.headers.set('X-Cache', 'HIT');
      response.headers.set('X-Cache-Key', cacheKey);
      return response;
    }
    
    // Execute handler
    const response = await handler();
    
    // Cache successful responses
    if (response.status === 200) {
      const responseData = await response.json();
      await CacheService.set(cacheKey, JSON.stringify(responseData), config.ttl || 300);
      
      // Return with cache headers
      const newResponse = NextResponse.json(responseData);
      newResponse.headers.set('X-Cache', 'MISS');
      newResponse.headers.set('X-Cache-Key', cacheKey);
      newResponse.headers.set('Cache-Control', `public, max-age=${config.ttl || 300}`);
      return newResponse;
    }
    
    return response;
  };
}

function generateDefaultCacheKey(request: NextRequest): string {
  const url = new URL(request.url);
  const headers = request.headers;
  
  // Include user agent for personalization
  const userAgent = headers.get('user-agent') || '';
  const userId = headers.get('x-user-id') || 'anonymous';
  
  return `cache:${url.pathname}:${url.search}:${userId}:${hashString(userAgent)}`;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}
```

## Property Caching Service
# src/services/property-service/utils/cache.ts
```typescript
import { CacheService } from '@/shared/utils/redis';
import type { Property } from '@/shared/types';

export class PropertyCacheService {
  // Cache property listings
  static async cacheProperties(
    properties: Property[], 
    filters: any, 
    ttl: number = 300
  ): Promise<void> {
    const cacheKey = `properties:${JSON.stringify(filters)}`;
    await CacheService.set(cacheKey, JSON.stringify(properties), ttl);
  }
  
  // Get cached properties
  static async getCachedProperties(filters: any): Promise<Property[] | null> {
    const cacheKey = `properties:${JSON.stringify(filters)}`;
    const cached = await CacheService.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }
  
  // Cache single property
  static async cacheProperty(property: Property, ttl: number = 600): Promise<void> {
    await CacheService.set(`property:${property.id}`, JSON.stringify(property), ttl);
  }
  
  // Get cached property
  static async getCachedProperty(id: string): Promise<Property | null> {
    const cached = await CacheService.get(`property:${id}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  // Cache search results
  static async cacheSearchResults(
    query: string, 
    results: Property[], 
    ttl: number = 1800
  ): Promise<void> {
    await CacheService.set(`search:${query}`, JSON.stringify(results), ttl);
  }
  
  // Get cached search results
  static async getCachedSearchResults(query: string): Promise<Property[] | null> {
    const cached = await CacheService.get(`search:${query}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  // Invalidate property caches
  static async invalidatePropertyCaches(propertyId?: string): Promise<void> {
    if (propertyId) {
      // Invalidate specific property
      await CacheService.del(`property:${propertyId}`);
    }
    
    // Invalidate all property listings
    await CacheService.delPattern('properties:*');
    
    // Invalidate search results
    await CacheService.delPattern('search:*');
    
    console.log(`🗑️ Invalidated property caches${propertyId ? ` for ${propertyId}` : ''}`);
  }
  
  // Cache popular properties
  static async cachePopularProperties(properties: Property[]): Promise<void> {
    await CacheService.set('popular:properties', JSON.stringify(properties), 3600);
  }
  
  // Get popular properties
  static async getPopularProperties(): Promise<Property[]> {
    const cached = await CacheService.get('popular:properties');
    return cached ? JSON.parse(cached) : [];
  }
  
  // Cache user favorites
  static async cacheUserFavorites(userId: string, propertyIds: string[]): Promise<void> {
    await CacheService.set(`user:${userId}:favorites`, JSON.stringify(propertyIds), 1800);
  }
  
  // Get user favorites
  static async getUserFavorites(userId: string): Promise<string[]> {
    const cached = await CacheService.get(`user:${userId}:favorites`);
    return cached ? JSON.parse(cached) : [];
  }
}
```

## Usage in API Routes
# src/services/property-service/routes/properties.ts
```typescript
import { NextRequest } from 'next/server';
import { PropertyController } from '../controllers/property.controller';
import { withCache } from '@/shared/middleware/cache';
import { PropertyCacheService } from '../utils/cache';

export async function GET(request: NextRequest) {
  return withCache({
    ttl: 300, // 5 minutes
    keyGenerator: (req) => `properties:${new URL(req.url).search}`
  })(request, async () => {
    return PropertyController.getProperties(request);
  });
}

export async function POST(request: NextRequest) {
  const response = await PropertyController.createProperty(request);
  
  // Invalidate caches on successful creation
  if (response.status === 201) {
    await PropertyCacheService.invalidatePropertyCaches();
  }
  
  return response;
}
```

## Cache Analytics
# src/shared/utils/cache-analytics.ts
```typescript
import { CacheService } from './redis';

export class CacheAnalytics {
  // Track cache hits/misses
  static async trackCacheHit(key: string): Promise<void> {
    await CacheService.hincrby('analytics:cache:hits', key, 1);
    await CacheService.hincrby('analytics:cache:hits:total', 'count', 1);
  }
  
  static async trackCacheMiss(key: string): Promise<void> {
    await CacheService.hincrby('analytics:cache:misses', key, 1);
    await CacheService.hincrby('analytics:cache:misses:total', 'count', 1);
  }
  
  // Get cache statistics
  static async getCacheStats(): Promise<{
    hits: number;
    misses: number;
    hitRate: number;
    topHitKeys: Array<{ key: string; count: number }>;
    topMissKeys: Array<{ key: string; count: number }>;
  }> {
    const hits = await CacheService.hget('analytics:cache:hits:total', 'count');
    const misses = await CacheService.hget('analytics:cache:misses:total', 'count');
    
    const hitCount = parseInt(hits || '0');
    const missCount = parseInt(misses || '0');
    const total = hitCount + missCount;
    const hitRate = total > 0 ? (hitCount / total) * 100 : 0;
    
    return {
      hits: hitCount,
      misses: missCount,
      hitRate: Math.round(hitRate * 100) / 100,
      topHitKeys: [], // Implement if needed
      topMissKeys: [] // Implement if needed
    };
  }
  
  // Reset analytics
  static async resetAnalytics(): Promise<void> {
    await CacheService.delPattern('analytics:cache:*');
  }
}
```

## Installation
```bash
# Install Upstash Redis client
npm install @upstash/redis

# Add to package.json
npm install @upstash/redis
```

## Testing Cache
# scripts/test-cache.js
```javascript
const { CacheService } = require('./src/shared/utils/redis');

async function testCache() {
  console.log('🧪 Testing Redis Cache...');
  
  // Test set/get
  await CacheService.set('test:key', 'test:value', 60);
  const value = await CacheService.get('test:key');
  console.log('✅ Set/Get test:', value === 'test:value');
  
  // Test pattern deletion
  await CacheService.set('test:pattern:1', 'value1', 60);
  await CacheService.set('test:pattern:2', 'value2', 60);
  const deleted = await CacheService.delPattern('test:pattern:*');
  console.log('✅ Pattern deletion test:', deleted === 2);
  
  console.log('🎉 Cache tests completed');
}

testCache().catch(console.error);
```
