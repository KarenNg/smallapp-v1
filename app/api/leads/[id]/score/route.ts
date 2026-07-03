import { createClient } from "@/lib/supabase/server";
import { computeScore } from "@/lib/scoring";
import { NextResponse } from "next/server";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: touchpoints, error: tpError } = await supabase
    .from("touchpoints")
    .select("*")
    .eq("lead_id", id);

  if (tpError) {
    return NextResponse.json({ error: tpError.message }, { status: 500 });
  }

  const score = computeScore(touchpoints ?? []);

  const { data: lead, error: updateError } = await supabase
    .from("leads")
    .update({
      ai_score: score,
      ai_score_source: "rule-v1",
      ai_score_confidence: 0.9,
      ai_score_review_status: "unreviewed",
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ lead, score });
}
