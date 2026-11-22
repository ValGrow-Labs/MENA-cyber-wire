export interface CVEItem {
  id: string;
  title: string;
  description: string;
  cvssScore: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  publishedDate: string;
  modifiedDate: string;
  affectedSoftware: string[];
  sourceUrl: string;
  isExploitedInWild?: boolean;
  menaImpactNote?: string;
  /** Date CISA added it to the Known Exploited Vulnerabilities catalogue (YYYY-MM-DD). */
  kevAddedDate?: string;
  /** CISA's plain-language name for the vulnerability. */
  kevName?: string;
}

export interface CISAAdvisory {
  id: string;
  title: string;
  publishedDate: string;
  affectedProducts: string[];
  severity: "Critical" | "High" | "Medium" | "Advisory";
  source: string;
  sourceUrl: string;
  summary: string;
  remediationAction: string;
  cveList?: string[];
}

export interface CyberPulseSummary {
  date: string;
  threatLevel: "GUARDED" | "ELEVATED" | "HIGH" | "CRITICAL";
  headline: string;
  activeIncidentsCount: number;
  targetedSectors: string[];
  primaryThreatActors: string[];
  keyTakeaway: string;
  advisoriesCount: number;
  criticalCveCount: number;
  recommendedDefensiveActions?: string[];
}
