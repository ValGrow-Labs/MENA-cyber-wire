import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/cms/auth";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (session) {
    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "AUTH_LOGOUT",
      targetType: "AUTH",
      details: "Admin logged out.",
    });
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
