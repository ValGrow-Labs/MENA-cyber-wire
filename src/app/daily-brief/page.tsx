"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTodayCyberPulse } from "@/lib/threat/cyber-pulse";
import { CyberPulseSummary, CVEItem } from "@/types/threat";
import { NewsArticle } from "@/types/news";

const ACTIONS = [
  "Check perimeter gateways (PAN-OS, Ivanti, Fortinet) against the current KEV list and patch anything listed.",
  "Warn finance teams about phishing that imitates GCC regulator memos; MuddyWater has used this lure repeatedly.",
  "Confirm offline backups exist and restore cleanly for OT historian and SCADA servers.",
  "Require hardware-key or app-based MFA on every administrative portal, including vendor access.",
];

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-x-6 border-t-2 border-edge pt-4 sm:grid-cols-[3.5rem_1fr]">
      <span className="font-mono text-2xl leading-none text-ink-4 tabular" aria-hidden>
        {String(n).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink sm:mt-0">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

function RowSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="animate-pulse" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2 border-t border-rule py-4">
          <div className="h-3 w-32 bg-paper-sunk" />
          <div className="h-5 w-11/12 bg-paper-sunk" />
          <div className="h-3 w-3/4 bg-paper-sunk" />
        </div>
      ))}
    </div>
  );
}

export default function DailyBriefPage() {
  const [pulse, setPulse] = useState<CyberPulseSummary | null>(null);
  const [topStories, setTopStories] = useState<NewsArticle[]>([]);
  const [topCves, setTopCves] = useState<CVEItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPulse(getTodayCyberPulse());
    Promise.all([
      fetch("/api/cyber-pulse").then((r) => r.json()).catch(() => null),
      fetch("/api/news?sortBy=latest").then((r) => r.json()).catch(() => null),
      fetch("/api/vulnerabilities?severity=CRITICAL").then((r) => r.json()).catch(() => null),
    ])
      .then(([pulseData, newsData, cveData]) => {
        if (pulseData?.pulse) setPulse(pulseData.pulse);
        if (Array.isArray(newsData?.data)) setTopStories(newsData.data.slice(0, 5));
        if (Array.isArray(cveData?.data)) setTopCves(cveData.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <article className="max-w-[46rem]">
      <header className="pb-6">
        <p className="kicker">Daily brief · {pulse?.date ?? " "}</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
          The morning brief
        </h1>
        <p className="mt-3 max-w-prose font-serif text-lg text-ink-2">
          What security teams in the region should know before the first meeting of the day.
        </p>
        <div className="mt-5 flex gap-5 text-xs font-medium text-ink-3">
          <button onClick={() => window.print()} className="hover:text-ink">
            Print
          </button>
          <Link href="/breaking" className="hover:text-ink">
            Full wire →
          </Link>
        </div>
      </header>

      <div className="space-y-14">
        {pulse && (
          <Section n={1} title="The short version">
            <p className="font-serif text-xl leading-relaxed text-ink first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-[3.4rem] first-letter:font-semibold first-letter:leading-[0.85]">
              {pulse.keyTakeaway}
            </p>
            <dl className="mt-6 grid border-y border-rule text-sm sm:grid-cols-2">
              <div className="py-3 sm:pr-4">
                <dt className="kicker">Sectors in focus</dt>
                <dd className="mt-1.5 text-ink">{pulse.targetedSectors.join(", ")}</dd>
              </div>
              <div className="border-t border-rule py-3 sm:border-l sm:border-t-0 sm:pl-4">
                <dt className="kicker">Groups we&apos;re tracking</dt>
                <dd className="mt-1.5 text-ink">{pulse.primaryThreatActors.join(", ")}</dd>
              </div>
            </dl>
          </Section>
        )}

        <Section n={2} title="On the wire">
          {loading ? (
            <RowSkeleton rows={4} />
          ) : topStories.length === 0 ? (
            <p className="text-ink-3">No stories came through the feed this morning.</p>
          ) : (
            <ol className="border-b border-rule">
              {topStories.map((s, i) => (
                <li key={s.id} className="grid grid-cols-[1.75rem_1fr] gap-x-3 border-t border-rule py-5">
                  <span className="font-mono text-sm text-ink-3 tabular">{i + 1}.</span>
                  <div className="min-w-0">
                    <p className="kicker flex flex-wrap gap-x-3">
                      {s.country && <span>{s.country}</span>}
                      <span>{s.category}</span>
                      <span className="normal-case tracking-normal">{s.sourceName}</span>
                    </p>
                    <Link href={`/article/${s.id}`} className="group">
                      <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-ink decoration-1 underline-offset-[5px] group-hover:underline">
                        {s.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{s.description}</p>
                    {s.threatToAction && (
                      <p className="mt-3 border-l-2 border-edge pl-3 text-sm leading-relaxed text-ink">
                        <span className="kicker mr-2 text-ink">What to do</span>
                        {s.threatToAction.whatShouldUsersDo}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Section>

        <Section n={3} title="Patch first">
          {loading ? (
            <RowSkeleton />
          ) : topCves.length === 0 ? (
            <p className="text-ink-3">NVD returned no critical records this morning.</p>
          ) : (
            <ul className="border-b border-rule">
              {topCves.map((cve) => (
                <li key={cve.id} className="border-t border-rule py-4">
                  <a href={cve.sourceUrl} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="flex items-baseline justify-between gap-4 font-mono text-sm">
                      <span className="text-ink group-hover:underline group-hover:underline-offset-4">{cve.id}</span>
                      <span className="text-2xs uppercase tracking-wider text-signal tabular">
                        CVSS {cve.cvssScore.toFixed(1)}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-2">
                      {cve.description}
                    </span>
                    {cve.isExploitedInWild && (
                      <span className="mt-1.5 block text-xs font-medium text-signal">
                        Known exploited
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <Link href="/threats" className="link mt-4 inline-block text-sm text-ink">
            All vulnerabilities →
          </Link>
        </Section>

        <Section n={4} title="This week's checklist">
          <ol className="space-y-3">
            {(pulse?.recommendedDefensiveActions || ACTIONS).map((a, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-2">
                <span className="font-mono text-2xs leading-6 text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </article>
  );
}
