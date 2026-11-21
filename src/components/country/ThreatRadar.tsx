"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CountryData } from "@/types/country";

const LEVEL: Record<CountryData["threatLevel"], number> = { Guarded: 1, Elevated: 2, High: 3, Critical: 4 };

// Radar centre sits over the Gulf, where most of our coverage clusters.
const CX = 60;
const CY = 50;

/**
 * Abstract regional radar. Positions come from mena-countries.ts (normalised 0-100).
 * Marker size and pulse follow our editorial threat assessment, not live telemetry.
 */
export default function ThreatRadar({ onSelect }: { onSelect?: (c: CountryData) => void }) {
  const [active, setActive] = useState("SA");
  const current = MENA_COUNTRIES.find((c) => c.code === active) || MENA_COUNTRIES[0];

  const pick = (c: CountryData) => {
    setActive(c.code);
    onSelect?.(c);
  };

  return (
    <div className="grid lg:grid-cols-12">
      {/* Map plate */}
      <div className="relative overflow-hidden border-b border-rule bg-paper lg:col-span-8 lg:border-b-0 lg:border-r">

        <svg viewBox="0 12 100 62" className="block h-auto w-full text-ink" role="img" aria-label="Map of MENA countries by threat assessment">
          <defs>
            <radialGradient id="sweep" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${CX} ${CY}) scale(60)`}>
              <stop offset="0" stopColor="rgb(var(--brand))" stopOpacity="0.2" />
              <stop offset="1" stopColor="rgb(var(--brand))" stopOpacity="0" />
            </radialGradient>
            <pattern id="dots" width="2" height="2" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.13" fill="currentColor" fillOpacity="0.14" />
            </pattern>
          </defs>

          <rect x="0" y="12" width="100" height="62" fill="url(#dots)" />

          {/* range rings + crosshair */}
          {[10, 20, 32, 46].map((r) => (
            <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="currentColor" strokeOpacity="0.10" strokeWidth="0.15" />
          ))}
          <line x1="0" y1={CY} x2="100" y2={CY} stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.12" />
          <line x1={CX} y1="12" x2={CX} y2="74" stroke="currentColor" strokeOpacity="0.07" strokeWidth="0.12" />

          {/* links from the selected desk to others at the same or higher level */}
          {MENA_COUNTRIES.filter((c) => c.code !== current.code && LEVEL[c.threatLevel] >= 3).map((c) => (
            <line
              key={`l-${c.code}`}
              x1={current.coordinates.x}
              y1={current.coordinates.y}
              x2={c.coordinates.x}
              y2={c.coordinates.y}
              stroke="rgb(var(--signal))" strokeOpacity="0.4"
              strokeWidth="0.15"
              strokeDasharray="0.6 0.8"
            />
          ))}

          {MENA_COUNTRIES.map((c) => {
            const lvl = LEVEL[c.threatLevel] ?? 1;
            const hot = lvl >= 3;
            const sel = c.code === active;
            const r = 0.55 + lvl * 0.28;
            const colour = hot ? "rgb(var(--signal))" : lvl === 2 ? "rgb(var(--caution))" : "rgb(var(--ink-4))";
            return (
              <g
                key={c.code}
                role="button"
                tabIndex={0}
                aria-label={`${c.name}: ${c.threatLevel}`}
                aria-pressed={sel}
                onClick={() => pick(c)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(c)}
                className="cursor-pointer outline-none [&:focus-visible_circle.hit]:stroke-white"
              >
                {hot && (
                  <circle
                    cx={c.coordinates.x}
                    cy={c.coordinates.y}
                    r={r * 1.6}
                    fill="none"
                    stroke={colour}
                    strokeWidth="0.2"
                    className="animate-ring motion-reduce:hidden"
                    style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: `${(c.coordinates.x * 37) % 2600}ms` }}
                  />
                )}
                <circle cx={c.coordinates.x} cy={c.coordinates.y} r={3} fill="transparent" className="hit" />
                {sel && <circle cx={c.coordinates.x} cy={c.coordinates.y} r={r + 1.1} fill="none" stroke="currentColor" strokeWidth="0.18" />}
                <circle cx={c.coordinates.x} cy={c.coordinates.y} r={r} fill={colour} />
                <text
                  x={c.coordinates.x + r + 0.9}
                  y={c.coordinates.y + 0.55}
                  fontSize="1.55"
                  fontFamily="'IBM Plex Sans', sans-serif" fontWeight="600"
                  letterSpacing="0.12"
                  fill="currentColor" fillOpacity={sel ? 1 : 0.55}
                >
                  {c.code}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute bottom-4 left-5 flex flex-wrap gap-4 text-xs text-ink-3">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" /> High</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-caution" /> Elevated</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-4" /> Guarded</span>
        </div>
      </div>

      {/* Selected desk plate */}
      <div key={current.code} className="flex animate-rise flex-col p-6 lg:col-span-4">
        <p className="kicker">{current.region} desk</p>
        <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.02em] text-ink">{current.name}</h3>
        <p className="mt-1 text-ink-3" lang="ar">{current.nativeName}</p>

        <div className="mt-6 flex items-baseline gap-3">
          <span
            className={`font-serif text-5xl font-semibold tracking-tight ${
              LEVEL[current.threatLevel] >= 3 ? "text-signal" : LEVEL[current.threatLevel] === 2 ? "text-caution" : "text-ink-2"
            }`}
          >
            {current.threatLevel}
          </span>
          <span className="kicker">Our assessment</span>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-2 line-clamp-5">{current.summary}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {current.criticalInfrastructureSectors.slice(0, 4).map((s) => (
            <span key={s} className="rounded-md bg-paper-sunk px-2 py-1 text-xs text-ink-2">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-7">
          <Link href={`/mena?country=${current.code}`} className="btn-quiet group">
            Open the {current.name} desk
            <span className="btn-icon">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
