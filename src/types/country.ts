export interface CountryData {
  code: string;
  name: string;
  nativeName: string;
  region: "Gulf" | "Levant" | "North Africa";
  flag: string;
  certAgency: string;
  threatLevel: "Critical" | "High" | "Elevated" | "Guarded";
  activeIncidents: number;
  criticalInfrastructureSectors: string[];
  summary: string;
  recentAdvisories: number;
  coordinates: { x: number; y: number }; // normalized 0-100 for SVG impact map
}
