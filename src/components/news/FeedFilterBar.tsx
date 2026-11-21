"use client";

import { ChevronDown, LayoutGrid, List } from "lucide-react";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { useSlidingIndicator } from "@/components/shared/useSlidingIndicator";

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

const TABS = [
  { id: "latest", label: "Latest" },
  { id: "severity", label: "Most severe" },
  { id: "signal", label: "Confirmed" },
  { id: "following", label: "Following" },
];

const CATEGORIES = [
  "Ransomware",
  "Critical Infrastructure",
  "Data Breach",
  "Espionage & APT",
  "Fintech & Banking",
  "Cloud & AI",
  "Policy & Regulation",
];

/** Compact pill dropdown that sizes to its content and lights up when a filter is active. */
function PillSelect({
  label,
  value,
  allValue,
  onChange,
  children,
}: {
  label: string;
  value: string;
  allValue: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const active = value !== allValue;
  return (
    <label
      className={`relative inline-flex items-center rounded-full border text-sm font-semibold transition-colors duration-200 focus-within:ring-2 focus-within:ring-brand/40 ${
        active ? "border-brand/60 bg-brand/10 text-ink" : "border-rule bg-paper-raised text-ink-2 hover:border-edge hover:text-ink"
      }`}
    >
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-2 pl-4 pr-9 focus:outline-none [&>option]:bg-paper-raised [&>option]:text-ink"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 opacity-60" strokeWidth={2} />
    </label>
  );
}

export default function FeedFilterBar(p: FilterBarProps) {
  const tabs = useSlidingIndicator<HTMLDivElement>(p.sortBy);

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink">More news</h2>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Sort: segmented control with a gliding highlight */}
        <div data-scroll-x className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div ref={tabs.ref} role="tablist" aria-label="Sort stories" className="relative flex w-max gap-0.5 rounded-full border border-rule bg-paper-raised p-1">
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-full bg-ink/[0.1] ring-1 ring-inset ring-ink/10 transition-[transform,width,height,opacity] duration-500 ease-spring motion-reduce:transition-none"
              style={tabs.style}
            />
            {TABS.map((t) => {
              const active = p.sortBy === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => p.onSortChange(t.id)}
                  className={`relative shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-300 ${
                    active ? "text-ink" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters + view */}
        <div className="flex flex-wrap items-center gap-2">
          <PillSelect label="Country" value={p.selectedCountry} allValue="all" onChange={p.onCountryChange}>
            <option value="all">All countries</option>
            {MENA_COUNTRIES.map((c) => (
              <option key={c.code} value={c.name.toLowerCase()}>
                {c.name}
              </option>
            ))}
          </PillSelect>
          <PillSelect label="Topic" value={p.selectedCategory} allValue="all" onChange={p.onCategoryChange}>
            <option value="all">All topics</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </PillSelect>
          <PillSelect label="Status" value={p.selectedStatus} allValue="ALL" onChange={p.onStatusChange}>
            <option value="ALL">Any status</option>
            <option value="SIGNAL">Confirmed</option>
            <option value="WATCH">Reported</option>
            <option value="UNVERIFIED">Unverified</option>
          </PillSelect>

          <div role="group" aria-label="View" className="ml-1 flex rounded-full border border-rule bg-paper-raised p-1">
            {(
              [
                ["card", LayoutGrid, "Show stories with images"],
                ["compact", List, "Show headlines only"],
              ] as const
            ).map(([m, Icon, label]) => (
              <button
                key={m}
                onClick={() => p.onViewModeChange(m)}
                aria-pressed={p.viewMode === m}
                aria-label={label}
                title={label}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 ${
                  p.viewMode === m ? "bg-ink/[0.1] text-ink" : "text-ink-3 hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
