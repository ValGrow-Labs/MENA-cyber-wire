import { NextResponse } from "next/server";
import { getAdminSessionFromCookies, canEditArticles } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSArticle } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase().trim();
  const category = searchParams.get("category");
  const country = searchParams.get("country");
  const status = searchParams.get("status");
  const verification = searchParams.get("verification");
  const isBreaking = searchParams.get("isBreaking");
  const isFeatured = searchParams.get("isFeatured");

  let list = CMS_DB.getArticles();

  if (search) {
    list = list.filter(
      (a) =>
        a.headline.toLowerCase().includes(search) ||
        a.shortDescription.toLowerCase().includes(search) ||
        a.body.toLowerCase().includes(search) ||
        a.tags.some((t) => t.toLowerCase().includes(search)) ||
        (a.country && a.country.toLowerCase().includes(search))
    );
  }

  if (category && category !== "all") {
    list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }

  if (country && country !== "all") {
    list = list.filter((a) => a.country?.toLowerCase() === country.toLowerCase());
  }

  if (status && status !== "all") {
    list = list.filter((a) => a.editorialStatus.toLowerCase() === status.toLowerCase());
  }

  if (verification && verification !== "all") {
    list = list.filter((a) => a.verificationStatus === verification);
  }

  if (isBreaking === "true") {
    list = list.filter((a) => a.isBreaking);
  }

  if (isFeatured === "true") {
    list = list.filter((a) => a.isFeatured);
  }

  return NextResponse.json({
    success: true,
    count: list.length,
    data: list,
  });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session || !canEditArticles(session.role)) {
    return NextResponse.json({ success: false, error: "Forbidden: insufficient permissions." }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.headline || !body.category) {
      return NextResponse.json({ success: false, error: "Headline and Category are required." }, { status: 400 });
    }

    const id = body.id || `art-${Date.now()}`;
    const slug = body.slug || body.headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
    const now = new Date().toISOString();

    const newArticle: CMSArticle = {
      id,
      headline: body.headline,
      slug,
      shortDescription: body.shortDescription || "",
      body: body.body || "",
      featuredImage: body.featuredImage || "",
      imageCaption: body.imageCaption || "",
      imageCredit: body.imageCredit || "",
      category: body.category,
      country: body.country || undefined,
      relatedCountries: body.relatedCountries || [],
      region: body.region || "MENA General",
      tags: Array.isArray(body.tags) ? body.tags : [],
      sourceName: body.sourceName || "MENA Cyber Desk",
      sourceUrl: body.sourceUrl || "",
      author: body.author || session.name,
      publishedAt: body.publishedAt || now,
      updatedAt: now,
      scheduledFor: body.scheduledFor || undefined,
      verificationStatus: body.verificationStatus || "SIGNAL",
      severity: body.severity || "Medium",
      editorialStatus: body.editorialStatus || "Draft",
      threatToAction: body.threatToAction || undefined,
      isBreaking: Boolean(body.isBreaking),
      isFeatured: Boolean(body.isFeatured),
      featuredPosition: body.featuredPosition || "none",
      featuredPriority: Number(body.featuredPriority) || 0,
      featuredExpiresAt: body.featuredExpiresAt || undefined,
      upvotes: 0,
      commentCount: 0,
      readTime: body.readTime || "4 min",
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      canonicalUrl: body.canonicalUrl,
      focusKeyword: body.focusKeyword,
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : [],
      noIndex: Boolean(body.noIndex),
    };

    CMS_DB.upsertArticle(newArticle);

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/");
      revalidatePath(`/article/${newArticle.slug || newArticle.id}`);
      revalidatePath("/sitemap.xml");
      revalidatePath("/news-sitemap.xml");
    } catch {}

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "ARTICLE_CREATE",
      targetType: "ARTICLE",
      targetId: newArticle.id,
      targetTitle: newArticle.headline,
      details: `Created article in status: ${newArticle.editorialStatus}`,
    });

    return NextResponse.json({ success: true, data: newArticle });
  } catch (err: any) {
    console.error("Create article error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to create article." }, { status: 500 });
  }
}
