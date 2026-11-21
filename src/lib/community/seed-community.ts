import { CommunityPost } from "@/types/community";

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "topic-101",
    title: "Implementing NCA ECC-1:2018 in Multi-Account Cloud Environments: Log Residency & CloudTrail Aggregation",
    body: "Fintechs and regulated entities in Saudi Arabia must comply with NCA Essential Cybersecurity Controls (ECC) regarding local data residency and continuous monitoring. How are teams handling multi-account CloudTrail and GuardDuty log export to local on-prem or local cloud region SIEMs (me-central-1) without incurring excessive NAT or egress charges? Share your architectural patterns and audit observations.",
    topic: "Compliance & Governance",
    country: "Saudi Arabia",
    author: {
      name: "MENA Cloud Security Working Group",
      handle: "@cloudsec_mena",
      role: "Architecture Desk",
      badge: "Discussion Topic",
      verified: true
    },
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    upvotes: 0,
    downvotes: 0,
    commentsCount: 0,
    tags: ["NCA", "CloudSecurity", "AWS", "SaudiFintech", "Compliance"],
    isPinned: true,
    comments: []
  },
  {
    id: "topic-102",
    title: "Defending Government & Banking Portals Against Regional Reverse-Proxy Phishing Kits (AiTM)",
    body: "Advisories across the GCC have noted threat actors deploying adversary-in-the-middle (AiTM) phishing frameworks that bypass standard SMS OTP and mobile application prompts by intercepting session cookies. What mitigations are organizations enforcing beyond FIDO2 / WebAuthn hardware keys, especially for legacy client environments?",
    topic: "Threat Intelligence",
    country: "United Arab Emirates",
    author: {
      name: "Identity & Access Working Group",
      handle: "@identity_defense",
      role: "Threat Intel Desk",
      badge: "Technical Exchange",
      verified: true
    },
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    upvotes: 0,
    downvotes: 0,
    commentsCount: 0,
    tags: ["AiTM", "Phishing", "FIDO2", "aeCERT", "MFA"],
    comments: []
  },
  {
    id: "topic-103",
    title: "OT/SCADA Perimeter Defense: Enforcing Zero-Trust Jump Hosts on Purdue Level 2/3 Industrial Networks",
    body: "With critical infrastructure and maritime telemetry facing increased automated scanning, securing foreign OEM pump and turbine vendor remote sessions is critical. How are regional energy and utility operators enforcing ephemeral PAM credentials, session isolation, and video auditing without disrupting operational availability?",
    topic: "Industrial Control Systems",
    country: "Qatar",
    author: {
      name: "Critical Infrastructure Security Group",
      handle: "@ot_defense_mena",
      role: "ICS Security Desk",
      badge: "OT Defense",
      verified: true
    },
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    upvotes: 0,
    downvotes: 0,
    commentsCount: 0,
    tags: ["OTSecurity", "SCADA", "Q-CERT", "PurdueModel", "Maritime"],
    comments: []
  },
  {
    id: "topic-104",
    title: "Regional Threat Actor Attribution: Curating MENA MISP Feeds for MuddyWater, Agrius, and OilRig",
    body: "Public global feeds often delay correlation for regional Middle East intrusion sets. Let's document open indicators, Yara rules, and MISP threat taxonomy galaxies focused on tracking regional persistent threats targeting government, financial, and telecommunication perimeters.",
    topic: "Research & Open Source",
    country: "Regional MENA",
    author: {
      name: "Open Threat Intelligence Initiative",
      handle: "@osint_mena",
      role: "Research Desk",
      badge: "MISP Sharing",
      verified: true
    },
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    upvotes: 0,
    downvotes: 0,
    commentsCount: 0,
    tags: ["MISP", "ThreatIntel", "ATT&CK", "OpenSource", "MENA"],
    comments: []
  }
];
