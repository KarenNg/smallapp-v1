"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NewLeadForm from "./NewLeadForm";
import type { Lead } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const res = await fetch("/api/leads");
    if (!res.ok) {
      setError("Could not load leads. Try refreshing.");
      return;
    }
    const data = await res.json();
    setLeads(data.leads);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <NewLeadForm onCreated={load} />
      </div>

      {error && (
        <p className="text-sm text-red-600 rounded-md bg-red-50 p-3">{error}</p>
      )}

      {leads === null && !error && (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-neutral-100" />
          ))}
        </div>
      )}

      {leads !== null && leads.length === 0 && (
        <p className="text-sm text-neutral-500 py-8 text-center">
          No leads yet. Add your first lead to get started.
        </p>
      )}

      {leads !== null && leads.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-neutral-200 text-neutral-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-2 pr-4">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-black hover:underline">
                    {lead.name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-neutral-600">{lead.email}</td>
                <td className="py-2 pr-4 text-neutral-600">{lead.source}</td>
                <td className="py-2 pr-4">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs">
                    {lead.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-neutral-500">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
