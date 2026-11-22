import { NextResponse } from "next/server";
import { getAdminSessionFromCookies, canEditArticles } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const article = CMS_DB.getArticleById(params.id);
  if (!article) return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });

  return NextResponse.json({ success: true, data: article });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session || !canEditArticles(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden: insufficient permissions." }, { status: 403 });
  }

  const existing = CMS_DB.getArticleById(params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });

  try {
    const body = await request.json();
    const updated = {
      ...existing,
      ...body,
      id: existing.id, // preserve id
      updatedAt: new Date().toISOString(),
    };

    CMS_DB.upsertArticle(updated);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "ARTICLE_UPDATE",
      targetType: "ARTICLE",
      targetId: updated.id,
      targetTitle: updated.headline,
      details: `Updated article. Status: ${updated.editorialStatus}, Severity: ${updated.severity}`,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update article." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = getAdminSessionFromCookies();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
    return NextResponse.json({ success: false, error: "Forbidden: only editors and super admins can delete." }, { status: 403 });
  }

  const existing = CMS_DB.getArticleById(params.id);
  if (!existing) return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });

  CMS_DB.deleteArticle(params.id);

  CMS_DB.addAuditLog({
    adminId: session.userId,
    adminEmail: session.email,
    adminName: session.name,
    action: "ARTICLE_DELETE",
    targetType: "ARTICLE",
    targetId: existing.id,
    targetTitle: existing.headline,
    details: `Deleted article: ${existing.headline}`,
  });

  return NextResponse.json({ success: true, message: "Article deleted successfully." });
}
