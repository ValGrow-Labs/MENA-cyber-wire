import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const user = CMS_DB.getUserById(session.userId);
  if (!user || !user.isActive) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      lastLoginAt: user.lastLoginAt,
    },
  });
}
