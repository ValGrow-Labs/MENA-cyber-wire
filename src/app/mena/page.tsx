"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CountryData } from "@/types/country";
import { NewsArticle } from "@/types/news";
import NewsCard from "@/components/news/NewsCard";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import { Globe2 } from "lucide-react";

function MenaWatchContent() {
  const searchParams = useSearchParams();
  const initialCountryCode = searchParams.get("country") || "SA";

  const [selectedCountry, setSelectedCountry] = useState<CountryData>(() => {
    return MENA_COUNTRIES.find((c) => c.code.toLowerCase() === initialCountryCode.toLowerCase()) || MENA_COUNTRIES[0];
  });

  const [countryArticles, setCountryArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get("country");
    if (code) {
      const match = MENA_COUNTRIES.find((c) => c.code.toLowerCase() === code.toLowerCase());
      if (match) setSelectedCountry(match);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?country=${encodeURIComponent(selectedCountry.name)}`)
      .then((res) => res.json())
      .then((data) => {
        setCountryArticles(data.data || []);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, [selectedCountry]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-border shadow-coastal-card">
        <div className="flex items-center gap-2 mb-1">
          <Globe2 className="w-5 h-5 text-teal" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal">
            Regional Intelligence Dossier
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-ocean">
          MENA Watch: 13 National Cyber Profiles & Directives
        </h1>
        <p className="text-xs text-slate-muted max-w-2xl mt-1 leading-relaxed">
          Select any of the 13 monitored nations to review national CERT mandates, critical infrastructure exposure profiles, and active incidents.
        </p>
      </div>

      {/* Country Selector Grid */}
      <div className="p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-muted block mb-3">
          Select Nation
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {MENA_COUNTRIES.map((c) => {
            const isSelected = c.code === selectedCountry.code;
            return (
              <button
                key={c.code}
                onClick={() => setSelectedCountry(c)}
                className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? "bg-teal text-white font-bold shadow-coastal scale-102"
                    : "bg-ice text-slate-dark border border-slate-border hover:border-teal hover:bg-mist"
                }`}
              >
                <span className="text-2xl mb-1">{c.flag}</span>
                <span className="text-xs font-semibold truncate w-full">{c.name}</span>
                <span className="text-[10px] opacity-80">{c.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Country Detailed Dossier Card */}
      <div className="p-6 rounded-2xl bg-mist/60 border border-mist-border shadow-coastal-card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-mist-border">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{selectedCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-ocean">
                  {selectedCountry.name}
                </h2>
                <span className="text-sm text-slate-muted font-medium">
                  {selectedCountry.nativeName}
                </span>
              </div>
              <p className="text-xs font-mono text-teal font-semibold mt-0.5">
                Designated CERT: <strong className="text-ocean">{selectedCountry.certAgency}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase ${
              selectedCountry.threatLevel === "High"
                ? "bg-alert-light text-alert-orange border border-alert-border"
                : "bg-amber-light text-amber-dark border border-amber-border"
            }`}>
              Threat: {selectedCountry.threatLevel}
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white text-ocean border border-slate-border">
              {selectedCountry.activeIncidents} active incident{selectedCountry.activeIncidents > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-sm text-slate-dark leading-relaxed">
          {selectedCountry.summary}
        </p>

        {/* Critical Infrastructure Exposure */}
        <div className="pt-3 border-t border-mist-border">
          <span className="text-xs font-bold uppercase tracking-wider text-ocean block mb-2">
            Monitored Critical Verticals:
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedCountry.criticalInfrastructureSectors.map((sector) => (
              <span
                key={sector}
                className="px-3 py-1 text-xs rounded-lg bg-white text-ocean border border-slate-border font-medium shadow-2xs"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Country News Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ocean">
            Live Stream: {selectedCountry.name}
          </h3>
          <span className="text-xs text-slate-muted">
            {countryArticles.length} verified reports
          </span>
        </div>

        {loading && <LoadingSkeleton />}

        {!loading && countryArticles.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-border">
            <p className="text-xs text-slate-muted">
              No active alerts specific to {selectedCountry.name} logged in this hourly cycle.
            </p>
          </div>
        )}

        {!loading && countryArticles.length > 0 && (
          <div className="space-y-4">
            {countryArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
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
