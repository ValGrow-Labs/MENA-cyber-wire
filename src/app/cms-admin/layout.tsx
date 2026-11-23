"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/cms/AdminSidebar";
import AdminHeader from "@/components/cms/AdminHeader";
import ToastNotification, { ToastMessage } from "@/components/cms/ToastNotification";

interface AdminContextType {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
  } | null;
  notify: (text: string, type?: "success" | "error" | "info" | "warning") => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  notify: () => {},
  logout: () => {},
});

export const useAdmin = () => useContext(AdminContext);

export default function CMSAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isLoginPage = pathname === "/cms-admin/login";

  const notify = (text: string, type: "success" | "error" | "info" | "warning" = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/cms/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          if (isLoginPage) {
            router.push("/cms-admin/dashboard");
          }
        } else if (!isLoginPage) {
          router.push("/cms-admin/login");
        }
      } else if (!isLoginPage) {
        router.push("/cms-admin/login");
      }
    } catch {
      if (!isLoginPage) router.push("/cms-admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMobileOpen(false);
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/cms/auth/logout", { method: "POST" });
      setUser(null);
      notify("Logged out successfully", "info");
      router.push("/cms-admin/login");
    } catch {}
  };

  if (isLoginPage) {
    return (
      <AdminContext.Provider value={{ user, notify, logout: handleLogout }}>
        <div className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5] antialiased">
          {children}
          <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
        </div>
      </AdminContext.Provider>
    );
  }

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] text-[#F5F5F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D63838] border-t-transparent" />
          <p className="font-mono text-xs tracking-wider text-[#707070]">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ user, notify, logout: handleLogout }}>
      <div className="flex min-h-screen bg-[#0B0B0B] text-[#F5F5F5] antialiased">
        {/* Desktop Sidebar (visible on lg+) */}
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Mobile Sidebar Overlay (visible on < lg when mobileOpen) */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm lg:hidden animate-rise"
            onClick={() => setMobileOpen(false)}
          >
            <div className="h-full" onClick={(e) => e.stopPropagation()}>
              <AdminSidebar
                collapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
                user={user}
                onLogout={handleLogout}
                isMobile
                onCloseMobile={() => setMobileOpen(false)}
              />
            </div>
            <button
              className="flex-1 bg-transparent"
              aria-label="Close menu backdrop"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div
          className={`flex flex-1 flex-col transition-all duration-300 ${
            collapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <AdminHeader
            onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
            user={user}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>

        <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </AdminContext.Provider>
  );
}
