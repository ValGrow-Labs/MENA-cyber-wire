import { NextResponse } from "next/server";
import { fetchGoogleNewsFeed } from "@/lib/rss/google-news";
import { NewsArticle } from "@/types/news";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const country = searchParams.get("country")?.toLowerCase().trim() || "";
    const category = searchParams.get("category")?.toLowerCase().trim() || "";
    const severity = searchParams.get("severity")?.toLowerCase().trim() || "";
    const status = searchParams.get("status")?.toUpperCase().trim() || "";
    const sortBy = searchParams.get("sortBy") || "latest";

    // Fetch combined live RSS + verified curated intelligence
    const allArticles = await fetchGoogleNewsFeed();

    // Filter
    let filtered = allArticles.filter((article: NewsArticle) => {
      if (search) {
        const matchesTitle = article.title.toLowerCase().includes(search);
        const matchesDesc = article.description.toLowerCase().includes(search);
        const matchesTags = article.tags.some(t => t.toLowerCase().includes(search));
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

    // Sorting
    if (sortBy === "trending") {
      filtered.sort((a, b) => (b.upvotes * 2 + b.commentCount * 3) - (a.upvotes * 2 + a.commentCount * 3));
    } else if (sortBy === "discussed") {
      filtered.sort((a, b) => b.commentCount - a.commentCount);
    } else if (sortBy === "severity") {
      const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      filtered.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
    } else {
      // Default: latest
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("API /api/news error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve news intelligence", data: [] },
      { status: 500 }
    );
  }
}
