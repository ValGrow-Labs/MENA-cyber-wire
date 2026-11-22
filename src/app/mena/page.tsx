"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CountryData } from "@/types/country";
import { NewsArticle } from "@/types/news";
import NewsCard from "@/components/news/NewsCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { LocalStore } from "@/lib/storage/local-store";

const REGIONS: CountryData["region"][] = ["Gulf", "Levant", "North Africa"];
const LEVEL: Record<CountryData["threatLevel"], number> = { Guarded: 1, Elevated: 2, High: 3, Critical: 4 };

function findCountry(code: string | null) {
  if (!code) return undefined;
  const c = code.toLowerCase();
  return MENA_COUNTRIES.find((x) => x.code.toLowerCase() === c || x.name.toLowerCase() === c);
}

function LevelBars({ level, inverted = false }: { level: number; inverted?: boolean }) {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-[3px] ${
            i <= level ? (level >= 3 ? "bg-signal" : inverted ? "bg-paper" : "bg-ink") : inverted ? "bg-paper/25" : "bg-rule"
          }`}
          style={{ height: `${3 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

function MenaWatchContent() {
  const searchParams = useSearchParams();
  const [countries, setCountries] = useState<CountryData[]>(MENA_COUNTRIES);
  const [selected, setSelected] = useState<CountryData>(
    () => findCountry(searchParams.get("country")) || MENA_COUNTRIES.find((c) => c.code === "SA") || MENA_COUNTRIES[0]
  );
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.data) && d.data.length > 0) {
          setCountries(d.data);
          const currentCode = selected.code;
          const updated = d.data.find((c: CountryData) => c.code === currentCode);
          if (updated) setSelected(updated);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const match = countries.find(
      (x) =>
        x.code.toLowerCase() === searchParams.get("country")?.toLowerCase() ||
        x.name.toLowerCase() === searchParams.get("country")?.toLowerCase()
    );
    if (match) setSelected(match);
  }, [searchParams, countries]);

  useEffect(() => {
    const sync = () => setFollowed(LocalStore.getFollowedCountries());
    sync();
    window.addEventListener("mena_followed_changed", sync);
    return () => window.removeEventListener("mena_followed_changed", sync);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?country=${encodeURIComponent(selected.name)}`)
      .then((r) => r.json())
      .then((d) => setArticles(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [selected]);

  const toggleFollow = (code: string) => {
    LocalStore.toggleFollowCountry(code);
    setFollowed(LocalStore.getFollowedCountries());
  };

  const pick = (c: CountryData) => {
    setSelected(c);
    const url = new URL(window.location.href);
    url.searchParams.set("country", c.code);
    window.history.replaceState(null, "", url.toString());
  };

  const isFollowing = followed.includes(selected.code);
  const level = LEVEL[selected.threatLevel] ?? 1;

  return (
    <div>
      <header className="pb-6">
        <p className="kicker">Country desks</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
          Thirteen countries, one region
        </h1>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          National CERTs, exposed sectors and the latest reporting for each country we cover.
        </p>
      </header>

      <div className="grid gap-10 border-t-2 border-edge pt-6 md:grid-cols-12">
        {/* Index */}
        <nav aria-label="Countries" className="md:col-span-4">
          {REGIONS.map((region) => {
            const list = countries.filter((c) => c.region === region);
            if (!list.length) return null;
            return (
              <div key={region} className="mb-6 last:mb-0">
                <p className="kicker mb-1">{region}</p>
                <ul>
                  {list.map((c) => {
                    const sel = c.code === selected.code;
                    const on = followed.includes(c.code);
                    return (
                      <li key={c.code}>
                        <button
                          onClick={() => pick(c)}
                          aria-current={sel ? "true" : undefined}
                          className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-2 border-b border-rule px-1.5 py-2 text-left text-sm transition-colors ${
                            sel ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-raised hover:text-ink"
                          }`}
                        >
                          <span className={`font-mono text-2xs ${sel ? "text-paper/60" : "text-ink-3"}`}>{c.code}</span>
                          <span className="truncate">
                            {c.name}
                            {on && (
                              <span className={`ml-2 font-mono text-2xs ${sel ? "text-paper/60" : "text-ink-3"}`} title="Following">
                                ●
                              </span>
                            )}
                          </span>
                          <LevelBars level={LEVEL[c.threatLevel] ?? 1} inverted={sel} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Desk */}
        <section key={selected.code} aria-label={`${selected.name} desk`} className="animate-rise md:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="kicker">{selected.region} desk</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink">{selected.name}</h2>
              <p className="mt-1 font-serif text-xl text-ink-3" lang="ar" dir="rtl">
                {selected.nativeName}
              </p>
            </div>
            <button
              onClick={() => toggleFollow(selected.code)}
              aria-pressed={isFollowing}
              className={`btn ${
                isFollowing ? "bg-ink text-paper hover:bg-signal" : "border border-edge text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>

          <dl className="mt-6 grid border-y border-rule sm:grid-cols-[auto_1fr]">
            <div className="py-3 sm:pr-6">
              <dt className="kicker">Our assessment</dt>
              <dd className={`mt-1 flex items-center gap-2 font-serif text-xl ${level >= 3 ? "text-signal" : "text-ink"}`}>
                <LevelBars level={level} />
                {selected.threatLevel}
              </dd>
            </div>
            <div className="border-t border-rule py-3 sm:border-l sm:border-t-0 sm:pl-6">
              <dt className="kicker">National CERT</dt>
              <dd className="mt-1 font-serif text-xl text-ink">{selected.certAgency}</dd>
            </div>
          </dl>

          <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-ink-2">{selected.summary}</p>

          <div className="mt-5">
            <p className="kicker">Sectors most exposed</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink">
              {selected.criticalInfrastructureSectors.map((s) => (
                <li key={s} className="before:mr-2 before:text-ink-4 before:content-['-']">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Coverage */}
      <section aria-label={`Coverage: ${selected.name}`} className="mt-16">
        <div className="section-head">
          <h2 className="section-title">Latest from {selected.name}</h2>
          <span className="text-xs font-medium text-ink-3 tabular">
            {loading ? "Loading…" : `${articles.length} ${articles.length === 1 ? "story" : "stories"}`}
          </span>
        </div>

        {loading && <LoadingSkeleton rows={3} />}

        {!loading && articles.length === 0 && (
          <div className="border-t border-rule py-10">
            <p className="font-serif text-xl text-ink">No recent stories about {selected.name}.</p>
            <p className="mt-2 max-w-prose text-ink-2">
              {isFollowing
                ? "You're following this country, so new stories will show under Following on the front page."
                : "Follow this country to collect its stories under Following on the front page."}
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="border-b border-rule">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MenaWatchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MenaWatchContent />
    </Suspense>
  );
}
