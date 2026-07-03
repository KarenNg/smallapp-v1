import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (leadError) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const { data: touchpoints, error: touchpointsError } = await supabase
    .from("touchpoints")
    .select("*")
    .eq("lead_id", id)
    .order("occurred_at", { ascending: false });

  if (touchpointsError) {
    return NextResponse.json({ error: touchpointsError.message }, { status: 500 });
  }

  return NextResponse.json({ lead, touchpoints });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status?: string };

  if (!status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}
