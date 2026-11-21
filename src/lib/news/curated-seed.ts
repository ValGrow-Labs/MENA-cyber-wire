import { NewsArticle } from "@/types/news";

export const CURATED_MENA_INTELLIGENCE: NewsArticle[] = [
  {
    id: "mena-intel-2024-001",
    title: "Regional Financial Sector Alert: MuddyWater APT Campaign Targets UAE and Saudi Banking Portals",
    description: "State-aligned threat actor MuddyWater (Mango Sandstorm) observed deploying updated PowerShell backdoors disguised as regulatory compliance memos targeting financial institutions across Riyadh and Dubai.",
    content: "Security research teams across the Gulf Cooperation Council (GCC) have identified a renewed spear-phishing campaign attributed to the threat group tracked as MuddyWater (also known as Mango Sandstorm and Seedworm). The campaign specifically targets compliance officers, IT administrators, and third-party contractors servicing tier-1 commercial banks in the United Arab Emirates and the Kingdom of Saudi Arabia.\n\nThe attack chain leverages weaponized PDF documents mimicking official notices from regional central banks regarding updated anti-money laundering (AML) and digital asset reporting guidelines. When opened, embedded macros initiate a multi-stage PowerShell payload communicating with compromised WordPress staging sites serving as command-and-control (C2) proxies.",
    sourceName: "MENA Cyber Wire Intelligence Desk",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    country: "Saudi Arabia",
    region: "Gulf",
    category: "Espionage & APT",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["MuddyWater", "Banking", "Spear-phishing", "PowerShell", "GCC", "NCA ECC"],
    threatToAction: {
      whatHappened: "A state-sponsored espionage campaign is sending deceptive emails containing weaponized regulatory documents to Gulf financial institutions, dropping evasive backdoor payloads.",
      whoIsAffected: "Commercial banks, fintech startups, investment houses, and external auditing firms in Saudi Arabia, UAE, and Bahrain.",
      whyItMatters: "Initial network access can lead to lateral movement into SWIFT interconnects, customer database exfiltration, or secondary ransomware extortion.",
      whatShouldUsersDo: "Exercise extreme caution with unsolicited attachments claiming to originate from regulatory bodies. Verify email sender authenticity via out-of-band channels.",
      recommendedDefensiveActions: [
        "Block outbound connections to newly registered and unclassified domains at the perimeter firewall.",
        "Restrict PowerShell execution policy to ConstrainedLanguage mode on all corporate workstations.",
        "Audit privileged domain accounts for anomalous Kerberos ticket requests (Kerberoasting).",
        "Enforce multi-factor authentication (FIDO2/hardware tokens) on all remote desktop and VPN gateways."
      ]
    },
    upvotes: 42,
    commentCount: 16,
    readTime: "4 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-002",
    title: "Critical Infrastructure Warning: Industrial Control Systems Targeted by Ransomware in Middle East Oil & Gas Corridor",
    description: "Cybersecurity agencies across Qatar, Kuwait, and Saudi Arabia issue unified advisory following ransomware intrusions targeting operational technology (OT) historian servers at maritime loading terminals.",
    content: "The National Cyber Security Agency of Qatar (Q-CERT) alongside regional defense partners has issued an urgent technical bulletin regarding unauthorized intrusions into supervisory control and data acquisition (SCADA) network perimeters at petrochemical terminals. Threat actors gained ingress through unpatched perimeter VPN appliances lacking multifactor authentication.\n\nWhile primary pipeline automation was safely isolated, telemetry historian databases and terminal scheduling interfaces experienced localized encryption, demonstrating an escalating willingness of cybercriminal syndicates to disrupt physical supply chains in the MENA region.",
    sourceName: "Q-CERT / GCC Threat Exchange",
    sourceUrl: "https://www.ncsa.gov.qa/",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    country: "Qatar",
    region: "Gulf",
    category: "Critical Infrastructure",
    severity: "Critical",
    verificationStatus: "SIGNAL",
    tags: ["SCADA", "OT Security", "Oil & Gas", "Ransomware", "Q-CERT", "VPN Exploits"],
    threatToAction: {
      whatHappened: "Ransomware operators infiltrated energy terminal operational networks via legacy edge gateway vulnerabilities, compromising scheduling telemetry.",
      whoIsAffected: "Energy operators, refinery maintenance providers, maritime transport logistics, and industrial port facilities.",
      whyItMatters: "Disruption to Middle East hydrocarbon export corridors creates severe geopolitical and economic ripple effects globally.",
      whatShouldUsersDo: "Ensure strict physical and logical network separation (Purdue Model) between enterprise corporate IT and plant OT networks.",
      recommendedDefensiveActions: [
        "Immediately patch edge VPN solutions (FortiOS, Ivanti, Palo Alto PAN-OS) to the latest vendor releases.",
        "Disable dual-homed network interface cards that bridge IT and OT segments.",
        "Implement unidirectional security gateways (data diodes) for historian data replication to corporate networks.",
        "Conduct offline air-gapped backup testing for industrial PLC logic and SCADA engineering configurations."
      ]
    },
    upvotes: 68,
    commentCount: 29,
    readTime: "5 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-003",
    title: "Dubai Health Authority and Healthcare Providers Urged to Patch Zero-Day Flaws in Electronic Health Records",
    description: "aeCERT issues remediation timeline for regional healthcare providers following proof-of-concept exploit release for medical imaging and patient portal software.",
    content: "The Telecommunications and Digital Government Regulatory Authority (TDRA) through aeCERT has distributed an emergency directive to private and public hospitals across Abu Dhabi, Dubai, and the Northern Emirates. The vulnerability allows unauthenticated remote attackers to execute arbitrary code and access unencrypted patient records.\n\nWith healthcare digitization accelerating across the UAE under national smart health initiatives, securing medical endpoints and cloud-hosted diagnostic portals has been designated a top national resilience priority.",
    sourceName: "aeCERT Security Advisory",
    sourceUrl: "https://tdra.gov.ae/en/services/aecert",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    country: "United Arab Emirates",
    region: "Gulf",
    category: "Data Breach",
    severity: "High",
    verificationStatus: "SIGNAL",
    tags: ["aeCERT", "Healthcare", "Patient Data", "Zero-Day", "Dubai", "UAE Health"],
    threatToAction: {
      whatHappened: "A critical flaw in commonly deployed hospital management software allows remote attackers to dump patient records and medical imaging files without authentication.",
      whoIsAffected: "Hospitals, diagnostic clinics, private healthcare networks, and medical insurance processors across the UAE.",
      whyItMatters: "Health information breaches result in catastrophic privacy violations, identity fraud, and heavy regulatory fines under UAE Federal Data Protection laws.",
      whatShouldUsersDo: "Healthcare patients should monitor insurance claims and credit reports for unauthorized billing. Clinics must patch immediately.",
      recommendedDefensiveActions: [
        "Apply emergency vendor patches to DICOM and PACS imaging servers immediately.",
        "Restrict access to patient record administration portals strictly behind internal VPNs.",
        "Enable database activity monitoring (DAM) on all patient record repositories to flag bulk data export queries."
      ]
    },
    upvotes: 35,
    commentCount: 11,
    readTime: "3 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-004",
    title: "Egypt NTRA Mandates Strict Telemetry Encryption for Fintech and Mobile Wallet Providers",
    description: "New regulatory framework enacted following surge in SIM-swap fraud and credential harvesting schemes targeting Cairo consumers.",
    content: "Egypt's National Telecommunications Regulatory Authority (NTRA) in collaboration with the Central Bank of Egypt has enacted updated cybersecurity baseline rules for all mobile wallet operators, micropayment gateways, and digital lenders.\n\nThe decree mandates hardware security module (HSM) key storage, mandatory multi-factor biometric step-up for transfers exceeding 5,000 EGP, and real-time fraud scoring integration with cellular carriers to detect unauthorized SIM porting events.",
    sourceName: "EG-CERT / NTRA",
    sourceUrl: "https://egcert.eg/",
    imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    country: "Egypt",
    region: "North Africa",
    category: "Fintech & Banking",
    severity: "Medium",
    verificationStatus: "SIGNAL",
    tags: ["EG-CERT", "Fintech", "Mobile Wallet", "SIM Swap", "Egypt", "Banking Regulation"],
    threatToAction: {
      whatHappened: "Egypt's NTRA has issued binding cyber rules requiring telecom and payment providers to implement cryptographic tokenization to halt SIM-swap account takeovers.",
      whoIsAffected: "All Egyptian commercial banks, mobile network operators (Vodafone, Orange, Etisalat, WE), and millions of digital wallet consumers.",
      whyItMatters: "Rapid mobile wallet adoption in North Africa makes digital consumers a prime target for organized credential harvesting rings.",
      whatShouldUsersDo: "Never share OTP SMS codes over the phone with anyone claiming to be a bank representative. Use biometric app logins instead of SMS authentication where available.",
      recommendedDefensiveActions: [
        "Incorporate cellular carrier SIM-change timestamps into real-time payment authorization fraud engines.",
        "Deprecate plain-text SMS OTPs in favor of time-based one-time password (TOTP) apps or push notifications.",
        "Conduct periodic threat modeling on all public REST APIs serving mobile banking applications."
      ]
    },
    upvotes: 27,
    commentCount: 8,
    readTime: "4 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-005",
    title: "Saudi National Cybersecurity Authority (NCA) Updates Essential Cybersecurity Controls (ECC) for Generative AI",
    description: "New directives mandate data residency, prompt-injection defense assessments, and automated audit logging for all enterprise LLM deployments across government entities.",
    content: "The Kingdom's National Cybersecurity Authority has released an addendum to the Essential Cybersecurity Controls (ECC-1:2018), specifically establishing cybersecurity requirements for artificial intelligence and machine learning systems deployed within government entities and critical national infrastructure.\n\nThe controls prohibit processing sensitive national data through external public cloud inference endpoints without cryptographic air-gapping, and require annual red-teaming against prompt extraction and model inversion attacks.",
    sourceName: "Saudi NCA Official Release",
    sourceUrl: "https://nca.gov.sa/",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    country: "Saudi Arabia",
    region: "Gulf",
    category: "Cloud & AI",
    severity: "Medium",
    verificationStatus: "SIGNAL",
    tags: ["NCA", "Saudi Arabia", "Generative AI", "ECC", "Compliance", "Data Sovereignty"],
    threatToAction: {
      whatHappened: "Saudi Arabia's NCA issued comprehensive cybersecurity controls for corporate and public sector deployments of Generative AI systems.",
      whoIsAffected: "Government agencies, state-owned enterprises, telecom companies, and private enterprises operating AI workloads in KSA.",
      whyItMatters: "Uncontrolled enterprise AI adoption risks leaking confidential intellectual property and sovereignty-sensitive datasets to foreign model hosts.",
      whatShouldUsersDo: "Organizations must conduct an inventory of all internal LLM usages and ensure employees do not paste classified data into public chatbots.",
      recommendedDefensiveActions: [
        "Deploy enterprise LLM firewalls capable of detecting PII, secret keys, and prompt-injection patterns in user inputs.",
        "Enforce strict data-loss prevention (DLP) policies on endpoints interacting with AI web services.",
        "Implement token-level logging and retention for all enterprise AI API calls for forensic traceability."
      ]
    },
    upvotes: 51,
    commentCount: 14,
    readTime: "4 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-006",
    title: "Active Threat Alert: DarkBit Ransomware Resurfaces with New Anti-Analysis Modules",
    description: "Developing campaign observed targeting technology vendors and logistics providers in the Levant and Gulf with double-extortion tactics.",
    content: "Incident response firms across Beirut and Amman have confirmed detections of an updated DarkBit ransomware variant. The ransomware compiles custom Rust binaries with heavy obfuscation, targeting both Windows Domain Controllers and VMware ESXi hypervisors. Stolen data is threatened with publication on onion mirror networks if ransoms are not settled within 72 hours.",
    sourceName: "Levant Cyber Watch / DFIR Reports",
    sourceUrl: "https://www.cisa.gov/stopransomware",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    country: "Jordan",
    region: "Levant",
    category: "Ransomware",
    severity: "High",
    verificationStatus: "WATCH",
    tags: ["Ransomware", "DarkBit", "Rust", "ESXi", "Levant", "Double Extortion"],
    threatToAction: {
      whatHappened: "An aggressive ransomware group is exploiting hypervisor vulnerabilities to encrypt virtual machines across technology providers in Jordan and Lebanon.",
      whoIsAffected: "Managed service providers (MSPs), cloud hosting providers, and medium-to-large enterprises running virtualized infrastructure.",
      whyItMatters: "Compromising hypervisors enables attackers to paralyze dozens of client tenant virtual machines in a single stroke.",
      whatShouldUsersDo: "Verify immutable backup availability and audit ESXi access controls immediately.",
      recommendedDefensiveActions: [
        "Patch VMware ESXi to the latest build and disable the OpenSLP service if not in active use.",
        "Restrict access to hypervisor management consoles to dedicated out-of-band management VLANs.",
        "Implement endpoint detection and response (EDR) with behavioral blocking for suspicious Rust processes."
      ]
    },
    upvotes: 29,
    commentCount: 9,
    readTime: "3 min read",
    isDemo: false
  },
  {
    id: "mena-intel-2024-007",
    title: "Unverified Claims: Telegram Channel Claims Infiltration of Regional Maritime Logistics Database",
    description: "A hacktivist collective claims possession of shipping manifests and customs documentation; MENA Cyber Wire is actively corroborating samples.",
    content: "A newly surfaced hacktivist group operating on Telegram has released a 200MB sample archive claiming to contain shipping manifests, cargo declarations, and employee passport scans from a prominent maritime port authority in North Africa.\n\nPreliminary forensic evaluation by our intelligence team indicates several leaked records match publicly available historical cargo registrations from 2021, suggesting a potential re-packaging of legacy breach data rather than an ongoing breach. Investigation is ongoing.",
    sourceName: "MENA Cyber Wire Verification Desk",
    sourceUrl: "https://news.google.com/search?q=maritime+cyber+middle+east",
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
    country: "Morocco",
    region: "North Africa",
    category: "Data Breach",
    severity: "Medium",
    verificationStatus: "UNVERIFIED",
    tags: ["Telegram", "Hacktivism", "Maritime", "Data Leak", "Investigation"],
    threatToAction: {
      whatHappened: "A hacktivist persona claimed a major breach of maritime port data, but verified evidence currently indicates the data consists of recycled older leaks.",
      whoIsAffected: "Port customs vendors, import-export brokers, and regional shipping agents.",
      whyItMatters: "Unsubstantiated breach claims can cause unnecessary panic and stock volatility without legitimate compromise.",
      whatShouldUsersDo: "Avoid downloading raw dumps from unverified Telegram links, as archives often contain disguised infostealer executables.",
      recommendedDefensiveActions: [
        "Review credential exposure through internal corporate leak-monitoring tools.",
        "Alert supply-chain logistics staff to potential spear-phishing utilizing leaked contact details."
      ]
    },
    upvotes: 18,
    commentCount: 7,
    readTime: "2 min read",
    isDemo: false
  }
];
