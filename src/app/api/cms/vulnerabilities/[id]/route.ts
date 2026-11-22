import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  CMS_DB.deleteVulnerabilityEditorial(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "VULNERABILITY_DELETE",
    targetType: "VULNERABILITY",
    targetId: params.id,
    details: `Removed editorial annotation for ${params.id}`,
  });

  return NextResponse.json({ success: true, message: "Deleted" });
}
