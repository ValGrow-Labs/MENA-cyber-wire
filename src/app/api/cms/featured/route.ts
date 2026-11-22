import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const config = CMS_DB.getHomepageConfig();
  const articles = CMS_DB.getArticles();

  return NextResponse.json({
    success: true,
    data: {
      leadStoryId: config.leadStoryId,
      featuredStoryIds: config.featuredStoryIds,
      topStoryIds: config.topStoryIds,
      secondaryStoryIds: config.secondaryStoryIds,
      articles: articles.map((a) => ({
        id: a.id,
        headline: a.headline,
        category: a.category,
        country: a.country,
        publishedAt: a.publishedAt,
        featuredPosition: a.featuredPosition,
        featuredPriority: a.featuredPriority,
        isFeatured: a.isFeatured,
      })),
    },
  });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const config = CMS_DB.getHomepageConfig();

    if (body.leadStoryId !== undefined) config.leadStoryId = body.leadStoryId;
    if (Array.isArray(body.featuredStoryIds)) config.featuredStoryIds = body.featuredStoryIds;
    if (Array.isArray(body.topStoryIds)) config.topStoryIds = body.topStoryIds;
    if (Array.isArray(body.secondaryStoryIds)) config.secondaryStoryIds = body.secondaryStoryIds;

    config.lastUpdated = new Date().toISOString();
    CMS_DB.saveHomepageConfig(config);

    // Also update individual articles' featuredPosition flags if articleUpdates provided
    if (Array.isArray(body.articleUpdates)) {
      const allArticles = CMS_DB.getArticles();
      body.articleUpdates.forEach((up: { id: string; position: "lead" | "top" | "secondary" | "none"; priority: number }) => {
        const art = allArticles.find((a) => a.id === up.id);
        if (art) {
          art.featuredPosition = up.position;
          art.isFeatured = up.position !== "none";
          art.featuredPriority = up.priority;
        }
      });
      CMS_DB.saveArticles(allArticles);
    }

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "FEATURED_UPDATE",
      targetType: "HOMEPAGE",
      details: `Updated featured placements. Lead: ${config.leadStoryId}`,
    });

    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
