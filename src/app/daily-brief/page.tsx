"use client";

import { useEffect, useState } from "react";
import { getTodayCyberPulse } from "@/lib/threat/cyber-pulse";
import { CyberPulseSummary } from "@/types/threat";
import { NewsArticle } from "@/types/news";
import { CVEItem } from "@/types/threat";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight,
  Printer
} from "lucide-react";
import Link from "next/link";

export default function DailyBriefPage() {
  const [pulse, setPulse] = useState<CyberPulseSummary | null>(null);
  const [topStories, setTopStories] = useState<NewsArticle[]>([]);
  const [topCves, setTopCves] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPulse(getTodayCyberPulse());

    Promise.all([
      fetch("/api/news?status=SIGNAL&sortBy=latest").then((r) => r.json()),
      fetch("/api/vulnerabilities?severity=CRITICAL").then((r) => r.json()),
    ])
      .then(([newsData, cveData]) => {
        if (newsData.data) setTopStories(newsData.data.slice(0, 5));
        if (cveData.data) setTopCves(cveData.data.slice(0, 3));
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Editorial Header (Coastal Tech Ocean Blue & Deep Teal) */}
      <div className="p-6 rounded-2xl bg-ocean text-white shadow-coastal-elevated">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2 mb-1 text-amber-desert">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Morning Intelligence Brief
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
              MENA Daily Cyber Brief
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-mist font-mono border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-amber-desert" />
              <span>{pulse?.date}</span>
            </span>
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Print Brief"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Executive Threat Posture */}
        {pulse && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
              <span className="text-mist-light block mb-1">Threat Posture</span>
              <span className="text-base font-extrabold text-amber-desert font-mono">
                DEFCON: {pulse.threatLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
              <span className="text-mist-light block mb-1">Active Intrusions</span>
              <span className="text-base font-extrabold text-white font-mono">
                {pulse.activeIncidentsCount} High-Severity Incidents
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
              <span className="text-mist-light block mb-1">Target Sectors</span>
              <span className="text-xs font-semibold text-white">
                {pulse.targetedSectors.join(", ")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Section 1: Executive Summary */}
      {pulse && (
        <section className="p-6 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-border">
            <span className="w-2.5 h-2.5 rounded-full bg-teal" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-ocean">
              1. Executive Intelligence Overview
            </h2>
          </div>
          <p className="text-sm text-slate-dark leading-relaxed">
            {pulse.keyTakeaway}
          </p>
        </section>
      )}

      {/* Section 2: Top 5 Regional Stories */}
      <section className="p-6 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-border">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-desert" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ocean">
            2. Top Verified Regional Incidents
          </h2>
        </div>

        <div className="space-y-4">
          {topStories.map((story, i) => (
            <div
              key={story.id}
              className="p-4 rounded-xl bg-ice border border-slate-border space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-teal">#{i + 1}</span>
                  {story.country && (
                    <span className="font-bold text-ocean">
                      [{story.country}]
                    </span>
                  )}
                  <span className="text-slate-muted">&middot; {story.category}</span>
                </div>
                <span className="text-[11px] text-slate-muted">
                  {story.sourceName}
                </span>
              </div>

              <Link href={`/article/${story.id}`}>
                <h3 className="text-sm sm:text-base font-bold text-ocean hover:text-teal transition-colors leading-snug">
                  {story.title}
                </h3>
              </Link>

              <p className="text-xs text-slate-dark leading-relaxed">
                {story.description}
              </p>

              {story.threatToAction && (
                <div className="mt-2 text-xs font-medium text-slate-dark bg-white p-2.5 rounded-lg border border-slate-border">
                  <strong className="text-teal">Defensive Takeaway: </strong>
                  {story.threatToAction.whatShouldUsersDo}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Critical CVEs of the Day */}
      <section className="p-6 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-border">
          <span className="w-2.5 h-2.5 rounded-full bg-alert-orange" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ocean">
            3. Priority Vulnerabilities Requiring Immediate Action
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topCves.map((cve) => (
            <div
              key={cve.id}
              className="p-3.5 rounded-xl bg-ice border border-slate-border flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-ocean">
                    {cve.id}
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-alert-light text-alert-orange border border-alert-border">
                    {cve.cvssScore}
                  </span>
                </div>
                <p className="text-xs text-slate-dark line-clamp-2 mb-2">
                  {cve.description}
                </p>
              </div>
              <a
                href={cve.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-teal hover:underline flex items-center gap-1 mt-2"
              >
                <span>NVD Advisory</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Recommended SOC & IT Actions */}
      <section className="p-6 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-border">
          <span className="w-2.5 h-2.5 rounded-full bg-teal" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-ocean">
            4. Recommended Actions for MENA IT & Security Teams
          </h2>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-dark">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
            <span>Audit perimeter gateway appliances (PAN-OS, Ivanti, Fortinet) against active CVE listings.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
            <span>Alert finance officers to ongoing MuddyWater phishing campaigns mimicking GCC regulatory memos.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
            <span>Verify air-gapped backup schedules for OT/SCADA telemetry historian nodes in industrial sectors.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
            <span>Enforce biometric or hardware token multi-factor authentication on all administrative portals.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
