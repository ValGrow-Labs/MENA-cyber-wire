"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StoryCover from "@/components/shared/StoryCover";
import { NewsArticle } from "@/types/news";
import { ago, SevText } from "@/components/home/FrontPage";

const href = (a: NewsArticle) => `/article/${a.id}`;
const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" });

/* ---------- Edition bar: date, trending topics (from real headlines), freshness ---------- */

// Names readers search for. Trending = the ones that appear most in this week's headlines.
const TOPICS = [
  "VMware", "Cisco", "Microsoft", "Windows", "WhatsApp", "Android", "iOS", "Apple", "Google", "Chrome", "Fortinet",
  "Ivanti", "Palo Alto", "Citrix", "Oracle", "SAP", "Linux", "AWS", "Azure", "Meta", "OpenAI", "Nvidia", "SonicWall",
  "Ransomware", "Phishing", "Zero-Day", "Supply Chain", "AI Agents",
  "Saudi Arabia", "UAE", "Dubai", "Qatar", "Egypt", "Iran", "Israel", "Jordan", "Kuwait", "Bahrain", "Oman", "Morocco",
];

function trending(articles: NewsArticle[], n = 6) {
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const recent = articles.filter((a) => new Date(a.publishedAt).getTime() > weekAgo);
  return TOPICS.map((t) => {
    const re = new RegExp(String.raw`\b` + t.replace(/[-]/g, "[- ]?") + String.raw`\b`, "i");
    return { t, n: recent.filter((a) => re.test(a.title)).length };
  })
    .filter((x) => x.n >= 2)
    .sort((x, y) => y.n - x.n)
    .slice(0, n);
}

