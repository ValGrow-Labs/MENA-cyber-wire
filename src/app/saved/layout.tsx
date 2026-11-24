import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Stories & Intelligence Bookmarks · MENA Cyber Wire",
  description: "Locally bookmarked cybersecurity intelligence reports.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
