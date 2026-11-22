import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const existing = CMS_DB.getThreatActorById(params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Threat actor not found" }, { status: 404 });

  const body = await request.json();
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    lastUpdated: new Date().toISOString(),
  };

  CMS_DB.upsertThreatActor(updated);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "RESEARCH_UPDATE",
    targetType: "RESEARCH",
    targetId: updated.id,
    targetTitle: updated.name,
    details: `Updated dossier for ${updated.name}`,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  CMS_DB.deleteThreatActor(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "RESEARCH_DELETE",
    targetType: "RESEARCH",
    targetId: params.id,
    details: `Deleted threat actor dossier`,
  });

  return NextResponse.json({ success: true, message: "Deleted" });
}
