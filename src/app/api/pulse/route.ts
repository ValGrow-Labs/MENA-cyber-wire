import { NextResponse } from "next/server";
import { getTodayCyberPulse } from "@/lib/threat/cyber-pulse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pulse = getTodayCyberPulse();
    return NextResponse.json({
      success: true,
      data: pulse,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to generate cyber pulse" }, { status: 500 });
  }
}
