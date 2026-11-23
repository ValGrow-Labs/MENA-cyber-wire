import fs from "fs";
import path from "path";
import os from "os";
import {
  AdminUser,
  CMSArticle,
  CMSBreakingNews,
  CMSCategory,
  CMSCountryProfile,
  CMSThreatActorResearch,
  CMSVulnerabilityEditorial,
  CMSDailyBrief,
  CMSCommunityPost,
  CMSHomepageConfig,
  CMSMediaItem,
  CMSWebsiteSettings,
  CMSSEOSettings,
  CMSAuditLog,
} from "@/types/cms";
import { hashPassword } from "./auth";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { CURATED_MENA_INTELLIGENCE } from "@/lib/news/curated-seed";

// Dual paths: bundled static seed dir and writable serverless /tmp dir
const BUNDLED_DIR = path.join(process.cwd(), "data", "cms");
const TMP_DIR = path.join(os.tmpdir(), "mena-cyber-cms");

// In-memory cache ensures zero EROFS exceptions on Vercel / read-only serverless platforms
const memoryCache: Record<string, any> = {};

function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {}
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  // 1. Check in-memory cache first
  if (memoryCache[filename] !== undefined) {
    return memoryCache[filename] as T;
  }

  // 2. Check writable /tmp directory next (written in current serverless session)
  try {
    const tmpFile = path.join(TMP_DIR, filename);
    if (fs.existsSync(tmpFile)) {
      const raw = fs.readFileSync(tmpFile, "utf-8");
      const parsed = JSON.parse(raw);
      memoryCache[filename] = parsed;
      return parsed as T;
    }
  } catch {}

  // 3. Check bundled project data directory next
  try {
    const bundledFile = path.join(BUNDLED_DIR, filename);
    if (fs.existsSync(bundledFile)) {
      const raw = fs.readFileSync(bundledFile, "utf-8");
      const parsed = JSON.parse(raw);
      memoryCache[filename] = parsed;
      return parsed as T;
    }
  } catch {}

  // 4. Fallback to default generated seed
  memoryCache[filename] = defaultValue;
  writeJsonAtomic(filename, defaultValue);
  return defaultValue;
}

