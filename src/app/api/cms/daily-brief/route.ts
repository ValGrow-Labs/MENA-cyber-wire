import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSDailyBrief } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = CMS_DB.getTodayDailyBrief();
  const all = CMS_DB.getDailyBriefs();
  return NextResponse.json({ success: true, current, all });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const dateStr = body.date || new Date().toISOString().split("T")[0];
    const brief: CMSDailyBrief = {
      id: body.id || `brief-${dateStr}`,
      date: dateStr,
      threatLevel: body.threatLevel || "GUARDED",
      headline: body.headline || "Daily Cyber Brief",
      executiveSummary: body.executiveSummary || "",
      targetedSectors: Array.isArray(body.targetedSectors) ? body.targetedSectors : [],
      primaryThreatActors: Array.isArray(body.primaryThreatActors) ? body.primaryThreatActors : [],
      keyTakeaway: body.keyTakeaway || "",
      recommendedDefensiveActions: Array.isArray(body.recommendedDefensiveActions) ? body.recommendedDefensiveActions : [],
      topStoryIds: Array.isArray(body.topStoryIds) ? body.topStoryIds : [],
      criticalCveIds: Array.isArray(body.criticalCveIds) ? body.criticalCveIds : [],
      status: body.status || "Published",
      publishedAt: new Date().toISOString(),
    };

    CMS_DB.upsertDailyBrief(brief);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "DAILY_BRIEF_UPDATE",
      targetType: "DAILY_BRIEF",
      targetId: brief.id,
      targetTitle: brief.headline,
      details: `Saved executive briefing for ${brief.date}. Threat Level: ${brief.threatLevel}`,
    });

    return NextResponse.json({ success: true, data: brief });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
