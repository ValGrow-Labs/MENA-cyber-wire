"use client";

import { useState, useEffect } from "react";
import NewsCard from "@/components/news/NewsCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { NewsArticle } from "@/types/news";

function dayKey(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Riyadh",
  });
}

export default function BreakingPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchBreaking = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/news?sortBy=latest");
      if (!res.ok) throw new Error(`The news service returned ${res.status}.`);
      const data = await res.json();
      setArticles(data.data || []);
      setUpdatedAt(new Date());
    } catch (err: any) {
      setError(err.message || "Breaking coverage didn't load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreaking();
  }, []);

  // Group entries by calendar day (Riyadh time), preserving feed order
  const groups: { day: string; items: NewsArticle[] }[] = [];
  for (const a of articles) {
    const day = dayKey(a.publishedAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(a);
    else groups.push({ day, items: [a] });
  }

  return (
    <div>
      <header className="pb-6">
        <p className="kicker flex items-center gap-2 text-signal">
          <span className="h-1.5 w-1.5 animate-blink bg-signal" aria-hidden />
          The wire
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">Breaking</h1>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          Every report on the wire, newest first. Times are Riyadh (AST).
        </p>
      </header>

      <div className="flex items-baseline justify-between border-t-2 border-edge pt-2.5 text-xs font-medium text-ink-3">
        <span className="tabular" suppressHydrationWarning>
          {loading
            ? "Updating…"
            : updatedAt
            ? `${articles.length} entries · updated ${updatedAt.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Riyadh",
              })} AST`
            : ""}
        </span>
        <button onClick={fetchBreaking} disabled={loading} className="hover:text-ink disabled:opacity-40">
          Refresh
        </button>
      </div>

      <div className="mt-2">
        {loading && <LoadingSkeleton />}
        {error && !loading && <ErrorState message={error} onRetry={fetchBreaking} />}

        {!loading && !error && articles.length === 0 && (
          <div className="border-t border-rule py-12">
            <p className="font-serif text-2xl text-ink">Nothing on the wire right now.</p>
            <p className="mt-2 max-w-prose text-ink-2">
              The feed refreshes every ten minutes. Try again shortly.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          groups.map((g) => (
            <section key={g.day} aria-label={g.day} className="mt-8 first:mt-4">
              <h2 className="sticky top-12 z-rail bg-paper/95 py-2 text-xs font-medium text-ink backdrop-blur-sm">
                {g.day}
              </h2>
              <div className="border-b border-rule">
                {g.items.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
