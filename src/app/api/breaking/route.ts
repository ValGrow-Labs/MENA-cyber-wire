import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const breaking = CMS_DB.getBreakingNews().filter((b) => !b.isResolved);
    return NextResponse.json({
      success: true,
      count: breaking.length,
      data: breaking,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
