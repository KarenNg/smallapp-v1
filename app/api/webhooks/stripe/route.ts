import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[webhooks/stripe] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = await createClient();

    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        email: session.customer_details?.email ?? "",
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string,
        status: "paid",
        tier: "pro",
        amount_cents: session.amount_total ?? 2900,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[webhooks/stripe] insert payment failed:", error);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    await supabase.from("audit_logs").insert({
      table_name: "payments",
      record_id: payment.id,
      action: "checkout",
      new_data: payment,
    });
  }

  return NextResponse.json({ received: true });
}
