import { CommunityPost, CommunityAuthor } from "@/types/community";

/**
 * Discussion prompts written by the site's editors to start conversations.
 * They describe no specific incident and carry no votes or replies.
 */
const EDITORS: CommunityAuthor = {
  name: "MENA Cyber Wire editors",
  handle: "@mcw_desk",
  role: "Editors",
  badge: "Discussion prompt",
  verified: false,
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();

const prompt = (
  id: string,
  title: string,
  body: string,
  topic: string,
  country: string,
  tags: string[],
  postedHoursAgo: number,
  isPinned = false
): CommunityPost => ({
  id,
  title,
  body,
  topic,
  country,
  author: EDITORS,
  timestamp: hoursAgo(postedHoursAgo),
  upvotes: 0,
  downvotes: 0,
  commentsCount: 0,
  tags,
  isPinned,
  comments: [],
});

export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  prompt(
    "topic-101",
    "How long are you keeping SOC logs under Saudi Arabia's Personal Data Protection Law?",
    "Security logs are full of personal data: usernames, IP addresses, email headers, sometimes message content. The PDPL expects personal data to be kept only as long as needed for its purpose, while incident response and forensic work want long retention. How have you set retention periods for SIEM and EDR data, and how did you document the justification? Did you pseudonymise anything before long-term storage?",
    "Compliance & Governance",
    "Saudi Arabia",
    ["PDPL", "SIEM", "LogRetention", "Privacy"],
    3,
    true
  ),
  prompt(
    "topic-102",
    "Rolling out FIDO2 security keys to staff who mostly work in Arabic",
    "Hardware keys and passkeys stop most credential phishing, but rollouts stall on training and support. If you have deployed FIDO2 to a largely Arabic-speaking workforce: what enrolment instructions worked, which identity provider screens were poorly localised, and how did you handle staff on shared or personal devices?",
    "Compliance & Governance",
    "United Arab Emirates",
    ["FIDO2", "Passkeys", "MFA", "Localisation"],
    9
  ),
  prompt(
    "topic-103",
    "Segmenting OT networks at desalination and water treatment plants",
    "Water utilities in the Gulf depend on desalination, and their control systems were often built for availability, not isolation. For those running or auditing these sites: where do you draw the boundary between corporate IT and the control network, how do you handle vendor remote access, and have unidirectional gateways been practical for historian data?",
    "Industrial Control Systems",
    "Kuwait",
    ["OT", "ICS", "Water", "Segmentation"],
    20
  ),
  prompt(
    "topic-104",
    "Reporting on ransomware leak-site claims without amplifying them",
    "Leak sites post victim names before anything is confirmed, and some claims turn out to be recycled or false. Journalists, communications teams and responders: what checks do you run before treating a claim as real, and how should outlets word a story when the named organisation hasn't commented yet?",
    "Threat Intelligence",
    "Regional MENA",
    ["Ransomware", "LeakSites", "Verification", "Media"],
    30
  ),
  prompt(
    "topic-105",
    "Incident reporting obligations when you operate in several GCC states",
    "A bank or telecom with operations in Saudi Arabia, the UAE, Qatar and Bahrain may owe notifications to several national authorities and sector regulators, each with its own timelines and forms. How do your incident response plans map these obligations? Is there a single internal trigger, or a per-country playbook?",
    "Incident Response",
    "Regional MENA",
    ["IncidentResponse", "Regulation", "GCC", "Notification"],
    44
  ),
  prompt(
    "topic-106",
    "Detecting adversary-in-the-middle phishing that steals session cookies",
    "Reverse-proxy phishing kits sit between the user and the real login page, capture the session cookie after MFA, and replay it. Beyond phishing-resistant MFA, what detections have worked for you, impossible-travel alerts, token binding, conditional access on device compliance, or monitoring sign-ins from hosting providers?",
    "Threat Intelligence",
    "Regional MENA",
    ["AiTM", "Phishing", "SessionHijacking", "Detection"],
    60
  ),
];
