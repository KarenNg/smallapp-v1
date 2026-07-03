import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { lead_id, channel, summary, outcome, occurred_at } = body as {
    lead_id?: string;
    channel?: string;
    summary?: string;
    outcome?: string;
    occurred_at?: string;
  };

  if (!lead_id || !channel?.trim() || !summary?.trim()) {
    return NextResponse.json(
      { error: "lead_id, channel, and summary are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("touchpoints")
    .insert({
      user_id: user.id,
      lead_id,
      channel: channel.trim(),
      summary: summary.trim(),
      outcome: outcome?.trim() || null,
      occurred_at: occurred_at || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_logs").insert({
    table_name: "touchpoints",
    record_id: data.id,
    action: "insert",
    new_data: data,
  });

  return NextResponse.json({ touchpoint: data }, { status: 201 });
}
