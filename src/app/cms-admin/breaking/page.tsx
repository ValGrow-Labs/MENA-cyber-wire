"use client";

import { useEffect, useState } from "react";
import { Radio, Plus, Trash2, CheckCircle2, AlertTriangle, ExternalLink, ArrowRight } from "lucide-react";
import { CMSBreakingNews } from "@/types/cms";
import { useAdmin } from "../layout";
import ConfirmModal from "@/components/cms/ConfirmModal";
import Link from "next/link";

export default function CMSBreakingNewsPage() {
  const { notify } = useAdmin();
  const [items, setItems] = useState<CMSBreakingNews[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal/drawer
  const [isCreating, setIsCreating] = useState(false);
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("Regional Desk Warning");
  const [sourceUrl, setSourceUrl] = useState("");
  const [country, setCountry] = useState("Regional MENA");
  const [category, setCategory] = useState<any>("Critical Infrastructure");
  const [severity, setSeverity] = useState<any>("Critical");
  const [verificationStatus, setVerificationStatus] = useState<any>("SIGNAL");

  const [deleteTarget, setDeleteTarget] = useState<CMSBreakingNews | null>(null);

  const fetchBreaking = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/breaking");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setItems(json.data);
      }
    } catch {
      notify("Failed to fetch breaking alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      notify("Please provide a headline", "error");
      return;
    }

    try {
      const res = await fetch("/api/cms/breaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          description,
          source,
          sourceUrl,
          country,
          category,
          severity,
          verificationStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        notify("Breaking news published to live wire!", "success");
        setIsCreating(false);
        setHeadline("");
        setDescription("");
        fetchBreaking();
      } else {
        notify(data.error || "Failed to create", "error");
      }
    } catch {
      notify("Failed to post breaking alert", "error");
    }
  };

  const handleToggleResolve = async (item: CMSBreakingNews) => {
    try {
      const res = await fetch(`/api/cms/breaking/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: !item.isResolved }),
      });
      if (res.ok) {
        notify(`Alert marked as ${!item.isResolved ? "Resolved" : "Active"}`, "info");
        fetchBreaking();
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/cms/breaking/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        notify("Breaking alert deleted", "success");
        setDeleteTarget(null);
        fetchBreaking();
      }
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#F5F5F5]">
            Breaking News
          </h2>
          <p className="mt-1 text-xs text-[#A1A1A1]">
            Publish breaking news alerts to the homepage ticker and breaking news wire.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-md bg-[#D63838] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#b02c2c]"
        >
          <Plus size={15} />
          <span>New Breaking Alert</span>
        </button>
      </div>

      {/* Creation Modal / Inline Box */}
      {isCreating && (
        <form onSubmit={handleCreate} className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-3">
            <h3 className="font-serif text-base font-semibold text-[#F5F5F5] flex items-center gap-2">
              <Radio size={16} className="text-[#D63838]" />
              New Breaking Alert
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-[#707070] hover:text-[#F5F5F5]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Breaking Headline <span className="text-[#D63838]">*</span>
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Critical Edge VPN Exploitation Detected in GCC Logistics Sector"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:border-[#D63838] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Urgent Summary & Indicators
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tactical overview of the unfolding incident and immediate guidance."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2.5 text-xs text-[#F5F5F5] focus:border-[#D63838] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Target Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Regional MENA">Regional MENA</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Qatar">Qatar</option>
                <option value="Egypt">Egypt</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Oman">Oman</option>
                <option value="Jordan">Jordan</option>
                <option value="Iraq">Iraq</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Critical Infrastructure">Critical Infrastructure</option>
                <option value="Ransomware">Ransomware</option>
                <option value="Data Breach">Data Breach</option>
                <option value="Espionage & APT">Espionage & APT</option>
                <option value="Vulnerability">Vulnerability</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Threat Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Signal vs Noise
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              >
                <option value="SIGNAL">SIGNAL — Verified</option>
                <option value="WATCH">WATCH — Developing</option>
                <option value="UNVERIFIED">UNVERIFIED — Rumor / Claim</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Source Organization
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. aeCERT / NCA"
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-[#A1A1A1]">
                Source URL
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded border border-[#2B2B2B] bg-[#191919] p-2 text-xs text-[#F5F5F5] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#2B2B2B]">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded border border-[#2B2B2B] px-4 py-2 text-xs text-[#A1A1A1] hover:bg-[#202020]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-[#D63838] px-5 py-2 text-xs font-semibold text-white hover:bg-[#b02c2c]"
            >
              Publish to Wire
            </button>
          </div>
        </form>
      )}

      {/* Wire List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-12 text-xs text-[#707070]">Loading breaking incident wire...</p>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-[#2B2B2B] bg-[#151515] p-12 text-center text-xs text-[#707070]">
            No breaking alerts active on the wire.
          </div>
        ) : (
          items.map((b) => (
            <div
              key={b.id}
              className={`rounded-lg border p-4 transition-all ${
                b.isResolved
                  ? "border-[#2B2B2B] bg-[#151515]/60 opacity-60"
                  : "border-[#D63838]/40 bg-[#151515]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        b.isResolved ? "bg-[#707070]/20 text-[#A1A1A1]" : "bg-[#D63838] text-white"
                      }`}
                    >
                      <Radio size={10} />
                      {b.isResolved ? "RESOLVED" : "ACTIVE WIRE"}
                    </span>
                    <span className="rounded bg-[#202020] px-2 py-0.5 font-mono text-[10px] text-[#A1A1A1]">
                      {b.category}
                    </span>
                    <span className="rounded bg-[#087E8B]/15 px-2 py-0.5 font-mono text-[10px] text-[#087E8B]">
                      {b.country || "Regional"}
                    </span>
                    <span className="font-mono text-[10px] text-[#707070]">
                      {new Date(b.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} AST
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#F5F5F5]">{b.headline}</h3>
                  {b.description && (
                    <p className="text-xs text-[#A1A1A1] leading-relaxed">{b.description}</p>
                  )}

                  <p className="font-mono text-[11px] text-[#707070]">Source: {b.source}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleResolve(b)}
                    className="rounded border border-[#2B2B2B] bg-[#191919] px-3 py-1.5 text-xs text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                  >
                    {b.isResolved ? "Mark Active" : "Mark Resolved"}
                  </button>

                  <Link
                    href={`/cms-admin/articles/new?fromBreaking=${encodeURIComponent(b.id)}`}
                    className="flex items-center gap-1 rounded border border-[#2B2B2B] bg-[#191919] px-3 py-1.5 text-xs text-[#A1A1A1] hover:bg-[#202020] hover:text-[#F5F5F5]"
                    title="Convert into full longform article"
                  >
                    <span>To Article</span>
                    <ArrowRight size={13} />
                  </Link>

                  <button
                    onClick={() => setDeleteTarget(b)}
                    className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
                    title="Delete alert"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Breaking Alert?"
        message={`Delete "${deleteTarget?.headline}" from the wire?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
