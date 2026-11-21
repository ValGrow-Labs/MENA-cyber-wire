"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import StoryCover from "@/components/shared/StoryCover";
import { NewsArticle } from "@/types/news";
import { CVEItem } from "@/types/threat";

export const ago = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return m === 1 ? "1 minute ago" : `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
  if (h < 48) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/** Severity as words, not a badge. Only "Critical" uses the accent. */
export function SevText({ sev }: { sev: string }) {
  if (sev === "Low") return null; // automatic guess; not worth a label
  const tone = sev === "Critical" ? "text-brand font-semibold" : sev === "High" ? "text-caution font-medium" : "text-ink-3";
  return <span className={`text-sm ${tone}`}>{sev}</span>;
}

/* ---------- Hero: asymmetric split ---------- */

export function HeroStory({ a }: { a: NewsArticle }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="order-2 lg:order-1 lg:col-span-5">
        <p className="text-sm font-semibold text-brand">{a.category}</p>
        <Link href={`/article/${a.id}`} className="group block">
          <h1 className="mt-3 text-[2.1rem] font-bold leading-[1.06] tracking-[-0.035em] text-ink transition-colors group-hover:text-ink-2 sm:text-[2.6rem] lg:text-[2.75rem]">
            {a.title}
          </h1>
        </Link>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">{a.description}</p>
        <p className="mt-5 text-sm text-ink-3">
          {a.sourceName}, {ago(a.publishedAt)}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={`/article/${a.id}`} className="btn-primary group">
            Read the story
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
          <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-quiet">
            Primary source
          </a>
        </div>
      </div>
      <Link href={`/article/${a.id}`} className="group order-1 block lg:order-2 lg:col-span-7" tabIndex={-1}>
        <StoryCover article={a} width={1600} className="aspect-[4/3] w-full rounded-xl sm:aspect-[16/11]" />
      </Link>
    </article>
  );
}

/* ---------- Top stories: two image tiles + a "Just in" list ---------- */

export function StoryTile({ a }: { a: NewsArticle }) {
  return (
    <Link href={`/article/${a.id}`} className="view-in group block">
      <StoryCover article={a} width={900} className="aspect-[3/2] w-full rounded-xl" />
      <p className="mt-4 text-sm font-semibold text-brand">{a.category}</p>
      <h3 className="mt-1.5 text-xl font-bold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-ink-2">{a.title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-2">{a.description}</p>
      <p className="mt-3 flex items-center gap-3 text-sm text-ink-3">
        <span>{ago(a.publishedAt)}</span>
        <SevText sev={a.severity} />
      </p>
    </Link>
  );
}

export function JustIn({ items }: { items: NewsArticle[] }) {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-[-0.02em] text-ink">Just in</h2>
      <ol className="mt-4">
        {items.map((a) => (
          <li key={a.id} className="view-in border-t border-rule first:border-t-0">
            <Link href={`/article/${a.id}`} className="group grid grid-cols-[4.25rem_1fr] gap-3 py-4">
              <time dateTime={a.publishedAt} className="pt-0.5 text-sm text-ink-3 tabular">
                {new Date(a.publishedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" })}
              </time>
              <span className="text-[0.9375rem] font-medium leading-snug text-ink transition-colors group-hover:text-brand">{a.title}</span>
            </Link>
          </li>
        ))}
      </ol>
      <Link href="/breaking" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand">
        Everything on the wire <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

export function TopSkeleton() {
  return (
    <div className="grid animate-pulse items-center gap-12 lg:grid-cols-12" aria-hidden>
      <div className="space-y-4 lg:col-span-5">
        <div className="h-4 w-24 rounded bg-paper-sunk" />
        <div className="h-12 w-full rounded bg-paper-sunk" />
        <div className="h-12 w-4/5 rounded bg-paper-sunk" />
        <div className="h-5 w-3/5 rounded bg-paper-sunk" />
      </div>
      <div className="aspect-[16/11] rounded-xl bg-paper-sunk lg:col-span-7" />
    </div>
  );
}

/* ---------- Exploited now: featured flaw + ranked list ---------- */

const fmtDay = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "");

/** Score ring: the arc length is the CVSS score out of 10, drawn in when visible. */
function ScoreRing({ score, size = 132 }: { score: number; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShown(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const r = 44;
  const c = 2 * Math.PI * r;
  const hot = score >= 9;
  return (
    <svg ref={ref} viewBox="0 0 100 100" width={size} height={size} className="shrink-0 -rotate-90" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-rule" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        stroke="currentColor"
        className={`${hot ? "text-brand" : "text-caution"} transition-[stroke-dashoffset] duration-[1400ms] ease-spring motion-reduce:transition-none`}
        strokeDasharray={c}
        strokeDashoffset={shown ? c * (1 - score / 10) : c}
      />
    </svg>
  );
}

export function ExploitedNow() {
  const [cves, setCves] = useState<CVEItem[] | null>(null);

  useEffect(() => {
    fetch("/api/vulnerabilities")
      .then((r) => r.json())
      .then((d) => setCves(Array.isArray(d?.data) ? d.data.slice(0, 6) : []))
      .catch(() => setCves([]));
  }, []);

  const [top, ...rest] = cves || [];

  return (
    <section aria-label="Vulnerabilities being exploited" className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <h2 className="section-title">Being exploited right now</h2>
        <p className="mt-3 max-w-md text-[1.0625rem] leading-relaxed text-ink-2">
          Flaws the US cyber agency CISA has confirmed attackers are using. Patch these first.
        </p>

        {cves === null && <div className="mt-8 h-72 animate-pulse rounded-2xl bg-paper-sunk" aria-hidden />}
        {cves?.length === 0 && <p className="mt-8 text-ink-3">The vulnerability database didn&apos;t respond. Try again shortly.</p>}

        {top && (
          <a
            href={top.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-8 block overflow-hidden rounded-2xl border border-rule bg-paper-raised p-7 transition-colors duration-300 hover:border-edge"
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl transition-opacity duration-500 group-hover:opacity-150"
              aria-hidden
            />
            <div className="relative flex items-center gap-6">
              <div className="relative grid place-items-center">
                <ScoreRing score={top.cvssScore} />
                <div className="absolute text-center">
                  <span className="block text-4xl font-bold leading-none tracking-[-0.03em] text-ink">{top.cvssScore.toFixed(1)}</span>
                  <span className="mt-1 block text-xs text-ink-3">CVSS</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand">Newest confirmed</p>
                <p className="mt-1 text-sm text-ink-3">{fmtDay(top.kevAddedDate) || fmtDay(top.publishedDate)}</p>
              </div>
            </div>
            <p className="relative mt-6 text-xl font-bold leading-snug tracking-[-0.02em] text-ink">
              {top.kevName || top.affectedSoftware?.[0] || top.id}
            </p>
            <p className="relative mt-3 flex items-center justify-between text-sm text-ink-3">
              <span className="font-mono">{top.id}</span>
              <span className="inline-flex items-center gap-1 font-medium text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                Details <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </p>
          </a>
        )}
      </div>

      <div className="lg:col-span-7 lg:pt-1">
        {cves === null && (
          <div className="space-y-3" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-paper-sunk" />
            ))}
          </div>
        )}
        {rest.length > 0 && (
          <ol className="space-y-2">
            {rest.map((c) => {
              const hot = c.cvssScore >= 9;
              return (
                <li key={c.id} className="view-in">
                  <a
                    href={c.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 rounded-xl px-4 py-4 transition-colors duration-200 hover:bg-paper-raised"
                  >
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-lg font-bold tracking-[-0.02em] ${
                        hot ? "bg-brand/10 text-brand" : "bg-caution/10 text-caution"
                      }`}
                    >
                      {c.cvssScore.toFixed(1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{c.kevName || c.affectedSoftware?.[0] || c.id}</span>
                      <span className="mt-1 block text-sm text-ink-3">
                        <span className="font-mono text-[0.8125rem]">{c.id}</span>
                        {c.kevAddedDate && <span className="ml-3">Confirmed {fmtDay(c.kevAddedDate)}</span>}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 shrink-0 text-ink-4 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      strokeWidth={1.75}
                    />
                  </a>
                </li>
              );
            })}
          </ol>
        )}
        <Link href="/threats" className="mt-4 inline-flex items-center gap-1.5 px-4 text-sm font-semibold text-ink hover:text-brand">
          All exploited vulnerabilities <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
