import { XMLParser } from "fast-xml-parser";
import { NewsArticle, NewsCategory, ThreatSeverity, VerificationStatus } from "@/types/news";
import { CURATED_MENA_INTELLIGENCE } from "../news/curated-seed";

const GOOGLE_NEWS_QUERIES = [
  "Cybersecurity Middle East",
  "Saudi Arabia cyber attack",
  "UAE cybersecurity",
  "Egypt data breach",
  "Middle East ransomware",
  "MENA cyber threat",
  "Gulf cyber attack",
  "Arab cybersecurity"
];

// In-memory cache for live RSS feed results (cache for 10 minutes)
interface CacheEntry {
  timestamp: number;
  data: NewsArticle[];
}
let rssCache: CacheEntry | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function cleanHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function detectCountry(text: string): { country: string; region: "Gulf" | "Levant" | "North Africa" | "MENA General" } {
  const lower = text.toLowerCase();
  if (lower.includes("saudi") || lower.includes("riyadh") || lower.includes("aramco")) {
    return { country: "Saudi Arabia", region: "Gulf" };
  }
  if (lower.includes("uae") || lower.includes("emirates") || lower.includes("dubai") || lower.includes("abu dhabi")) {
    return { country: "United Arab Emirates", region: "Gulf" };
  }
  if (lower.includes("qatar") || lower.includes("doha")) {
    return { country: "Qatar", region: "Gulf" };
  }
  if (lower.includes("egypt") || lower.includes("cairo") || lower.includes("suez")) {
    return { country: "Egypt", region: "North Africa" };
  }
  if (lower.includes("kuwait")) {
    return { country: "Kuwait", region: "Gulf" };
  }
  if (lower.includes("bahrain") || lower.includes("manama")) {
    return { country: "Bahrain", region: "Gulf" };
  }
  if (lower.includes("oman") || lower.includes("muscat")) {
    return { country: "Oman", region: "Gulf" };
  }
  if (lower.includes("jordan") || lower.includes("amman")) {
    return { country: "Jordan", region: "Levant" };
  }
  if (lower.includes("lebanon") || lower.includes("beirut")) {
    return { country: "Lebanon", region: "Levant" };
  }
  if (lower.includes("iraq") || lower.includes("baghdad")) {
    return { country: "Iraq", region: "Levant" };
  }
  if (lower.includes("morocco") || lower.includes("rabat") || lower.includes("casablanca")) {
    return { country: "Morocco", region: "North Africa" };
  }
  if (lower.includes("tunisia") || lower.includes("tunis")) {
    return { country: "Tunisia", region: "North Africa" };
  }
  if (lower.includes("algeria") || lower.includes("algiers")) {
    return { country: "Algeria", region: "North Africa" };
  }
  return { country: "Regional MENA", region: "MENA General" };
}

function detectCategory(text: string): NewsCategory {
  const lower = text.toLowerCase();
  if (lower.includes("ransomware") || lower.includes("encrypt") || lower.includes("extortion")) {
    return "Ransomware";
  }
  if (lower.includes("breach") || lower.includes("leak") || lower.includes("stolen data") || lower.includes("credentials")) {
    return "Data Breach";
  }
  if (lower.includes("cve") || lower.includes("vulnerability") || lower.includes("zero-day") || lower.includes("exploit") || lower.includes("patch")) {
    return "Vulnerability";
  }
  if (lower.includes("scada") || lower.includes("energy") || lower.includes("pipeline") || lower.includes("infrastructure") || lower.includes("grid") || lower.includes("port")) {
    return "Critical Infrastructure";
  }
  if (lower.includes("apt") || lower.includes("espionage") || lower.includes("state-backed") || lower.includes("muddywater") || lower.includes("oilrig") || lower.includes("actor")) {
    return "Espionage & APT";
  }
  if (lower.includes("bank") || lower.includes("fintech") || lower.includes("payment") || lower.includes("crypto") || lower.includes("wallet")) {
    return "Fintech & Banking";
  }
  if (lower.includes("ai") || lower.includes("artificial intelligence") || lower.includes("cloud") || lower.includes("llm")) {
    return "Cloud & AI";
  }
  return "Policy & Regulation";
}

