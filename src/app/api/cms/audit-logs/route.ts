import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const targetType = searchParams.get("targetType");
  const search = searchParams.get("search")?.toLowerCase();

  let logs = CMS_DB.getAuditLogs();

  if (action && action !== "all") {
    logs = logs.filter((l) => l.action.toLowerCase().includes(action.toLowerCase()));
  }

  if (targetType && targetType !== "all") {
    logs = logs.filter((l) => l.targetType.toLowerCase() === targetType.toLowerCase());
  }

  if (search) {
    logs = logs.filter(
      (l) =>
        l.adminEmail.toLowerCase().includes(search) ||
        l.action.toLowerCase().includes(search) ||
        l.targetTitle?.toLowerCase().includes(search) ||
        l.details?.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ success: true, count: logs.length, data: logs });
}
