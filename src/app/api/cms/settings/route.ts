import { NextResponse } from "next/server";
import { getAdminSessionFromCookies, canManageSettings } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = CMS_DB.getSettings();
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session || !canManageSettings(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden: only Super Admins can change settings" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const existing = CMS_DB.getSettings();
    const updated = {
      ...existing,
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    CMS_DB.saveSettings(updated);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "SETTINGS_UPDATE",
      targetType: "SETTINGS",
      details: `Updated site settings. Timezone: ${updated.editorialTimezone}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
