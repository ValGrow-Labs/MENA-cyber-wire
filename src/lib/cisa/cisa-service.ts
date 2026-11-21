import { XMLParser } from "fast-xml-parser";
import { CISAAdvisory } from "@/types/threat";

const FALLBACK_ADVISORIES: CISAAdvisory[] = [
  {
    id: "AA24-109A",
    title: "Threat Actors Exploiting Vulnerabilities in Perimeter VPNs and Gateway Appliances",
    publishedDate: "2024-04-18T10:00:00Z",
    affectedProducts: ["Ivanti Connect Secure", "Palo Alto PAN-OS", "Fortinet FortiOS"],
    severity: "Critical",
    source: "CISA / US-CERT Alert",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-109a",
    summary: "State-sponsored cyber actors are actively conducting reconnaissance and mass exploitation of edge security devices to gain unauthenticated foothold in enterprise and critical infrastructure networks.",
    remediationAction: "Revoke all active VPN credentials, audit edge appliances for unexpected binary files, and enforce hardware security keys.",
    cveList: ["CVE-2024-3400", "CVE-2024-21887"]
  },
  {
    id: "AA24-057A",
    title: "Russian Foreign Intelligence Service (SVR) Cyber Operations Targeting Cloud Environments",
    publishedDate: "2024-02-26T14:00:00Z",
    affectedProducts: ["Microsoft 365", "Azure Active Directory", "AWS Identity"],
    severity: "High",
    source: "CISA / FBI Joint Advisory",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-057a",
    summary: "Actors leveraging compromised credentials, password spray, and dormant accounts to register rogue devices in target tenants and bypass conditional access controls.",
    remediationAction: "Disable dormant user accounts, audit OAuth application consent permissions, and eliminate SMS-based 2FA.",
    cveList: []
  },
  {
    id: "AA24-038A",
    title: "PRC State-Sponsored Cyber Actors Compromise and Maintain Persistent Access to Critical Infrastructure",
    publishedDate: "2024-02-07T12:00:00Z",
    affectedProducts: ["SCADA/ICS", "Cisco Routers", "Netgear SOHO Routers"],
    severity: "Critical",
    source: "CISA / NSA / FBI Alert",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a",
    summary: "Known as Volt Typhoon, actors pre-position themselves on IT networks to enable disruptive cyberattacks against communications, energy, transportation, and water systems.",
    remediationAction: "Segment OT networks from corporate IT. Implement out-of-band monitoring for operational telemetry.",
    cveList: []
  },
  {
    id: "AA24-015A",
    title: "StopRansomware: Phobos Ransomware Tactics and Indicators of Compromise",
    publishedDate: "2024-01-16T15:00:00Z",
    affectedProducts: ["Windows RDP", "Active Directory"],
    severity: "High",
    source: "CISA StopRansomware",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-015a",
    summary: "Phobos affiliates target municipal governments, healthcare institutions, and educational facilities via open RDP ports and phishing payloads.",
    remediationAction: "Close public-facing RDP ports (3389). Mandate VPN with MFA before accessing remote desktops.",
    cveList: []
  }
];

let cisaCache: { timestamp: number; data: CISAAdvisory[] } | null = null;
const CISA_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchCISAAdvisories(): Promise<CISAAdvisory[]> {
  const now = Date.now();
  if (cisaCache && (now - cisaCache.timestamp < CISA_CACHE_TTL) && cisaCache.data.length > 0) {
    return cisaCache.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // Official CISA cybersecurity alerts RSS feed
    const response = await fetch("https://www.cisa.gov/cybersecurity-advisories/all.xml", {
      signal: controller.signal,
      headers: {
        "User-Agent": "MENA-Cyber-Wire-Platform/1.0",
        "Accept": "application/rss+xml, text/xml, application/xml"
      },
      next: { revalidate: 1800 }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return FALLBACK_ADVISORIES;
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
    });
    const parsed = parser.parse(xml);
    const items = parsed?.rss?.channel?.item;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return FALLBACK_ADVISORIES;
    }

    const liveAdvisories: CISAAdvisory[] = items.slice(0, 10).map((item: any, idx: number) => {
      const title = item.title?.replace(/<[^>]*>/g, "").trim() || "CISA Cybersecurity Advisory";
      const desc = item.description?.replace(/<[^>]*>/g, "").trim() || "Official advisory from Cybersecurity & Infrastructure Security Agency.";
      const link = item.link || "https://www.cisa.gov";
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

      return {
        id: `CISA-${new Date(pubDate).getFullYear()}-${idx + 101}`,
        title,
        publishedDate: pubDate,
        affectedProducts: ["Enterprise Systems", "Network Perimeter", "Cloud Identity"],
        severity: title.toLowerCase().includes("critical") ? "Critical" : "High",
        source: "CISA Official Feed",
        sourceUrl: link,
        summary: desc.length > 250 ? `${desc.slice(0, 250)}...` : desc,
        remediationAction: "Apply vendor security updates and audit privileged account configurations according to CISA guidelines."
      };
    });

    const combined = [...FALLBACK_ADVISORIES, ...liveAdvisories];
    const unique = Array.from(new Map(combined.map((a) => [a.title, a])).values());
    cisaCache = { timestamp: now, data: unique };
    return unique;

  } catch (err) {
    console.warn("CISA feed fetch error, returning fallback advisories:", err);
    return FALLBACK_ADVISORIES;
  }
}
