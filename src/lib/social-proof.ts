/**
 * Deterministic "social proof" values derived from a product id.
 *
 * These are presentation-only signals (units sold, stock left, rating) used to
 * create the marketplace feel shoppers expect. They are stable per product so
 * the same product always shows the same numbers.
 */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface SocialProof {
  sold: number;
  soldLabel: string;
  stockLeft: number;
  almostGone: boolean;
  rating: number;
  reviews: number;
  viewing: number;
}

export function socialProof(id: string): SocialProof {
  const h = hash(id);
  const sold = 120 + (h % 9800);
  const stockLeft = 3 + ((h >> 5) % 40);
  const rating = 4.3 + ((h >> 9) % 7) / 10;
  const reviews = 40 + ((h >> 3) % 2400);
  const viewing = 12 + ((h >> 7) % 180);
  return {
    sold,
    soldLabel: sold >= 1000 ? `${(sold / 1000).toFixed(1)}K+ sold` : `${sold}+ sold`,
    stockLeft,
    almostGone: stockLeft <= 12,
    rating: Math.min(5, Math.round(rating * 10) / 10),
    reviews,
    viewing,
  };
}

/** Milliseconds remaining in the current rolling deal window (resets daily). */
export function dealCountdownTarget(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end.getTime();
}