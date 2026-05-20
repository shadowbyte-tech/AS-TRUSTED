/**
 * @file src/lib/redis.ts
 * Zero-dependency Upstash Redis client using REST API for maximum performance.
 * Falls back to in-memory/no-op gracefully if keys are missing (zero-crash).
 */

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

let warned = false;
function checkConfig(): boolean {
  if (!url || !token) {
    if (!warned) {
      console.warn("⚠️ Upstash Redis URL or Token is missing. Caching is disabled. Safe database fallback active.");
      warned = true;
    }
    return false;
  }
  return true;
}

/**
 * Gets a cached value by key.
 */
export async function redisGet(key: string): Promise<string | null> {
  if (!checkConfig()) return null;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result; // Upstash returns value in "result" field
  } catch (err) {
    console.error("Redis GET error:", err);
    return null;
  }
}

/**
 * Caches a string value with a TTL in seconds.
 */
export async function redisSet(key: string, value: string, ttlSeconds = 600): Promise<boolean> {
  if (!checkConfig()) return false;
  try {
    // Upstash REST SET with EX command: POST /set/key/value/EX/ttl
    // We encode parameters cleanly to support JSON values.
    const res = await fetch(`${url}/set/${key}/EX/${ttlSeconds}`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: value,
      cache: 'no-store'
    });
    return res.ok;
  } catch (err) {
    console.error("Redis SET error:", err);
    return false;
  }
}

/**
 * Invalidates all cache keys matching a glob pattern (e.g. properties:*).
 */
export async function redisInvalidatePattern(pattern: string): Promise<boolean> {
  if (!checkConfig()) return false;
  try {
    // 1. Get all matching keys
    const keysRes = await fetch(`${url}/keys/${pattern}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!keysRes.ok) return false;
    const keysData = await keysRes.json();
    const keys: string[] = keysData.result || [];

    if (keys.length === 0) return true;

    // 2. Delete all matching keys
    // Upstash allows POST /del with JSON array of keys
    const delRes = await fetch(`${url}/del`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(keys),
      cache: 'no-store'
    });
    return delRes.ok;
  } catch (err) {
    console.error("Redis Invalidate error:", err);
    return false;
  }
}
