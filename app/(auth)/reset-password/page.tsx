"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the session tokens in the URL hash after redirect.
    // onAuthStateChange fires with PASSWORD_RECOVERY when the hash is consumed.
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => { window.location.href = "/leads"; }, 2000);
  }

  if (done) {
    return (
      <main className="max-w-sm mx-auto p-8 space-y-4">
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="text-sm text-neutral-600">Redirecting you to the app…</p>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="max-w-sm mx-auto p-8 space-y-4">
        <p className="text-sm text-neutral-500">Verifying reset link…</p>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Set new password</h1>
        <p className="text-sm text-neutral-500 mt-1">Choose a password with at least 6 characters.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Set new password"}
        </button>
      </form>
    </main>
  );
}
