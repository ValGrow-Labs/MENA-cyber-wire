import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found · MENA Cyber Wire",
  description: "The requested intelligence dispatch or page could not be located on the wire.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="py-8 sm:py-16 max-w-page mx-auto px-4">
      <p className="kicker text-signal">Error 404 · Signal Lost</p>
      <h1 className="mt-3 max-w-[18ch] font-serif text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl">
        This page isn&apos;t on the wire.
      </h1>
      <p className="mt-5 max-w-prose font-serif text-lg text-ink-2">
        The link may be outdated, or the intelligence dispatch may have moved to a permanent canonical archive.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-rule pt-6">
        <Link href="/" className="btn-primary">Return to Front Page</Link>
        <Link href="/breaking" className="btn-secondary">Breaking Ticker</Link>
        <Link href="/threats" className="btn-secondary">Vulnerabilities</Link>
        <Link href="/mena" className="btn-secondary">Country Desks</Link>
        <Link href="/search" className="link text-sm text-ink hover:underline">Search Archive</Link>
      </div>
    </div>
  );
}
