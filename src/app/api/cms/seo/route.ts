import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const seo = CMS_DB.getSEOSettings();
  return NextResponse.json({ success: true, data: seo });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const existing = CMS_DB.getSEOSettings();
    const updated = {
      ...existing,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    CMS_DB.saveSEOSettings(updated);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "SEO_UPDATE",
      targetType: "SETTINGS",
      details: "Updated global SEO and Open Graph metadata",
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
