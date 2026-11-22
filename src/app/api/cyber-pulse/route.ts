import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";
import { CyberPulseSummary } from "@/types/threat";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brief = CMS_DB.getTodayDailyBrief();
    const settings = CMS_DB.getSettings();

    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const pulse: CyberPulseSummary = {
      date: dateStr,
      threatLevel: settings.threatLevelOverride || brief.threatLevel || "GUARDED",
      headline: brief.headline || "What our desk follows across the region, and why.",
      activeIncidentsCount: 0,
      targetedSectors: brief.targetedSectors?.length
        ? brief.targetedSectors
        : ["Energy and petrochemicals", "Government", "Banking and payments", "Telecoms", "Healthcare"],
      primaryThreatActors: brief.primaryThreatActors?.length
        ? brief.primaryThreatActors
        : ["MuddyWater", "OilRig (APT34)", "Shamoon wiper operators", "Ransomware affiliates"],
      keyTakeaway:
        brief.keyTakeaway ||
        "Edge devices, VPNs, firewalls, and remote-access gateways remain the entry point cited most often in government advisories across the Gulf.",
      advisoriesCount: 0,
      criticalCveCount: 0,
      recommendedDefensiveActions: brief.recommendedDefensiveActions?.length
        ? brief.recommendedDefensiveActions
        : undefined,
    };

    return NextResponse.json({
      success: true,
      pulse,
      brief,
    });
  } catch (error) {
    console.error("Public cyber-pulse GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load cyber pulse" }, { status: 500 });
  }
}
