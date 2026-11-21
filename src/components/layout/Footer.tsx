import Link from "next/link";
import BrandLogo from "@/components/shared/BrandLogo";
import { ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-border bg-white text-slate-muted text-xs transition-colors">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Identity */}
          <div className="space-y-3 md:col-span-1">
            <BrandLogo size="sm" showTagline={false} />
            <p className="text-xs leading-relaxed text-slate-dark">
              MENA Cyber Wire is an independent editorial cybersecurity platform providing real-time awareness and actionable defensive telemetry across 13 Middle East & North African nations.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-teal">
              <ShieldCheck className="w-4 h-4 text-teal" />
              <span>Coastal Tech &middot; Light Edition</span>
            </div>
          </div>

          {/* Regional Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Regional Desks
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/mena?country=SA" className="hover:text-teal transition-colors">
                  Saudi Arabia (NCA ECC)
                </Link>
              </li>
              <li>
                <Link href="/mena?country=AE" className="hover:text-teal transition-colors">
                  United Arab Emirates (aeCERT)
                </Link>
              </li>
              <li>
                <Link href="/mena?country=QA" className="hover:text-teal transition-colors">
                  Qatar & Energy SCADA (Q-CERT)
                </Link>
              </li>
              <li>
                <Link href="/mena?country=EG" className="hover:text-teal transition-colors">
                  Egypt & Fintech (EG-CERT)
                </Link>
              </li>
              <li>
                <Link href="/mena?country=JO" className="hover:text-teal transition-colors">
                  Levant Security Watch (Jordan & Lebanon)
                </Link>
              </li>
            </ul>
          </div>

          {/* Intelligence Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Intelligence Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/breaking" className="hover:text-teal transition-colors">
                  Breaking Incidents Wire
                </Link>
              </li>
              <li>
                <Link href="/threats" className="hover:text-teal transition-colors">
                  NVD CVE Vulnerability Watch
                </Link>
              </li>
              <li>
                <Link href="/daily-brief" className="hover:text-teal transition-colors">
                  Daily Cyber Digest
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-teal transition-colors">
                  Practitioner Community Forum
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-teal transition-colors">
                  Adversary Tracking (MuddyWater / OilRig)
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Standards & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ocean">
              Editorial Standards
            </h4>
            <p className="text-xs leading-relaxed text-slate-dark">
              Every report links directly to primary sources, public advisories, and corroborated indicators. We do not invent incidents or fabricate telemetry.
            </p>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 text-[10px] font-mono rounded-md bg-mist text-ocean border border-mist-border">
                Google News RSS &middot; NVD API 2.0 &middot; CISA
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-muted">
          <div>
            &copy; {currentYear} MENA CYBER WIRE. Powered by the Coastal Tech UI/UX Design System.
          </div>
          <div className="flex items-center gap-4 font-semibold text-ocean">
            <Link href="/" className="hover:text-teal">Feed</Link>
            <Link href="/threats" className="hover:text-teal">Threats</Link>
            <Link href="/mena" className="hover:text-teal">MENA Watch</Link>
            <Link href="/community" className="hover:text-teal">Community</Link>
            <Link href="/saved" className="hover:text-teal">Saved</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
