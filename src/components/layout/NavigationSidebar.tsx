"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Flame, 
  AlertTriangle, 
  Globe2, 
  Users, 
  FileText, 
  BookOpen, 
  Bookmark, 
  Search,
  ShieldCheck,
  Check,
  Plus
} from "lucide-react";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { LocalStore } from "@/lib/storage/local-store";

interface NavProps {
  isMobile?: boolean;
}

export default function NavigationSidebar({ isMobile = false }: NavProps) {
  const pathname = usePathname();
  const [followedCodes, setFollowedCodes] = useState<string[]>(["AE", "SA"]);

  useEffect(() => {
    setFollowedCodes(LocalStore.getFollowedCountries());
    const handleFollowChange = () => {
      setFollowedCodes(LocalStore.getFollowedCountries());
    };
    window.addEventListener("mena_followed_changed", handleFollowChange);
    return () => window.removeEventListener("mena_followed_changed", handleFollowChange);
  }, []);

  const handleToggleFollow = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    LocalStore.toggleFollowCountry(code);
    setFollowedCodes(LocalStore.getFollowedCountries());
  };

  const navItems = [
    { label: "Home Feed", href: "/", icon: Home, badge: null },
    { label: "Breaking News", href: "/breaking", icon: Flame, badge: "LIVE", badgeColor: "bg-alert-orange text-white" },
    { label: "Live Threats & CVEs", href: "/threats", icon: AlertTriangle, badge: "NVD 2.0", badgeColor: "bg-mist text-teal font-mono" },
    { label: "MENA Watch", href: "/mena", icon: Globe2, badge: "13 Countries", badgeColor: "bg-slate-subtle text-slate-muted" },
    { label: "Community Intelligence", href: "/community", icon: Users, badge: null },
    { label: "Research & Reports", href: "/research", icon: FileText, badge: null },
    { label: "Daily Cyber Brief", href: "/daily-brief", icon: BookOpen, badge: "DAILY", badgeColor: "bg-amber-light text-amber-dark border border-amber-border" },
    { label: "Saved Intelligence", href: "/saved", icon: Bookmark, badge: null },
    { label: "Global Search", href: "/search", icon: Search, badge: null },
  ];

  const topics = [
    { name: "Ransomware Operations", slug: "Ransomware" },
    { name: "Industrial SCADA / OT", slug: "Critical Infrastructure" },
    { name: "Banking & SWIFT Ingress", slug: "Fintech & Banking" },
    { name: "State-Sponsored APTs", slug: "Espionage & APT" },
    { name: "Cloud & Sovereign AI", slug: "Cloud & AI" },
    { name: "NCA & Compliance", slug: "Policy & Regulation" },
  ];

  return (
    <div className={`space-y-6 ${isMobile ? "p-1" : "p-4 bg-white rounded-2xl border border-slate-border shadow-coastal-card"}`}>
      {/* Primary Navigation Links */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-muted px-3 mb-2">
          Intelligence Desk
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all group ${
                  isActive
                    ? "bg-teal text-white font-bold shadow-coastal"
                    : "text-slate-dark hover:bg-mist hover:text-teal"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-muted group-hover:text-teal"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Follow Countries Watchlist (All 13 MENA Nations) */}
      <div className="pt-4 border-t border-slate-border">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted">
            Follow Countries ({followedCodes.length} followed)
          </span>
          <Link href="/mena" className="text-[11px] text-teal hover:underline font-bold">
            All 13
          </Link>
        </div>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {MENA_COUNTRIES.map((c) => {
            const isFollowed = followedCodes.includes(c.code);
            return (
              <div
                key={c.code}
                className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg text-slate-dark hover:bg-mist transition-colors group"
              >
                <Link
                  href={`/mena?country=${c.code}`}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <span className="text-sm">{c.flag}</span>
                  <span className="truncate group-hover:text-teal font-medium">{c.name}</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleToggleFollow(e, c.code)}
                    title={isFollowed ? "Following (click to unfollow)" : "Follow country"}
                    className={`p-1 rounded-md text-[10px] transition-colors ${
                      isFollowed
                        ? "bg-teal-light text-teal border border-teal-border"
                        : "text-slate-muted hover:text-teal hover:bg-white"
                    }`}
                  >
                    {isFollowed ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                  <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-sm ${
                    c.threatLevel === "High" ? "bg-alert-light text-alert-orange" : "bg-slate-subtle text-slate-muted"
                  }`}>
                    {c.activeIncidents}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics & Attack Vectors */}
      <div className="pt-4 border-t border-slate-border">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-muted px-3 mb-2">
          Priority Attack Vectors
        </div>
        <div className="flex flex-wrap gap-1.5 px-2">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/?category=${encodeURIComponent(t.slug)}`}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-ice border border-slate-border text-slate-dark hover:border-teal hover:text-teal hover:bg-white transition-all shadow-2xs"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Verified Editorial Standard Callout */}
      <div className="pt-4 border-t border-slate-border px-2">
        <div className="p-3.5 rounded-xl bg-mist border border-mist-border text-[11px] space-y-1.5 text-slate-dark">
          <div className="flex items-center gap-1.5 font-bold text-ocean">
            <ShieldCheck className="w-4 h-4 text-teal" />
            <span>Coastal Tech Standard</span>
          </div>
          <p className="text-slate-muted leading-relaxed">
            Directly connected to national CERT advisories and NVD records. Pure verified reporting with zero synthetic news.
          </p>
        </div>
      </div>
    </div>
  );
}
