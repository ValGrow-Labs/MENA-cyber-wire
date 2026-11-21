import { CyberPulseSummary } from "@/types/threat";

export function getTodayCyberPulse(): CyberPulseSummary {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return {
    date: dateStr,
    threatLevel: "ELEVATED",
    headline: "Active exploitation of perimeter VPNs and spear-phishing across GCC banking and critical infrastructure.",
    activeIncidentsCount: 8,
    targetedSectors: ["Fintech & Banking", "Oil & Petrochemicals", "Maritime Logistics", "Healthcare"],
    primaryThreatActors: ["MuddyWater (APT)", "LockBit 3.0 Affiliates", "DarkBit", "Phobos"],
    keyTakeaway: "Perimeter gateway zero-days (PAN-OS, Ivanti) and spear-phishing utilizing weaponized regulatory PDFs represent the primary vector for unauthorized intrusion in MENA networks this week.",
    advisoriesCount: 14,
    criticalCveCount: 6
  };
}
