import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const country = CMS_DB.getCountryByCode(params.code);
  if (!country) return NextResponse.json({ success: false, error: "Country not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: country });
}

export async function PUT(request: Request, { params }: { params: { code: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const existing = CMS_DB.getCountryByCode(params.code);
  if (!existing) return NextResponse.json({ success: false, error: "Country not found" }, { status: 404 });

  const body = await request.json();
  const updated = {
    ...existing,
    ...body,
    code: existing.code, // preserve code
  };

  CMS_DB.updateCountry(updated);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "COUNTRY_UPDATE",
    targetType: "COUNTRY",
    targetId: updated.code,
    targetTitle: updated.name,
    details: `Updated national profile for ${updated.name} (${updated.code}). Threat Level: ${updated.threatLevel}`,
  });

  return NextResponse.json({ success: true, data: updated });
}
