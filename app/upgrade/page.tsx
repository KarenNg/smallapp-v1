"use client";

import { useState } from "react";
import Link from "next/link";

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();

    if (!res.ok || !data.url) {
      setError(data.error || "Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <main className="max-w-lg mx-auto p-8 space-y-8">
      <Link href="/leads" className="text-sm text-neutral-500 hover:underline">
        ← Back to leads
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">You&apos;ve reached the free limit</h1>
        <p className="text-neutral-600">
          The free plan includes up to 5 leads. Upgrade to Pro for unlimited leads and touchpoints.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 p-6 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Pro</p>
          <p className="text-4xl font-bold mt-1">
            $29 <span className="text-lg font-normal text-neutral-500">one-time</span>
          </p>
        </div>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li>✓ Unlimited leads</li>
          <li>✓ Unlimited touchpoint logging</li>
          <li>✓ Full timeline history</li>
          <li>✓ All future updates</li>
        </ul>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Redirecting to checkout..." : "Upgrade to Pro — $29"}
        </button>
        <p className="text-xs text-neutral-400 text-center">
          Secure payment via Stripe. No subscription — pay once.
        </p>
      </div>
    </main>
  );
}