export function EditionLine({ count, updated, articles = [] }: { count: number; updated: Date | null; articles?: NewsArticle[] }) {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const hot = trending(articles);
  return (
    <div className="flex flex-col gap-4 border-b border-rule pb-5 lg:flex-row lg:items-center lg:gap-8">
      <div className="shrink-0">
        <p className="text-lg font-bold leading-tight text-ink" suppressHydrationWarning>
          {today}
        </p>
        <p className="mt-0.5 text-sm text-ink-3" suppressHydrationWarning>
          {count > 0 && `${count} stories`}
          {updated && `, updated ${time(updated.toISOString())} Riyadh time`}
        </p>
      </div>

      {hot.length > 0 && (
        <nav aria-label="Trending topics" className="flex min-w-0 flex-1 items-baseline gap-5 lg:border-l lg:border-rule lg:pl-8">
          <span className="shrink-0 text-sm font-bold text-brand">Trending</span>
          <ul className="flex min-w-0 gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {hot.map(({ t, n }) => (
              <li key={t} className="shrink-0">
                <Link
                  href={`/search?q=${encodeURIComponent(t)}`}
                  title={`${n} stories this week`}
                  className="text-sm font-semibold text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

/* ---------- Front page: lead (2/3) + top stories list (1/3), then a row of four ---------- */

const meta = (a: NewsArticle) => (
  <p className="mt-2 text-[0.8125rem] text-ink-3">
    {a.sourceName}, {ago(a.publishedAt).toLowerCase()}
  </p>
);

function Lead({ lead, related, image }: { lead: NewsArticle; related: NewsArticle[]; image?: string }) {
  return (
    <article>
      {/* Photo and headline side by side, so the headline is visible without scrolling. */}
      <Link href={href(lead)} className="group grid gap-6 md:grid-cols-12">
        <StoryCover article={image ? { ...lead, imageUrl: image } : lead} width={1400} className="aspect-[4/3] w-full md:col-span-7" />
        <div className="md:col-span-5">
          <p className="text-sm font-semibold text-ink-3">{lead.country || lead.category}</p>
          <h1 className="mt-1 text-[1.75rem] font-bold leading-[1.15] text-ink group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4 xl:text-[2.125rem]">
            {lead.title}
          </h1>
          {lead.description && <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-2 line-clamp-5">{lead.description}</p>}
          {meta(lead)}
        </div>
      </Link>
      {related.length > 0 && (
        <ul className="mt-6 grid gap-x-8 gap-y-3 border-t border-rule pt-4 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r.id}>
              <Link href={href(r)} className="text-[0.9375rem] font-semibold leading-snug text-ink hover:underline hover:underline-offset-2">
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function TopStories({ items }: { items: NewsArticle[] }) {
  return (
    <ol className="divide-y divide-rule">
      {items.map((a) => (
        <li key={a.id}>
          <Link href={href(a)} className="group flex gap-4 py-4 first:pt-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-[1.0625rem] font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2">{a.title}</h3>
              {meta(a)}
            </div>
            <StoryCover article={a} width={360} className="aspect-[4/3] w-28 shrink-0" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

function CardRow({ items }: { items: NewsArticle[] }) {
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((a) => (
        <Link key={a.id} href={href(a)} className="view-in group block">
          <StoryCover article={a} width={700} className="aspect-[16/10] w-full" />
          <h3 className="mt-3 text-[1.0625rem] font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2">{a.title}</h3>
          {meta(a)}
        </Link>
      ))}
    </div>
  );
}

export function FrontPageGrid({
  lead,
  related,
  secondary,
  latest,
  leadImage,
}: {
  lead: NewsArticle;
  related: NewsArticle[];
  secondary: NewsArticle[];
  latest: NewsArticle[];
  leadImage?: string;
}) {
  return (
    <div className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Lead lead={lead} related={related} image={leadImage} />
        </div>
        <div className="lg:col-span-4">
          <h2 className="border-b border-ink pb-2 text-base text-ink">Top stories</h2>
          <div className="pt-4">
            <TopStories items={secondary} />
          </div>
        </div>
      </div>
      {latest.length > 0 && (
        <div className="border-t border-rule pt-8">
          <CardRow items={latest} />
        </div>
      )}
    </div>
  );
}

export function FrontSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-12" aria-hidden>
      <div className="space-y-3 lg:col-span-3">
        <div className="aspect-[3/2] rounded-xl bg-paper-sunk" />
        <div className="h-4 w-full rounded bg-paper-sunk" />
        <div className="h-4 w-2/3 rounded bg-paper-sunk" />
      </div>
      <div className="space-y-3 lg:col-span-6">
        <div className="aspect-[16/10] rounded-xl bg-paper-sunk" />
        <div className="h-8 w-5/6 rounded bg-paper-sunk" />
      </div>
      <div className="space-y-4 lg:col-span-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded bg-paper-sunk" />
        ))}
      </div>
    </div>
  );
}

/* ---------- Section block: newspaper-style section front ---------- */

export function SectionBlock({ title, more, items }: { title: string; more: string; items: NewsArticle[] }) {
  const [first, ...rest] = items;
  if (!first) return null;
  return (
    <section aria-label={title} className="view-in">
      <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">{title}</h2>
        <Link href={more} className="inline-flex items-center gap-0.5 text-sm font-semibold text-ink-2 hover:text-brand">
          More <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
      <div className="mt-5 grid gap-6 sm:grid-cols-12">
        <Link href={href(first)} className="group sm:col-span-7">
          <StoryCover article={first} width={900} className="aspect-[16/10] w-full rounded-xl" />
          <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.02em] text-ink group-hover:underline group-hover:underline-offset-2">
            {first.title}
          </h3>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-2">{first.description}</p>
          <p className="mt-2 text-xs text-ink-3">{ago(first.publishedAt)}</p>
        </Link>
        <ul className="divide-y divide-rule sm:col-span-5">
          {rest.map((a) => (
            <li key={a.id}>
              <Link href={href(a)} className="group flex gap-4 py-4 first:pt-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2">{a.title}</h3>
                  <p className="mt-1.5 text-xs text-ink-3">
                    {ago(a.publishedAt)} <span className="ml-2">{a.sourceName}</span>
                  </p>
                </div>
                
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- More news: full-width, two-column list in the front-page style ---------- */

export function RiverList({ items, compact = false }: { items: NewsArticle[]; compact?: boolean }) {
  return (
    <ul className="grid gap-x-12 lg:grid-cols-2">
      {items.map((a) => (
        <li key={a.id} className="border-t border-rule">
          <Link href={href(a)} className="view-in group flex gap-5 py-5">
            {!compact && <StoryCover article={a} width={420} className="aspect-[4/3] w-36 shrink-0 sm:w-44" />}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-ink-3">{a.country || a.category}</p>
              <h3 className="mt-1 text-lg font-bold leading-snug text-ink group-hover:underline group-hover:underline-offset-2">{a.title}</h3>
              {!compact && a.description && <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2 line-clamp-2">{a.description}</p>}
              <p className="mt-2 text-[0.8125rem] text-ink-3">
                {a.sourceName}, {ago(a.publishedAt).toLowerCase()}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
