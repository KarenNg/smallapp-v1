"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import NewLeadForm from "./NewLeadForm";
import AuthNav from "@/app/components/AuthNav";
import type { Lead } from "@/lib/types";
import { LEAD_STATUSES } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-yellow-50 text-yellow-700",
  converted: "bg-green-50 text-green-700",
  closed: "bg-neutral-100 text-neutral-500",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads((prev) =>
      prev ? prev.map((l) => (l.id === id ? { ...l, status } : l)) : prev
    );
    setUpdatingId(null);
  }

  function exportCsv() {
    if (!leads) return;
    const rows = [
      ["Name", "Email", "Source", "Status", "Notes", "Created"],
      ...leads.map((l) => [
        l.name,
        l.email,
        l.source,
        l.status,
        l.notes ?? "",
        new Date(l.created_at).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads
    ?.filter((l) => {
      const matchStatus = filter === "all" || l.status === filter;
      const q = search.toLowerCase();
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0));

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex items-center gap-4">
          <AuthNav />
          <NewLeadForm onCreated={load} />
        </div>
      </div>

      {/* Search + Export */}
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
        />
        <button
          onClick={exportCsv}
          disabled={!leads || leads.length === 0}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {["all", ...LEAD_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm capitalize border-b-2 transition-colors ${
              filter === s
                ? "border-black font-medium text-black"
                : "border-transparent text-neutral-500 hover:text-black"
            }`}
          >
            {s}
            {s !== "all" && leads && (
              <span className="ml-1.5 text-xs text-neutral-400">
                {leads.filter((l) => l.status === s).length}
              </span>
            )}
            {s === "all" && leads && (
              <span className="ml-1.5 text-xs text-neutral-400">{leads.length}</span>
            )}
          </button>
        ))}
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

      {filtered !== undefined && filtered.length === 0 && leads !== null && (
        <p className="text-sm text-neutral-500 py-8 text-center">
          {search || filter !== "all" ? "No leads match your filter." : "No leads yet. Add your first lead to get started."}
        </p>
      )}

      {filtered !== undefined && filtered.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-neutral-200 text-neutral-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-2 pr-4">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-black hover:underline">
                    {lead.name}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-neutral-600">{lead.email}</td>
                <td className="py-2 pr-4 text-neutral-600">{lead.source}</td>
                <td className="py-2 pr-4">
                  <select
                    value={lead.status}
                    disabled={updatingId === lead.id}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer disabled:opacity-50 ${STATUS_COLORS[lead.status] ?? "bg-neutral-100 text-neutral-600"}`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-4">
                  {lead.ai_score !== null ? (
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.ai_score >= 70 ? "bg-green-100 text-green-700" :
                      lead.ai_score >= 40 ? "bg-yellow-100 text-yellow-700" :
                      "bg-neutral-100 text-neutral-500"
                    }`}>
                      {lead.ai_score}
                    </span>
                  ) : (
                    <span className="text-neutral-300 text-xs">—</span>
                  )}
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
