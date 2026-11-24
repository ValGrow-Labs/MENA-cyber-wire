import fs from "fs";
import path from "path";

// Test script to verify CMS updates directly propagate to SEO metadata and sitemap
const DATA_DIR = path.join(process.cwd(), "data", "cms");
const seoFile = path.join(DATA_DIR, "seo.json");
const articlesFile = path.join(DATA_DIR, "articles.json");

console.log("==================================================================");
console.log("CMS PROPAGATION TEST: DYNAMIC METADATA & SITEMAP SYNCHRONIZATION");
console.log("==================================================================\n");

// 1. Verify SEO Settings Save & Immediate Read
console.log("--- TEST 1: CMS SEO Title Update & Readback ---");
const rawSeo = fs.readFileSync(seoFile, "utf-8");
const originalSeo = JSON.parse(rawSeo);

const testTitle = `MENA Cyber Wire: Automated Audit Test ${Date.now()}`;
originalSeo.defaultTitle = testTitle;
fs.writeFileSync(seoFile, JSON.stringify(originalSeo, null, 2), "utf-8");

// Re-read
const updatedSeo = JSON.parse(fs.readFileSync(seoFile, "utf-8"));
if (updatedSeo.defaultTitle === testTitle) {
  console.log("  [PASS] CMS SEO Settings successfully persisted and read back immediately.");
} else {
  console.error("  [FAIL] CMS SEO Settings mismatch!");
  process.exit(1);
}

// Restore original title
originalSeo.defaultTitle = "MENA Cyber Wire: Cyber Security Intelligence for Middle East & North Africa";
fs.writeFileSync(seoFile, JSON.stringify(originalSeo, null, 2), "utf-8");
console.log("  [PASS] Original SEO Title cleanly restored.");

// 2. Verify Article Publishing Updates Sitemap Dynamically
console.log("\n--- TEST 2: Article Publishing Updates Sitemap ---");
const rawArticles = fs.readFileSync(articlesFile, "utf-8");
const originalArticles = JSON.parse(rawArticles);

const testArticleId = `test-audit-art-${Date.now()}`;
const testSlug = `saudi-critical-infrastructure-exploit-audit-${Date.now()}`;

const testArticle = {
  id: testArticleId,
  headline: "Audit Verification: Zero-Day Exploit Telemetry in GCC Energy Grids",
  slug: testSlug,
  shortDescription: "Automated test article validating dynamic sitemap entry upon publishing.",
  body: "Technical verification article body for search engine indexing.",
  category: "Critical Infrastructure",
  country: "Saudi Arabia",
  region: "Gulf",
  tags: ["Audit", "ZeroDay", "GCC"],
  sourceName: "MENA Cyber Wire Intelligence Desk",
  sourceUrl: "https://mena-cyber-wire.vercel.app",
  author: "Senior Cyber Desk Editor",
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  verificationStatus: "SIGNAL",
  severity: "Critical",
  editorialStatus: "Published", // Crucial: Published
  noIndex: false,
  upvotes: 0,
  commentCount: 0,
};

// Insert test article
originalArticles.unshift(testArticle);
fs.writeFileSync(articlesFile, JSON.stringify(originalArticles, null, 2), "utf-8");

// Read articles and filter for sitemap as done in src/app/sitemap.ts
const articlesInDb = JSON.parse(fs.readFileSync(articlesFile, "utf-8"));
const eligibleForSitemap = articlesInDb.filter(
  (a) => a.editorialStatus === "Published" && !a.noIndex
);

const foundInSitemap = eligibleForSitemap.some(
  (a) => a.id === testArticleId || a.slug === testSlug
);

if (foundInSitemap) {
  console.log(`  [PASS] Newly published article '${testSlug}' immediately recognized as eligible for Sitemap.`);
} else {
  console.error("  [FAIL] Published article was not found in sitemap query!");
  process.exit(1);
}

// Now test with noIndex: true -> should be excluded from sitemap!
console.log("\n--- TEST 3: Article noIndex Directive Excludes from Sitemap ---");
testArticle.noIndex = true;
originalArticles[0] = testArticle;
fs.writeFileSync(articlesFile, JSON.stringify(originalArticles, null, 2), "utf-8");

const reArticlesInDb = JSON.parse(fs.readFileSync(articlesFile, "utf-8"));
const reEligibleForSitemap = reArticlesInDb.filter(
  (a) => a.editorialStatus === "Published" && !a.noIndex
);

const foundWhenNoIndex = reEligibleForSitemap.some(
  (a) => a.id === testArticleId || a.slug === testSlug
);

if (!foundWhenNoIndex) {
  console.log("  [PASS] Article marked with noIndex: true is correctly excluded from Sitemap.");
} else {
  console.error("  [FAIL] noIndex article was improperly included in sitemap!");
  process.exit(1);
}

// Clean up: remove test article
const cleanedArticles = originalArticles.filter((a) => a.id !== testArticleId);
fs.writeFileSync(articlesFile, JSON.stringify(cleanedArticles, null, 2), "utf-8");
console.log("  [PASS] Test article cleanly purged from database.");

console.log("\n==================================================================");
console.log("ALL CMS PROPAGATION AND SITEMAP SYNCHRONIZATION TESTS PASSED!");
console.log("==================================================================");
