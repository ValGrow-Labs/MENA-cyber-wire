import { NextResponse } from "next/server";
import { fetchNVDVulnerabilities } from "@/lib/nvd/cve-service";
import { CMS_DB } from "@/lib/cms/db";
import { CVEItem } from "@/types/threat";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const severity = searchParams.get("severity")?.toUpperCase().trim() || "";

    // 1. Live NVD vulnerabilities
    const liveCves = await fetchNVDVulnerabilities();

    // 2. CMS Editorial Annotations & Overlays
    const cmsEditorials = CMS_DB.getVulnerabilityEditorials();
    const editorialMap = new Map(cmsEditorials.map((e) => [e.cveId.toUpperCase(), e]));

    // Overlay editorial annotations and filter hidden CVEs
    const mergedLive = liveCves
      .filter((cve) => {
        const annotation = editorialMap.get(cve.id.toUpperCase());
        return !annotation?.isHidden;
      })
      .map((cve) => {
        const annotation = editorialMap.get(cve.id.toUpperCase());
        if (!annotation) return cve;

        return {
          ...cve,
          title: annotation.editorialTitle || cve.title,
          description: annotation.description || cve.description,
          severity: annotation.editorialSeverity || cve.severity,
          cvssScore: annotation.cvssScore !== undefined ? annotation.cvssScore : cve.cvssScore,
          affectedSoftware: annotation.affectedProducts?.length ? annotation.affectedProducts : cve.affectedSoftware,
          menaImpactNote: annotation.menaImpactNotes || cve.menaImpactNote,
        } as CVEItem;
      });

    // Custom CVE entries manually added in CMS
    const customEntries: CVEItem[] = cmsEditorials
      .filter((e) => e.isCustomEntry && !e.isHidden && !liveCves.some((c) => c.id.toUpperCase() === e.cveId.toUpperCase()))
      .map((e) => ({
        id: e.cveId,
        title: e.editorialTitle || e.cveId,
        description: e.description || "",
        cvssScore: e.cvssScore || 9.0,
        severity: e.editorialSeverity || "CRITICAL",
        publishedDate: e.lastUpdated || new Date().toISOString(),
        modifiedDate: e.lastUpdated || new Date().toISOString(),
        affectedSoftware: e.affectedProducts || [],
        sourceUrl: `https://nvd.nist.gov/vuln/detail/${e.cveId}`,
        isExploitedInWild: true,
        menaImpactNote: e.menaImpactNotes,
      }));

    let allCves = [...customEntries, ...mergedLive];

    if (search) {
      allCves = allCves.filter(
        (c) =>
          c.id.toLowerCase().includes(search) ||
          c.title.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.affectedSoftware.some((s) => s.toLowerCase().includes(search)) ||
          (c.menaImpactNote && c.menaImpactNote.toLowerCase().includes(search))
      );
    }

    if (severity && severity !== "ALL") {
      allCves = allCves.filter((c) => c.severity === severity);
    }

    return NextResponse.json({
      success: true,
      count: allCves.length,
      data: allCves,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("API /api/vulnerabilities error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load vulnerabilities", data: [] },
      { status: 500 }
    );
  }
}
