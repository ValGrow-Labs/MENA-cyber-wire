import { CommunityPost } from "@/types/community";

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-101",
    title: "Best practices for implementing NCA ECC-1:2018 controls in AWS multi-account landing zones?",
    body: "We are currently preparing for our third-party NCA Essential Cybersecurity Controls (ECC) audit for our Riyadh-based fintech. Specifically struggling with mapping cloud-native CloudTrail/GuardDuty aggregation into local on-prem SIEM for data residency compliance. Has anyone solved this without inflating data egress costs?",
    topic: "Compliance & Governance",
    country: "Saudi Arabia",
    author: {
      name: "Tariq Al-Mansoor",
      handle: "@tariq_sec",
      role: "Lead Cloud Architect",
      badge: "SOC 2 Practitioner",
      verified: true
    },
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    upvotes: 47,
    downvotes: 1,
    commentsCount: 14,
    tags: ["NCA", "CloudSecurity", "AWS", "SaudiFintech", "Compliance"],
    isPinned: true,
    isDemo: true,
    comments: [
      {
        id: "comm-101-1",
        postId: "post-101",
        author: {
          name: "Dr. Laila Haddad",
          handle: "@lhaddad_ciso",
          role: "Enterprise CISO"
        },
        timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
        content: "We deployed local AWS Saudi Region (me-central-1) instances and feed CloudWatch metrics directly into a local OpenSearch cluster before filtering only high-severity alerts to the primary on-prem SIEM. Cuts egress by 80% and satisfies NCA clause 2-3-4.",
        upvotes: 19
      },
      {
        id: "comm-101-2",
        postId: "post-101",
        author: {
          name: "Sami Kabbani",
          handle: "@samik_dfir",
          role: "Senior Security Engineer"
        },
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        content: "Seconding Dr. Laila's approach. Also make sure your KMS customer managed keys (CMKs) are tagged specifically per environment; NCA auditors asked for evidence of cryptographic separation during our last evaluation.",
        upvotes: 9
      }
    ]
  },
  {
    id: "post-102",
    title: "Wave of Telegram credential stealer campaigns spoofing UAE Federal Authority SMS notices",
    body: "Seeing an uptick in smishing targeting consumers in Dubai and Sharjah claiming to be ICP (Federal Authority for Identity and Citizenship) fines. The landing pages clone the UAE Pass interface to siphon Emirates ID and OTP credentials. The IOCs link back to bulletproof hosting in Eastern Europe.",
    topic: "Threat Intelligence",
    country: "United Arab Emirates",
    author: {
      name: "Farah Al-Suwaidi",
      handle: "@farah_intel",
      role: "Threat Hunter",
      badge: "aeCERT Contributor",
      verified: true
    },
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    upvotes: 63,
    downvotes: 2,
    commentsCount: 19,
    tags: ["UAEPass", "Phishing", "aeCERT", "ThreatIntel", "Smishing"],
    isDemo: true,
    comments: [
      {
        id: "comm-102-1",
        postId: "post-102",
        author: {
          name: "Zaid Bin Rashid",
          handle: "@zaid_redteam",
          role: "Offensive Security Lead"
        },
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        content: "Good catch Farah. We analyzed the APKs pushed on Android redirects—it contains an SMS-forwarder background service using accessibility permissions. We forwarded the C2 IPs to aeCERT this morning.",
        upvotes: 14
      }
    ]
  },
  {
    id: "post-103",
    title: "OT/SCADA isolation lessons learned: Protecting maritime telemetry from ransomware spillover",
    body: "Following the recent Q-CERT advisory on edge gateway exploits, how are regional logistics and port operators handling remote maintenance for foreign OEM pump vendors without compromising Purdue Model Level 2/3 networks?",
    topic: "Industrial Control Systems",
    country: "Qatar",
    author: {
      name: "Omar Al-Kuwari",
      handle: "@omar_ics",
      role: "Industrial Security Specialist",
      badge: "GICSP Certified",
      verified: true
    },
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    upvotes: 38,
    downvotes: 0,
    commentsCount: 8,
    tags: ["OTSecurity", "SCADA", "Q-CERT", "PurdueModel", "Maritime"],
    isDemo: true,
    comments: [
      {
        id: "comm-103-1",
        postId: "post-103",
        author: {
          name: "Karim Mostafa",
          handle: "@karim_ot",
          role: "Automation Engineer"
        },
        timestamp: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
        content: "We strictly mandate session-brokered jump hosts with video session recording (PAM) and ephemeral one-time credentials that expire after 2 hours. Dual-approver workflow required before any technician connects to L2 PLC programming consoles.",
        upvotes: 12
      }
    ]
  },
  {
    id: "post-104",
    title: "Discussion: Open-source Arabic threat intelligence feeds and MISP taxonomy sharing",
    body: "Most public threat intel taxonomies focus on Western or East Asian actors. Are there community-curated MISP galaxies or ATT&CK navigation layers specifically tracking regional Gulf & Levant intrusion sets (Charming Kitten, MuddyWater, Lyceum, Agrius)? Let's compile a community list.",
    topic: "Research & Open Source",
    country: "Regional MENA",
    author: {
      name: "Youssef Nabil",
      handle: "@ynabil_sec",
      role: "Security Researcher",
      badge: "MISP Project Member",
      verified: true
    },
    timestamp: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
    upvotes: 55,
    downvotes: 1,
    commentsCount: 22,
    tags: ["MISP", "ThreatIntel", "ATT&CK", "OpenSource", "MENA"],
    isDemo: true,
    comments: []
  }
];
