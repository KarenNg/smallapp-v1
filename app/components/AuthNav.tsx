"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AuthNav() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (user === undefined) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <span>{user.email}</span>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href="/login" className="text-neutral-500 hover:underline">Sign in</Link>
      <Link
        href="/signup"
        className="rounded-md bg-black px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800"
      >
        Sign up
      </Link>
    </div>
  );
}
