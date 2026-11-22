"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/cms-admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <PageShell>{children}</PageShell>
      <Footer />
    </>
  );
}
