import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ice: "#F7FAFC", // Primary background
        teal: {
          DEFAULT: "#087E8B", // Primary brand
          dark: "#066873",
          light: "#EBF6F7",
          border: "#B4DFE3",
        },
        ocean: {
          DEFAULT: "#183B56", // Secondary brand / headings
          dark: "#102A3E",
          light: "#EDF2F7",
          surface: "#F4F7FA",
        },
        amber: {
          desert: "#F2B45B", // Accent / highlights
          light: "#FEF7ED",
          dark: "#C68832",
          border: "#FAD9A6",
        },
        mist: {
          DEFAULT: "#E5F2F5", // Secondary surface
          light: "#F0F7F9",
          dark: "#D0E4EA",
          border: "#C8DFE6",
        },
        alert: {
          orange: "#E45B48", // Breaking / critical
          light: "#FDF2F0",
          border: "#F6BEB7",
          dark: "#C33F2E",
        },
        slate: {
          dark: "#1D2939", // Text
          muted: "#68788A", // Secondary text
          border: "#DCE6EC", // Border
          subtle: "#F1F5F8",
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "'Manrope'", "system-ui", "sans-serif"],
        body: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Newsreader'", "'Source Serif 4'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "Courier New", "monospace"],
      },
      boxShadow: {
        coastal: "0 1px 3px rgba(24, 59, 86, 0.05), 0 4px 12px rgba(8, 126, 139, 0.03)",
        "coastal-card": "0 2px 8px rgba(24, 59, 86, 0.04), 0 1px 2px rgba(24, 59, 86, 0.02)",
        "coastal-hover": "0 6px 20px rgba(8, 126, 139, 0.08), 0 2px 6px rgba(24, 59, 86, 0.04)",
        "coastal-elevated": "0 12px 32px rgba(24, 59, 86, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
