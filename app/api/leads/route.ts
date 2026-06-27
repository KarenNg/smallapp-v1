import { createClient } from "@/lib/supabase/server";
import { FREE_LEAD_LIMIT } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ leads: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { name, email, source, notes } = body as {
    name?: string;
    email?: string;
    source?: string;
    notes?: string;
  };

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("leads")
    .select("id")
    .eq("email", email.trim())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "A lead with this email already exists" }, { status: 409 });
  }

  const { count } = await supabase.from("leads").select("id", { count: "exact", head: true });

  if ((count ?? 0) >= FREE_LEAD_LIMIT) {
    const { data: paidPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();

    if (!paidPayment) {
      return NextResponse.json(
        { error: "Free tier limit reached", upgrade_required: true },
        { status: 402 },
      );
    }
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: name.trim(),
      email: email.trim(),
      source: source?.trim() || "direct",
      status: "new",
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    table_name: "leads",
    record_id: data.id,
    action: "insert",
    new_data: data,
  });

  return NextResponse.json({ lead: data }, { status: 201 });
}
