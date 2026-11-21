"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NewsCard from "@/components/news/NewsCard";
import CVECard from "@/components/threat/CVECard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { NewsArticle } from "@/types/news";
import { CVEItem } from "@/types/threat";
import { LocalStore } from "@/lib/storage/local-store";

const SUGGESTED = ["Saudi Arabia", "Ransomware UAE", "CVE-2024-3400", "OT/SCADA", "MuddyWater", "NCA ECC"];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<"all" | "news" | "cve">("all");
  const [newsResults, setNewsResults] = useState<NewsArticle[]>([]);
  const [cveResults, setCveResults] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(LocalStore.getSearchHistory());
  }, []);

  const runSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setFailed(false);
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
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      setActiveTab("all");
      runSearch(queryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);

  // Drive searches through the URL so results are shareable and the back button works.
  const go = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setQuery(t);
    if (t === queryParam) runSearch(t);
    else router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  const total = newsResults.length + cveResults.length;
  const tabs = [
    { id: "all" as const, label: "All", count: total },
    { id: "news" as const, label: "Stories", count: newsResults.length },
    { id: "cve" as const, label: "CVEs", count: cveResults.length },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="kicker">Search</p>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(query);
          }}
          className="mt-3 flex items-end gap-4 border-b-2 border-edge"
        >
          <label htmlFor="q" className="sr-only">Search stories and CVEs</label>
          <input
            id="q"
            type="search"
            autoFocus={!queryParam}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the wire"
            className="min-w-0 flex-1 bg-transparent pb-2 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink placeholder:font-normal placeholder:text-ink-4 focus:outline-none sm:text-5xl"
          />
          <button type="submit" className="mb-3 shrink-0 text-xs font-medium text-ink-3 hover:text-ink">
            Search ↵
          </button>
        </form>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          Stories, CVE records and threat groups, by keyword, country or ID.
        </p>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium">
          <span className="text-ink-4">Try</span>
          {SUGGESTED.map((s) => (
            <button key={s} onClick={() => go(s)} className="text-ink-3 hover:text-ink hover:underline hover:underline-offset-4">
              {s}
            </button>
          ))}
        </div>
      </header>

      {recentSearches.length > 0 && !queryParam && (
        <section aria-label="Recent searches">
          <div className="section-head">
            <h2 className="section-title">Recent searches</h2>
            <button
              onClick={() => {
                LocalStore.clearSearchHistory();
                setRecentSearches([]);
              }}
              className="text-xs font-medium text-ink-3 hover:text-ink"
            >
              Clear
            </button>
          </div>
          <ul className="border-b border-rule">
            {recentSearches.map((term) => (
              <li key={term} className="border-t border-rule first:border-t-0">
                <button onClick={() => go(term)} className="flex w-full items-center justify-between py-3 text-left text-ink-2 hover:text-ink">
                  <span>{term}</span>
                  <span className="text-ink-4" aria-hidden>→</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {queryParam && (
        <section aria-label="Results">
          <div className="section-head items-end">
            <div role="tablist" aria-label="Result type" className="-mb-3 flex gap-5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`border-b-[3px] pb-2.5 font-serif text-lg transition-colors ${
                    activeTab === t.id ? "border-signal text-ink" : "border-transparent text-ink-3 hover:text-ink"
                  }`}
                >
                  {t.label} <span className="font-mono text-xs tabular">{loading ? "" : t.count}</span>
                </button>
              ))}
            </div>
            <span className="hidden truncate text-xs font-medium text-ink-3 sm:block">
              “{queryParam}”
            </span>
          </div>

          <div className="mt-2">
            {loading && <LoadingSkeleton rows={4} />}

            {!loading && failed && (
              <div role="alert" className="border-l-2 border-signal bg-paper-raised px-5 py-5">
                <p className="font-serif text-lg text-ink">The search didn&apos;t complete.</p>
                <button onClick={() => runSearch(queryParam)} className="btn-quiet mt-4">Try again</button>
              </div>
            )}

            {!loading && !failed && total === 0 && (
              <div className="border-t border-rule py-12">
                <p className="font-serif text-2xl text-ink">Nothing found for “{queryParam}”.</p>
                <p className="mt-2 max-w-prose text-ink-2">
                  Try a country, a CVE ID such as CVE-2024-3400, a group name, or a broader word like ransomware.
                </p>
              </div>
            )}

            {!loading && !failed && total > 0 && (
              <div className="space-y-12">
                {(activeTab === "all" || activeTab === "news") && newsResults.length > 0 && (
                  <div>
                    {activeTab === "all" && <p className="kicker mb-1 mt-4">Stories</p>}
                    <div className="border-b border-rule">
                      {newsResults.map((a) => <NewsCard key={a.id} article={a} />)}
                    </div>
                  </div>
                )}
                {(activeTab === "all" || activeTab === "cve") && cveResults.length > 0 && (
                  <div>
                    {activeTab === "all" && <p className="kicker mb-1 mt-4">CVE records</p>}
                    <div>
                      {cveResults.map((c) => <CVECard key={c.id} cve={c} />)}
                    </div>
                  </div>
                )}
                {activeTab === "news" && newsResults.length === 0 && (
                  <p className="border-t border-rule py-8 text-ink-2">No stories match. Check the CVEs tab.</p>
                )}
                {activeTab === "cve" && cveResults.length === 0 && (
                  <p className="border-t border-rule py-8 text-ink-2">No CVE records match. Check the Stories tab.</p>
                )}
              </div>
            )}
          </div>
        </section>
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
