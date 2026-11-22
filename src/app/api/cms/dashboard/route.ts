import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const articles = CMS_DB.getArticles();
  const breaking = CMS_DB.getBreakingNews();
  const categories = CMS_DB.getCategories();
  const countries = CMS_DB.getCountries();
  const community = CMS_DB.getCommunityPosts();
  const auditLogs = CMS_DB.getAuditLogs().slice(0, 10);
  const research = CMS_DB.getThreatActors();
  const vulnerabilities = CMS_DB.getVulnerabilityEditorials();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneWeekAgo = now.getTime() - 7 * 24 * 3600 * 1000;

  const publishedArticles = articles.filter((a) => a.editorialStatus === "Published");
  const draftArticles = articles.filter((a) => a.editorialStatus === "Draft");
  const scheduledArticles = articles.filter((a) => a.editorialStatus === "Scheduled");
  const pendingReview = articles.filter((a) => a.editorialStatus === "Under Review");

  const publishedToday = publishedArticles.filter(
    (a) => new Date(a.publishedAt).getTime() >= todayStart
  ).length;

  const publishedThisWeek = publishedArticles.filter(
    (a) => new Date(a.publishedAt).getTime() >= oneWeekAgo
  ).length;

  const activeBreaking = breaking.filter((b) => !b.isResolved).length;

  return NextResponse.json({
    success: true,
    stats: {
      totalPublished: publishedArticles.length,
      totalDrafts: draftArticles.length,
      totalScheduled: scheduledArticles.length,
      totalPendingReview: pendingReview.length,
      totalBreaking: activeBreaking,
      totalCategories: categories.length,
      totalCountries: countries.length,
      totalCommunity: community.length,
      totalResearch: research.length,
      totalVulnerabilities: vulnerabilities.length,
      publishedToday,
      publishedThisWeek,
    },
    recentlyUpdatedArticles: articles.slice(0, 5),
    recentAuditLogs: auditLogs,
  });
}
