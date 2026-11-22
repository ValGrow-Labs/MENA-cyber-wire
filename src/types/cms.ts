import { ThreatSeverity, VerificationStatus, NewsCategory, ThreatToAction } from "./news";
import { CountryData } from "./country";

export type AdminRole = "SUPER_ADMIN" | "EDITOR" | "AUTHOR" | "MODERATOR";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export type ArticleEditorialStatus = "Draft" | "Under Review" | "Approved" | "Published" | "Scheduled" | "Archived";

export interface CMSArticle {
  id: string;
  headline: string;
  slug: string;
  shortDescription: string;
  body: string; // Rich markdown or HTML content
  featuredImage?: string;
  imageCaption?: string;
  imageCredit?: string;
  category: NewsCategory;
  country?: string; // Target country (e.g., "Saudi Arabia", "United Arab Emirates")
  relatedCountries?: string[];
  region: "Gulf" | "Levant" | "North Africa" | "MENA General" | "Global";
  tags: string[];
  sourceName: string;
  sourceUrl: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  scheduledFor?: string;
  verificationStatus: VerificationStatus; // "SIGNAL" | "WATCH" | "UNVERIFIED"
  severity: ThreatSeverity; // "Critical" | "High" | "Medium" | "Low"
  editorialStatus: ArticleEditorialStatus;
  threatToAction?: ThreatToAction;
  isBreaking?: boolean;
  isFeatured?: boolean;
  featuredPosition?: "lead" | "top" | "secondary" | "none";
  featuredPriority?: number;
  featuredExpiresAt?: string;
  upvotes: number;
  commentCount: number;
  readTime?: string;
  isExternal?: boolean; // If imported or linked from external feed
  originalExternalId?: string;
  isDemo?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface CMSBreakingNews {
  id: string;
  headline: string;
  description: string;
  source: string;
  sourceUrl?: string;
  country?: string;
  category: NewsCategory;
  severity: ThreatSeverity;
  verificationStatus: VerificationStatus;
  publishedAt: string;
  isResolved: boolean;
  convertedArticleId?: string;
}

export interface CMSCategory {
  id: string;
  name: NewsCategory | string;
  slug: string;
  description: string;
  icon?: string;
  colorHex?: string;
  order: number;
  isEnabled: boolean;
}

export interface CMSCountryProfile extends CountryData {
  slug: string;
  cybersecurityAgency?: string;
  regulatoryFramework?: string;
  cybersecurityLaws?: string[];
  editorialSummary?: string;
  countryImage?: string;
  pageMetadata?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface CMSThreatActorResearch {
  id: string;
  name: string;
  aliases: string;
  origin: string;
  region: string;
  targetSectors: string[];
  description: string;
  threatProfile: string;
  tactics: string[];
  techniques: string[];
  procedures: string[];
  indicators: string[];
  relatedIncidents: string[];
  references: { title: string; url: string }[];
  author: string;
  lastUpdated: string;
  publicationStatus: "Draft" | "Published" | "Archived";
  isFeatured?: boolean;
}

export interface CMSVulnerabilityEditorial {
  cveId: string; // e.g. "CVE-2024-3400"
  editorialTitle?: string;
  editorialSeverity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  cvssScore?: number;
  affectedProducts?: string[];
  vendor?: string;
  description?: string;
  menaImpactNotes?: string;
  recommendedRemediation?: string;
  patchStatus?: "Available" | "Workaround" | "Zero-Day";
  relatedArticleIds?: string[];
  isFeatured?: boolean;
  isHidden?: boolean; // Override to hide from public threats feed
  isCustomEntry?: boolean; // Created manually in CMS vs fetched from NVD
  lastUpdated: string;
}

export interface CMSDailyBrief {
  id: string;
  date: string; // YYYY-MM-DD
  threatLevel: "GUARDED" | "ELEVATED" | "HIGH" | "CRITICAL";
  headline: string;
  executiveSummary: string;
  targetedSectors: string[];
  primaryThreatActors: string[];
  keyTakeaway: string;
  recommendedDefensiveActions: string[];
  topStoryIds: string[];
  criticalCveIds: string[];
  status: "Draft" | "Published" | "Archived";
  scheduledFor?: string;
  publishedAt?: string;
}

export interface CMSCommunityPost {
  id: string;
  title: string;
  body: string;
  topic: string;
  country: string;
  authorName: string;
  authorHandle: string;
  authorRole: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  moderationStatus: "ACTIVE" | "FLAGGED" | "HIDDEN" | "DELETED";
  isPinned: boolean;
  moderationNotes?: string;
  commentsCount: number;
  comments: CMSCommunityComment[];
  tags: string[];
}

export interface CMSCommunityComment {
  id: string;
  postId: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  text: string;
  moderationStatus: "ACTIVE" | "FLAGGED" | "HIDDEN" | "DELETED";
}

export interface CMSHomepageSection {
  id: string;
  title: string;
  type: "lead" | "breaking_ticker" | "river" | "radar" | "vulnerabilities" | "research" | "community";
  order: number;
  isEnabled: boolean;
  customItemIds?: string[];
}

export interface CMSHomepageConfig {
  leadStoryId?: string;
  featuredStoryIds: string[];
  topStoryIds: string[];
  secondaryStoryIds: string[];
  sections: CMSHomepageSection[];
  lastUpdated: string;
}

export interface CMSMediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  title: string;
  altText: string;
  caption?: string;
  credit?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CMSWebsiteSettings {
  websiteName: string;
  websiteTagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    github?: string;
  };
  footerDisclaimer: string;
  editorialTimezone: string; // default "Asia/Riyadh"
  breakingNewsTickerEnabled: boolean;
  threatLevelOverride?: "GUARDED" | "ELEVATED" | "HIGH" | "CRITICAL";
  lastUpdated: string;
}

export interface CMSSEOSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  defaultOgImage?: string;
  canonicalBaseUrl: string;
  twitterHandle?: string;
  robotsTxtContent?: string;
  lastUpdated: string;
}

export interface CMSAuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string; // e.g. "ARTICLE_CREATE", "ARTICLE_PUBLISH", "COUNTRY_UPDATE", etc.
  targetType: string; // "ARTICLE", "BREAKING", "COUNTRY", "RESEARCH", "SETTING", etc.
  targetId?: string;
  targetTitle?: string;
  details?: string;
  ipAddress?: string;
  timestamp: string;
}
