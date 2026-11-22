"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CMSAdminIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cms-admin/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] text-[#F5F5F5]">
      <p className="font-mono text-xs text-[#707070]">Loading CMS...</p>
    </div>
  );
}
