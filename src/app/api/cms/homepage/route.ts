import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const config = CMS_DB.getHomepageConfig();
  return NextResponse.json({ success: true, data: config });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const config = CMS_DB.getHomepageConfig();

    if (body.sections && Array.isArray(body.sections)) {
      config.sections = body.sections;
    }
    if (body.leadStoryId !== undefined) config.leadStoryId = body.leadStoryId;
    if (Array.isArray(body.featuredStoryIds)) config.featuredStoryIds = body.featuredStoryIds;

    config.lastUpdated = new Date().toISOString();
    CMS_DB.saveHomepageConfig(config);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "HOMEPAGE_BUILDER_UPDATE",
      targetType: "HOMEPAGE",
      details: "Updated homepage layout sections and visibility",
    });

    return NextResponse.json({ success: true, data: config });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
