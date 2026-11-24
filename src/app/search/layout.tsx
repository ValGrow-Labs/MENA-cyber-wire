import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Intelligence Archive · MENA Cyber Wire",
  description: "Search primary source intelligence, vulnerabilities, and regional advisories across the MENA region.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
