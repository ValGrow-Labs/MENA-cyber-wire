import { NextResponse } from "next/server";
import { fetchGoogleNewsFeed } from "@/lib/rss/google-news";
import { NewsArticle } from "@/types/news";
import { CMS_DB } from "@/lib/cms/db";
import { CMSArticle } from "@/types/cms";

export const dynamic = "force-dynamic";

function cmsArticleToNewsArticle(a: CMSArticle): NewsArticle {
  return {
    id: a.id,
    title: a.headline,
    description: a.shortDescription,
    content: a.body,
    sourceName: a.sourceName || "MENA Cyber Desk",
    sourceUrl: a.sourceUrl || `/article/${a.id}`,
    imageUrl: a.featuredImage,
    publishedAt: a.publishedAt,
    country: a.country,
    region: a.region || "MENA General",
    category: a.category,
    severity: a.severity,
    verificationStatus: a.verificationStatus,
    tags: a.tags || [],
    threatToAction: a.threatToAction,
    upvotes: a.upvotes || 0,
    commentCount: a.commentCount || 0,
    readTime: a.readTime || "4 min",
    isDemo: false,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const country = searchParams.get("country")?.toLowerCase().trim() || "";
    const category = searchParams.get("category")?.toLowerCase().trim() || "";
    const severity = searchParams.get("severity")?.toLowerCase().trim() || "";
    const status = searchParams.get("status")?.toUpperCase().trim() || "";
    const sortBy = searchParams.get("sortBy") || "latest";

    // 1. Fetch live RSS wire items
    const rssArticles = await fetchGoogleNewsFeed();

    // 2. Fetch persistent CMS editorial articles
    const cmsArticles = CMS_DB.getArticles();
    const now = Date.now();

    const publishedCmsArticles = cmsArticles
      .filter((a) => {
        if (a.editorialStatus === "Published") return true;
        if (a.editorialStatus === "Scheduled" && a.scheduledFor) {
          return new Date(a.scheduledFor).getTime() <= now;
        }
        return false;
      })
      .map(cmsArticleToNewsArticle);

    // 3. De-duplicate: CMS articles replace any matching seed or wire articles with same ID or slug
    const cmsIds = new Set(publishedCmsArticles.map((a) => a.id));
    const nonDuplicatedRss = rssArticles.filter((a) => !cmsIds.has(a.id));

    // Combine CMS articles (first) with RSS feeds
    let allArticles = [...publishedCmsArticles, ...nonDuplicatedRss];

    // Filter
    let filtered = allArticles.filter((article: NewsArticle) => {
      if (search) {
        const matchesTitle = article.title.toLowerCase().includes(search);
        const matchesDesc = article.description.toLowerCase().includes(search);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(search));
        const matchesCountry = article.country?.toLowerCase().includes(search);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesCountry) return false;
      }

      if (country && country !== "all") {
        if (!article.country || article.country.toLowerCase() !== country) return false;
      }

      if (category && category !== "all") {
        if (article.category.toLowerCase() !== category) return false;
      }

      if (severity && severity !== "all") {
        if (article.severity.toLowerCase() !== severity) return false;
      }

      if (status && status !== "ALL") {
        if (article.verificationStatus !== status) return false;
      }

      return true;
    });

    // Homepage featured lead placement override
    const homeConfig = CMS_DB.getHomepageConfig();

    // Sorting
    if (sortBy === "trending") {
      filtered.sort((a, b) => b.upvotes * 2 + b.commentCount * 3 - (a.upvotes * 2 + a.commentCount * 3));
    } else if (sortBy === "discussed") {
      filtered.sort((a, b) => b.commentCount - a.commentCount);
    } else if (sortBy === "severity") {
      const rank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      filtered.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
    } else {
      // Default: latest, with lead story positioned first if configured
      filtered.sort((a, b) => {
        if (homeConfig.leadStoryId) {
          if (a.id === homeConfig.leadStoryId) return -1;
          if (b.id === homeConfig.leadStoryId) return 1;
        }
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("API /api/news error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve news intelligence", data: [] },
      { status: 500 }
    );
  }
}
