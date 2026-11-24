import { MetadataRoute } from "next";
import { CMS_DB } from "@/lib/cms/db";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const seoSettings = CMS_DB.getSEOSettings();
  const baseUrl = (seoSettings.canonicalBaseUrl || "https://menacyberwire.com").replace(/\/$/, "");

  const now = new Date();

  // Core public static sections
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/breaking`,
      lastModified: now,
      changeFrequency: "always",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/threats`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/daily-brief`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mena`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Country desks for all 13 MENA nations
  const countries = CMS_DB.getCountries();
  const countryRoutes: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${baseUrl}/country/${c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Categories
  const categories = CMS_DB.getCategories().filter((c) => c.isEnabled);
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Published articles only (excluding drafts, archived, and noindex)
  const articles = CMS_DB.getArticlesForSitemap();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug || article.id}`,
    lastModified: new Date(article.updatedAt || article.publishedAt || now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...countryRoutes, ...categoryRoutes, ...articleRoutes];
}
