import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CMS_DB } from "@/lib/cms/db";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import StoryCover from "@/components/shared/StoryCover";
import ThreatSeverityBadge from "@/components/shared/ThreatSeverityBadge";
import { ArrowLeft, Tag } from "lucide-react";
import { NewsArticle } from "@/types/news";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const categories = CMS_DB.getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: "Category Not Found · MENA Cyber Wire",
      description: "The requested intelligence category could not be located.",
      robots: { index: false, follow: true },
    };
  }

  const metaTitle = `${category.name} in Middle East: News & Threat Intelligence | MENA Cyber Wire`;
  const metaDesc = `Comprehensive reporting on ${category.name} across Saudi Arabia, UAE, Qatar, and North Africa. ${category.description}`;
  const canonicalUrl = `${baseUrl}/category/${category.slug}`;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [
      `Middle East ${category.name}`,
      `MENA ${category.name}`,
      `GCC ${category.name} attacks`,
      "Cybersecurity News Middle East",
      "Threat Intelligence",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "website",
      images: [
        {
          url:
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: `${category.name} Cybersecurity Dossier`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [seo.defaultOgImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"],
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = (seo.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");
  const categories = CMS_DB.getCategories();
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const canonicalUrl = `${baseUrl}/category/${category.slug}`;

  // Fetch articles in this category
  const allArticles = CMS_DB.getArticles();
  const articles = allArticles
    .filter(
      (a) =>
        a.editorialStatus === "Published" &&
        a.category?.toLowerCase() === category.name.toLowerCase()
    )
    .sort((x, y) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime());

  const peerCategories = categories.filter((c) => c.slug !== category.slug && c.isEnabled);

  const breadcrumbItems = [
    { name: "Home", item: `${baseUrl}/` },
    { name: "Categories", item: `${baseUrl}/` },
    { name: category.name, item: canonicalUrl },
  ];

  return (
    <div className="space-y-12">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Nav breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs font-medium text-ink-3">
        <Link href="/" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          Front Page
        </Link>
        <span className="font-mono text-2xs uppercase tracking-wider text-ink-3">
          Topic Desk
        </span>
      </nav>

      {/* Category Dossier Header */}
      <header className="border-b-2 border-edge pb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand uppercase tracking-wider">
          <Tag className="h-3.5 w-3.5" />
          Intelligence Section
        </div>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          {category.name} in MENA
        </h1>
        <p className="mt-3 max-w-3xl font-serif text-lg leading-relaxed text-ink-2">
          {category.description}
        </p>
      </header>

      {/* Articles River */}
      <section aria-label={`${category.name} Stories`}>
        <div className="section-head mb-6">
          <h2 className="section-title">
            All {category.name} Dispatches ({articles.length})
          </h2>
          <span className="text-xs font-medium text-ink-3">Primary source validated</span>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-xl bg-paper-sunk px-8 py-12 text-center border border-rule">
            <p className="text-lg font-bold text-ink">No dispatches currently under {category.name}.</p>
            <Link href="/" className="btn-primary mt-4 inline-block">
              Return to Front Page
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((art) => {
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
                      {art.country && (
                        <>
                          <Link
                            href={`/country/${art.country.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                            className="font-semibold text-brand hover:underline"
                          >
                            {art.country}
                          </Link>
                          <span className="text-ink-4">·</span>
                        </>
                      )}
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

      {/* Related Categories Navigation */}
      <aside aria-label="Other Sections" className="border-t-2 border-edge pt-8">
        <h2 className="section-title mb-4">Other Threat Categories</h2>
        <div className="flex flex-wrap gap-2">
          {peerCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-lg border border-rule bg-paper-sunk/60 px-3 py-2 text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
