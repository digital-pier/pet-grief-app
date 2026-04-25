// In-memory rate limiter — works for single-instance deployments.
// For multi-instance / serverless, replace with an Upstash Redis-backed limiter.
type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key    Unique key (e.g. "login:1.2.3.4")
 * @param limit  Max requests allowed within the window
 * @param windowMs  Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
