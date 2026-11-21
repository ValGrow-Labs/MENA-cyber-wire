import { NextResponse } from "next/server";
import { fetchNVDVulnerabilities } from "@/lib/nvd/cve-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const severity = searchParams.get("severity")?.toUpperCase().trim() || "";

    const cves = await fetchNVDVulnerabilities();

    let filtered = cves;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.id.toLowerCase().includes(search) ||
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.affectedSoftware.some((s) => s.toLowerCase().includes(search))
      );
    }

    if (severity && severity !== "ALL") {
      filtered = filtered.filter((c) => c.severity === severity);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("API /api/vulnerabilities error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load vulnerabilities", data: [] },
      { status: 500 }
    );
  }
}
