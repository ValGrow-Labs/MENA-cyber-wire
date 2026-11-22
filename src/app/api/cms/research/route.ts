import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSThreatActorResearch } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const actors = CMS_DB.getThreatActors();
  return NextResponse.json({ success: true, count: actors.length, data: actors });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ success: false, error: "Threat actor name is required" }, { status: 400 });

    const newActor: CMSThreatActorResearch = {
      id: body.id || `actor-${Date.now()}`,
      name: body.name,
      aliases: body.aliases || "",
      origin: body.origin || "Unknown",
      region: body.region || "MENA General",
      targetSectors: Array.isArray(body.targetSectors) ? body.targetSectors : [],
      description: body.description || "",
      threatProfile: body.threatProfile || "",
      tactics: Array.isArray(body.tactics) ? body.tactics : [],
      techniques: Array.isArray(body.techniques) ? body.techniques : [],
      procedures: Array.isArray(body.procedures) ? body.procedures : [],
      indicators: Array.isArray(body.indicators) ? body.indicators : [],
      relatedIncidents: Array.isArray(body.relatedIncidents) ? body.relatedIncidents : [],
      references: Array.isArray(body.references) ? body.references : [],
      author: body.author || session.name,
      lastUpdated: new Date().toISOString(),
      publicationStatus: body.publicationStatus || "Published",
      isFeatured: Boolean(body.isFeatured),
    };

    CMS_DB.upsertThreatActor(newActor);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "RESEARCH_CREATE",
      targetType: "RESEARCH",
      targetId: newActor.id,
      targetTitle: newActor.name,
      details: `Created threat actor dossier: ${newActor.name}`,
    });

    return NextResponse.json({ success: true, data: newActor });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
