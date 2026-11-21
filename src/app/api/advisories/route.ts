import { NextResponse } from "next/server";
import { fetchCISAAdvisories } from "@/lib/cisa/cisa-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const advisories = await fetchCISAAdvisories();
    return NextResponse.json({
      success: true,
      count: advisories.length,
      data: advisories,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("API /api/advisories error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve CISA advisories", data: [] },
      { status: 500 }
    );
  }
}
