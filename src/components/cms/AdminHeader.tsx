"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminHeader({ onToggleMobileMenu, user }: AdminHeaderProps) {
  const pathname = usePathname();
  const [riyadhTime, setRiyadhTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setRiyadhTime(`${formatted} AST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path: string) => {
    if (path.includes("/articles/new")) return "New Article";
    if (path.includes("/articles/")) return "Edit Article";
    if (path.includes("/articles")) return "Articles";
    if (path.includes("/breaking")) return "Breaking News";
    if (path.includes("/featured")) return "Featured Stories";
    if (path.includes("/homepage")) return "Homepage Sections";
    if (path.includes("/categories")) return "Categories";
    if (path.includes("/countries")) return "Country Desks";
    if (path.includes("/research")) return "Research";
    if (path.includes("/vulnerabilities")) return "Vulnerabilities & Advisories";
    if (path.includes("/daily-brief")) return "Daily Brief";
    if (path.includes("/community")) return "Community";
    if (path.includes("/media")) return "Media Library";
    if (path.includes("/seo")) return "SEO Settings";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/users")) return "Users";
    if (path.includes("/audit-logs")) return "Audit Logs";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#2B2B2B] bg-[#0B0B0B]/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded p-1.5 text-[#A1A1A1] hover:bg-[#191919] hover:text-[#F5F5F5] lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-serif text-base font-semibold text-[#F5F5F5] sm:text-lg">
            {getPageTitle(pathname)}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Riyadh Timezone Indicator */}
        <div className="flex items-center gap-1.5 rounded border border-[#2B2B2B] bg-[#151515] px-3 py-1 text-xs text-[#A1A1A1]">
          <Clock size={13} className="text-[#D63838]" />
          <span className="font-mono text-[11px]">{riyadhTime || "Riyadh AST"}</span>
        </div>
      </div>
    </header>
  );
}
