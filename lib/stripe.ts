import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  stripeClient = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  return stripeClient;
}

export type PaidTier = "companion" | "support_plus";

export function isPaidTier(value: unknown): value is PaidTier {
  return value === "companion" || value === "support_plus";
}

export function priceIdForTier(tier: PaidTier): string {
  const envKey =
    tier === "companion" ? "STRIPE_COMPANION_PRICE_ID" : "STRIPE_SUPPORT_PLUS_PRICE_ID";
  const id = process.env[envKey];
  if (!id) throw new Error(`${envKey} environment variable is not set`);
  return id;
}

export function tierForPriceId(priceId: string): PaidTier | null {
  if (priceId === process.env.STRIPE_COMPANION_PRICE_ID) return "companion";
  if (priceId === process.env.STRIPE_SUPPORT_PLUS_PRICE_ID) return "support_plus";
  return null;
}
