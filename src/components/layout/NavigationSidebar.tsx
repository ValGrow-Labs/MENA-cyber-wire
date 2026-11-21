"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENA_COUNTRIES } from "@/lib/country/mena-countries";
import { LocalStore } from "@/lib/storage/local-store";
import { SECTIONS } from "@/components/layout/Header";

/** Drawer contents for small screens: sections, saved, and country follows. */
export default function NavigationSidebar() {
  const pathname = usePathname();
  const [followed, setFollowed] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setFollowed(LocalStore.getFollowedCountries());
    sync();
    window.addEventListener("mena_followed_changed", sync);
    return () => window.removeEventListener("mena_followed_changed", sync);
  }, []);

  const toggle = (code: string) => {
    LocalStore.toggleFollowCountry(code);
    setFollowed(LocalStore.getFollowedCountries());
  };

  const links = [...SECTIONS, { label: "Saved", href: "/saved" }, { label: "Search", href: "/search" }];

  return (
    <div className="space-y-8">
      <nav aria-label="Sections">
        <ul>
          {links.map((s) => {
            const active = s.href === "/" ? pathname === "/" : pathname.startsWith(s.href);
            return (
              <li key={s.href} className="border-b border-rule">
                <Link
                  href={s.href}
                  className={`flex items-center justify-between py-3 font-serif text-lg ${
                    active ? "text-ink" : "text-ink-2"
                  }`}
                >
                  {s.label}
                  {active && <span className="h-2 w-2 bg-signal" aria-hidden />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section>
        <div className="flex items-baseline justify-between border-t-2 border-edge pt-2">
          <p className="kicker">Countries you follow</p>
          <span className="font-mono text-2xs text-ink-3 tabular">{followed.length}/{MENA_COUNTRIES.length}</span>
        </div>
        <ul className="mt-2">
          {MENA_COUNTRIES.map((c) => {
            const on = followed.includes(c.code);
            return (
              <li key={c.code} className="flex items-center justify-between border-b border-rule py-2 text-sm">
                <Link href={`/mena?country=${c.code}`} className="flex items-center gap-2.5 text-ink-2 hover:text-ink">
                  <span className="w-6 font-mono text-2xs text-ink-3">{c.code}</span>
                  {c.name}
                </Link>
                <button
                  onClick={() => toggle(c.code)}
                  aria-pressed={on}
                  className={`px-2 py-0.5 text-xs font-medium transition-colors ${
                    on ? "bg-ink text-paper" : "border border-rule text-ink-3 hover:border-ink hover:text-ink"
                  }`}
                >
                  {on ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
