"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Radio,
  Star,
  LayoutTemplate,
  FolderTree,
  Globe2,
  Binary,
  ShieldAlert,
  CalendarDays,
  MessagesSquare,
  Image as ImageIcon,
  Search,
  Settings,
  Users,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  user?: {
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  };
  onLogout: () => void;
}

const NAV_ITEMS = [
  { group: "EDITORIAL", items: [
    { label: "Dashboard", href: "/cms-admin/dashboard", icon: LayoutDashboard },
    { label: "Articles", href: "/cms-admin/articles", icon: FileText },
    { label: "Breaking News", href: "/cms-admin/breaking", icon: Radio },
    { label: "Featured Stories", href: "/cms-admin/featured", icon: Star },
    { label: "Homepage", href: "/cms-admin/homepage", icon: LayoutTemplate },
    { label: "Categories", href: "/cms-admin/categories", icon: FolderTree },
  ]},
  { group: "DESKS", items: [
    { label: "Country Desks", href: "/cms-admin/countries", icon: Globe2 },
    { label: "Research", href: "/cms-admin/research", icon: Binary },
    { label: "Vulnerabilities", href: "/cms-admin/vulnerabilities", icon: ShieldAlert },
    { label: "Daily Brief", href: "/cms-admin/daily-brief", icon: CalendarDays },
    { label: "Community", href: "/cms-admin/community", icon: MessagesSquare },
  ]},
  { group: "SETTINGS", items: [
    { label: "Media Library", href: "/cms-admin/media", icon: ImageIcon },
    { label: "SEO Settings", href: "/cms-admin/seo", icon: Search },
    { label: "Settings", href: "/cms-admin/settings", icon: Settings },
    { label: "Users", href: "/cms-admin/users", icon: Users },
    { label: "Audit Logs", href: "/cms-admin/audit-logs", icon: History },
  ]},
];

export default function AdminSidebar({
  collapsed,
  onToggleCollapse,
  user,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#2B2B2B] bg-[#0B0B0B] text-[#F5F5F5] transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#2B2B2B] px-4">
        {!collapsed && (
          <Link href="/cms-admin/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#D63838] font-mono font-bold text-white shadow-sm">
              M
            </span>
            <div className="min-w-0">
              <span className="block font-serif text-sm font-semibold tracking-wide text-[#F5F5F5]">
                MENA Cyber Wire
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#D63838]">
                Editorial CMS
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded bg-[#D63838] font-mono font-bold text-white">
            M
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden rounded p-1 text-[#A1A1A1] hover:bg-[#191919] hover:text-[#F5F5F5] lg:block"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {NAV_ITEMS.map((section) => (
          <div key={section.group} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-3 font-mono text-[10px] font-semibold tracking-wider text-[#707070]">
                {section.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/cms-admin/dashboard" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#191919] text-[#F5F5F5] font-semibold"
                          : "text-[#A1A1A1] hover:bg-[#151515] hover:text-[#F5F5F5]"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <span
                        className={`${
                          isActive ? "text-[#D63838]" : "text-[#707070] group-hover:text-[#A1A1A1]"
                        }`}
                      >
                        <Icon size={17} />
                      </span>
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {isActive && !collapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D63838]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Live Website Link */}
      <div className="border-t border-[#2B2B2B] p-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-md px-3 py-2 text-xs text-[#A1A1A1] hover:bg-[#191919] hover:text-[#F5F5F5]"
          title="Open Public Website"
        >
          <ExternalLink size={16} className="text-[#707070]" />
          {!collapsed && <span>Open Public Site</span>}
        </a>
      </div>

      {/* Admin User Footer Profile */}
      <div className="border-t border-[#2B2B2B] bg-[#151515] p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#202020] text-xs font-bold text-[#F5F5F5] border border-[#2B2B2B]">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#F5F5F5]">
                  {user?.name || "Admin"}
                </p>
                <p className="font-mono text-[10px] text-[#D63838]">
                  {user?.role || "SUPER_ADMIN"}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={onLogout}
              className="rounded p-1.5 text-[#707070] hover:bg-[#202020] hover:text-[#D63838]"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
