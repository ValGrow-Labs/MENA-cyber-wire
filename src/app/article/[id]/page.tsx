import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMS_DB } from "@/lib/cms/db";
import { CURATED_MENA_INTELLIGENCE } from "@/lib/news/curated-seed";
import ArticleClient from "@/components/article/ArticleClient";
import { NewsArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { NewsArticle } from "@/types/news";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

function resolveArticle(identifier: string): NewsArticle | null {
  // 1. Check CMS database
  const cmsArt = CMS_DB.getArticleBySlugOrId(identifier);
  if (cmsArt) {
    return {
      id: cmsArt.id,
      title: cmsArt.headline,
      description: cmsArt.shortDescription,
      content: cmsArt.body,
      sourceName: cmsArt.sourceName || "MENA Cyber Wire Desk",
      sourceUrl: cmsArt.sourceUrl || `/article/${cmsArt.slug || cmsArt.id}`,
      imageUrl: cmsArt.featuredImage,
      publishedAt: cmsArt.publishedAt,
      country: cmsArt.country,
      region: cmsArt.region || "MENA General",
      category: cmsArt.category,
      severity: cmsArt.severity,
      verificationStatus: cmsArt.verificationStatus,
      tags: cmsArt.tags || [],
      threatToAction: cmsArt.threatToAction,
      upvotes: cmsArt.upvotes || 0,
      commentCount: cmsArt.commentCount || 0,
      readTime: cmsArt.readTime || "4 min",
      slug: cmsArt.slug,
      author: cmsArt.author,
      updatedAt: cmsArt.updatedAt,
    };
  }

  // 2. Check curated news seed fallback
  const curated = CURATED_MENA_INTELLIGENCE.find(
    (a) =>
      a.id === identifier ||
      a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80) === identifier
  );
  if (curated) {
    return {
      ...curated,
      slug: curated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);
  const article = resolveArticle(params.id);

  if (!article) {
    return {
      title: "Story Not Found · MENA Cyber Wire",
      description: "The requested cybersecurity intelligence dispatch could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const cmsArt = CMS_DB.getArticleById(article.id);
  const title = cmsArt?.seoTitle || article.title;
  const description = cmsArt?.seoDescription || article.description;
  const slug = cmsArt?.slug || article.slug || article.id;
  const canonicalUrl = `${baseUrl}/article/${slug}`;

  const keywords = [
    ...(cmsArt?.focusKeyword ? [cmsArt.focusKeyword] : []),
    ...(cmsArt?.secondaryKeywords || []),
    ...(article.tags || []),
    article.category,
    ...(article.country ? [`${article.country} Cybersecurity`, `${article.country} Cyber Threat`] : []),
    "Middle East Cyber Threat Intelligence",
  ];

  return {
    title: `${title} | MENA Cyber Wire`,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | MENA Cyber Wire`,
      description,
      url: canonicalUrl,
      siteName: seo.publisherName || "MENA Cyber Wire",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      section: article.category,
      tags: article.tags,
      images: [
        {
          url:
            article.imageUrl ||
            seo.defaultOgImage ||
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: `${title} - MENA Cyber Wire Intelligence`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MENA Cyber Wire`,
      description,
      creator: seo.twitterHandle || "@menacyberwire",
      images: [
        article.imageUrl ||
          seo.defaultOgImage ||
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    robots: cmsArt?.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export default function ArticlePage({ params }: PageProps) {
  const seo = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seo.canonicalBaseUrl);
  const article = resolveArticle(params.id);

  if (!article) {
    notFound();
  }

  const cmsArt = CMS_DB.getArticleById(article.id);
  const slug = cmsArt?.slug || article.slug || article.id;
  const canonicalUrl = `${baseUrl}/article/${slug}`;

  // Get related articles
  const allArticles = CMS_DB.getArticles();
  const relatedPool = allArticles
    .filter((a) => a.id !== article.id)
    .sort((x, y) => new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime());

  const matchedRelated = [
    ...relatedPool.filter((a) => article.country && a.country === article.country),
    ...relatedPool.filter((a) => a.category === article.category),
    ...relatedPool,
  ];

  const uniqueRelated: NewsArticle[] = Array.from(
    new Map(matchedRelated.map((a) => [a.id, a])).values()
  )
    .slice(0, 4)
    .map((a) => ({
      id: a.id,
      title: a.headline,
      description: a.shortDescription,
      sourceName: a.sourceName || "MENA Cyber Desk",
      sourceUrl: `/article/${a.slug || a.id}`,
      imageUrl: a.featuredImage,
      publishedAt: a.publishedAt,
      country: a.country,
      region: a.region || "MENA General",
      category: a.category,
      severity: a.severity,
      verificationStatus: a.verificationStatus,
      tags: a.tags || [],
      upvotes: a.upvotes || 0,
      commentCount: a.commentCount || 0,
      slug: a.slug,
    }));

  const breadcrumbItems = [
    { name: "Home", item: `${baseUrl}/` },
    ...(article.country
      ? [
          {
            name: `${article.country} Desk`,
            item: `${baseUrl}/country/${article.country.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          },
        ]
      : []),
    {
      name: article.category,
      item: `${baseUrl}/category/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    },
    { name: article.title, item: canonicalUrl },
  ];

  return (
    <>
      <NewsArticleJsonLd
        headline={article.title}
        canonicalUrl={canonicalUrl}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt || article.publishedAt}
        description={article.description}
        imageUrl={article.imageUrl}
        authorName={article.author || "Senior Cyber Desk Editor"}
        publisherName={seo.publisherName || "MENA Cyber Wire"}
        publisherLogoUrl={seo.publisherLogoUrl || `${baseUrl}/logo.png`}
        articleSection={article.category}
        keywords={article.tags}
        country={article.country}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <ArticleClient
        article={article}
        relatedArticles={uniqueRelated}
        canonicalUrl={canonicalUrl}
      />
    </>
  );
}
