import { NewsArticle } from "@/types/news";

/**
 * Desk coverage that sits alongside the live Google News feed.
 *
 * Every item here describes a documented, publicly reported event, carries the
 * date it actually happened, and links to a primary or reference source.
 * Do not add incidents that cannot be traced to a public source, and do not
 * give stories relative ("2 hours ago") timestamps, they must keep their real dates.
 */
export const CURATED_MENA_INTELLIGENCE: NewsArticle[] = [
  {
    id: "mcw-desk-pan-os-3400",
    title: "Palo Alto firewall zero-day scored 10.0 and was exploited before a fix existed",
    description:
      "A command-injection flaw in the GlobalProtect feature of PAN-OS let unauthenticated attackers run code as root on the firewall. Exploitation began weeks before disclosure.",
    content:
      "Palo Alto Networks disclosed CVE-2024-3400 on 12 April 2024. The bug sits in the GlobalProtect feature of PAN-OS and lets an unauthenticated attacker execute arbitrary code with root privileges on the firewall itself. It received the maximum CVSS score of 10.0.\n\nThe flaw was already being used. Volexity, which found it while responding to an intrusion, traced exploitation back to 26 March 2024 and tracked the activity as Operation MidnightEclipse. CISA added the CVE to its Known Exploited Vulnerabilities catalogue on the day of disclosure.\n\nAffected versions were PAN-OS 10.2, 11.0 and 11.1 on devices with a GlobalProtect gateway or portal configured. Cloud NGFW, Panorama and Prisma Access were not affected. Hotfixes followed over the next several days.\n\nWhy it matters in the region: perimeter firewalls of this kind front a large share of government, banking and energy networks across the Gulf. An attacker with root on the firewall sits upstream of every other control, can harvest VPN credentials and configuration, and can pivot inward. Patching the appliance is not enough if it was exposed during the exploitation window, it needs to be checked for compromise as well.",
    sourceName: "Palo Alto Networks security advisory",
    sourceUrl: "https://security.paloaltonetworks.com/CVE-2024-3400",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2024-04-12T15:00:00.000Z",
    region: "MENA General",
    category: "Vulnerability",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["CVE-2024-3400", "PAN-OS", "GlobalProtect", "Zero-day", "KEV"],
    threatToAction: {
      whatHappened:
        "An unauthenticated command-injection flaw in PAN-OS GlobalProtect was exploited in the wild from late March 2024, before Palo Alto Networks published fixes on 12 April.",
      whoIsAffected:
        "Any organisation running PAN-OS 10.2, 11.0 or 11.1 with a GlobalProtect gateway or portal enabled.",
      whyItMatters:
        "Root on the firewall gives an attacker the network's front door: credentials, configuration and a position to move into internal systems unseen.",
      whatShouldUsersDo:
        "Apply the fixed PAN-OS release, then treat devices that were exposed during the exploitation window as potentially compromised and check them.",
      recommendedDefensiveActions: [
        "Upgrade to a fixed PAN-OS hotfix release for your branch.",
        "Run Palo Alto's published compromise checks and review the device for unexpected files and cron entries.",
        "Rotate credentials, certificates and keys stored on or passing through exposed devices.",
        "Restrict management and GlobalProtect interfaces to the addresses that need them.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "4 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-ivanti-ed-24-01",
    title: "Two chained Ivanti VPN flaws prompt a US emergency directive",
    description:
      "CVE-2023-46805 and CVE-2024-21887 together allowed unauthenticated remote code execution on Ivanti Connect Secure and Policy Secure. CISA ordered federal agencies to act within days.",
    content:
      "Ivanti disclosed two vulnerabilities in Connect Secure and Policy Secure on 10 January 2024: an authentication bypass (CVE-2023-46805) and a command-injection flaw (CVE-2024-21887). Chained, they let an attacker with no credentials execute commands on the gateway.\n\nVolexity had found the pair while investigating a compromise and reported that exploitation pre-dated disclosure. Mass exploitation followed once details became public. On 19 January 2024 CISA issued Emergency Directive 24-01, requiring US federal agencies to apply Ivanti's mitigation and check for compromise.\n\nFixes arrived in stages, and additional Connect Secure vulnerabilities were disclosed in the following weeks, which kept the product in the news through early 2024.\n\nWhy it matters in the region: SSL VPN gateways such as Connect Secure are a common way into ministries, banks and operators across the GCC and North Africa, and stolen VPN sessions are a recurring first step in regional intrusions.",
    sourceName: "NIST National Vulnerability Database",
    sourceUrl: "https://nvd.nist.gov/vuln/detail/CVE-2024-21887",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2024-01-19T14:00:00.000Z",
    region: "MENA General",
    category: "Vulnerability",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["Ivanti", "CVE-2024-21887", "CVE-2023-46805", "VPN", "ED 24-01"],
    threatToAction: {
      whatHappened:
        "An authentication bypass and a command-injection bug in Ivanti Connect Secure and Policy Secure were chained for unauthenticated remote code execution and exploited in the wild.",
      whoIsAffected: "Organisations running Ivanti Connect Secure or Policy Secure gateways.",
      whyItMatters:
        "A compromised VPN gateway exposes every remote session and can be used to plant persistent access that survives patching.",
      whatShouldUsersDo:
        "Patch to a fixed release, run Ivanti's integrity checker, and factory-reset devices that show signs of compromise before re-deploying.",
      recommendedDefensiveActions: [
        "Apply Ivanti's fixed releases for all supported versions in use.",
        "Run the external Integrity Checker Tool and review its results.",
        "Revoke and reissue certificates, keys and passwords held on the appliance.",
        "Hunt for unusual sessions and logins originating from the gateway's internal address.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "4 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-muddywater-aa22-055a",
    title: "MuddyWater named as an arm of Iran's intelligence ministry, with a joint advisory on how it operates",
    description:
      "US Cyber Command tied the group to Iran's Ministry of Intelligence and Security in January 2022. A month later, US and UK agencies published its tools and targets.",
    content:
      "On 12 January 2022, US Cyber Command's Cyber National Mission Force identified MuddyWater as a subordinate element within Iran's Ministry of Intelligence and Security (MOIS) and published malware samples linked to the group.\n\nOn 24 February 2022, the FBI, CISA, the Cyber National Mission Force and the UK's National Cyber Security Centre followed with joint advisory AA22-055A. It describes MuddyWater conducting espionage and other malicious operations against government and private-sector organisations, including telecommunications, defence, local government and oil and natural gas, across Asia, Africa, Europe and North America.\n\nThe advisory lists tooling the group used at the time, including PowGoop, Small Sieve, Canopy (Starwhale), Mori and POWERSTATS, and notes its reliance on spear-phishing, public exploits and legitimate remote-administration software.\n\nWhy it matters in the region: MuddyWater (also tracked as Seedworm, Static Kitten and Mango Sandstorm) has a long record of targeting organisations in the Middle East. Its preference for legitimate admin tools makes it hard to spot with signature-based controls alone.",
    sourceName: "CISA joint advisory AA22-055A",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-055a",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2022-02-24T15:00:00.000Z",
    region: "MENA General",
    category: "Espionage & APT",
    severity: "High",
    verificationStatus: "SIGNAL",
    tags: ["MuddyWater", "Iran", "MOIS", "Espionage", "AA22-055A"],
    threatToAction: {
      whatHappened:
        "US and UK agencies attributed MuddyWater to Iran's Ministry of Intelligence and Security and published its tools and techniques.",
      whoIsAffected:
        "Government bodies and private-sector organisations, notably telecoms, defence, local government and oil and gas.",
      whyItMatters:
        "The group mixes phishing, public exploits and legitimate remote-access tools, so it can blend into normal IT activity.",
      whatShouldUsersDo:
        "Use the advisory's indicators and techniques to hunt in your environment, and lock down remote-administration software.",
      recommendedDefensiveActions: [
        "Inventory remote monitoring and management tools; block any that are not approved.",
        "Alert on PowerShell launched from Office applications and on encoded PowerShell commands.",
        "Apply phishing-resistant MFA to email and remote access.",
        "Patch internet-facing systems promptly; the group uses public exploits.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "5 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-triton-2017",
    title: "Triton: the malware built to disable safety systems at a Saudi petrochemical plant",
    description:
      "Disclosed in December 2017, Triton targeted Schneider Electric Triconex safety controllers, the systems meant to stop an industrial accident.",
    content:
      "In December 2017, researchers at FireEye (now Mandiant) and Dragos disclosed malware designed to interact with Schneider Electric Triconex safety instrumented systems (SIS). FireEye named it Triton; Dragos called it TRISIS.\n\nSafety instrumented systems are the last automated line of defence in a plant: they shut processes down when pressure, temperature or flow move outside safe limits. The intrusion came to light when controllers at the facility entered a failed-safe state and shut down. Later reporting identified the site as a petrochemical plant in Saudi Arabia.\n\nIn 2018 FireEye linked the activity to Russia's Central Scientific Research Institute of Chemistry and Mechanics (CNIIHM). The US Treasury sanctioned the institute in October 2020 over its connection to Triton.\n\nWhy it matters in the region: Gulf economies depend on oil, gas, petrochemical and desalination plants that run on industrial control and safety systems. Triton showed that an attacker can aim for physical consequences, not just data.",
    sourceName: "Reference: Triton (malware)",
    sourceUrl: "https://en.wikipedia.org/wiki/Triton_(malware)",
    imageUrl: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2017-12-14T12:00:00.000Z",
    country: "Saudi Arabia",
    region: "Gulf",
    category: "Critical Infrastructure",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["Triton", "TRISIS", "ICS", "Safety systems", "Petrochemical"],
    threatToAction: {
      whatHappened:
        "Malware targeting Triconex safety instrumented systems was found at a petrochemical facility after controllers tripped into a safe shutdown.",
      whoIsAffected: "Operators of oil, gas, petrochemical and other process plants that rely on safety instrumented systems.",
      whyItMatters: "Tampering with safety systems can turn a cyber intrusion into an industrial accident.",
      whatShouldUsersDo:
        "Keep safety controllers physically in run mode, isolate safety networks from business IT, and monitor for unexpected program changes.",
      recommendedDefensiveActions: [
        "Keep SIS controller keyswitches out of program mode except during supervised changes.",
        "Segment safety networks from control and corporate networks; allow no direct routing.",
        "Alert on any download or logic change to safety controllers.",
        "Restrict and monitor engineering workstations that can reach safety systems.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "5 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-shamoon-aramco",
    title: "Shamoon: the wiper that erased about 30,000 computers at Saudi Aramco, and came back twice",
    description:
      "The August 2012 attack is still the reference case for destructive malware in the Gulf. New variants hit Saudi organisations in 2016 and an oil-services contractor in 2018.",
    content:
      "On 15 August 2012, a wiper known as Shamoon (also W32.Disttrack) overwrote data on roughly 30,000 workstations at Saudi Aramco. A group calling itself the Cutting Sword of Justice claimed responsibility. Aramco's oil production was not affected, but the company spent weeks restoring its corporate IT.\n\nShamoon returned in November 2016 in a new version, Shamoon 2, which hit several Saudi organisations, including government bodies. A third variant in December 2018 struck the Italian oil-services company Saipem, damaging systems largely in its Middle East operations.\n\nEach wave used the same basic approach: steal credentials, spread across the Windows estate, and trigger the wipe at a set time to maximise damage.\n\nWhy it matters in the region: Shamoon shaped how Gulf energy companies think about resilience. The lessons, offline backups, segmented networks, tight control of privileged accounts, still apply to today's ransomware and wiper threats.",
    sourceName: "Reference: Shamoon",
    sourceUrl: "https://en.wikipedia.org/wiki/Shamoon",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2012-08-15T08:00:00.000Z",
    country: "Saudi Arabia",
    region: "Gulf",
    category: "Critical Infrastructure",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["Shamoon", "Wiper", "Saudi Aramco", "Energy"],
    threatToAction: {
      whatHappened:
        "A wiper destroyed data on about 30,000 Saudi Aramco workstations in 2012; later variants hit Saudi organisations in 2016 and Saipem in 2018.",
      whoIsAffected: "Energy companies, their contractors and government bodies in the Gulf.",
      whyItMatters: "Destructive attacks aim to stop operations outright, and recovery takes weeks without tested offline backups.",
      whatShouldUsersDo: "Plan for a wipe, not only for data theft: keep offline backups and practise restoring from them.",
      recommendedDefensiveActions: [
        "Keep offline, immutable backups of critical systems and test restores regularly.",
        "Limit and monitor domain administrator accounts; use tiered administration.",
        "Segment corporate IT from operational technology.",
        "Watch for scheduled tasks and services created across many hosts at once.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "4 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-saudi-pdpl",
    title: "Saudi Arabia's data protection law is fully enforceable after a one-year grace period ends",
    description:
      "The Personal Data Protection Law took effect on 14 September 2023, with organisations given until 14 September 2024 to comply. SDAIA oversees it.",
    content:
      "Saudi Arabia's Personal Data Protection Law (PDPL) came into force on 14 September 2023. Organisations processing personal data were given a one-year transition period, which ended on 14 September 2024. The Saudi Data and Artificial Intelligence Authority (SDAIA) is the supervising authority.\n\nThe law sets rules on the legal basis for processing personal data, the rights of data subjects, breach notification, the appointment of data protection officers in some cases, and transfers of personal data outside the Kingdom, which are governed by separate implementing regulations.\n\nWhy it matters for security teams: breach notification duties and limits on cross-border transfers affect how incidents are handled and where logs, backups and security tooling can store personal data.",
    sourceName: "Saudi Data & AI Authority (SDAIA)",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    sourceUrl: "https://sdaia.gov.sa/en/",
    publishedAt: "2024-09-14T06:00:00.000Z",
    country: "Saudi Arabia",
    region: "Gulf",
    category: "Policy & Regulation",
    severity: "Medium",
    verificationStatus: "SIGNAL",
    tags: ["PDPL", "SDAIA", "Privacy", "Compliance"],
    threatToAction: {
      whatHappened: "The grace period for Saudi Arabia's Personal Data Protection Law ended on 14 September 2024.",
      whoIsAffected: "Any organisation processing personal data of people in Saudi Arabia.",
      whyItMatters:
        "Breach notification and data-transfer rules now apply in full, which shapes incident response and where security data can live.",
      whatShouldUsersDo:
        "Map where personal data sits, including in security tooling, and align your incident response plan with the law's notification duties.",
      recommendedDefensiveActions: [
        "Build a data inventory that includes logs, SIEM, EDR and backup stores.",
        "Check where security vendors store and process telemetry containing personal data.",
        "Add the regulator's breach-notification steps to your incident playbooks.",
        "Review contracts with processors for PDPL obligations.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "3 min read",
    isDemo: false,
  },
  {
    id: "mcw-desk-uae-pdpl",
    title: "The UAE's federal data protection law: what Decree-Law No. 45 of 2021 asks of organisations",
    description:
      "The UAE's first federal personal data protection law took effect on 2 January 2022. Financial free zones such as DIFC and ADGM keep their own regimes.",
    content:
      "Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data took effect on 2 January 2022. It was the UAE's first general federal data protection law.\n\nThe law covers the processing of personal data of people in the UAE, and of data processed by organisations established in the country. It sets out lawful bases for processing, data subject rights, security obligations and breach notification, and rules for cross-border transfers. Financial free zones with their own data protection laws, such as the Dubai International Financial Centre and Abu Dhabi Global Market, are outside its scope.\n\nWhy it matters for security teams: the law's security and breach-notification duties sit alongside sector rules and free-zone regimes, so organisations operating across the Emirates may need to meet more than one set of requirements.",
    sourceName: "UAE Government portal",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    sourceUrl: "https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws",
    publishedAt: "2022-01-02T06:00:00.000Z",
    country: "United Arab Emirates",
    region: "Gulf",
    category: "Policy & Regulation",
    severity: "Low",
    verificationStatus: "SIGNAL",
    tags: ["UAE", "Data protection", "Decree-Law 45/2021", "Compliance"],
    threatToAction: {
      whatHappened: "The UAE's federal personal data protection law came into force on 2 January 2022.",
      whoIsAffected: "Organisations processing personal data in the UAE outside the financial free zones.",
      whyItMatters: "It adds federal security and breach-notification duties on top of sector and free-zone rules.",
      whatShouldUsersDo: "Confirm which regime applies to each entity and align security controls and incident response with it.",
      recommendedDefensiveActions: [
        "Map each legal entity to the data protection regime that governs it.",
        "Document security measures protecting personal data.",
        "Include regulatory notification steps in incident playbooks.",
        "Review cross-border transfers of personal data, including to security vendors.",
      ],
    },
    upvotes: 0,
    commentCount: 0,
    readTime: "3 min read",
    isDemo: false,
  },
];
