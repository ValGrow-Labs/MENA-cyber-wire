"use client";

import { ShieldCheck } from "lucide-react";

export default function ThemeToggle() {
  // Pure Coastal Tech Light Theme badge/indicator
  return (
    <div
      title="Coastal Tech Editorial Edition (Light Theme)"
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-border bg-white text-ocean text-xs font-semibold shadow-xs"
    >
      <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
      <span className="text-[11px] text-slate-muted font-medium">Coastal Tech</span>
    </div>
  );
}
