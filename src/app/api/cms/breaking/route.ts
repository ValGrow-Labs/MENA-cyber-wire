import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSBreakingNews } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const breaking = CMS_DB.getBreakingNews();
  return NextResponse.json({ success: true, count: breaking.length, data: breaking });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.headline) {
      return NextResponse.json({ success: false, error: "Headline is required." }, { status: 400 });
    }

    const item: CMSBreakingNews = {
      id: body.id || `brk-${Date.now()}`,
      headline: body.headline,
      description: body.description || "",
      source: body.source || "Regional Desk",
      sourceUrl: body.sourceUrl,
      country: body.country,
      category: body.category || "Critical Infrastructure",
      severity: body.severity || "Critical",
      verificationStatus: body.verificationStatus || "SIGNAL",
      publishedAt: body.publishedAt || new Date().toISOString(),
      isResolved: Boolean(body.isResolved),
      convertedArticleId: body.convertedArticleId,
    };

    CMS_DB.upsertBreakingNews(item);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "BREAKING_CREATE",
      targetType: "BREAKING",
      targetId: item.id,
      targetTitle: item.headline,
      details: `Created breaking alert for ${item.country || "Regional"}`,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
