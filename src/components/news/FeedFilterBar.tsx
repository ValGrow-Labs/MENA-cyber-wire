"use client";

import { Clock, AlertTriangle, ShieldCheck, UserCheck, LayoutGrid, List } from "lucide-react";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";

interface FilterBarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: "card" | "compact";
  onViewModeChange: (mode: "card" | "compact") => void;
}

export default function FeedFilterBar({
  sortBy,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  const feedTabs = [
    { id: "latest", label: "Latest Wire", icon: Clock },
    { id: "severity", label: "High Severity", icon: AlertTriangle },
    { id: "signal", label: "Verified Signals", icon: ShieldCheck },
    { id: "following", label: "My Following", icon: UserCheck },
  ];

  const categories = [
    "All Categories",
    "Ransomware",
    "Critical Infrastructure",
    "Data Breach",
    "Espionage & APT",
    "Fintech & Banking",
    "Cloud & AI",
    "Policy & Regulation",
  ];

  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-border shadow-coastal-card space-y-3">
      {/* Top Row: Feed Tabs + View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Feed Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {feedTabs.map((tab) => {
            const Icon = tab.icon;
            const active = sortBy === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSortChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                  active
                    ? "bg-teal text-white shadow-coastal"
                    : "text-slate-dark hover:bg-mist hover:text-teal"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-amber-desert" : "text-slate-muted"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-ice border border-slate-border">
          <button
            onClick={() => onViewModeChange("card")}
            title="Card View"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "card"
                ? "bg-white text-teal shadow-xs font-bold"
                : "text-slate-muted hover:text-ocean"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("compact")}
            title="Compact Headline View"
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "compact"
                ? "bg-white text-teal shadow-xs font-bold"
                : "text-slate-muted hover:text-ocean"
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Selectors (Country, Category, Verification) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-slate-border text-xs">
        {/* Country Filter */}
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal font-medium"
        >
          <option value="all">All MENA Countries</option>
          {MENA_COUNTRIES.map((c) => (
            <option key={c.code} value={c.name.toLowerCase()}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal font-medium"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === "All Categories" ? "all" : cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Verification Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal font-medium"
        >
          <option value="ALL">All Editorial Classifications</option>
          <option value="SIGNAL">SIGNAL (Verified Intel)</option>
          <option value="WATCH">WATCH (Developing Incident)</option>
          <option value="UNVERIFIED">UNVERIFIED (Third-party Claims)</option>
        </select>
      </div>
    </div>
  );
}
