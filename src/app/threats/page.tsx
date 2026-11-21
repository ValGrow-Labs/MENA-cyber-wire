"use client";

import { useState, useEffect } from "react";
import CVECard from "@/components/threat/CVECard";
import AdvisoryCard from "@/components/threat/AdvisoryCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { CVEItem, CISAAdvisory } from "@/types/threat";
import { ShieldAlert, RefreshCw, Search } from "lucide-react";

export default function ThreatsPage() {
  const [activeTab, setActiveTab] = useState<"cve" | "advisories">("cve");
  const [cves, setCves] = useState<CVEItem[]>([]);
  const [advisories, setAdvisories] = useState<CISAAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
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
        throw new Error("Failed to load vulnerability and advisory feeds");
      }

      const cveData = await cveRes.json();
      const advData = await advRes.json();

      setCves(cveData.data || []);
      setAdvisories(advData.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load threats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [severityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner (Coastal Tech Styling) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-light text-teal">
                <ShieldAlert className="w-4 h-4 text-teal" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal">
                Vulnerability Intelligence & Advisories
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-ocean">
              Critical CVE Watch & CISA Alerts
            </h1>
            <p className="text-xs text-slate-muted max-w-xl leading-relaxed">
              Direct connection to the National Vulnerability Database (NVD API 2.0) and CISA public advisories, annotated with regional MENA operational impacts.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal text-white hover:bg-teal-dark shadow-coastal transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync NVD Feed</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Tab Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("cve")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "cve"
                  ? "bg-teal text-white shadow-coastal"
                  : "text-slate-dark hover:bg-mist hover:text-teal"
              }`}
            >
              NVD Vulnerabilities ({cves.length})
            </button>
            <button
              onClick={() => setActiveTab("advisories")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "advisories"
                  ? "bg-teal text-white shadow-coastal"
                  : "text-slate-dark hover:bg-mist hover:text-teal"
              }`}
            >
              CISA Direct Advisories ({advisories.length})
            </button>
          </div>

          {/* Severity selector */}
          {activeTab === "cve" && (
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl bg-ice border border-slate-border text-slate-dark font-medium focus:outline-hidden focus:border-teal"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical (CVSS 9.0 - 10.0)</option>
              <option value="HIGH">High (CVSS 7.0 - 8.9)</option>
              <option value="MEDIUM">Medium</option>
            </select>
          )}
        </div>

        {/* Search Bar */}
        {activeTab === "cve" && (
          <form onSubmit={handleSearchSubmit} className="relative flex items-center pt-2 border-t border-slate-border">
            <Search className="w-4 h-4 absolute left-3 text-slate-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by CVE-ID or affected vendor (e.g. Palo Alto, Fortinet, Cisco, Ivanti)..."
              className="w-full pl-9 pr-20 py-2 text-xs rounded-xl bg-ice border border-slate-border text-slate-dark placeholder-slate-muted focus:outline-hidden focus:border-teal"
            />
            <button
              type="submit"
              className="absolute right-2 px-3.5 py-1 text-xs font-bold rounded-lg bg-ocean text-white hover:bg-ocean-dark"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {loading && <LoadingSkeleton />}
      {error && !loading && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && (
        <div className="space-y-4">
          {activeTab === "cve" ? (
            cves.length > 0 ? (
              cves.map((cve) => <CVECard key={cve.id} cve={cve} />)
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-border">
                <p className="text-xs text-slate-muted">No CVE records matched your filter.</p>
              </div>
            )
          ) : (
            advisories.length > 0 ? (
              advisories.map((advisory) => (
                <AdvisoryCard key={advisory.id} advisory={advisory} />
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-border">
                <p className="text-xs text-slate-muted">No advisories currently recorded.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
