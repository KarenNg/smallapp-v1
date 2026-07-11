"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import LogTouchpointForm from "./LogTouchpointForm";
import type { Lead, Touchpoint } from "@/lib/types";

export default function LeadDetailPage() {
  const params = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [touchpoints, setTouchpoints] = useState<Touchpoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch(`/api/leads/${params.id}`);
    if (!res.ok) {
      setError("Lead not found.");
      return;
    }
    const data = await res.json();
    setLead(data.lead);
    setTouchpoints(data.touchpoints);
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <Link href="/leads" className="text-sm text-neutral-500 hover:underline">
          ← Back to leads
        </Link>
        <p className="text-sm text-red-600 mt-4">{error}</p>
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="max-w-3xl mx-auto p-8 space-y-2 animate-pulse">
        <div className="h-6 w-48 rounded bg-neutral-100" />
        <div className="h-4 w-64 rounded bg-neutral-100" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <Link href="/leads" className="text-sm text-neutral-500 hover:underline">
        ← Back to leads
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <p className="text-neutral-600">{lead.email}</p>
        <div className="flex gap-2 mt-2 text-xs text-neutral-500 flex-wrap">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5">{lead.source}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5">{lead.status}</span>
          {lead.ai_score !== null && (
            <span className={`rounded-full px-2 py-0.5 font-medium ${
              lead.ai_score >= 70 ? "bg-green-100 text-green-700" :
              lead.ai_score >= 40 ? "bg-yellow-100 text-yellow-700" :
              "bg-neutral-100 text-neutral-500"
            }`}>
              Score: {lead.ai_score}
            </span>
          )}
        </div>
        {lead.notes && <p className="mt-2 text-sm text-neutral-600">{lead.notes}</p>}
      </div>

      <LogTouchpointForm leadId={lead.id} onCreated={load} />

      <div>
        <h2 className="font-medium mb-3">Touchpoint Timeline</h2>
        {touchpoints?.length === 0 && (
          <p className="text-sm text-neutral-500 py-4 text-center">
            No touchpoints logged yet.
          </p>
        )}
        <ul className="space-y-3">
          {touchpoints?.map((tp) => (
            <li key={tp.id} className="rounded-lg border border-neutral-200 p-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-medium uppercase">{tp.channel}</span>
                <span>{new Date(tp.occurred_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm mt-1">{tp.summary}</p>
              {tp.outcome && <p className="text-sm text-neutral-500 mt-1">→ {tp.outcome}</p>}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
