import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSCategory } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = CMS_DB.getCategories();
  return NextResponse.json({ success: true, count: categories.length, data: categories });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.name) return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });

    const newCat: CMSCategory = {
      id: body.id || `cat-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: body.description || "",
      icon: body.icon || "Shield",
      colorHex: body.colorHex || "#087E8B",
      order: Number(body.order) || CMS_DB.getCategories().length + 1,
      isEnabled: body.isEnabled !== false,
    };

    CMS_DB.upsertCategory(newCat);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "CATEGORY_CREATE",
      targetType: "CATEGORY",
      targetId: newCat.id,
      targetTitle: newCat.name,
      details: `Created category: ${newCat.name}`,
    });

    return NextResponse.json({ success: true, data: newCat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
