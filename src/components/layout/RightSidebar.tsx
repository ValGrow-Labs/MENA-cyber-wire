"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  ShieldAlert, 
  ArrowRight,
  Radio,
  FileCheck2,
  BookOpen
} from "lucide-react";
import { getTodayCyberPulse } from "@/lib/threat/cyber-pulse";
import { CVEItem, CyberPulseSummary, CISAAdvisory } from "@/types/threat";

export default function RightSidebar() {
  const [pulse, setPulse] = useState<CyberPulseSummary | null>(null);
  const [topCves, setTopCves] = useState<CVEItem[]>([]);
  const [advisories, setAdvisories] = useState<CISAAdvisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPulse(getTodayCyberPulse());

    Promise.all([
      fetch("/api/vulnerabilities?severity=CRITICAL").then((r) => r.json()),
      fetch("/api/advisories").then((r) => r.json()),
    ])
      .then(([cveData, advData]) => {
        if (cveData.data) setTopCves(cveData.data.slice(0, 3));
        if (advData.data) setAdvisories(advData.data.slice(0, 3));
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Regional Cyber Pulse Panel */}
      <div className="p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-teal-light text-teal">
              <Radio className="w-4 h-4 text-teal animate-pulse" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Regional Cyber Pulse
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-muted bg-ice px-2 py-0.5 rounded-md border border-slate-border">
            {pulse?.date}
          </span>
        </div>

        {pulse && (
          <div className="mt-3 space-y-3">
            {/* Threat Posture Meter */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-mist border border-mist-border">
              <span className="text-xs text-ocean font-medium">National Posture:</span>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-md bg-alert-orange text-white tracking-wider">
                {pulse.threatLevel} ADVISORY
              </span>
            </div>

            <p className="text-xs text-slate-dark leading-relaxed">
              {pulse.headline}
            </p>

            {/* Targeted Sectors */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-muted">
                Targeted Critical Sectors
              </span>
              <div className="flex flex-wrap gap-1">
                {pulse.targetedSectors.map((sector) => (
                  <span
                    key={sector}
                    className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-ice text-ocean border border-slate-border"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Threat Actors */}
            <div className="pt-2 border-t border-slate-border">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-muted block mb-1">
                Monitored Threat Actors
              </span>
              <div className="flex flex-wrap gap-1">
                {pulse.primaryThreatActors.map((actor) => (
                  <span
                    key={actor}
                    className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-teal-light text-teal border border-teal-border"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/daily-brief"
                className="flex items-center justify-between w-full py-1.5 px-2 text-xs font-bold text-teal hover:text-teal-dark transition-colors"
              >
                <span>Read Full Daily Intelligence Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 2. Critical CVE Watch Panel */}
      <div className="p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-light text-amber-dark">
              <ShieldAlert className="w-4 h-4 text-amber-dark" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Critical CVE Watch
            </h3>
          </div>
          <Link href="/threats" className="text-[11px] text-teal hover:underline font-bold">
            All CVEs
          </Link>
        </div>

        <div className="mt-3 space-y-3">
          {topCves.map((cve) => (
            <div
              key={cve.id}
              className="p-3 rounded-xl bg-ice border border-slate-border hover:border-teal transition-colors shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-ocean">
                  {cve.id}
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-alert-light text-alert-orange border border-alert-border">
                  CVSS {cve.cvssScore}
                </span>
              </div>
              <p className="text-[11px] text-slate-dark line-clamp-2 leading-snug">
                {cve.description}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-border">
                <span className="text-alert-orange font-semibold">Actively Exploited</span>
                <a
                  href={cve.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-teal font-semibold hover:underline"
                >
                  <span>NVD Record</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Official Government Advisories */}
      <div className="p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-border">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-teal-light text-teal">
              <FileCheck2 className="w-4 h-4 text-teal" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Government Advisories
            </h3>
          </div>
          <Link href="/threats" className="text-[11px] text-teal hover:underline font-bold">
            View Feed
          </Link>
        </div>

        <div className="mt-3 space-y-2.5">
          {advisories.map((adv) => (
            <a
              key={adv.id}
              href={adv.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2.5 rounded-xl bg-ice border border-slate-border hover:border-teal/40 transition-colors group"
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-mono text-alert-orange font-bold">{adv.id}</span>
                <span className="text-slate-muted">{new Date(adv.publishedDate).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
              </div>
              <h4 className="text-xs font-semibold text-ocean group-hover:text-teal line-clamp-2 leading-snug">
                {adv.title}
              </h4>
              <span className="text-[10px] text-teal font-semibold flex items-center gap-1 mt-1.5">
                <span>{adv.source}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 4. Daily Cyber Brief Card */}
      <div className="p-5 rounded-2xl bg-ocean text-white shadow-coastal-card space-y-3">
        <div className="flex items-center gap-2 text-amber-desert">
          <BookOpen className="w-4 h-4 text-amber-desert" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Daily Cyber Brief
          </span>
        </div>
        <h4 className="text-base font-bold font-serif leading-snug">
          Today&apos;s 5-Point Regional Threat Brief
        </h4>
        <p className="text-xs text-mist-light leading-relaxed">
          Morning digest covering targeted GCC banking portals, maritime SCADA perimeters, and required CISO defensive actions.
        </p>
        <Link
          href="/daily-brief"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-bold transition-all shadow-coastal w-full justify-center"
        >
          <span>Open Today&apos;s Digest</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
