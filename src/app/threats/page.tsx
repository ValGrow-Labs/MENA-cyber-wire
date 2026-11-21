"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CVECard from "@/components/threat/CVECard";
import AdvisoryCard from "@/components/threat/AdvisoryCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { CVEItem, CISAAdvisory } from "@/types/threat";

export default function ThreatsPage() {
  const [activeTab, setActiveTab] = useState<"cve" | "advisories">("cve");
  const [cves, setCves] = useState<CVEItem[]>([]);
  const [advisories, setAdvisories] = useState<CISAAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cveRes, advRes] = await Promise.all([
        fetch(`/api/vulnerabilities?search=${encodeURIComponent(search)}&severity=${severityFilter}`),
        fetch("/api/advisories"),
      ]);
      if (!cveRes.ok || !advRes.ok) {
        throw new Error("The vulnerability and advisory feeds didn't respond.");
      }
      const cveData = await cveRes.json();
      const advData = await advRes.json();
      setCves(cveData.data || []);
      setAdvisories(advData.data || []);
    } catch (err: any) {
      setError(err.message || "The vulnerability feed didn't load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const tabs = [
    { id: "cve" as const, label: "Vulnerabilities", count: cves.length },
    { id: "advisories" as const, label: "Advisories", count: advisories.length },
  ];

  const severities = [
    { value: "ALL", label: "All" },
    { value: "CRITICAL", label: "Critical" },
    { value: "HIGH", label: "High" },
    { value: "MEDIUM", label: "Medium" },
  ];

  return (
    <div>
      <header className="border-b border-edge pb-6">
        <p className="kicker">Vulnerabilities</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl">
          What to patch this week
        </h1>
        <p className="mt-3 max-w-prose font-serif text-lg leading-relaxed text-ink-2">
          Recent records from the US National Vulnerability Database and CISA advisories, with notes where a
          flaw matters for organisations in the region.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-b border-rule">
        <div role="tablist" aria-label="Feed" className="-mb-px flex gap-6">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.id)}
                className={`border-b-[3px] pb-2.5 font-serif text-lg transition-colors ${
                  active ? "border-signal text-ink" : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {t.label}
                <span className="ml-2 font-mono text-2xs text-ink-3 tabular">{loading ? "-" : t.count}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="mb-2.5 text-xs font-medium text-ink-3 hover:text-ink disabled:opacity-40"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {activeTab === "cve" && (
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-8">
          <form onSubmit={handleSearchSubmit} role="search" className="flex flex-1 items-center border-b border-rule focus-within:border-ink">
            <Search className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} />
            <label htmlFor="cve-search" className="sr-only">Search CVE ID or vendor</label>
            <input
              id="cve-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="CVE ID or vendor, e.g. Fortinet"
              className="w-full bg-transparent px-2.5 py-2 text-sm text-ink placeholder:text-ink-4 focus:outline-none"
            />
            <button type="submit" className="shrink-0 text-xs font-medium text-ink-3 hover:text-ink">
              Search
            </button>
          </form>

          <div role="group" aria-label="Severity" className="flex items-baseline gap-4 pb-2">
            <span className="kicker">Severity</span>
            {severities.map((s) => (
              <button
                key={s.value}
                onClick={() => setSeverityFilter(s.value)}
                aria-pressed={severityFilter === s.value}
                className={`text-sm transition-colors ${
                  severityFilter === s.value ? "text-ink underline decoration-1 underline-offset-4" : "text-ink-3 hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {activeTab === "cve" && !loading && !error && cves.length > 0 && (
          <div className="hidden grid-cols-[10.5rem_1fr_4.5rem_6.5rem] gap-x-5 border-t-2 border-edge pb-2 pt-2 text-xs font-medium text-ink-3 sm:grid">
            <span>CVE</span>
            <span>Description · product</span>
            <span>CVSS</span>
            <span>Published</span>
          </div>
        )}

        {loading && <LoadingSkeleton rows={6} />}
        {error && !loading && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && (
          activeTab === "cve" ? (
            cves.length > 0 ? (
              <div className="border-b border-rule">
                {cves.map((cve) => <CVECard key={cve.id} cve={cve} />)}
              </div>
            ) : (
              <div className="border-t border-rule py-12">
                <p className="font-serif text-2xl text-ink">No records match that search.</p>
                <p className="mt-2 max-w-prose text-ink-2">
                  NVD matches on exact keywords. Try a vendor name, a product, or a full CVE ID.
                </p>
                {(search || severityFilter !== "ALL") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setSeverityFilter("ALL");
                    }}
                    className="btn-quiet mt-5"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )
          ) : advisories.length > 0 ? (
            <div className="border-b border-rule">
              {advisories.map((a) => <AdvisoryCard key={a.id} advisory={a} />)}
            </div>
          ) : (
            <div className="border-t border-rule py-12">
              <p className="font-serif text-2xl text-ink">No advisories right now.</p>
              <p className="mt-2 max-w-prose text-ink-2">The CISA feed returned nothing. Check back later.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
