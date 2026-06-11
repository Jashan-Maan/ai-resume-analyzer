import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Analyze route — 5 requests per 5 hour
// Most strict because Gemini API has limited quota
export const analyzeLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 h"),
  analytics: true,
  prefix: "kira:analyze",
});

// Interview route — 5 requests per 5 hour
// Gemini 3 flash gives 20 requests per day, so 5 per 5hours is safe
export const interviewLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "5 h"),
  analytics: true,
  prefix: "kira:interview",
});

// Jobs route — 100 requests per 15 minutes
// CRUD operations are cheap, be generous
export const jobsLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "15 m"),
  analytics: true,
  prefix: "kira:jobs",
});

// Helper function — cleaner to use in routes
export async function checkLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const { success, remaining, reset } = await limiter.limit(identifier);
  return { allowed: success, remaining, reset };
}
