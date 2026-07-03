import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/leads", process.env.NEXT_PUBLIC_SITE_URL ?? "https://smallapp-v1.vercel.app"));
}
