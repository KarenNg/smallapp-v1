"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="max-w-sm mx-auto p-8 space-y-4">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-neutral-600">
          We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
        </p>
        <Link href="/login" className="block text-sm text-neutral-500 hover:underline">
          ← Back to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-sm mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>
      <Link href="/login" className="block text-sm text-neutral-500 hover:underline">
        ← Back to sign in
      </Link>
    </main>
  );
}
