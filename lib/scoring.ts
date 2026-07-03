import type { Touchpoint } from "./types";

export function computeScore(touchpoints: Touchpoint[]): number {
  const count = touchpoints.length;

  // Base: touchpoint_count × 10, max 50
  let score = Math.min(count * 10, 50);

  if (count > 0) {
    const sorted = [...touchpoints].sort(
      (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );
    const lastTouchDate = new Date(sorted[0].occurred_at);
    const daysSinceLast = (Date.now() - lastTouchDate.getTime()) / (1000 * 60 * 60 * 24);

    // Recency bonus
    if (daysSinceLast <= 3) score += 30;
    else if (daysSinceLast <= 7) score += 15;

    // Channel bonus: call or in-person in last 2 touches
    const lastTwo = sorted.slice(0, 2).map((t) => t.channel);
    if (lastTwo.some((c) => c === "call" || c === "in-person")) score += 10;
  }

  return Math.min(score, 100);
}
