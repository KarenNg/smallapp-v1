import Stripe from "stripe";

// Lazily instantiated so a missing key doesn't crash the build.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2025-05-28.basil" });
  }
  return _stripe;
}
