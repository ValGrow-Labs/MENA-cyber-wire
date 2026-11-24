import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const seoSettings = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seoSettings.canonicalBaseUrl);
  const publicationName = seoSettings.publisherName || "MENA Cyber Wire";

  // Google News requires recent eligible news articles
  const articles = CMS_DB.getArticlesForNewsSitemap();

  const urlEntries = articles.map((article) => {
    const loc = `${baseUrl}/article/${article.slug || article.id}`;
    const pubDate = new Date(article.publishedAt || Date.now()).toISOString();
    const title = escapeXml(article.headline || "Middle East Cyber Security Intelligence");

    return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(publicationName)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
      "X-Robots-Tag": "noindex, follow", // Standard practice for sitemaps
    },
  });
}
