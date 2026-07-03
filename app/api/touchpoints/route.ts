import { createClient } from "@/lib/supabase/server";
import { computeScore } from "@/lib/scoring";
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

  // Re-score the lead after each new touchpoint
  const { data: allTouchpoints } = await supabase
    .from("touchpoints")
    .select("*")
    .eq("lead_id", lead_id);

  const score = computeScore(allTouchpoints ?? []);
  await supabase
    .from("leads")
    .update({ ai_score: score, ai_score_source: "rule-v1", ai_score_confidence: 0.9, ai_score_review_status: "unreviewed" })
    .eq("id", lead_id);

  return NextResponse.json({ touchpoint: data }, { status: 201 });
}
