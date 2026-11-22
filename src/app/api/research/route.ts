import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const threatActors = CMS_DB.getThreatActors().filter((a) => a.publicationStatus === "Published");
    return NextResponse.json({
      success: true,
      threatActors,
    });
  } catch (error) {
    console.error("Public research GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load research" }, { status: 500 });
  }
}
