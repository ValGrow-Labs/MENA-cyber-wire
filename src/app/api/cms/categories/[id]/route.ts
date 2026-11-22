import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const existing = CMS_DB.getCategories().find((c) => c.id === params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });

  const body = await request.json();
  const updated = { ...existing, ...body, id: existing.id };

  CMS_DB.upsertCategory(updated);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "CATEGORY_UPDATE",
    targetType: "CATEGORY",
    targetId: updated.id,
    targetTitle: updated.name,
    details: `Updated category properties`,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  CMS_DB.deleteCategory(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "CATEGORY_DELETE",
    targetType: "CATEGORY",
    targetId: params.id,
    details: `Deleted category: ${params.id}`,
  });

  return NextResponse.json({ success: true, message: "Category deleted" });
}
