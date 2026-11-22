import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";
import { SEED_COMMUNITY_POSTS } from "@/lib/community/seed-community";
import { CommunityPost } from "@/types/community";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cmsPosts = CMS_DB.getCommunityPosts();
    const cmsPostMap = new Map(cmsPosts.map((p) => [p.id, p]));

    // Filter seed posts against moderation status if overridden in CMS
    const activeSeed = SEED_COMMUNITY_POSTS.filter((seed) => {
      const override = cmsPostMap.get(seed.id);
      return !override || (override.moderationStatus !== "HIDDEN" && override.moderationStatus !== "DELETED");
    });

    // Custom posts created in CMS
    const activeCmsPosts: CommunityPost[] = cmsPosts
      .filter((p) => p.moderationStatus === "ACTIVE" && !SEED_COMMUNITY_POSTS.some((s) => s.id === p.id))
      .map((p) => ({
        id: p.id,
        title: p.title,
        body: p.body,
        topic: p.topic,
        country: p.country,
        author: {
          name: p.authorName,
          handle: p.authorHandle || "@mcw_desk",
          role: p.authorRole || "Editors",
          badge: "Verified Practitioner",
          verified: true,
        },
        timestamp: p.timestamp,
        upvotes: p.upvotes || 0,
        downvotes: p.downvotes || 0,
        commentsCount: p.commentsCount || 0,
        tags: p.tags || [],
        isPinned: Boolean(p.isPinned),
        comments: (p.comments || []).filter((c) => c.moderationStatus !== "HIDDEN" && c.moderationStatus !== "DELETED").map((c) => ({
          id: c.id,
          postId: c.postId,
          author: {
            name: c.authorName,
            handle: "@user",
            role: c.authorRole,
          },
          timestamp: c.timestamp,
          content: c.text,
          upvotes: 0,
          downvotes: 0,
        })),
      }));

    const all = [...activeCmsPosts, ...activeSeed];

    return NextResponse.json({
      success: true,
      count: all.length,
      data: all,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, data: SEED_COMMUNITY_POSTS }, { status: 500 });
  }
}
