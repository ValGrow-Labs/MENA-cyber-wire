"use client";

import { useState, useEffect } from "react";
import NewsCard from "@/components/news/NewsCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { NewsArticle } from "@/types/news";
import { Flame, RefreshCw, Radio } from "lucide-react";

export default function BreakingPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBreaking = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news?status=SIGNAL&sortBy=latest");
      if (!res.ok) throw new Error("Failed to load breaking intelligence feed");
      const data = await res.json();
      setArticles(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load breaking news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();
  }, []);

  return (
    <div className="space-y-6">
      {/* Breaking Header Banner in Coastal Tech styling (Alert Orange + Mist Blue) */}
      <div className="p-6 rounded-2xl bg-mist border border-alert-border shadow-coastal-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-alert-orange text-white text-[10px] font-extrabold uppercase tracking-wider">
                <Flame className="w-3 h-3 animate-pulse" />
                <span>Live Breaking Wire</span>
              </span>
              <span className="text-xs font-mono font-bold text-teal">
                SIGNAL CLASSIFIED
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold font-serif text-ocean">
              Breaking MENA Cybersecurity Incidents
            </h1>
            <p className="text-xs text-slate-dark max-w-xl leading-relaxed">
              Real-time alerts, corroborated adversary campaigns, and high-impact infrastructure intrusions across the Middle East and North Africa.
            </p>
          </div>

          <button
            onClick={fetchBreaking}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-alert-orange border border-alert-border hover:bg-alert-light transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live Wire</span>
          </button>
        </div>
      </div>

      {loading && <LoadingSkeleton />}
      {error && !loading && <ErrorState message={error} onRetry={fetchBreaking} />}

      {!loading && !error && (
        <div className="space-y-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
