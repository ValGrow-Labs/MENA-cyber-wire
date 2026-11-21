"use client";

import { useEffect, useState, useCallback } from "react";
import FeedFilterBar from "@/components/news/FeedFilterBar";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import ErrorState from "@/components/shared/ErrorState";
import { EditionLine, FrontPageGrid, FrontSkeleton, SectionBlock, RiverList } from "@/components/home/NewsFront";
import { NewsArticle } from "@/types/news";
import { LocalStore } from "@/lib/storage/local-store";
import { pickUnusedPhoto } from "@/lib/media/category-images";

const FOLLOW_MATCH: Record<string, string> = {
  AE: "emirates",
  SA: "saudi",
  QA: "qatar",
  EG: "egypt",
  KW: "kuwait",
  BH: "bahrain",
  OM: "oman",
  JO: "jordan",
};

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"card" | "compact">("card");
  const [updated, setUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("category");
    if (cat) setSelectedCategory(cat);
  }, []);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (sortBy !== "following") params.append("sortBy", sortBy);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedCountry !== "all") params.append("country", selectedCountry);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error(`The news service returned ${res.status}.`);
      const data = await res.json();
      if (!Array.isArray(data.data)) throw new Error("The news service sent an unexpected response.");

      let list: NewsArticle[] = data.data;
      if (sortBy === "following") {
        const followed = LocalStore.getFollowedCountries();
        list = list.filter((a) => {
          const c = a.country?.toLowerCase();
          return !!c && followed.some((code) => FOLLOW_MATCH[code] && c.includes(FOLLOW_MATCH[code]));
        });
      }
      setArticles(list);
      setUpdated(new Date());
    } catch (err: any) {
      setError(err.message || "The feed didn't load.");
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, selectedCountry, selectedStatus]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const filtered = selectedCategory !== "all" || selectedCountry !== "all" || selectedStatus !== "ALL";
  const showFront = sortBy === "latest" && !filtered;

  // ---- Front page allocation (each story appears once) ----
  const byNewest = (x: NewsArticle, y: NewsArticle) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime();
  const isBackground = (a: NewsArticle) => a.id.startsWith("mcw-desk-");
  const realPhoto = (a: NewsArticle) => !!a.imageUrl && !a.imageUrl.includes("images.unsplash.com");
  const regional = (a: NewsArticle) => a.region !== "Global";
  const fresh = articles.filter((a) => !isBackground(a)).sort(byNewest);
  const recent = (a: NewsArticle) => Date.now() - new Date(a.publishedAt).getTime() < 3 * 24 * 3600 * 1000;

  const lead =
    fresh.find((a) => realPhoto(a) && regional(a) && recent(a)) ||
    fresh.find((a) => realPhoto(a) && recent(a)) ||
    fresh[0] ||
    articles[0];
  const used = new Set<string>(lead ? [lead.id] : []);
  const take = (pool: NewsArticle[], n: number) => {
    const out = pool.filter((a) => !used.has(a.id)).slice(0, n);
    out.forEach((a) => used.add(a.id));
    return out;
  };
  const related = showFront && lead ? take(fresh.filter((a) => a.category === lead.category), 3) : [];
  const secondary = showFront ? take([...fresh.filter((a) => regional(a) && realPhoto(a)), ...fresh.filter(realPhoto), ...fresh], 5) : [];
  const latest = showFront ? take([...fresh.filter(realPhoto), ...fresh], 4) : [];

  const SECTIONS: { title: string; more: string; cats: string[]; regionalOnly?: boolean }[] = [
    { title: "Middle East and North Africa", more: "/mena", cats: [], regionalOnly: true },
    { title: "Vulnerabilities", more: "/threats", cats: ["Vulnerability"] },
    { title: "Threat groups and espionage", more: "/research", cats: ["Espionage & APT"] },
    { title: "Critical infrastructure", more: "/?category=Critical%20Infrastructure", cats: ["Critical Infrastructure"] },
    { title: "Policy and regulation", more: "/?category=Policy%20%26%20Regulation", cats: ["Policy & Regulation"] },
    { title: "Breaches and ransomware", more: "/?category=Data%20Breach", cats: ["Data Breach", "Ransomware"] },
    { title: "Banking and fintech", more: "/?category=Fintech%20%26%20Banking", cats: ["Fintech & Banking", "Cloud & AI"] },
  ];
  const blocks = showFront
    ? SECTIONS.map((sec) => {
        const pool = fresh.filter((a) => (sec.regionalOnly ? regional(a) : sec.cats.includes(a.category)) && !used.has(a.id));
        if (pool.length < 3) return null; // a block needs a lead plus at least two headlines
        const items = take(pool, 4);
        return { ...sec, items };
      }).filter(Boolean) as { title: string; more: string; items: NewsArticle[] }[]
    : [];
  const background = showFront ? take(articles.filter(isBackground), 4) : [];
  const river = showFront ? fresh.filter((a) => !used.has(a.id)) : articles;

  const reset = () => {
    setSortBy("latest");
    setSelectedCategory("all");
    setSelectedCountry("all");
    setSelectedStatus("ALL");
  };

  return (
    <div className="space-y-12">
      <EditionLine count={articles.length} updated={updated} articles={articles} />

      {showFront && (
        <section aria-label="Front page">
          {loading && !lead ? (
            <FrontSkeleton />
          ) : (
            lead && (
              <FrontPageGrid
                lead={lead}
                related={related}
                secondary={secondary}
                latest={latest}
                // Publisher images are thumbnails; the lead slot gets a full-quality curated photo.
                leadImage={pickUnusedPhoto(lead.category, articles, lead.id)}
              />
            )
          )}
        </section>
      )}

      <div className="border-t border-rule pt-10">
        <div className="min-w-0 space-y-14">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-2">
          {blocks.map((b) => (
            <SectionBlock key={b.title} title={b.title} more={b.more} items={b.items} />
          ))}
          {background.length >= 3 && (
            <SectionBlock title="Background: attacks and rules that shaped the region" more="/research" items={background} />
          )}
        </div>

        <section id="river" aria-label="All stories" className="scroll-mt-24">
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

          <div className="mt-5 flex items-baseline justify-between text-sm text-ink-3">
            <span className="tabular">{loading ? "Loading" : `${river.length} stories`}</span>
            <div className="flex gap-4">
              {filtered && (
                <button onClick={reset} className="font-semibold text-ink hover:text-brand">
                  Clear filters
                </button>
              )}
              <button onClick={loadFeed} disabled={loading} className="hover:text-ink disabled:opacity-40">
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-3">
            {loading && <LoadingSkeleton />}
            {error && !loading && <ErrorState message={error} onRetry={loadFeed} />}

            {!loading && !error && river.length === 0 && (
              <div className="rounded-xl bg-paper-sunk px-8 py-14 text-center">
                <p className="text-xl font-bold text-ink">Nothing matches those filters.</p>
                <p className="mx-auto mt-2 max-w-md text-ink-2">
                  {sortBy === "following"
                    ? "None of today's stories involve the countries you follow. Follow more from Countries, or switch back to Latest."
                    : "Try a different country or topic, or clear the filters to see everything."}
                </p>
                <button onClick={reset} className="btn-primary mt-6">
                  Show all stories
                </button>
              </div>
            )}

            {!loading && !error && river.length > 0 && <RiverList items={river} compact={viewMode === "compact"} />}
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
