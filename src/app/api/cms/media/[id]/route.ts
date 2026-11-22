import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const items = CMS_DB.getMediaItems();
  const existing = items.find((m) => m.id === params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 });

  // Delete physical file if exists
  try {
    const filePath = path.join(process.cwd(), "public", "uploads", existing.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {}

  CMS_DB.deleteMediaItem(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "MEDIA_DELETE",
    targetType: "MEDIA",
    targetId: params.id,
    targetTitle: existing.filename,
    details: `Deleted media file: ${existing.filename}`,
  });

  return NextResponse.json({ success: true, message: "Media deleted successfully." });
}
