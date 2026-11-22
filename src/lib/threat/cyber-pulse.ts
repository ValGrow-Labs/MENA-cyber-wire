import { CyberPulseSummary } from "@/types/threat";

/**
 * Editorial watchlist & threat posture fallback defaults.
 */
export function getTodayCyberPulse(): CyberPulseSummary {
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    date: dateStr,
    threatLevel: "GUARDED",
    headline: "What our desk follows across the region, and why.",
    activeIncidentsCount: 0,
    targetedSectors: ["Energy and petrochemicals", "Government", "Banking and payments", "Telecoms", "Healthcare"],
    primaryThreatActors: ["MuddyWater", "OilRig (APT34)", "Shamoon wiper operators", "Ransomware affiliates"],
    keyTakeaway:
      "Edge devices, VPNs, firewalls, and remote-access gateways remain the entry point cited most often in government advisories across the Gulf.",
    advisoriesCount: 0,
    criticalCveCount: 0,
    recommendedDefensiveActions: [
      "Check perimeter gateways (PAN-OS, Ivanti, Fortinet) against the current KEV list and patch anything listed.",
      "Warn finance teams about phishing that imitates GCC regulator memos; MuddyWater has used this lure repeatedly.",
      "Confirm offline backups exist and restore cleanly for OT historian and SCADA servers.",
      "Require hardware-key or app-based MFA on every administrative portal, including vendor access.",
    ],
  };
}
