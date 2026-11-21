"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X, ArrowUpRight, Bell, Bookmark } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import NavigationSidebar from "@/components/layout/NavigationSidebar";
import { LocalStore } from "@/lib/storage/local-store";
import { useSlidingIndicator } from "@/components/shared/useSlidingIndicator";
import ThemeToggle from "@/components/shared/ThemeToggle";

export const SECTIONS = [
  { label: "Latest", href: "/" },
  { label: "Breaking", href: "/breaking" },
  { label: "Vulnerabilities", href: "/threats" },
  { label: "Countries", href: "/mena" },
  { label: "Daily brief", href: "/daily-brief" },
  { label: "Research", href: "/research" },
  { label: "Community", href: "/community" },
];

interface Advisory {
  id?: string;
  title: string;
  source?: string;
  sourceUrl?: string;
  link?: string;
  publishedDate?: string;
}

const iconBtn =
  "relative flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-paper-sunk hover:text-ink";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const alertsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateBookmarks = () => setBookmarkCount(LocalStore.getBookmarks().length);
    updateBookmarks();
    window.addEventListener("mena_bookmarks_changed", updateBookmarks);
    fetch("/api/advisories")
      .then((r) => r.json())
      .then((d) => Array.isArray(d?.data) && setAdvisories(d.data.slice(0, 4)))
      .catch(() => {});
    return () => window.removeEventListener("mena_bookmarks_changed", updateBookmarks);
  }, []);

  useEffect(() => {
    if (!alertsOpen) return;
    const close = (e: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) setAlertsOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAlertsOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [alertsOpen]);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    LocalStore.addSearchHistory(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const deskNav = useSlidingIndicator<HTMLUListElement>(pathname);
  const mobNav = useSlidingIndicator<HTMLUListElement>(pathname);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-modal focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <header className="header-scroll sticky top-0 z-header border-b border-rule bg-paper">
        <div aria-hidden className="read-progress pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-brand" />
        <div className="mx-auto flex h-16 max-w-page items-center gap-6 px-4 sm:px-6 lg:px-8">
          <button onClick={() => setDrawerOpen(true)} className={`${iconBtn} -ml-2 lg:hidden`} aria-label="Open menu">
            <Menu className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <BrandLogo size="md" />

          <nav aria-label="Sections" className="hidden flex-1 lg:block">
            <ul ref={deskNav.ref} className="relative flex w-max items-center gap-0.5">
              <span aria-hidden className="pointer-events-none absolute left-0 top-0 rounded-full bg-ink/[0.09] ring-1 ring-inset ring-ink/10 transition-[transform,width,height,opacity] duration-500 ease-spring motion-reduce:transition-none" style={deskNav.style} />
              {SECTIONS.map((s) => {
                const active = isActive(s.href);
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block whitespace-nowrap rounded-full px-3.5 py-1.5 text-[0.9375rem] font-semibold transition-colors duration-300 ${
                        active ? "text-ink" : "text-ink-3 hover:text-ink"
                      }`}
                    >
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {searchOpen ? (
              <form onSubmit={submit} role="search" className="flex animate-rise items-center rounded-full border border-edge bg-paper-raised pl-3">
                <Search className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="CVE, group, country"
                  aria-label="Search"
                  className="w-40 bg-transparent px-2.5 py-2 text-sm text-ink placeholder:text-ink-4 focus:outline-none sm:w-56"
                />
              </form>
            ) : (
              <button
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchRef.current?.focus(), 0);
                }}
                className={iconBtn}
                aria-label="Search (press /)"
                title="Search (press /)"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            )}

            <div className="relative" ref={alertsRef}>
              <button onClick={() => setAlertsOpen((v) => !v)} aria-expanded={alertsOpen} aria-label="Advisories" className={iconBtn}>
                <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {advisories.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-paper" aria-hidden />}
              </button>
              {alertsOpen && (
                <div className="absolute right-0 top-full z-overlay mt-3 w-[min(24rem,calc(100vw-2rem))] animate-rise overflow-hidden rounded-xl border border-rule bg-paper-raised shadow-[0_24px_48px_-16px_rgb(var(--shade)/0.35)]">
                  <p className="border-b border-rule px-4 py-3 text-sm font-semibold text-ink">Government and CERT advisories</p>
                  {advisories.length > 0 ? (
                    <ul>
                      {advisories.map((a, i) => (
                        <li key={a.id || i} className="border-b border-rule last:border-0">
                          <a
                            href={a.sourceUrl || a.link || "/breaking"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-3 transition-colors hover:bg-paper-sunk"
                          >
                            <span className="text-xs text-ink-3">
                              {a.source || "Advisory"}
                              {a.publishedDate &&
                                `, ${new Date(a.publishedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                            </span>
                            <span className="mt-1 block text-sm font-medium leading-snug text-ink">{a.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-4 text-sm text-ink-3">No advisories loaded yet.</p>
                  )}
                  <Link
                    href="/breaking"
                    onClick={() => setAlertsOpen(false)}
                    className="flex items-center justify-between border-t border-rule px-4 py-3 text-sm font-medium text-ink hover:bg-paper-sunk"
                  >
                    All breaking coverage <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                </div>
              )}
            </div>

            <ThemeToggle />

            <Link href="/saved" className={iconBtn} aria-label={`Saved stories (${bookmarkCount})`}>
              <Bookmark className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {bookmarkCount > 0 && (
                <span className="absolute -right-0.5 top-0.5 min-w-4 rounded-full bg-ink px-1 text-center text-[10px] font-semibold leading-4 text-paper tabular">
                  {bookmarkCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <nav aria-label="Sections" data-scroll-x className="scroll-x border-t border-rule lg:hidden">
          <ul ref={mobNav.ref} className="relative mx-3 my-2 flex w-max gap-0.5">
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 rounded-full bg-ink/[0.09] ring-1 ring-inset ring-ink/10 transition-[transform,width,height,opacity] duration-500 ease-spring motion-reduce:transition-none" style={mobNav.style} />
            {SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <li key={s.href} className="shrink-0">
                  <Link
                    href={s.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors duration-300 ${active ? "text-ink" : "text-ink-3"}`}
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-modal flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="h-full w-[85%] max-w-sm animate-rise overflow-y-auto border-r border-rule bg-paper px-5 py-5">
            <div className="flex items-center justify-between border-b border-rule pb-4">
              <BrandLogo size="sm" />
              <button onClick={() => setDrawerOpen(false)} className={iconBtn} aria-label="Close menu">
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>
            <form onSubmit={submit} role="search" className="mt-5 flex items-center rounded-full border border-edge bg-paper-raised pl-3">
              <Search className="h-4 w-4 text-ink-3" strokeWidth={1.75} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search"
                className="w-full bg-transparent px-2.5 py-2 text-sm text-ink focus:outline-none"
              />
            </form>
            <div className="mt-6">
              <NavigationSidebar />
            </div>
          </div>
          <button className="flex-1 bg-ink/40 backdrop-blur-sm" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </>
  );
}
