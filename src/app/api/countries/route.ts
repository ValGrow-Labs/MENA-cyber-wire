import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const countries = CMS_DB.getCountries();
    return NextResponse.json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