function writeJsonAtomic<T>(filename: string, data: T): void {
  // Always update in-memory cache immediately
  memoryCache[filename] = data;

  // Try writing to /tmp directory (works on Vercel and AWS Lambda)
  try {
    ensureDir(TMP_DIR);
    const tmpTarget = path.join(TMP_DIR, filename);
    fs.writeFileSync(tmpTarget, JSON.stringify(data, null, 2), "utf-8");
  } catch {}

  // Try writing to local project directory (works in local dev, silently skipped on Vercel read-only filesystem)
  try {
    ensureDir(BUNDLED_DIR);
    const localTarget = path.join(BUNDLED_DIR, filename);
    fs.writeFileSync(localTarget, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

// -----------------------------------------------------------------------------
// DEFAULT SEED DATA GENERATORS
// -----------------------------------------------------------------------------

function getInitialAdminUsers(): AdminUser[] {
  const { hash, salt } = hashPassword("MenaCyber@2026!");
  return [
    {
      id: "usr-admin-01",
      name: "Senior Cyber Desk Editor",
      email: "admin@menacyberwire.com",
      passwordHash: hash,
      salt: salt,
      role: "SUPER_ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      createdAt: new Date().toISOString(),
      isActive: true,
    },
  ];
}

function getInitialCategories(): CMSCategory[] {
  return [
    { id: "cat-1", name: "Ransomware", slug: "ransomware", description: "Ransomware syndicates, double-extortion campaigns, and decryptor telemetry.", order: 1, isEnabled: true, colorHex: "#E52D27", icon: "Lock" },
    { id: "cat-2", name: "Data Breach", slug: "data-breach", description: "Regional enterprise and government leaks, stolen credentials, and dark web disclosures.", order: 2, isEnabled: true, colorHex: "#F2B45B", icon: "Database" },
    { id: "cat-3", name: "Critical Infrastructure", slug: "critical-infrastructure", description: "Attacks on energy grids, desalination plants, ports, and ICS/SCADA systems.", order: 3, isEnabled: true, colorHex: "#E45B48", icon: "Cpu" },
    { id: "cat-4", name: "Espionage & APT", slug: "espionage-apt", description: "State-sponsored cyber espionage campaigns in the Middle East & North Africa.", order: 4, isEnabled: true, colorHex: "#9B51E0", icon: "Eye" },
    { id: "cat-5", name: "Vulnerability", slug: "vulnerability", description: "Zero-days, edge appliances (PAN-OS, Ivanti, FortiOS), and active KEV exploits.", order: 5, isEnabled: true, colorHex: "#EB5757", icon: "AlertTriangle" },
    { id: "cat-6", name: "Fintech & Banking", slug: "fintech-banking", description: "Financial cyber threats, SWIFT anomalies, ATM malware, and payment gateway security.", order: 6, isEnabled: true, colorHex: "#27AE60", icon: "CreditCard" },
    { id: "cat-7", name: "Cloud & AI", slug: "cloud-ai", description: "AI security risks, cloud tenant compromises, and LLM adversarial exploitation.", order: 7, isEnabled: true, colorHex: "#2D9CDB", icon: "Cloud" },
    { id: "cat-8", name: "Policy & Regulation", slug: "policy-regulation", description: "NCA ECC compliance, UAE Federal Decree-Law 45, Qatar Law 13, and CERT directives.", order: 8, isEnabled: true, colorHex: "#087E8B", icon: "Shield" },
  ];
}

function getInitialCountries(): CMSCountryProfile[] {
  return MENA_COUNTRIES.map((c) => ({
    ...c,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    cybersecurityAgency: c.certAgency,
    regulatoryFramework: c.summary,
    cybersecurityLaws: [
      c.code === "SA" ? "Personal Data Protection Law (PDPL - SDAIA)" :
      c.code === "AE" ? "Federal Decree-Law No. 45 of 2021 on Personal Data" :
      c.code === "QA" ? "Law No. 13 of 2016 on Personal Data Protection" :
      "National Cybersecurity Policy & Critical Sector Guidelines"
    ],
    editorialSummary: c.summary,
    pageMetadata: {
      metaTitle: `${c.name} Cybersecurity Profile & Threat Telemetry | MENA Cyber Wire`,
      metaDescription: `Real-time cyber threat posture, national CERT directives, and critical infrastructure analysis for ${c.name}.`,
    },
  }));
}

function getInitialThreatActors(): CMSThreatActorResearch[] {
  return [
    {
      id: "actor-muddywater",
      name: "MuddyWater",
      aliases: "Mango Sandstorm, Seedworm, Static Kitten, MERCURY",
      origin: "Iranian state (MOIS)",
      region: "Middle East, North Africa, Global",
      targetSectors: ["Government", "Telecommunications", "Energy", "Defense", "Municipalities"],
      description: "A state-sponsored cyber espionage operator subordinate to Iran's Ministry of Intelligence and Security (MOIS), actively targeting entities across the GCC and Levant.",
      threatProfile: "Utilizes spear-phishing with malicious document lures, legitimate remote management software (ScreenConnect, Syncro, Atera), and custom backdoors including POWERSTATS and Small Sieve.",
      tactics: ["Initial Access via Spear-phishing", "Execution via Living-off-the-Land Binaries", "Persistence via Scheduled Tasks"],
      techniques: ["T1566 Spearphishing Attachment", "T1059 Command and Scripting Interpreter", "T1219 Remote Access Software"],
      procedures: ["Masquerading as telecom or government regulatory memos to trick regional administrators."],
      indicators: ["powershell.exe -w hidden -enc ...", "C:\\ProgramData\\syncro.exe"],
      relatedIncidents: ["GCC Government Phishing Wave", "Regional ISP Compromise"],
      references: [{ title: "CISA / FBI Joint Advisory AA22-055A", url: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a" }],
      author: "MENA Cyber Wire Intelligence Desk",
      lastUpdated: new Date().toISOString(),
      publicationStatus: "Published",
      isFeatured: true,
    },
    {
      id: "actor-oilrig",
      name: "OilRig",
      aliases: "APT34, Helix Kitten, Hazel Sandstorm, EUROPIUM",
      origin: "Iran-linked",
      region: "Middle East",
      targetSectors: ["Financial", "Energy", "Government", "Chemicals", "Telecom"],
      description: "Publicly tracked since at least 2014, OilRig focuses on long-term espionage across high-value Arabian Gulf institutions.",
      threatProfile: "Pioneered DNS tunneling for covert command-and-control communication and uses faux recruiter profiles on LinkedIn for initial access.",
      tactics: ["Social Engineering", "DNS Tunneling C2", "Web Shell Persistence"],
      techniques: ["T1071.004 DNS C2", "T1505.003 Web Shell", "T1056 Input Capture"],
      procedures: ["Placing web shells on internet-facing Outlook Web Access (OWA) servers."],
      indicators: ["nslookup query.c2.domain.org", "tunnel.ps1"],
      relatedIncidents: ["Gulf Financial Services Infiltration", "Energy Ministry Inquiries"],
      references: [{ title: "MITRE ATT&CK OilRig (G0049)", url: "https://attack.mitre.org/groups/G0049/" }],
      author: "MENA Cyber Wire Intelligence Desk",
      lastUpdated: new Date().toISOString(),
      publicationStatus: "Published",
      isFeatured: true,
    },
    {
      id: "actor-shamoon",
      name: "Shamoon (Disttrack) Operators",
      aliases: "Wiper campaigns of 2012, 2016-17, and 2018",
      origin: "Attributed to Iran-linked operators",
      region: "Saudi Arabia & GCC",
      targetSectors: ["Oil & Petrochemicals", "Government Agencies", "Desalination"],
      description: "Responsible for some of the most destructive cyber attacks in regional history, completely destroying hard drives and master boot records.",
      threatProfile: "Payload consists of a wiper, dropper, and reporter component. Replaces master boot records with an image (e.g., the burning flag or Alan Kurdi) and overwrites file structures.",
      tactics: ["Destructive Malware", "Credential Theft", "Network Propagation"],
      techniques: ["T1485 Data Destruction", "T1561 Disk Wipe", "T1078 Valid Accounts"],
      procedures: ["Internal propagation via admin shares using stolen domain admin credentials."],
      indicators: ["disttrack.exe", "\\\\*\\C$\\Windows\\system32\\wiper.sys"],
      relatedIncidents: ["Saudi Aramco 2012 Wipe (30,000 workstations)", "Saipem Middle East 2018 Wipe"],
      references: [{ title: "NCA Saudi Incident Telemetry", url: "https://nca.gov.sa" }],
      author: "MENA Cyber Wire Intelligence Desk",
      lastUpdated: new Date().toISOString(),
      publicationStatus: "Published",
      isFeatured: true,
    },
    {
      id: "actor-triton",
      name: "TRITON / TRISIS",
      aliases: "XENOTIME (Dragos), HatMan",
      origin: "Russian State Research Institute (TsNIIKhM)",
      region: "Saudi Arabia / Middle East Industrial Plants",
      targetSectors: ["Safety Instrumented Systems (SIS)", "Petrochemical Refineries", "Industrial Plants"],
      description: "First discovered in 2017 targeting a petrochemical plant in Saudi Arabia. Built specifically to reprogram Triconex safety controllers that prevent explosions or toxic leaks.",
      threatProfile: "Interacts directly with proprietary TriStation network protocols to read/write memory on safety instrumented system firmware.",
      tactics: ["OT/ICS Infiltration", "Safety System Tampering", "Physical Disruption Threat"],
      techniques: ["T0839 Modify Controller Tasking", "T0887 Denial of Safety"],
      procedures: ["Reprogramming Schneider Electric Triconex MP 3008 controllers."],
      indicators: ["trilog.exe", "imain.bin", "inject.bin"],
      relatedIncidents: ["2017 Petrochemical Plant Emergency Tripping"],
      references: [{ title: "US Treasury Sanctions Announcement (2020)", url: "https://home.treasury.gov" }],
      author: "MENA Cyber Wire Intelligence Desk",
      lastUpdated: new Date().toISOString(),
      publicationStatus: "Published",
      isFeatured: true,
    },
  ];
}

function getInitialArticles(): CMSArticle[] {
  return CURATED_MENA_INTELLIGENCE.map((a, i) => ({
    id: a.id,
    headline: a.title,
    slug: a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80),
    shortDescription: a.description,
    body: a.content || `${a.description}\n\n### Threat Assessment\nOur desk has conducted continuous telemetry review of this developing situation across regional communication channels. IT and SOC teams must verify indicators of compromise immediately.\n\n### Impact on Regional Operations\nDisruption to critical infrastructure and financial networks carries severe cascading impact across supply chain partners.`,
    featuredImage: a.imageUrl,
    imageCaption: `Editorial intelligence photo for ${a.title.slice(0, 40)}`,
    imageCredit: a.sourceName,
    category: a.category,
    country: a.country,
    region: a.region,
    tags: a.tags,
    sourceName: a.sourceName,
    sourceUrl: a.sourceUrl,
    author: "MENA Cyber Wire Desk",
    publishedAt: a.publishedAt,
    updatedAt: a.publishedAt,
    verificationStatus: a.verificationStatus,
    severity: a.severity,
    editorialStatus: "Published",
    threatToAction: a.threatToAction,
    isBreaking: i === 0,
    isFeatured: i < 3,
    featuredPosition: i === 0 ? "lead" : i === 1 ? "top" : "secondary",
    featuredPriority: 10 - i,
    upvotes: a.upvotes || 0,
    commentCount: a.commentCount || 0,
    readTime: a.readTime || "4 min",
    isExternal: false,
    isDemo: false,
  }));
}

function getInitialBreakingNews(): CMSBreakingNews[] {
  return [
    {
      id: "brk-01",
      headline: "Urgent: Active Exploitation of Edge VPN Firewalls Reported Across GCC Government Networks",
      description: "State-affiliated threat groups are targeting unpatched boundary gateways to gain persistence before weekend SOC shift changes.",
      source: "aeCERT & Saudi NCA Warning",
      sourceUrl: "https://nca.gov.sa",
      country: "Regional MENA",
      category: "Critical Infrastructure",
      severity: "Critical",
      verificationStatus: "SIGNAL",
      publishedAt: new Date().toISOString(),
      isResolved: false,
    },
    {
      id: "brk-02",
      headline: "New Ransomware Variant Implements Arabic Ransom Note Lures in UAE Logistics Sector",
      description: "Affiliates observed delivering double-extortion payloads via compromised corporate email credentials.",
      source: "MENA Cyber Desk",
      country: "United Arab Emirates",
      category: "Ransomware",
      severity: "High",
      verificationStatus: "WATCH",
      publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      isResolved: false,
    },
  ];
}

function getInitialVulnerabilities(): CMSVulnerabilityEditorial[] {
  return [
    {
      cveId: "CVE-2024-3400",
      editorialTitle: "Palo Alto PAN-OS Command Injection Zero-Day",
      editorialSeverity: "CRITICAL",
      cvssScore: 10.0,
      affectedProducts: ["PAN-OS 10.2", "PAN-OS 11.0", "PAN-OS 11.1"],
      vendor: "Palo Alto Networks",
      description: "Unauthenticated remote code execution via GlobalProtect feature.",
      menaImpactNotes: "Extensively deployed as boundary firewall in GCC government, banking, and energy perimeter networks. Immediate patching mandatory under NCA & aeCERT directives.",
      recommendedRemediation: "Upgrade to PAN-OS 10.2.9-h1, 11.0.4-h1, or 11.1.2-h3 immediately. Audit system logs for root shell executions.",
      patchStatus: "Available",
      isFeatured: true,
      isHidden: false,
      isCustomEntry: false,
      lastUpdated: new Date().toISOString(),
    },
    {
      cveId: "CVE-2024-21887",
      editorialTitle: "Ivanti Connect Secure and Policy Secure Command Injection",
      editorialSeverity: "CRITICAL",
      cvssScore: 9.1,
      affectedProducts: ["Ivanti Connect Secure 9.x", "Ivanti Connect Secure 22.x"],
      vendor: "Ivanti",
      description: "Command injection in web components allows authenticated admin command execution.",
      menaImpactNotes: "Observed in APT espionage campaigns targeting Middle Eastern telecommunications and defense ministries.",
      recommendedRemediation: "Apply Ivanti security patches and run external integrity checker tool (ICT).",
      patchStatus: "Available",
      isFeatured: true,
      isHidden: false,
      isCustomEntry: false,
      lastUpdated: new Date().toISOString(),
    },
  ];
}

function getInitialDailyBrief(): CMSDailyBrief {
  const dateStr = new Date().toISOString().split("T")[0];
  return {
    id: `brief-${dateStr}`,
    date: dateStr,
    threatLevel: "GUARDED",
    headline: "Morning Cyber Intelligence: Regional Posture, Edge Exposure, and Remediation Directives",
    executiveSummary: "Regional threat telemetry highlights continuing reconnaissance against internet-facing VPN gateways and firewall appliances across GCC petrochemical and financial verticals.",
    targetedSectors: ["Energy and petrochemicals", "Government & Vision 2030 entities", "Banking and payments", "Telecoms", "Aviation"],
    primaryThreatActors: ["MuddyWater", "OilRig (APT34)", "Shamoon wiper operators", "LockBit affiliates"],
    keyTakeaway: "Edge devices, VPNs, firewalls, and remote-access gateways remain the primary entry point cited in regional alerts. Review KEV catalogs and enforce hardware MFA across all administrative ingress points.",
    recommendedDefensiveActions: [
      "Check perimeter gateways (PAN-OS, Ivanti, Fortinet) against the current KEV list and patch anything listed.",
      "Warn finance teams about phishing that imitates GCC regulator memos; MuddyWater has used this lure repeatedly.",
      "Confirm offline backups exist and restore cleanly for OT historian and SCADA servers.",
      "Require hardware-key or app-based MFA on every administrative portal, including vendor access.",
    ],
    topStoryIds: ["mcw-desk-01", "mcw-desk-02"],
    criticalCveIds: ["CVE-2024-3400", "CVE-2024-21887"],
    status: "Published",
    publishedAt: new Date().toISOString(),
  };
}

function getInitialHomepageConfig(): CMSHomepageConfig {
  return {
    leadStoryId: "mcw-desk-01",
    featuredStoryIds: ["mcw-desk-01", "mcw-desk-02", "mcw-desk-03"],
    topStoryIds: ["mcw-desk-02", "mcw-desk-03"],
    secondaryStoryIds: ["mcw-desk-04", "mcw-desk-05"],
    sections: [
      { id: "sec-breaking", title: "Breaking Wire Ticker", type: "breaking_ticker", order: 1, isEnabled: true },
      { id: "sec-lead", title: "Lead Investigation", type: "lead", order: 2, isEnabled: true },
      { id: "sec-radar", title: "Regional Threat Radar", type: "radar", order: 3, isEnabled: true },
      { id: "sec-river", title: "Live Intelligence River", type: "river", order: 4, isEnabled: true },
      { id: "sec-vulns", title: "Critical Vulnerabilities", type: "vulnerabilities", order: 5, isEnabled: true },
      { id: "sec-research", title: "Adversary Research", type: "research", order: 6, isEnabled: true },
      { id: "sec-community", title: "Practitioner Community", type: "community", order: 7, isEnabled: true },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

function getInitialSettings(): CMSWebsiteSettings {
  return {
    websiteName: "MENA Cyber Wire",
    websiteTagline: "Regional Cyber Intelligence. Real-time Awareness.",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "intel@menacyberwire.com",
    socialLinks: {
      twitter: "https://x.com/menacyberwire",
      linkedin: "https://linkedin.com/company/mena-cyber-wire",
      telegram: "https://t.me/menacyberwire",
      github: "https://github.com/ValGrow-Labs/MENA-cyber-wire",
    },
    footerDisclaimer: "MENA Cyber Wire is an independent intelligence and editorial platform dedicated to regional security transparency across the Middle East & North Africa.",
    editorialTimezone: "Asia/Riyadh",
    breakingNewsTickerEnabled: true,
    threatLevelOverride: "GUARDED",
    lastUpdated: new Date().toISOString(),
  };
}

function getInitialSEO(): CMSSEOSettings {
  return {
    defaultTitle: "MENA Cyber Wire: Cyber Security Intelligence for the Middle East & North Africa",
    titleTemplate: "%s · MENA Cyber Wire",
    defaultDescription: "Independent reporting on cyber attacks, zero-days, ransomware, and national security directives across Saudi Arabia, UAE, Qatar, Egypt, and the MENA region.",
    keywords: ["MENA cybersecurity", "Saudi Arabia cyber attack", "UAE cybersecurity", "NCA ECC", "aeCERT", "Q-CERT", "Middle East ransomware", "CISA advisories", "NVD CVE"],
    defaultOgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    canonicalBaseUrl: "https://menacyberwire.com",
    twitterHandle: "@menacyberwire",
    robotsTxtContent: "User-agent: *\nAllow: /\nDisallow: /cms-admin/\nDisallow: /api/cms/\nSitemap: https://menacyberwire.com/sitemap.xml",
    lastUpdated: new Date().toISOString(),
  };
}

// -----------------------------------------------------------------------------
// CMS DATABASE SINGLETON REPOSITORY
// -----------------------------------------------------------------------------

export const CMS_DB = {
  // --- USERS ---
  getUsers(): AdminUser[] {
    return readJsonFile<AdminUser[]>("users.json", getInitialAdminUsers());
  },
  getUserByEmail(email: string): AdminUser | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById(id: string): AdminUser | undefined {
    return this.getUsers().find((u) => u.id === id);
  },
  saveUsers(users: AdminUser[]): void {
    writeJsonAtomic("users.json", users);
  },
  upsertUser(user: AdminUser): void {
    const list = this.getUsers();
    const idx = list.findIndex((u) => u.id === user.id);
    if (idx >= 0) list[idx] = user;
    else list.push(user);
    this.saveUsers(list);
  },
  deleteUser(id: string): boolean {
    const list = this.getUsers().filter((u) => u.id !== id);
    this.saveUsers(list);
    return true;
  },

  // --- ARTICLES ---
  getArticles(): CMSArticle[] {
    return readJsonFile<CMSArticle[]>("articles.json", getInitialArticles());
  },
  getArticleById(id: string): CMSArticle | undefined {
    return this.getArticles().find((a) => a.id === id);
  },
  saveArticles(articles: CMSArticle[]): void {
    writeJsonAtomic("articles.json", articles);
  },
  upsertArticle(article: CMSArticle): void {
    const list = this.getArticles();
    const idx = list.findIndex((a) => a.id === article.id);
    if (idx >= 0) list[idx] = article;
    else list.unshift(article);
    this.saveArticles(list);
  },
  deleteArticle(id: string): boolean {
    const list = this.getArticles().filter((a) => a.id !== id);
    this.saveArticles(list);
    return true;
  },

  // --- BREAKING NEWS ---
  getBreakingNews(): CMSBreakingNews[] {
    return readJsonFile<CMSBreakingNews[]>("breaking.json", getInitialBreakingNews());
  },
  saveBreakingNews(items: CMSBreakingNews[]): void {
    writeJsonAtomic("breaking.json", items);
  },
  upsertBreakingNews(item: CMSBreakingNews): void {
    const list = this.getBreakingNews();
    const idx = list.findIndex((b) => b.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    this.saveBreakingNews(list);
  },
  deleteBreakingNews(id: string): boolean {
    const list = this.getBreakingNews().filter((b) => b.id !== id);
    this.saveBreakingNews(list);
    return true;
  },

  // --- CATEGORIES ---
  getCategories(): CMSCategory[] {
    return readJsonFile<CMSCategory[]>("categories.json", getInitialCategories());
  },
  saveCategories(categories: CMSCategory[]): void {
    writeJsonAtomic("categories.json", categories);
  },
  upsertCategory(cat: CMSCategory): void {
    const list = this.getCategories();
    const idx = list.findIndex((c) => c.id === cat.id);
    if (idx >= 0) list[idx] = cat;
    else list.push(cat);
    this.saveCategories(list);
  },
  deleteCategory(id: string): boolean {
    const list = this.getCategories().filter((c) => c.id !== id);
    this.saveCategories(list);
    return true;
  },

  // --- COUNTRIES ---
  getCountries(): CMSCountryProfile[] {
    return readJsonFile<CMSCountryProfile[]>("countries.json", getInitialCountries());
  },
  getCountryByCode(code: string): CMSCountryProfile | undefined {
    return this.getCountries().find((c) => c.code.toUpperCase() === code.toUpperCase());
  },
  saveCountries(countries: CMSCountryProfile[]): void {
    writeJsonAtomic("countries.json", countries);
  },
  updateCountry(country: CMSCountryProfile): void {
    const list = this.getCountries();
    const idx = list.findIndex((c) => c.code.toUpperCase() === country.code.toUpperCase());
    if (idx >= 0) list[idx] = country;
    else list.push(country);
    this.saveCountries(list);
  },

  // --- RESEARCH & THREAT ACTORS ---
  getThreatActors(): CMSThreatActorResearch[] {
    return readJsonFile<CMSThreatActorResearch[]>("research.json", getInitialThreatActors());
  },
  getThreatActorById(id: string): CMSThreatActorResearch | undefined {
    return this.getThreatActors().find((a) => a.id === id);
  },
  saveThreatActors(actors: CMSThreatActorResearch[]): void {
    writeJsonAtomic("research.json", actors);
  },
  upsertThreatActor(actor: CMSThreatActorResearch): void {
    const list = this.getThreatActors();
    const idx = list.findIndex((a) => a.id === actor.id);
    if (idx >= 0) list[idx] = actor;
    else list.unshift(actor);
    this.saveThreatActors(list);
  },
  deleteThreatActor(id: string): boolean {
    const list = this.getThreatActors().filter((a) => a.id !== id);
    this.saveThreatActors(list);
    return true;
  },

  // --- VULNERABILITIES EDITORIAL ---
  getVulnerabilityEditorials(): CMSVulnerabilityEditorial[] {
    return readJsonFile<CMSVulnerabilityEditorial[]>("vulnerabilities.json", getInitialVulnerabilities());
  },
  getVulnerabilityEditorialByCve(cveId: string): CMSVulnerabilityEditorial | undefined {
    return this.getVulnerabilityEditorials().find((v) => v.cveId.toUpperCase() === cveId.toUpperCase());
  },
  saveVulnerabilityEditorials(list: CMSVulnerabilityEditorial[]): void {
    writeJsonAtomic("vulnerabilities.json", list);
  },
  upsertVulnerabilityEditorial(vuln: CMSVulnerabilityEditorial): void {
    const list = this.getVulnerabilityEditorials();
    const idx = list.findIndex((v) => v.cveId.toUpperCase() === vuln.cveId.toUpperCase());
    if (idx >= 0) list[idx] = vuln;
    else list.unshift(vuln);
    this.saveVulnerabilityEditorials(list);
  },
  deleteVulnerabilityEditorial(cveId: string): boolean {
    const list = this.getVulnerabilityEditorials().filter((v) => v.cveId.toUpperCase() !== cveId.toUpperCase());
    this.saveVulnerabilityEditorials(list);
    return true;
  },

  // --- DAILY BRIEF ---
  getDailyBriefs(): CMSDailyBrief[] {
    return readJsonFile<CMSDailyBrief[]>("daily-briefs.json", [getInitialDailyBrief()]);
  },
  getTodayDailyBrief(): CMSDailyBrief {
    const briefs = this.getDailyBriefs();
    return briefs[0] || getInitialDailyBrief();
  },
  saveDailyBriefs(briefs: CMSDailyBrief[]): void {
    writeJsonAtomic("daily-briefs.json", briefs);
  },
  upsertDailyBrief(brief: CMSDailyBrief): void {
    const list = this.getDailyBriefs();
    const idx = list.findIndex((b) => b.id === brief.id);
    if (idx >= 0) list[idx] = brief;
    else list.unshift(brief);
    this.saveDailyBriefs(list);
  },

  // --- HOMEPAGE CONFIG ---
  getHomepageConfig(): CMSHomepageConfig {
    return readJsonFile<CMSHomepageConfig>("homepage.json", getInitialHomepageConfig());
  },
  saveHomepageConfig(config: CMSHomepageConfig): void {
    writeJsonAtomic("homepage.json", config);
  },

  // --- COMMUNITY POSTS MODERATION ---
  getCommunityPosts(): CMSCommunityPost[] {
    return readJsonFile<CMSCommunityPost[]>("community.json", []);
  },
  saveCommunityPosts(posts: CMSCommunityPost[]): void {
    writeJsonAtomic("community.json", posts);
  },
  upsertCommunityPost(post: CMSCommunityPost): void {
    const list = this.getCommunityPosts();
    const idx = list.findIndex((p) => p.id === post.id);
    if (idx >= 0) list[idx] = post;
    else list.unshift(post);
    this.saveCommunityPosts(list);
  },

  // --- MEDIA ---
  getMediaItems(): CMSMediaItem[] {
    return readJsonFile<CMSMediaItem[]>("media.json", []);
  },
  saveMediaItems(items: CMSMediaItem[]): void {
    writeJsonAtomic("media.json", items);
  },
  addMediaItem(item: CMSMediaItem): void {
    const list = this.getMediaItems();
    list.unshift(item);
    this.saveMediaItems(list);
  },
  deleteMediaItem(id: string): boolean {
    const list = this.getMediaItems().filter((m) => m.id !== id);
    this.saveMediaItems(list);
    return true;
  },

  // --- WEBSITE SETTINGS ---
  getSettings(): CMSWebsiteSettings {
    return readJsonFile<CMSWebsiteSettings>("settings.json", getInitialSettings());
  },
  saveSettings(settings: CMSWebsiteSettings): void {
    writeJsonAtomic("settings.json", settings);
  },

  // --- SEO SETTINGS ---
  getSEOSettings(): CMSSEOSettings {
    return readJsonFile<CMSSEOSettings>("seo.json", getInitialSEO());
  },
  saveSEOSettings(seo: CMSSEOSettings): void {
    writeJsonAtomic("seo.json", seo);
  },

  // --- AUDIT LOGS ---
  getAuditLogs(): CMSAuditLog[] {
    return readJsonFile<CMSAuditLog[]>("audit-logs.json", [
      {
        id: "log-init-01",
        adminId: "usr-admin-01",
        adminEmail: "admin@menacyberwire.com",
        adminName: "Senior Cyber Desk Editor",
        action: "SYSTEM_INITIALIZE",
        targetType: "CMS",
        targetTitle: "MENA Cyber Wire CMS Initialized",
        details: "Initialized secure database, regional desks, threat actors, and default configurations.",
        timestamp: new Date().toISOString(),
      },
    ]);
  },
  addAuditLog(entry: Omit<CMSAuditLog, "id" | "timestamp">): void {
    const list = this.getAuditLogs();
    const fullEntry: CMSAuditLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    list.unshift(fullEntry);
    // Keep last 1,000 logs
    writeJsonAtomic("audit-logs.json", list.slice(0, 1000));
  },
};
