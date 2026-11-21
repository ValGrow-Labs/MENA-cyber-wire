"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NewsCard from "@/components/news/NewsCard";
import CVECard from "@/components/threat/CVECard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { NewsArticle } from "@/types/news";
import { CVEItem } from "@/types/threat";
import { Search, Clock } from "lucide-react";
import { LocalStore } from "@/lib/storage/local-store";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<"all" | "news" | "cve">("all");
  const [newsResults, setNewsResults] = useState<NewsArticle[]>([]);
  const [cveResults, setCveResults] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(LocalStore.getSearchHistory());
  }, []);

  const runSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    LocalStore.addSearchHistory(term.trim());
    setRecentSearches(LocalStore.getSearchHistory());

    try {
      const [nRes, cRes] = await Promise.all([
        fetch(`/api/news?search=${encodeURIComponent(term)}`),
        fetch(`/api/vulnerabilities?search=${encodeURIComponent(term)}`),
      ]);

      const nData = await nRes.json();
      const cData = await cRes.json();

      setNewsResults(nData.data || []);
      setCveResults(cData.data || []);
    } catch (err) {
      console.warn("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      runSearch(queryParam);
    }
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    runSearch(tag);
  };

  const totalResults = newsResults.length + cveResults.length;

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card">
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-ocean mb-1.5">
          Global Threat Intelligence Search
        </h1>
        <p className="text-xs text-slate-muted mb-4">
          Query indexed MENA incidents, APT actor campaigns, NVD CVE records, and regional cyber regulations.
        </p>

        {/* Big Search Input */}
        <form onSubmit={handleSubmit} className="relative flex items-center w-full">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords (e.g. MuddyWater, Saudi Arabia, CVE-2024-3400, Ransomware, aeCERT)..."
            className="w-full pl-10 pr-24 py-2.5 text-sm rounded-xl bg-ice border border-slate-border text-slate-dark placeholder-slate-muted focus:outline-hidden focus:border-teal"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-1.5 text-xs font-bold rounded-lg bg-teal text-white hover:bg-teal-dark shadow-coastal"
          >
            Search
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-muted font-medium">Suggested:</span>
          {["Saudi Arabia", "Ransomware UAE", "CVE-2024-3400", "OT/SCADA", "MuddyWater", "NCA ECC"].map((s) => (
            <button
              key={s}
              onClick={() => handleTagClick(s)}
              className="px-2.5 py-0.5 rounded-lg bg-mist text-ocean hover:bg-teal hover:text-white border border-mist-border text-[11px] font-semibold transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Search History */}
      {recentSearches.length > 0 && !queryParam && (
        <div className="p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-border text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-muted">
              Recent Queries
            </span>
            <button
              onClick={() => {
                LocalStore.clearSearchHistory();
                setRecentSearches([]);
              }}
              className="text-teal hover:underline font-bold"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleTagClick(term)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-ice text-ocean border border-slate-border hover:border-teal font-medium"
              >
                <Clock className="w-3 h-3 text-teal" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      {queryParam && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-border text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "all" ? "bg-teal text-white shadow-coastal" : "text-slate-dark hover:bg-mist"
              }`}
            >
              All Matches ({totalResults})
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "news" ? "bg-teal text-white shadow-coastal" : "text-slate-dark hover:bg-mist"
              }`}
            >
              Intelligence Reports ({newsResults.length})
            </button>
            <button
              onClick={() => setActiveTab("cve")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === "cve" ? "bg-teal text-white shadow-coastal" : "text-slate-dark hover:bg-mist"
              }`}
            >
              CVE Records ({cveResults.length})
            </button>
          </div>

          <span className="text-slate-muted">
            Results for &ldquo;{queryParam}&rdquo;
          </span>
        </div>
      )}

      {loading && <LoadingSkeleton />}

      {/* Results */}
      {!loading && queryParam && (
        <div className="space-y-4">
          {totalResults === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-border shadow-coastal-card">
              <p className="text-sm font-bold text-ocean">
                No threat intelligence matched &ldquo;{queryParam}&rdquo;.
              </p>
              <p className="text-xs text-slate-muted mt-1">
                Try searching for a country name, CVE ID, threat actor, or attack vector.
              </p>
            </div>
          ) : (
            <>
              {(activeTab === "all" || activeTab === "news") && newsResults.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block">
                    Intelligence Articles ({newsResults.length})
                  </span>
                  {newsResults.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {(activeTab === "all" || activeTab === "cve") && cveResults.length > 0 && (
                <div className="space-y-3 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block">
                    CVE Records ({cveResults.length})
                  </span>
                  {cveResults.map((cve) => (
                    <CVECard key={cve.id} cve={cve} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
