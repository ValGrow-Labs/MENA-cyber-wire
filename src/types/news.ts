export type VerificationStatus = "SIGNAL" | "WATCH" | "UNVERIFIED";

export type ThreatSeverity = "Critical" | "High" | "Medium" | "Low";

export type NewsCategory = 
  | "Ransomware"
  | "Data Breach"
  | "Critical Infrastructure"
  | "Espionage & APT"
  | "Vulnerability"
  | "Policy & Regulation"
  | "Fintech & Banking"
  | "Cloud & AI";

export interface ThreatToAction {
  whatHappened: string;
  whoIsAffected: string;
  whyItMatters: string;
  whatShouldUsersDo: string;
  recommendedDefensiveActions: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
  publishedAt: string;
  country?: string;
  region: "Gulf" | "Levant" | "North Africa" | "MENA General" | "Global";
  category: NewsCategory;
  severity: ThreatSeverity;
  verificationStatus: VerificationStatus;
  tags: string[];
  threatToAction?: ThreatToAction;
  upvotes: number;
  commentCount: number;
  readTime?: string;
  isDemo?: boolean;
}

export interface NewsFilterState {
  search: string;
  country: string;
  category: string;
  severity: string;
  verificationStatus: string;
  sortBy: "latest" | "trending" | "discussed" | "severity";
}
