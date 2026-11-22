import { NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/cms/permissions";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const countries = CMS_DB.getCountries();
  return NextResponse.json({ success: true, count: countries.length, data: countries });
}
