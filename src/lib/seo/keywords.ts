export interface KeywordGroup {
  id: string;
  name: string;
  targetRegion: string;
  recommendedKeywords: string[];
  suggestedUrl: string;
}

export const SEO_KEYWORD_GROUPS: KeywordGroup[] = [
  {
    id: "grp-1",
    name: "Group 1: Middle East Cybersecurity",
    targetRegion: "MENA Regional",
    recommendedKeywords: [
      "Middle East cybersecurity",
      "MENA cyber threat intelligence",
      "Gulf cyber defense",
      "Middle East critical infrastructure security",
      "Arab world cybersecurity trends",
    ],
    suggestedUrl: "/",
  },
  {
    id: "grp-2",
    name: "Group 2: UAE Cybersecurity",
    targetRegion: "United Arab Emirates",
    recommendedKeywords: [
      "UAE cybersecurity news",
      "aeCERT advisories",
      "Dubai cyber security strategy",
      "UAE Cyber Security Council",
      "Emirates critical infrastructure protection",
    ],
    suggestedUrl: "/country/united-arab-emirates",
  },
  {
    id: "grp-3",
    name: "Group 3: Saudi Arabia Cybersecurity",
    targetRegion: "Saudi Arabia",
    recommendedKeywords: [
      "Saudi Arabia cybersecurity news",
      "NCA ECC compliance",
      "National Cybersecurity Authority Saudi",
      "Saudi critical infrastructure cyber threats",
      "SDAIA PDPL compliance",
    ],
    suggestedUrl: "/country/saudi-arabia",
  },
  {
    id: "grp-4",
    name: "Group 4: Qatar Cybersecurity",
    targetRegion: "Qatar",
    recommendedKeywords: [
      "Qatar cybersecurity news",
      "Q-CERT warnings",
      "National Cyber Security Agency Qatar NCSA",
      "Doha cyber defense posture",
      "Qatar critical infrastructure security",
    ],
    suggestedUrl: "/country/qatar",
  },
  {
    id: "grp-5",
    name: "Group 5: MENA Ransomware",
    targetRegion: "Regional / GCC",
    recommendedKeywords: [
      "Middle East ransomware attacks",
      "MENA double-extortion ransomware",
      "LockBit Gulf energy attacks",
      "Ransomware remediation GCC",
      "Dark web extortion leaks Middle East",
    ],
    suggestedUrl: "/category/ransomware",
  },
  {
    id: "grp-6",
    name: "Group 6: Data Breach Intelligence",
    targetRegion: "Regional / GCC",
    recommendedKeywords: [
      "MENA data breach disclosures",
      "Middle East credential leaks",
      "GCC database exfiltration",
      "Regional personal data compromise",
      "Financial sector cyber breaches Middle East",
    ],
    suggestedUrl: "/category/data-breach",
  },
  {
    id: "grp-7",
    name: "Group 7: CVE Vulnerabilities",
    targetRegion: "Global & MENA",
    recommendedKeywords: [
      "CISA KEV actively exploited vulnerabilities",
      "Edge appliance zero-days (PAN-OS, Ivanti, FortiOS)",
      "NVD CVSS telemetry Middle East",
      "Perimeter gateway exploit remediation",
      "Critical severity CVE patches",
    ],
    suggestedUrl: "/threats",
  },
  {
    id: "grp-8",
    name: "Group 8: Threat Actor Research",
    targetRegion: "Middle East / Levant",
    recommendedKeywords: [
      "APT threat actors Middle East",
      "MuddyWater cyber espionage",
      "Charming Kitten TTPs",
      "OilRig indicators of compromise",
      "State-sponsored cyber espionage GCC",
    ],
    suggestedUrl: "/research",
  },
];

/**
 * Checks for keyword cannibalization across a list of articles.
 * Returns map of focus keyword -> list of conflicting article titles and IDs.
 */
export function checkKeywordCannibalization(
  articles: Array<{ id: string; headline: string; focusKeyword?: string }>
): Array<{ keyword: string; count: number; articles: Array<{ id: string; title: string }> }> {
  const map = new Map<string, Array<{ id: string; title: string }>>();

  for (const art of articles) {
    const raw = art.focusKeyword?.trim().toLowerCase();
    if (raw) {
      const existing = map.get(raw) || [];
      existing.push({ id: art.id, title: art.headline });
      map.set(raw, existing);
    }
  }

  const conflicts: Array<{ keyword: string; count: number; articles: Array<{ id: string; title: string }> }> = [];

  map.forEach((items, keyword) => {
    if (items.length > 1) {
      conflicts.push({ keyword, count: items.length, articles: items });
    }
  });

  return conflicts;
}
