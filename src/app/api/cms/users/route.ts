import { NextResponse } from "next/server";
import { getAdminSessionFromCookies, canManageUsers } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { hashPassword } from "@/lib/cms/auth";
import { AdminUser } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const users = CMS_DB.getUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    isActive: u.isActive,
  }));

  return NextResponse.json({ success: true, data: users });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session || !canManageUsers(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: "Name, email, password, and role are required." }, { status: 400 });
    }

    const existing = CMS_DB.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: false, error: "A user with this email already exists." }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      passwordHash: hash,
      salt,
      role,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    CMS_DB.upsertUser(newUser);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "USER_CREATE",
      targetType: "USER",
      targetId: newUser.id,
      targetTitle: newUser.name,
      details: `Created new admin user ${newUser.email} with role ${newUser.role}`,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
