import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

/** Wordmark: "MENA" set heavy, "Cyber Wire" regular, with a single accent bar as the mark. */
export default function BrandLogo({ className = "", size = "md" }: BrandLogoProps) {
  const text = { sm: "text-lg", md: "text-xl", lg: "text-3xl" }[size];

  return (
    <Link href="/" aria-label="MENA Cyber Wire, home" className={`group inline-flex shrink-0 items-center gap-2 ${className}`}>
      <span className="h-5 w-[5px] rounded-full bg-brand transition-transform duration-300 group-hover:scale-y-125" aria-hidden />
      <span className={`${text} leading-none tracking-[-0.03em] text-ink`}>
        <span className="font-extrabold">MENA</span> <span className="font-medium">Cyber Wire</span>
      </span>
    </Link>
  );
}
