"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, Globe2, Users, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { LocalStore } from "@/lib/storage/local-store";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setSavedCount(LocalStore.getBookmarks().length);
    };
    update();
    window.addEventListener("mena_bookmarks_changed", update);
    return () => window.removeEventListener("mena_bookmarks_changed", update);
  }, []);

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Live", href: "/threats", icon: Flame },
    { label: "MENA", href: "/mena", icon: Globe2 },
    { label: "Community", href: "/community", icon: Users },
    { label: "Saved", href: "/saved", icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-border py-2 px-3 shadow-coastal-elevated">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[54px] min-h-[44px] transition-colors ${isActive
                ? "text-teal font-bold bg-teal-light"
                : "text-slate-muted hover:text-ocean"
                }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-4 h-4 flex items-center justify-center bg-teal text-white text-[9px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
