import { getStripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "https://smallapp-v1.vercel.app";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 2900,
            product_data: {
              name: "Pro — Unlimited Leads",
              description: "Unlimited lead capture and touchpoint logging",
            },
          },
          quantity: 1,
        },
      ],
      customer_creation: "always",
      billing_address_collection: "auto",
      success_url: `${origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/upgrade`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[api/checkout]", err);
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }
}
