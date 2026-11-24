import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import StoryCover from "@/components/shared/StoryCover";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import { ArrowLeft, Shield, AlertTriangle, Scale, ExternalLink } from "lucide-react";
import { NewsArticle } from "@/types/news";

export const dynamic = "force-dynamic";

interface CountryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const country = CMS_DB.getCountryBySlugOrCode(params.slug);

  if (!country) {
    return {
      title: "Country Desk Not Found · MENA Cyber Wire",
      description: "The requested national cyber intelligence desk could not be located.",
      robots: { index: false, follow: true },
    };
  }

  const metaTitle = country.pageMetadata?.metaTitle || `${country.name} Cybersecurity News & Threat Intelligence | MENA Cyber Wire`;
  const metaDesc =
    country.pageMetadata?.metaDescription ||
    `Real-time cyber threat telemetry, sovereign CERT advisories (${country.cybersecurityAgency || country.certAgency}), regulatory compliance frameworks, and primary-source attack reporting for ${country.name}.`;

  const canonicalUrl = `${baseUrl}/country/${country.slug}`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [
      `${country.name} Cybersecurity News`,
      `${country.name} Cyber Attack`,
      `${country.name} Ransomware`,
      `${country.name} Threat Telemetry`,
      country.cybersecurityAgency || country.certAgency || "",
      ...(country.cybersecurityLaws || []),
      `${country.region} Cyber Defense`,
      "Middle East Cybersecurity",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: seo.publisherName || "MENA Cyber Wire",
      images: [
        {
          url:
            country.countryImage ||
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: `${country.name} National Cybersecurity Profile & Threat Desk`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [country.countryImage || seo.defaultOgImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"],
    },
  };
}

export default function CountryDeskPage({ params }: CountryPageProps) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const country = CMS_DB.getCountryBySlugOrCode(params.slug);

  if (!country) {
    notFound();
  }

  const canonicalUrl = `${baseUrl}/country/${country.slug}`;

  // Fetch articles related to this country
  const allArticles = CMS_DB.getArticles();
  const countryArticles = allArticles
    .filter(
      (a) =>
        a.editorialStatus === "Published" &&
        (a.country?.toLowerCase() === country.name.toLowerCase() ||
          a.relatedCountries?.some((rc) => rc.toLowerCase() === country.name.toLowerCase()))
    )
    .sort((x, y) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime());

  // Other regional desks for contextual internal linking
  const allCountries = CMS_DB.getCountries();
  const peerDesks = allCountries
    .filter((c) => c.code !== country.code)
    .slice(0, 6);

  const breadcrumbItems = [
    { name: "Home", item: `${baseUrl}/` },
    { name: "Regional Desks", item: `${baseUrl}/mena` },
    { name: `${country.name} Cyber Desk`, item: canonicalUrl },
  ];

  return (
    <div className="space-y-12">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs font-medium text-ink-3">
        <Link href="/mena" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          All 13 Regional Desks
        </Link>
        <span className="font-mono text-2xs uppercase tracking-wider text-ink-3">
          ISO Code: {country.code} · Region: {country.region}
        </span>
      </nav>

      {/* Country Desk Lead Dossier */}
      <header className="border-b-2 border-edge pb-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">
            Sovereign Intelligence Desk
          </span>
          <span className="text-ink-4">·</span>
          <span className="font-mono text-xs text-ink-3">Current Posture:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              country.threatLevel === "Critical"
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : country.threatLevel === "High"
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            {country.threatLevel} Alert Level
          </span>
        </div>

        <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {country.name} Cyber Threat Intelligence
        </h1>

        <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-ink-2 sm:text-xl">
          {country.editorialSummary || country.summary}
        </p>

        {/* Regulatory & CERT Intelligence Snapshot */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-rule bg-paper-sunk/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-2">
              <Shield className="h-4 w-4 text-brand" />
              National Cybersecurity Agency
            </div>
            <p className="mt-2 text-sm font-bold text-ink">
              {country.cybersecurityAgency || country.certAgency || "National Cyber Directorate"}
            </p>
          </div>

          <div className="rounded-xl border border-rule bg-paper-sunk/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-2">
              <Scale className="h-4 w-4 text-brand" />
              Primary Regulatory Directives
            </div>
            <div className="mt-2 space-y-1">
              {(country.cybersecurityLaws || ["National Critical Sector Cyber Directives"]).slice(0, 2).map((law, i) => (
                <p key={i} className="text-xs font-medium text-ink truncate">
                  {law}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-rule bg-paper-sunk/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink-2">
              <ExternalLink className="h-4 w-4 text-brand" />
              Active Monitored Surface
            </div>
            <p className="mt-2 text-sm font-bold text-ink">
              {countryArticles.length || 1} Active Intelligence Reports
            </p>
          </div>
        </div>
      </header>

      {/* Country Stories River */}
      <section aria-label={`${country.name} Intelligence River`}>
        <div className="section-head mb-6">
          <h2 className="section-title">
            Latest {country.name} Dispatches & Advisories ({countryArticles.length})
          </h2>
          <span className="text-xs font-medium text-ink-3">Live verified coverage</span>
        </div>

        {countryArticles.length === 0 ? (
          <div className="rounded-xl bg-paper-sunk px-8 py-12 text-center border border-rule">
            <p className="text-lg font-bold text-ink">No specific alerts active for {country.name}.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">
              The regional desk is currently continuously monitoring sovereign CERT feeds and telemetry for {country.name}.
            </p>
            <Link href="/" className="btn-primary mt-6 inline-block">
              View Regional Wire Front Page
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {countryArticles.map((art) => {
              const newsArticle: NewsArticle = {
                id: art.id,
                title: art.headline,
                description: art.shortDescription,
                sourceName: art.sourceName,
                sourceUrl: `/article/${art.slug || art.id}`,
                imageUrl: art.featuredImage,
                publishedAt: art.publishedAt,
                country: art.country,
                region: art.region,
                category: art.category,
                severity: art.severity,
                verificationStatus: art.verificationStatus,
                tags: art.tags,
                upvotes: art.upvotes || 0,
                commentCount: art.commentCount || 0,
                slug: art.slug,
              };

              return (
                <article
                  key={art.id}
                  className="group flex flex-col gap-4 border-b border-rule pb-6 sm:flex-row sm:items-start"
                >
                  <Link
                    href={`/article/${art.slug || art.id}`}
                    className="shrink-0 sm:w-48 aspect-[16/10] overflow-hidden rounded-lg bg-paper-sunk"
                  >
                    <StoryCover article={newsArticle} width={400} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-brand">{art.category}</span>
                      <span className="text-ink-4">·</span>
                      <time dateTime={art.publishedAt} className="text-ink-3">
                        {new Date(art.publishedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                      <ThreatSeverityBadge severity={art.severity} />
                    </div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-ink group-hover:underline">
                      <Link href={`/article/${art.slug || art.id}`}>{art.headline}</Link>
                    </h3>
                    <p className="line-clamp-2 text-sm text-ink-2 font-serif">
                      {art.shortDescription}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs text-ink-3">
                      <span>Source: {art.sourceName}</span>
                      {art.readTime && <span>· {art.readTime}</span>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Internal Linking: Peer Regional Desks */}
      <aside aria-label="Neighboring Country Desks" className="border-t-2 border-edge pt-8">
        <div className="section-head mb-4">
          <h2 className="section-title">Explore Neighboring MENA Sovereign Desks</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {peerDesks.map((peer) => (
            <Link
              key={peer.code}
              href={`/country/${peer.slug}`}
              className="group rounded-xl border border-rule bg-paper-sunk/40 p-4 transition-colors hover:border-brand/40 hover:bg-paper-sunk"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand uppercase tracking-wider">{peer.code}</span>
                <span className="text-2xs font-semibold text-ink-3">{peer.region}</span>
              </div>
              <p className="mt-1 font-serif text-base font-bold text-ink group-hover:underline">
                {peer.name} Cyber Desk →
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-ink-2">
                Agency: {peer.cybersecurityAgency || peer.certAgency}
              </p>
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
