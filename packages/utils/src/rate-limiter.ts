interface Bucket {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets = new Map<string, Bucket>();

  constructor(
    private readonly maxTokens: number,
    private readonly refillRate: number,
    private readonly refillIntervalMs: number,
  ) {}

  consume(key: string, tokens = 1): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    const elapsed = now - bucket.lastRefill;
    const refillTokens = Math.floor(elapsed / this.refillIntervalMs) * this.refillRate;
    if (refillTokens > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + refillTokens);
      bucket.lastRefill = now;
    }

    if (bucket.tokens < tokens) {
      return false;
    }

    bucket.tokens -= tokens;
    return true;
  }

  getRemainingTokens(key: string): number {
    const bucket = this.buckets.get(key);
    if (!bucket) return this.maxTokens;
    return bucket.tokens;
  }

  reset(key: string): void {
    this.buckets.delete(key);
  }

  clear(): void {
    this.buckets.clear();
  }
}
