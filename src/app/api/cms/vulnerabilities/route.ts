import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSVulnerabilityEditorial } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = CMS_DB.getVulnerabilityEditorials();
  return NextResponse.json({ success: true, count: items.length, data: items });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.cveId) return NextResponse.json({ success: false, error: "CVE ID is required" }, { status: 400 });

    const cveId = body.cveId.toUpperCase().trim();
    const item: CMSVulnerabilityEditorial = {
      cveId,
      editorialTitle: body.editorialTitle,
      editorialSeverity: body.editorialSeverity || "HIGH",
      cvssScore: Number(body.cvssScore) || undefined,
      affectedProducts: Array.isArray(body.affectedProducts) ? body.affectedProducts : [],
      vendor: body.vendor,
      description: body.description,
      menaImpactNotes: body.menaImpactNotes,
      recommendedRemediation: body.recommendedRemediation,
      patchStatus: body.patchStatus || "Available",
      relatedArticleIds: Array.isArray(body.relatedArticleIds) ? body.relatedArticleIds : [],
      isFeatured: Boolean(body.isFeatured),
      isHidden: Boolean(body.isHidden),
      isCustomEntry: Boolean(body.isCustomEntry),
      lastUpdated: new Date().toISOString(),
    };

    CMS_DB.upsertVulnerabilityEditorial(item);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "VULNERABILITY_UPDATE",
      targetType: "VULNERABILITY",
      targetId: item.cveId,
      targetTitle: item.editorialTitle || item.cveId,
      details: `Added/updated editorial note for ${item.cveId}`,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
