"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CountryData } from "@/types/country";

interface Props {
  onSelectCountry?: (country: CountryData) => void;
  selectedCountryCode?: string;
}

const LEVEL: Record<CountryData["threatLevel"], number> = { Guarded: 1, Elevated: 2, High: 3, Critical: 4 };
const REGIONS: CountryData["region"][] = ["Gulf", "Levant", "North Africa"];

/** Country desks: an index grouped by region on the left, the selected dossier on the right. */
export default function CountryImpactMap({ onSelectCountry, selectedCountryCode }: Props) {
  const [countries, setCountries] = useState<CountryData[]>(MENA_COUNTRIES);
  const [active, setActive] = useState(selectedCountryCode || "SA");

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.data) && d.data.length > 0) setCountries(d.data);
      })
      .catch(() => {});
  }, []);

  const current = countries.find((c) => c.code === active) || countries[0];

  const pick = (c: CountryData) => {
    setActive(c.code);
    onSelectCountry?.(c);
  };

  return (
    <div>
      <div className="section-head">
        <h2 className="section-title">Country desks</h2>
        <Link href="/mena" className="text-xs font-medium text-ink-3 hover:text-ink">
          All 13 →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          {REGIONS.map((region) => {
            const list = countries.filter((c) => c.region === region);
            if (!list.length) return null;
            return (
              <div key={region} className="mb-4 last:mb-0">
                <p className="kicker mb-1">{region}</p>
                <ul>
                  {list.map((c) => {
                    const sel = c.code === active;
                    const lvl = LEVEL[c.threatLevel] ?? 1;
                    return (
                      <li key={c.code}>
                        <button
                          onClick={() => pick(c)}
                          aria-pressed={sel}
                          className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-2 border-b border-rule px-1.5 py-2 text-left text-sm transition-colors ${
                            sel ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-raised hover:text-ink"
                          }`}
                        >
                          <span className={`font-mono text-2xs ${sel ? "text-paper/60" : "text-ink-3"}`}>{c.code}</span>
                          <span className="truncate">{c.name}</span>
                          <span className="flex items-end gap-[2px]" title={`Threat level: ${c.threatLevel}`}>
                            {[1, 2, 3, 4].map((i) => (
                              <span
                                key={i}
                                className={`w-[3px] ${
                                  i <= lvl
                                    ? lvl >= 3
                                      ? "bg-signal"
                                      : sel
                                      ? "bg-paper"
                                      : "bg-ink"
                                    : sel
                                    ? "bg-paper/25"
                                    : "bg-rule"
                                }`}
                                style={{ height: `${3 + i * 2}px` }}
                              />
                            ))}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        <div key={current.code} className="animate-rise md:col-span-7">
          <p className="kicker">{current.region} desk</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink">{current.name}</h3>
          <p className="mt-1 font-serif text-lg text-ink-3" lang="ar">
            {current.nativeName}
          </p>

          <dl className="mt-5 grid grid-cols-2 border-y border-rule">
            <div className="py-3 pr-3">
              <dt className="kicker">Our assessment</dt>
              <dd className={`mt-1 font-serif text-xl ${LEVEL[current.threatLevel] >= 3 ? "text-signal" : "text-ink"}`}>
                {current.threatLevel}
              </dd>
            </div>
            <div className="border-l border-rule px-3 py-3">
              <dt className="kicker">National CERT</dt>
              <dd className="mt-1 text-sm leading-snug text-ink">{current.certAgency}</dd>
            </div>
          </dl>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{current.summary}</p>
          <p className="mt-2 text-sm text-ink-3">
            <span className="kicker mr-2">Key sectors</span>
            {current.criticalInfrastructureSectors.join(" · ")}
          </p>

          <Link href={`/mena?country=${current.code}`} className="link mt-5 inline-block text-sm text-ink">
            Open the {current.name} desk →
          </Link>
        </div>
      </div>
    </div>
  );
}
