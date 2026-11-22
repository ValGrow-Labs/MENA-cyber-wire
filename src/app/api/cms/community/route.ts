import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const posts = CMS_DB.getCommunityPosts();
  return NextResponse.json({ success: true, count: posts.length, data: posts });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const newPost = {
      id: body.id || `topic-${Date.now()}`,
      title: body.title,
      body: body.body,
      topic: body.topic || "Threat Intelligence",
      country: body.country || "Regional MENA",
      authorName: body.authorName || "MENA Cyber Desk",
      authorHandle: "@mcw_desk",
      authorRole: "Editors",
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      moderationStatus: body.moderationStatus || "ACTIVE",
      isPinned: Boolean(body.isPinned),
      commentsCount: 0,
      comments: [],
      tags: Array.isArray(body.tags) ? body.tags : [],
    };

    CMS_DB.upsertCommunityPost(newPost as any);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "COMMUNITY_POST_CREATE",
      targetType: "COMMUNITY",
      targetId: newPost.id,
      targetTitle: newPost.title,
      details: "Created editorial discussion topic",
    });

    return NextResponse.json({ success: true, data: newPost });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