function detectSeverity(text: string): ThreatSeverity {
  const lower = text.toLowerCase();
  if (lower.includes("critical") || lower.includes("zero-day") || lower.includes("emergency") || lower.includes("actively exploited") || lower.includes("major shutdown")) {
    return "Critical";
  }
  if (lower.includes("ransomware") || lower.includes("high") || lower.includes("severe") || lower.includes("breach") || lower.includes("warning")) {
    return "High";
  }
  if (lower.includes("medium") || lower.includes("advisory") || lower.includes("update") || lower.includes("guidance")) {
    return "Medium";
  }
  return "Low";
}

function detectVerification(text: string): VerificationStatus {
  const lower = text.toLowerCase();
  if (lower.includes("claims") || lower.includes("alleged") || lower.includes("unconfirmed") || lower.includes("telegram")) {
    return "UNVERIFIED";
  }
  if (lower.includes("developing") || lower.includes("investigating") || lower.includes("monitoring") || lower.includes("watch")) {
    return "WATCH";
  }
  return "SIGNAL";
}

function extractPublisher(title: string): { cleanTitle: string; sourceName: string } {
  // Google News titles format is typically: "Headline - Source Name"
  const lastDash = title.lastIndexOf(" - ");
  if (lastDash > 0) {
    return {
      cleanTitle: title.substring(0, lastDash).trim(),
      sourceName: title.substring(lastDash + 3).trim(),
    };
  }
  return { cleanTitle: title, sourceName: "Cyber Intelligence Wire" };
}

export async function fetchGoogleNewsFeed(queryIndex: number = 0): Promise<NewsArticle[]> {
  const now = Date.now();
  if (rssCache && (now - rssCache.timestamp < CACHE_TTL) && rssCache.data.length > 0) {
    return rssCache.data;
  }

  const selectedQuery = GOOGLE_NEWS_QUERIES[queryIndex % GOOGLE_NEWS_QUERIES.length];
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(selectedQuery)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8"
      },
      next: { revalidate: 600 }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return CURATED_MENA_INTELLIGENCE;
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xmlData);

    const items = parsed?.rss?.channel?.item;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return CURATED_MENA_INTELLIGENCE;
    }

    const liveArticles: NewsArticle[] = items.slice(0, 20).map((item: any, idx: number) => {
      const rawTitle = cleanHtml(item.title || "MENA Cybersecurity Update");
      const { cleanTitle, sourceName } = extractPublisher(rawTitle);
      const rawDesc = cleanHtml(item.description || item.contentSnippet || "");
      const fullText = `${cleanTitle} ${rawDesc}`;
      const { country, region } = detectCountry(fullText);
      const category = detectCategory(fullText);
      const severity = detectSeverity(fullText);
      const verificationStatus = detectVerification(fullText);

      // Create a stable ID from link or GUID
      const link = item.link || item.guid || `live-${idx}`;
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

      return {
        id: `gn-${idx}-${Math.abs(hashString(link))}`,
        title: cleanTitle,
        description: rawDesc.length > 20 ? rawDesc : `Reporting on ${category.toLowerCase()} developments affecting digital assets in the ${country} region.`,
        sourceName: item.source?.["#text"] || sourceName,
        sourceUrl: item.link || "https://news.google.com",
        publishedAt: pubDate,
        country: country !== "Regional MENA" ? country : undefined,
        region,
        category,
        severity,
        verificationStatus,
        tags: [country, category, "MENA"].filter(Boolean),
        upvotes: 0,
        commentCount: 0,
        readTime: `${Math.max(2, Math.min(6, Math.floor(cleanTitle.length / 18)))} min read`,
        isDemo: false
      };
    });

    // Merge live articles with curated MENA investigations
    const combined = [...CURATED_MENA_INTELLIGENCE, ...liveArticles];
    rssCache = { timestamp: now, data: combined };
    return combined;

  } catch (err) {
    return CURATED_MENA_INTELLIGENCE;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
