/**
 * Versaly Flow - Performance Optimization Utilities (Phase 29)
 * LRU In-Memory Cache, Virtual Windowing Math, Debounce/Throttle, & Optimistic Sync
 */

import { CacheEntry, ContentItem } from '../types';

export class LruCache<T = any> {
  private capacity: number;
  private cache: Map<string, CacheEntry<T>>;
  private totalHits: number = 0;
  private totalMisses: number = 0;

  constructor(capacity: number = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.totalMisses++;
      return null;
    }

    // Check TTL
    if (entry.ttlMs !== 0 && (Date.now() - entry.cachedAt >= entry.ttlMs || entry.ttlMs < 0)) {
      this.cache.delete(key);
      this.totalMisses++;
      return null;
    }

    // Refresh LRU order (delete & re-insert)
    this.cache.delete(key);
    entry.hits++;
    this.cache.set(key, entry);
    this.totalHits++;
    return entry.data;
  }

  set(key: string, data: T, ttlMs: number = 60000): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest (first key in iteration)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const approxSizeBytes = JSON.stringify(data).length * 2;
    this.cache.set(key, {
      key,
      data,
      cachedAt: Date.now(),
      hits: 0,
      sizeBytes: approxSizeBytes,
      ttlMs
    });
  }

  clear(): void {
    this.cache.clear();
    this.totalHits = 0;
    this.totalMisses++;
  }

  getTelemetry() {
    const totalRequests = this.totalHits + this.totalMisses;
    const hitRatio = totalRequests > 0 ? (this.totalHits / totalRequests) * 100 : 100;
    let totalSizeBytes = 0;
    this.cache.forEach(entry => { totalSizeBytes += entry.sizeBytes; });

    return {
      size: this.cache.size,
      capacity: this.capacity,
      hits: this.totalHits,
      misses: this.totalMisses,
      hitRatio: Number(hitRatio.toFixed(1)),
      totalSizeBytes,
      entries: Array.from(this.cache.values())
    };
  }
}

// Global Singleton Query Cache
export const globalQueryCache = new LruCache<any>(150);

/**
 * High-performance Virtual Window Calculation
 * Calculates startIndex, endIndex, and padding offsets for rendering huge datasets in sub-millisecond budgets.
 */
export function calculateVirtualWindow({
  totalItems,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 3
}: {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}) {
  const totalHeight = totalItems * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleCount: Math.max(0, endIndex - startIndex + 1),
    totalHeight,
    offsetY
  };
}

/**
 * Debounce helper with instant cancel
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timer: any = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return debounced;
}

/**
 * Generates synthetic posts to stress-test virtualized feeds at scale
 */
export function generateSyntheticPosts(basePost: ContentItem, count: number): ContentItem[] {
  const platforms = ['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook', 'youtube'] as const;
  const stages = ['draft', 'internal_review', 'client_review', 'approved', 'scheduled', 'published'] as const;
  const themes = [
    'Safari Sunrise in Maasai Mara',
    'Kericho Purple Tea Harvest',
    'Nairobi Fintech Tech Meetup',
    'Naivasha Geothermal Green Power',
    'Swahili Coastal Cuisine Secrets',
    'Kilifi Sunset Catamaran Tour',
    'Mount Kenya High-Altitude Marathon',
    'Diani Beach Turtle Conservation'
  ];

  const results: ContentItem[] = [];
  for (let i = 0; i < count; i++) {
    const theme = themes[i % themes.length];
    const platform = platforms[i % platforms.length];
    const stage = stages[i % stages.length];
    const postNum = i + 1;

    results.push({
      ...basePost,
      id: `synthetic_post_${postNum}`,
      title: `[#${postNum}] ${theme}`,
      caption: `Real-time virtualized feed rendering demo for high-velocity Kenyan agency campaigns. Item #${postNum} running with zero frame drops. #VersalySpeed #KenyaDigital`,
      platforms: [platform],
      stage,
      scheduledDate: new Date(Date.now() + i * 3600000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - i * 60000).toISOString()
    });
  }
  return results;
}
