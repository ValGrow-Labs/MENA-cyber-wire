import { CyberPulseSummary } from "@/types/threat";

/**
 * Editorial watchlist: the groups and sectors our desk follows, and why.
 * This is not live telemetry, counts are left at 0 and are not displayed anywhere.
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
      "We follow these groups because public reporting has repeatedly tied them to intrusions in Gulf government, energy and telecoms networks. Edge devices, VPNs, firewalls and remote-access gateways, remain the entry point we see cited most often in government advisories.",
    advisoriesCount: 0,
    criticalCveCount: 0,
  };
}
