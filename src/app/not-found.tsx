import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-8 sm:py-16">
      <p className="kicker text-signal">Error 404</p>
      <h1 className="mt-3 max-w-[16ch] font-serif text-5xl font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl">
        This page isn&apos;t on the wire.
      </h1>
      <p className="mt-5 max-w-prose font-serif text-lg text-ink-2">
        The link may be old, or the story may have been pulled from its source feed.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-rule pt-6">
        <Link href="/" className="btn-primary">Latest stories</Link>
        <Link href="/search" className="link text-sm text-ink">Search the archive</Link>
      </div>
    </div>
  );
}
