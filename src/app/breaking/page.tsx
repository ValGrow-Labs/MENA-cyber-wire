"use client";

import { useState, useEffect } from "react";
import NewsCard from "@/components/news/NewsCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { NewsArticle } from "@/types/news";
import { CMSBreakingNews } from "@/types/cms";
import { Radio } from "lucide-react";

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
  const [liveBreaking, setLiveBreaking] = useState<CMSBreakingNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchBreaking = async () => {
    setLoading(true);
    setError(null);
    try {
      const [newsRes, brkRes] = await Promise.all([
        fetch("/api/news?sortBy=latest"),
        fetch("/api/breaking"),
      ]);
      if (!newsRes.ok) throw new Error(`The news service returned ${newsRes.status}.`);
      const newsData = await newsRes.json();
      const brkData = await brkRes.json();

      setArticles(newsData.data || []);
      if (Array.isArray(brkData?.data)) {
        setLiveBreaking(brkData.data);
      }
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
          Every story in chronological order, Riyadh time. Items are logged as public reporting appears and verified by our desk.
        </p>
        {updatedAt && (
          <p className="mt-4 font-mono text-2xs text-ink-3">
            Updated {updatedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" })} AST
          </p>
        )}
      </header>

      {/* Live Broadcast Wire Alerts */}
      {liveBreaking.length > 0 && (
        <section className="mb-8 space-y-3">
          <div className="section-head">
            <h2 className="section-title text-signal flex items-center gap-2">
              <Radio size={14} className="animate-pulse" />
              Active Incident Broadcasts
            </h2>
          </div>
          {liveBreaking.map((item) => (
            <div key={item.id} className="rounded border-l-4 border-signal bg-paper-raised p-4 shadow-sm">
              <div className="flex items-center gap-2 font-mono text-2xs text-signal font-bold uppercase">
                <span>{item.category}</span>
                <span>&middot;</span>
                <span>{item.country || "Regional MENA"}</span>
                <span>&middot;</span>
                <span>{item.verificationStatus}</span>
              </div>
              <h3 className="mt-1 font-serif text-lg font-semibold text-ink">{item.headline}</h3>
              {item.description && <p className="mt-1 text-sm text-ink-2 leading-relaxed">{item.description}</p>}
              <p className="mt-2 font-mono text-2xs text-ink-3">Reported by {item.source}</p>
            </div>
          ))}
        </section>
      )}

      {loading && <LoadingSkeleton rows={6} />}
      {error && !loading && <ErrorState message={error} onRetry={fetchBreaking} />}

      {!loading && !error && (
        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.day} aria-label={group.day}>
              <div className="section-head">
                <h2 className="section-title">{group.day}</h2>
                <span className="text-xs font-medium text-ink-3 tabular">{group.items.length} stories</span>
              </div>
              <div className="divide-y divide-rule">
                {group.items.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
