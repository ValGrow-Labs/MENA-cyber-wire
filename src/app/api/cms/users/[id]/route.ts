import { NextResponse } from "next/server";
import { getAdminSessionFromCookies, canManageUsers } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { hashPassword } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const existing = CMS_DB.getUserById(params.id);
  if (!existing) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  try {
    const body = await request.json();
    const updated = { ...existing };

    if (body.name) updated.name = body.name;
    if (body.role) updated.role = body.role;
    if (body.isActive !== undefined) updated.isActive = Boolean(body.isActive);
    if (body.password) {
      const { hash, salt } = hashPassword(body.password);
      updated.passwordHash = hash;
      updated.salt = salt;
    }

    CMS_DB.upsertUser(updated);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "USER_UPDATE",
      targetType: "USER",
      targetId: updated.id,
      targetTitle: updated.name,
      details: `Updated user ${updated.email}. Active: ${updated.isActive}, Role: ${updated.role}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  if (params.id === session.userId) {
    return NextResponse.json({ success: false, error: "Cannot delete your own admin account." }, { status: 400 });
  }

  const existing = CMS_DB.getUserById(params.id);
  if (!existing) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  CMS_DB.deleteUser(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "USER_DELETE",
    targetType: "USER",
    targetId: params.id,
    targetTitle: existing.name,
    details: `Deleted user: ${existing.email}`,
  });

  return NextResponse.json({ success: true, message: "User deleted" });
}
