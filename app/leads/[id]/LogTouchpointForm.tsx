"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TOUCHPOINT_CHANNELS } from "@/lib/types";

export default function LogTouchpointForm({
  leadId,
  onCreated,
}: {
  leadId: string;
  onCreated: () => void;
}) {
  const router = useRouter();
  const [channel, setChannel] = useState<string>(TOUCHPOINT_CHANNELS[0]);
  const [summary, setSummary] = useState("");
  const [outcome, setOutcome] = useState("");
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/touchpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: leadId,
        channel,
        summary,
        outcome,
        occurred_at: new Date(occurredAt).toISOString(),
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    setSummary("");
    setOutcome("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-neutral-200 p-4">
      <h3 className="font-medium text-sm">Log a Touchpoint</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Channel</label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            {TOUCHPOINT_CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Outcome</label>
        <input
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Log Touchpoint"}
      </button>
    </form>
  );
}
