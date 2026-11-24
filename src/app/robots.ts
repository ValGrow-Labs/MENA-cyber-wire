import { MetadataRoute } from "next";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const seoSettings = CMS_DB.getSEOSettings();
  const baseUrl = (seoSettings.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

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
