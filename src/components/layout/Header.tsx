"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/shared/BrandLogo";
import { 
  Search, 
  Bookmark, 
  Menu, 
  X, 
  Bell, 
  Clock, 
  User, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock
} from "lucide-react";
import { LocalStore } from "@/lib/storage/local-store";
import Link from "next/link";
import NavigationSidebar from "@/components/layout/NavigationSidebar";

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeGcc, setTimeGcc] = useState("");
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Sign-in modal state
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateBookmarks = () => {
      setBookmarkCount(LocalStore.getBookmarks().length);
    };
    updateBookmarks();
    window.addEventListener("mena_bookmarks_changed", updateBookmarks);

    const updateClock = () => {
      const now = new Date();
      setTimeGcc(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Riyadh",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) + " AST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);

    return () => {
      window.removeEventListener("mena_bookmarks_changed", updateBookmarks);
      clearInterval(interval);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      LocalStore.addSearchHistory(searchQuery.trim());
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setIsSignedIn(true);
      setShowSignInModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-border bg-white/95 backdrop-blur-md transition-colors shadow-coastal">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-ocean hover:bg-mist transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-alert-orange" /> : <Menu className="w-5 h-5" />}
            </button>
            <BrandLogo size="md" />
          </div>

          {/* Desktop Search Bar (Coastal Tech styling) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-6 relative items-center"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-slate-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MENA threats, CVEs, ransomware, Saudi, UAE..."
              className="w-full pl-10 pr-14 py-2 text-xs rounded-xl bg-ice border border-slate-border text-slate-dark placeholder-slate-muted focus:outline-hidden focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-2 py-0.5 text-[10px] font-bold text-slate-muted bg-white border border-slate-border rounded-md hover:text-teal hover:border-teal"
            >
              ↵
            </button>
          </form>

          {/* Header Action Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Threats Indicator */}
            <Link
              href="/threats"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-alert-light border border-alert-border text-alert-orange text-xs font-semibold hover:bg-alert-orange hover:text-white transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-alert-orange animate-pulse" />
              <span>LIVE THREATS: ELEVATED</span>
            </Link>

            {/* AST Time Telemetry */}
            {timeGcc && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-muted font-mono px-2.5 py-1 rounded-lg bg-ice border border-slate-border">
                <Clock className="w-3.5 h-3.5 text-teal" />
                <span>{timeGcc}</span>
              </div>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadNotifications(0);
                }}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-border bg-white text-ocean hover:bg-mist hover:border-teal/30 transition-colors shadow-xs"
                title="Intelligence Alerts & Advisories"
              >
                <Bell className="w-4 h-4 text-ocean" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-alert-orange text-[9px] font-bold text-white leading-none">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-border shadow-coastal-elevated p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-ocean">
                      Intelligence Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-muted hover:text-slate-dark text-xs"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-alert-light border border-alert-border">
                      <div className="flex items-center justify-between font-bold text-alert-orange mb-1">
                        <span>Emergency Advisory</span>
                        <span className="text-[10px]">Just now</span>
                      </div>
                      <p className="text-slate-dark text-[11px] leading-snug">
                        aeCERT warns of active exploitation of PAN-OS zero-days across GCC perimeters.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-light border border-amber-border">
                      <div className="flex items-center justify-between font-bold text-amber-dark mb-1">
                        <span>APT Campaign</span>
                        <span className="text-[10px]">2h ago</span>
                      </div>
                      <p className="text-slate-dark text-[11px] leading-snug">
                        MuddyWater spear-phishing campaign detected targeting Riyadh commercial banks.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/breaking"
                    onClick={() => setShowNotifications(false)}
                    className="block text-center text-xs font-bold text-teal hover:underline pt-1"
                  >
                    View All Live Wire Alerts &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Bookmarks Quick Link */}
            <Link
              href="/saved"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-border bg-white text-ocean hover:bg-mist hover:border-teal/30 transition-colors shadow-xs"
              title="Saved Intelligence Vault"
            >
              <Bookmark className="w-4 h-4 text-ocean" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-teal text-[9px] font-bold text-white leading-none">
                  {bookmarkCount}
                </span>
              )}
            </Link>

            {/* Sign-in / User Profile Button */}
            {isSignedIn ? (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-border bg-teal-light text-teal text-xs font-bold hover:bg-teal hover:text-white transition-all shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analyst Verified</span>
              </button>
            ) : (
              <button
                onClick={() => setShowSignInModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal text-white hover:bg-teal-dark text-xs font-bold transition-all shadow-coastal"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <Search className="w-4 h-4 absolute left-3 text-slate-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threats, CVEs, countries..."
              className="w-full pl-9 pr-10 py-1.5 text-xs rounded-xl bg-ice border border-slate-border text-slate-dark placeholder-slate-muted focus:outline-hidden"
            />
          </form>
        </div>
      </div>

      {/* Sign-in / Analyst Access Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-ocean-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-border shadow-coastal-elevated p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-border">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-light text-teal">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-ocean">
                  {isSignedIn ? "Analyst Profile" : "Analyst Intelligence Portal"}
                </h3>
              </div>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-slate-muted hover:text-slate-dark p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSignedIn ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-mist border border-mist-border space-y-1">
                  <span className="font-bold text-ocean block text-sm">Authenticated SOC Session</span>
                  <p className="text-slate-muted">Access token active for {userEmail || "analyst@menacyberwire.org"}.</p>
                </div>
                <button
                  onClick={() => setIsSignedIn(false)}
                  className="w-full py-2 rounded-xl border border-alert-border text-alert-orange font-bold hover:bg-alert-light transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-3 text-xs">
                <p className="text-slate-muted leading-relaxed">
                  Sign in to follow regional threat feeds, customize CERT alerts, and publish verified practitioner research.
                </p>
                <div>
                  <label className="font-bold text-ocean block mb-1">Corporate or Government Email</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="analyst@organization.sa or .ae"
                    className="w-full px-3 py-2 rounded-xl bg-ice border border-slate-border text-slate-dark focus:outline-hidden focus:border-teal"
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSignInModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-muted font-semibold hover:text-slate-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal text-white font-bold hover:bg-teal-dark shadow-coastal"
                  >
                    Enter Portal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[115px] z-50 bg-ocean-dark/40 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm h-full bg-white p-4 overflow-y-auto shadow-coastal-elevated border-r border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Intelligence Navigation
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-muted hover:text-slate-dark"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4" onClick={() => setMobileMenuOpen(false)}>
              <NavigationSidebar isMobile />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
