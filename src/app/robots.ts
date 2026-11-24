import { MetadataRoute } from "next";
import { CMS_DB } from "@/lib/cms/db";
import { getBaseUrl } from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const seoSettings = CMS_DB.getSEOSettings();
  const baseUrl = getBaseUrl(seoSettings.canonicalBaseUrl);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cms-admin/",
          "/api/",
          "/saved",
          "/search",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/cms-admin/", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/cms-admin/", "/api/"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/news-sitemap.xml`,
    ],
  };
}
