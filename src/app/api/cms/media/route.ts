import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";
import { CMSMediaItem } from "@/types/cms";

export const dynamic = "force-dynamic";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET() {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const items = CMS_DB.getMediaItems();
  return NextResponse.json({ success: true, count: items.length, data: items });
}

export async function POST(request: Request) {
  const session = getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    ensureUploadsDir();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const altText = (formData.get("altText") as string) || "";
    const caption = (formData.get("caption") as string) || "";
    const credit = (formData.get("credit") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "File size exceeds 10MB limit." }, { status: 400 });
    }

    const mime = file.type;
    const ext = ALLOWED_TYPES[mime] || path.extname(file.name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(ext)) {
      return NextResponse.json({ success: false, error: "Unsupported image format. Allowed: JPG, PNG, WebP, SVG." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Sanitize SVG if SVG
    if (ext === ".svg") {
      const svgText = buffer.toString("utf-8");
      if (/<script|javascript:|onload=|onerror=/i.test(svgText)) {
        return NextResponse.json({ success: false, error: "Potentially malicious script detected in SVG file." }, { status: 400 });
      }
    }

    const safeFilename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const mediaItem: CMSMediaItem = {
      id: `media-${Date.now()}`,
      filename: safeFilename,
      originalName: file.name,
      url: `/uploads/${safeFilename}`,
      mimeType: mime || "image/jpeg",
      sizeBytes: file.size,
      title: title || file.name,
      altText: altText || title || file.name,
      caption: caption || undefined,
      credit: credit || undefined,
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.name,
    };

    CMS_DB.addMediaItem(mediaItem);

    CMS_DB.addAuditLog({
      adminId: session.userId,
      adminEmail: session.email,
      adminName: session.name,
      action: "MEDIA_UPLOAD",
      targetType: "MEDIA",
      targetId: mediaItem.id,
      targetTitle: mediaItem.filename,
      details: `Uploaded media: ${mediaItem.originalName} (${Math.round(file.size / 1024)} KB)`,
    });

    return NextResponse.json({ success: true, data: mediaItem });
  } catch (err: any) {
    console.error("Media upload error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
