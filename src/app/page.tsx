"use client";

import { useEffect, useState, useCallback } from "react";
import FeaturedStory from "@/components/news/FeaturedStory";
import NewsCard from "@/components/news/NewsCard";
import CompactNewsCard from "@/components/news/CompactNewsCard";
import FeedFilterBar from "@/components/news/FeedFilterBar";
import CountryImpactMap from "@/components/country/CountryImpactMap";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { NewsArticle } from "@/types/news";
import { RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LocalStore } from "@/lib/storage/local-store";

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & sort states
  const [sortBy, setSortBy] = useState("latest"); // latest, discussed, trending, following
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (sortBy && sortBy !== "following") params.append("sortBy", sortBy);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedCountry && selectedCountry !== "all") params.append("country", selectedCountry);
      if (selectedStatus && selectedStatus !== "ALL") params.append("status", selectedStatus);

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Feed request returned ${res.status}`);
      }
      const data = await res.json();
      if (data.data) {
        let list: NewsArticle[] = data.data;

        // If "My Following" tab is active, filter articles by user followed countries
        if (sortBy === "following") {
          const followed = LocalStore.getFollowedCountries();
          list = list.filter((a) => {
            if (!a.country) return false;
            // Match country code or name
            const countryLower = a.country.toLowerCase();
            return followed.some((code) => {
              if (code === "AE" && countryLower.includes("emirates")) return true;
              if (code === "SA" && countryLower.includes("saudi")) return true;
              if (code === "QA" && countryLower.includes("qatar")) return true;
              if (code === "EG" && countryLower.includes("egypt")) return true;
              if (code === "KW" && countryLower.includes("kuwait")) return true;
              if (code === "BH" && countryLower.includes("bahrain")) return true;
              if (code === "OM" && countryLower.includes("oman")) return true;
              if (code === "JO" && countryLower.includes("jordan")) return true;
              return false;
            });
          });
        }

        setArticles(list);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Feed error:", err);
      setError(err.message || "Failed to retrieve intelligence feed");
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, selectedCountry, selectedStatus]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // Featured story is the top SIGNAL article or first available
  const featuredArticle = articles.find((a) => a.verificationStatus === "SIGNAL") || articles[0];
  const feedArticles = articles.filter((a) => a.id !== featuredArticle?.id);

  return (
    <div className="space-y-6">
      {/* Editorial Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-border text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold uppercase tracking-wider text-ocean">
            MENA Cyber Wire &middot; Intelligence Feed
          </span>
          <span className="text-slate-muted">
            ({articles.length} verified reports active)
          </span>
        </div>

        <button
          onClick={loadFeed}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
          title="Refresh live feeds"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Feeds</span>
        </button>
      </div>

      {/* Featured Investigation Hero Card */}
      {featuredArticle && !loading && sortBy !== "following" && (
        <section aria-label="Featured Story">
          <FeaturedStory article={featuredArticle} />
        </section>
      )}

      {/* Interactive MENA Country Impact Map */}
      <section aria-label="Regional Impact Map">
        <CountryImpactMap
          selectedCountryCode={selectedCountry !== "all" ? selectedCountry : "SA"}
          onSelectCountry={(country) => {
            setSelectedCountry(country.name.toLowerCase());
          }}
        />
      </section>

      {/* Feed Filters & Controls Bar (Latest, Discussed, Trending, Following) */}
      <section aria-label="Feed Filters">
        <FeedFilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </section>

      {/* Loading Skeleton */}
      {loading && <LoadingSkeleton />}

      {/* Error State */}
      {error && !loading && (
        <ErrorState message={error} onRetry={loadFeed} />
      )}

      {/* Empty State */}
      {!loading && !error && feedArticles.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-border shadow-coastal-card space-y-3">
          <p className="text-sm font-bold text-ocean">
            No intelligence reports matched your active filters.
          </p>
          <p className="text-xs text-slate-muted">
            {sortBy === "following"
              ? "You haven't followed any countries that have matching articles, or none match your category filters."
              : "Try broadening your category or country filter settings."}
          </p>
          <button
            onClick={() => {
              setSortBy("latest");
              setSelectedCategory("all");
              setSelectedCountry("all");
              setSelectedStatus("ALL");
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal text-white hover:bg-teal-dark shadow-coastal"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Social Editorial News Feed (Reddit + Instagram style in Coastal Tech) */}
      {!loading && !error && feedArticles.length > 0 && (
        <section aria-label="Cybersecurity News Feed" className="space-y-4">
          {viewMode === "card" ? (
            feedArticles.map((article, idx) => (
              <NewsCard key={article.id} article={article} priority={idx < 3} />
            ))
          ) : (
            <div className="space-y-2">
              {feedArticles.map((article) => (
                <CompactNewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Bottom Editorial Callout */}
      <div className="p-5 rounded-2xl bg-white border border-slate-border shadow-coastal-card flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-ocean block text-sm">
            Looking for detailed vulnerability records?
          </span>
          <p className="text-slate-muted text-xs">
            Review NVD API 2.0 scores and official CISA alerts in the Live Threat Portal.
          </p>
        </div>
        <Link
          href="/threats"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ocean text-white font-bold hover:bg-ocean-dark transition-colors"
        >
          <span>Open Threat Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
