"use client";

import { useState } from "react";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CountryData } from "@/types/country";
import { Shield, AlertTriangle, ExternalLink, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

interface Props {
  onSelectCountry?: (country: CountryData) => void;
  selectedCountryCode?: string;
}

export default function CountryImpactMap({ onSelectCountry, selectedCountryCode }: Props) {
  const [activeCode, setActiveCode] = useState<string>(selectedCountryCode || "SA");

  const currentCountry = MENA_COUNTRIES.find((c) => c.code === activeCode) || MENA_COUNTRIES[0];

  const handleCountryClick = (c: CountryData) => {
    setActiveCode(c.code);
    if (onSelectCountry) {
      onSelectCountry(c);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-border p-5 sm:p-6 shadow-coastal-card">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-border">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-ocean flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
            MENA Cyber Impact Map & Regional Threat Posture
          </h3>
          <p className="text-xs text-slate-muted mt-0.5">
            Real-time cybersecurity posture monitoring across 13 Middle East & North African nations.
          </p>
        </div>

        <Link
          href={`/mena?country=${currentCountry.code}`}
          className="text-xs font-bold text-teal hover:text-teal-dark flex items-center gap-1 hover:underline"
        >
          <span>View {currentCountry.name} Dossier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Country Pills (Coastal Tech styled) */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {MENA_COUNTRIES.map((c) => {
          const isSelected = c.code === activeCode;
          return (
            <button
              key={c.code}
              onClick={() => handleCountryClick(c)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isSelected
                ? "bg-teal text-white shadow-coastal scale-102 font-bold"
                : "bg-ice text-slate-dark border border-slate-border hover:border-teal hover:bg-mist"
                }`}
            >
              <span className="text-sm">{c.flag}</span>
              <span>{c.name}</span>
              <span className={`w-2 h-2 rounded-full ${c.threatLevel === "High" ? "bg-alert-orange" : c.threatLevel === "Elevated" ? "bg-amber-desert" : "bg-teal"
                }`} />
            </button>
          );
        })}
      </div>

      {/* Selected Country Dossier Panel */}
      <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-mist/60 border border-mist-border space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-mist-border">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-ocean">
                  {currentCountry.name}
                </h4>
                <span className="text-xs text-slate-muted">
                  ({currentCountry.nativeName})
                </span>
              </div>
              <span className="text-xs font-mono text-teal font-semibold">
                National CERT: {currentCountry.certAgency}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${currentCountry.threatLevel === "High"
              ? "bg-alert-light text-alert-orange border border-alert-border"
              : "bg-amber-light text-amber-dark border border-amber-border"
              }`}>
              Threat: {currentCountry.threatLevel}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-ocean border border-slate-border">
              {currentCountry.activeIncidents} active alert{currentCountry.activeIncidents > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Narrative Summary */}
        <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
          {currentCountry.summary}
        </p>

        {/* Sectors */}
        <div className="pt-2 border-t border-mist-border flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-ocean">
            Critical Infrastructure Verticals:
          </span>
          {currentCountry.criticalInfrastructureSectors.map((sector) => (
            <span
              key={sector}
              className="text-[11px] px-2.5 py-0.5 rounded-md bg-white border border-slate-border text-slate-dark font-medium"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
