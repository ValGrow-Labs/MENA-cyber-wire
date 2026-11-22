import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const posts = CMS_DB.getCommunityPosts();
  const existing = posts.find((p) => p.id === params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });

  const body = await request.json();
  const updated = { ...existing, ...body, id: existing.id };

  CMS_DB.upsertCommunityPost(updated);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "COMMUNITY_MODERATE",
    targetType: "COMMUNITY",
    targetId: updated.id,
    targetTitle: updated.title,
    details: `Moderated post. Status: ${updated.moderationStatus}, Pinned: ${updated.isPinned}`,
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const posts = CMS_DB.getCommunityPosts();
  const existing = posts.find((p) => p.id === params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });

  existing.moderationStatus = "DELETED";
  CMS_DB.upsertCommunityPost(existing);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "COMMUNITY_DELETE",
    targetType: "COMMUNITY",
    targetId: params.id,
    details: "Marked community post as DELETED",
  });

  return NextResponse.json({ success: true, message: "Marked as deleted" });
}
