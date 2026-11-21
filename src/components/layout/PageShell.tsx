"use client";

import { usePathname } from "next/navigation";

/**
 * The front page composes its own full-width grid.
 * Articles get a centred reading column; listing pages use the full page width.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Articles keep a comfortable reading width; every other page uses the full page width.
  const reading = pathname.startsWith("/article/");

  return (
    <main
      id="main"
      className={`mx-auto w-full flex-1 px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10 ${reading ? "max-w-5xl" : "max-w-page"}`}
    >
      {children}
    </main>
  );
}
