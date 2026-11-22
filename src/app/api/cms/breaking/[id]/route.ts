import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const list = CMS_DB.getBreakingNews();
  const existing = list.find((b) => b.id === params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  const body = await request.json();
  const updated = { ...existing, ...body, id: existing.id };

  CMS_DB.upsertBreakingNews(updated);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "BREAKING_UPDATE",
    targetType: "BREAKING",
    targetId: updated.id,
    targetTitle: updated.headline,
    details: `Updated breaking alert. Resolved: ${updated.isResolved}`,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  CMS_DB.deleteBreakingNews(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "BREAKING_DELETE",
    targetType: "BREAKING",
    targetId: params.id,
    details: `Removed breaking news item`,
  });

  return NextResponse.json({ success: true, message: "Deleted" });
}
