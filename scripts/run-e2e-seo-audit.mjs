import { spawn } from "child_process";
import http from "http";
import { XMLParser } from "fast-xml-parser";

const PORT = 3009;
const BASE = `http://127.0.0.1:${PORT}`;

function fetchText(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE}${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on("error", (err) => {
      reject(new Error(`Fetch ${path} failed: ${err.code || err.message || err}`));
    });
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${path}`));
    });
  });
}

function parseMeta(html) {
  const result = {
    title: "",
    metaTags: {},
    canonical: "",
    jsonLd: [],
    robots: "",
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) result.title = titleMatch[1].trim();

  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (canonicalMatch) result.canonical = canonicalMatch[1];

  const metaRegex = /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']*)["'][^>]*>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    result.metaTags[match[1]] = match[2];
  }

  // Also check reverse attribute order: content first, then name
  const metaRegexRev = /<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']([^"']+)["'][^>]*>/gi;
  while ((match = metaRegexRev.exec(html)) !== null) {
    if (!result.metaTags[match[2]]) {
      result.metaTags[match[2]] = match[1];
    }
  }

  // Parse JSON-LD scripts
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let sMatch;
  while ((sMatch = scriptRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(sMatch[1]);
      result.jsonLd.push(parsed);
    } catch (e) {
      result.jsonLd.push({ parseError: e.message, raw: sMatch[1] });
    }
  }

  return result;
}

async function runAudit() {
  console.log("==================================================================");
  console.log("MENA CYBER WIRE - PRODUCTION TECHNICAL SEO AUDIT EXECUTION");
  console.log("==================================================================\n");

  const results = {
    totalTests: 0,
    passed: 0,
    failed: 0,
    failures: [],
    details: [],
  };

  function test(name, passed, detail = "") {
    results.totalTests++;
    if (passed) {
      results.passed++;
      console.log(`  [PASS] ${name}`);
      results.details.push({ name, status: "PASS", detail });
    } else {
      results.failed++;
      console.error(`  [FAIL] ${name} -> ${detail}`);
      results.failures.push({ name, detail });
      results.details.push({ name, status: "FAIL", detail });
    }
  }

  const parser = new XMLParser({ ignoreAttributes: false });

  // 1. XML SITEMAP AUDIT
  console.log("--- 1. AUDITING /sitemap.xml ---");
  try {
    const res = await fetchText("/sitemap.xml");
    test("Sitemap HTTP 200 Status", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    test("Sitemap XML Content-Type", (res.headers["content-type"] || "").includes("xml"), `Got: ${res.headers["content-type"]}`);

    const parsedXml = parser.parse(res.body);
    const urlset = parsedXml.urlset;
    test("Valid <urlset> root node", !!urlset, "urlset missing");

    const urls = Array.isArray(urlset?.url) ? urlset.url : (urlset?.url ? [urlset.url] : []);
    test("Sitemap contains indexable URLs", urls.length >= 20, `Found ${urls.length} URLs`);

    const hasAdmin = urls.some((u) => String(u.loc || "").includes("/cms-admin/"));
    test("Sitemap excludes /cms-admin/ pages", !hasAdmin, "Found admin route in sitemap!");

    const hasApi = urls.some((u) => String(u.loc || "").includes("/api/"));
    test("Sitemap excludes /api/ routes", !hasApi, "Found api route in sitemap!");

    const hasCanonicalDomain = urls.every((u) => String(u.loc || "").startsWith("https://menacyberwire.com"));
    test("All sitemap URLs use canonical https://menacyberwire.com", hasCanonicalDomain, "Some URLs lack canonical domain");

    const hasCountryDesks = urls.some((u) => String(u.loc || "").includes("/country/saudi-arabia"));
    test("Sitemap includes national country desks", hasCountryDesks, "saudi-arabia desk missing");

    const hasArticles = urls.some((u) => String(u.loc || "").includes("/article/"));
    test("Sitemap includes published articles", hasArticles, "No articles in sitemap");
  } catch (err) {
    test("Sitemap fetch succeeded", false, err.message);
  }

  // 2. GOOGLE NEWS SITEMAP AUDIT
  console.log("\n--- 2. AUDITING /news-sitemap.xml ---");
  try {
    const res = await fetchText("/news-sitemap.xml");
    test("News Sitemap HTTP 200 Status", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    test("News Sitemap XML Content-Type", (res.headers["content-type"] || "").includes("xml"), `Got: ${res.headers["content-type"]}`);

    const parsedNews = parser.parse(res.body);
    const urlset = parsedNews.urlset;
    test("Valid Google News <urlset>", !!urlset, "Missing urlset");
    test("Google News Namespace attribute declared", (res.body || "").includes("http://www.google.com/schemas/sitemap-news/0.9"), "Namespace missing");

    const newsUrls = Array.isArray(urlset?.url) ? urlset.url : (urlset?.url ? [urlset.url] : []);
    test("News sitemap contains news articles", newsUrls.length > 0, `Found ${newsUrls.length} entries`);

    const hasNewsBlock = (res.body || "").includes("<news:news>") && (res.body || "").includes("<news:publication>");
    test("Contains <news:news> and <news:publication> nodes", hasNewsBlock, "Missing news nodes");

    const hasPubDate = (res.body || "").includes("<news:publication_date>");
    test("Contains <news:publication_date>", hasPubDate, "Missing publication date");
  } catch (err) {
    test("News sitemap fetch succeeded", false, err.message);
  }

  // 3. ROBOTS.TXT AUDIT
  console.log("\n--- 3. AUDITING /robots.txt ---");
  try {
    const res = await fetchText("/robots.txt");
    test("Robots.txt HTTP 200 Status", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    test("Robots.txt allows root /", res.body.includes("Allow: /"), "Allow / missing");
    test("Robots.txt disallows /cms-admin/", res.body.includes("Disallow: /cms-admin/"), "Disallow /cms-admin/ missing");
    test("Robots.txt disallows /api/", res.body.includes("Disallow: /api/"), "Disallow /api/ missing");
    test("Robots.txt references primary sitemap.xml", res.body.includes("sitemap.xml"), "Sitemap reference missing");
    test("Robots.txt references news-sitemap.xml", res.body.includes("news-sitemap.xml"), "News sitemap reference missing");
  } catch (err) {
    test("Robots.txt fetch succeeded", false, err.message);
  }

  // 4. HOMEPAGE METADATA & SCHEMA AUDIT
  console.log("\n--- 4. AUDITING HOMEPAGE (/) ---");
  try {
    const res = await fetchText("/");
    test("Homepage HTTP 200 Status", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    const meta = parseMeta(res.body);
    test("Homepage <title> present", meta.title.length > 10, `Title: "${meta.title}"`);
    test("Homepage <meta name='description'> present", (meta.metaTags["description"] || "").length > 40, `Desc: "${meta.metaTags["description"]}"`);
    test("Homepage canonical URL present", meta.canonical.startsWith("https://menacyberwire.com"), `Canonical: "${meta.canonical}"`);
    test("Homepage OpenGraph title present", !!meta.metaTags["og:title"], "og:title missing");
    test("Homepage OpenGraph image present", !!meta.metaTags["og:image"], "og:image missing");
    test("Homepage Twitter Card configured", meta.metaTags["twitter:card"] === "summary_large_image", `Card: "${meta.metaTags["twitter:card"]}"`);

    // Schema checks
    const orgSchema = meta.jsonLd.find((s) => s["@type"] === "NewsMediaOrganization" || s["@type"] === "Organization");
    test("NewsMediaOrganization JSON-LD present on Homepage", !!orgSchema, "Organization schema missing");
    if (orgSchema) {
      test("Organization schema has legal name", orgSchema.name === "MENA Cyber Wire", `Name: ${orgSchema.name}`);
      test("Organization schema has logo", !!orgSchema.logo?.url, "Logo missing");
      test("Organization schema has publishing principles", !!orgSchema.publishingPrinciples, "Publishing principles missing");
      test("Organization schema has corrections policy", !!orgSchema.correctionsPolicy, "Corrections policy missing");
    }

    const webSiteSchema = meta.jsonLd.find((s) => s["@type"] === "WebSite");
    test("WebSite JSON-LD present with SearchAction", !!webSiteSchema?.potentialAction, "WebSite or SearchAction missing");
  } catch (err) {
    test("Homepage audit succeeded", false, err.message);
  }

  // 5. ARTICLE DETAIL METADATA & NEWSARTICLE SCHEMA AUDIT
  console.log("\n--- 5. AUDITING ARTICLE DETAIL PAGE ---");
  try {
    // Read an article ID from sitemap or default article
    const smRes = await fetchText("/sitemap.xml");
    const artMatch = smRes.body.match(/<loc>(https:\/\/menacyberwire\.com\/article\/[^<]+)<\/loc>/);
    const articlePath = artMatch ? new URL(artMatch[1]).pathname : "/article/test-advisory-zero-day-campaign-detected-in-gulf-energy-sector";

    const res = await fetchText(articlePath);
    test(`Article Page HTTP 200 (${articlePath})`, res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    const meta = parseMeta(res.body);

    test("Article <title> present and distinct", meta.title.includes("MENA Cyber Wire"), `Title: "${meta.title}"`);
    test("Article meta description present", (meta.metaTags["description"] || "").length > 20, `Desc: "${meta.metaTags["description"]}"`);
    test("Article canonical URL matches article path", meta.canonical.includes("/article/"), `Canonical: "${meta.canonical}"`);
    test("Article OpenGraph type is 'article'", meta.metaTags["og:type"] === "article", `og:type: "${meta.metaTags["og:type"]}"`);

    // Check NewsArticle JSON-LD
    const newsArticleSchema = meta.jsonLd.find((s) => s["@type"] === "NewsArticle");
    test("NewsArticle JSON-LD schema present", !!newsArticleSchema, "NewsArticle schema missing");
    if (newsArticleSchema) {
      test("NewsArticle has headline", !!newsArticleSchema.headline, "Headline missing");
      test("NewsArticle has datePublished", !!newsArticleSchema.datePublished, "datePublished missing");
      test("NewsArticle has dateModified", !!newsArticleSchema.dateModified, "dateModified missing");
      test("NewsArticle has author (Person)", newsArticleSchema.author?.["@type"] === "Person", "Author not Person");
      test("NewsArticle has publisher (NewsMediaOrganization)", !!newsArticleSchema.publisher, "Publisher missing");
      test("NewsArticle has mainEntityOfPage", !!newsArticleSchema.mainEntityOfPage?.["@id"], "mainEntityOfPage missing");
    }

    const breadcrumbSchema = meta.jsonLd.find((s) => s["@type"] === "BreadcrumbList");
    test("BreadcrumbList JSON-LD present on article", !!breadcrumbSchema, "Breadcrumb schema missing");
  } catch (err) {
    test("Article audit succeeded", false, err.message);
  }

  // 6. COUNTRY DESK PAGE AUDIT
  console.log("\n--- 6. AUDITING COUNTRY DESK (/country/saudi-arabia) ---");
  try {
    const res = await fetchText("/country/saudi-arabia");
    test("Country Desk HTTP 200", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    const meta = parseMeta(res.body);
    test("Country Desk <title> includes country name", meta.title.includes("Saudi Arabia"), `Title: "${meta.title}"`);
    test("Country Desk canonical is /country/saudi-arabia", meta.canonical.endsWith("/country/saudi-arabia"), `Canonical: "${meta.canonical}"`);
    test("Country Desk has BreadcrumbList JSON-LD", meta.jsonLd.some((s) => s["@type"] === "BreadcrumbList"), "Breadcrumb missing");
  } catch (err) {
    test("Country Desk audit succeeded", false, err.message);
  }

  // 7. CATEGORY PAGE AUDIT
  console.log("\n--- 7. AUDITING CATEGORY PAGE (/category/ransomware) ---");
  try {
    const res = await fetchText("/category/ransomware");
    test("Category Page HTTP 200", res.statusCode === 200, `Got HTTP ${res.statusCode}`);
    const meta = parseMeta(res.body);
    test("Category <title> includes topic", meta.title.includes("Ransomware"), `Title: "${meta.title}"`);
    test("Category canonical is /category/ransomware", meta.canonical.endsWith("/category/ransomware"), `Canonical: "${meta.canonical}"`);
  } catch (err) {
    test("Category audit succeeded", false, err.message);
  }

  // 8. SECTION PAGES AUDIT
  console.log("\n--- 8. AUDITING CORE SECTIONS METADATA ---");
  const sections = [
    { path: "/threats", keyword: "Vulnerability" },
    { path: "/breaking", keyword: "Breaking" },
    { path: "/daily-brief", keyword: "Daily" },
    { path: "/research", keyword: "Research" },
    { path: "/about", keyword: "About" },
    { path: "/editorial-policy", keyword: "Editorial" },
  ];

  for (const sec of sections) {
    try {
      const res = await fetchText(sec.path);
      const meta = parseMeta(res.body);
      test(`Section ${sec.path} HTTP 200 & Title`, res.statusCode === 200 && meta.title.length > 5, `Status: ${res.statusCode}, Title: "${meta.title}"`);
      test(`Section ${sec.path} Canonical Link`, meta.canonical.includes(sec.path), `Canonical: "${meta.canonical}"`);
    } catch (e) {
      test(`Section ${sec.path} loaded`, false, e.message);
    }
  }

  // 9. ADMIN CRAWL PROTECTION & NOINDEX HEADERS
  console.log("\n--- 9. AUDITING ADMIN SECURITY & NOINDEX DIRECTIVES ---");
  try {
    const resAdmin = await fetchText("/cms-admin");
    const xRobots = resAdmin.headers["x-robots-tag"] || "";
    test("/cms-admin serves X-Robots-Tag: noindex", xRobots.includes("noindex"), `Got: "${xRobots}"`);
    test("/cms-admin serves X-Robots-Tag: nofollow", xRobots.includes("nofollow"), `Got: "${xRobots}"`);
  } catch (err) {
    test("Admin headers check succeeded", false, err.message);
  }

  try {
    const resApi = await fetchText("/api/news");
    const xRobotsApi = resApi.headers["x-robots-tag"] || "";
    test("/api/* routes serve X-Robots-Tag: noindex", xRobotsApi.includes("noindex"), `Got: "${xRobotsApi}"`);
  } catch (err) {
    test("API headers check succeeded", false, err.message);
  }

  // 10. NOT FOUND (404) STATUS & ROBOTS
  console.log("\n--- 10. AUDITING 404 STATUS & META DIRECTIVE ---");
  try {
    const res404 = await fetchText("/non-existent-page-audit-verify-404");
    test("404 Page returns HTTP 404 Status Code", res404.statusCode === 404, `Got HTTP ${res404.statusCode}`);
    const meta404 = parseMeta(res404.body);
    const robotsContent = meta404.metaTags["robots"] || "";
    test("404 Page serves robots noindex directive", robotsContent.includes("noindex") || (res404.headers["x-robots-tag"] || "").includes("noindex"), `Robots: "${robotsContent}"`);
  } catch (err) {
    test("404 check succeeded", false, err.message);
  }

  // 11. CREDENTIALS & MEASUREMENT ID AUDIT
  console.log("\n--- 11. AUDITING GOOGLE SEARCH CONSOLE & GA4 CREDENTIALS ---");
  const gaEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  const gscEnv = process.env.GOOGLE_SITE_VERIFICATION || "";
  console.log(`  [INFO] NEXT_PUBLIC_GA_MEASUREMENT_ID in env: "${gaEnv || "NOT_SET"}"`);
  console.log(`  [INFO] GOOGLE_SITE_VERIFICATION in env: "${gscEnv || "NOT_SET"}"`);

  // FINAL SUMMARY
  console.log("\n==================================================================");
  console.log(`AUDIT FINISHED: ${results.passed} PASSED / ${results.failed} FAILED (TOTAL: ${results.totalTests})`);
  console.log("==================================================================");

  if (results.failures.length > 0) {
    console.log("\nFAILURES IDENTIFIED:");
    results.failures.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
  }

  return results;
}

// Start next server and run audit
console.log("Starting Next.js production server on port", PORT, "...");
const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
});

let started = false;

server.stdout.on("data", async (data) => {
  const msg = data.toString();
  if (msg.includes("Ready in") || msg.includes("started server on") || msg.includes(`localhost:${PORT}`)) {
    if (!started) {
      started = true;
      console.log(`Server is ready on port ${PORT}! Beginning audit suite...`);
      try {
        await runAudit();
      } catch (e) {
        console.error("Audit error:", e);
      } finally {
        console.log("Shutting down audit server...");
        server.kill("SIGTERM");
        process.exit(0);
      }
    }
  }
});

server.stderr.on("data", (data) => {
  console.error("Server stderr:", data.toString());
});

setTimeout(() => {
  if (!started) {
    console.error("Server startup timed out after 30 seconds.");
    server.kill();
    process.exit(1);
  }
}, 30000);
