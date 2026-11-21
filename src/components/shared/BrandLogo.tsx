import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({ className = "", showTagline = true, size = "md" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const titleSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg sm:text-xl tracking-tight",
    lg: "text-2xl tracking-tight",
  };

  return (
    <Link href="/" className={`group flex items-center gap-3 transition-opacity hover:opacity-95 ${className}`}>
      {/* Modern Coastal Tech Shield & Signal Geometric Logo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-teal text-white shadow-coastal group-hover:bg-teal-dark transition-all duration-300`}>
        {/* Geometric coastal shield with signal node */}
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 3L6 7V15C6 21.6 10.3 27.7 16 29C21.7 27.7 26 21.6 26 15V7L16 3Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 11V18"
            stroke="#F2B45B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="16" cy="22" r="1.5" fill="#F2B45B" />
        </svg>

        {/* Desert Amber Accent Corner Pulse */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-desert rounded-full border-2 border-white ring-1 ring-teal/20" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className={`font-extrabold ${titleSizes[size]} text-ocean font-heading uppercase`}>
            MENA<span className="text-teal">.</span>CYBER<span className="text-amber-desert">.</span>WIRE
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-slate-muted uppercase">
            Regional Cyber Intelligence &middot; Real-time Awareness
          </span>
        )}
      </div>
    </Link>
  );
}
