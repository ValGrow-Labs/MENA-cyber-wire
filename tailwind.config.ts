import type { Config } from "tailwindcss";

/**
 * MENA Cyber Wire — professional light system
 * Token names are semantic: paper = background surfaces, ink = foreground text,
 * edge = structural dividers, signal = the single accent (ember), reserved for urgency.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // All colours are CSS variables (see globals.css) so light and dark themes swap in one place.
      colors: {
        paper: { DEFAULT: "rgb(var(--paper) / <alpha-value>)", raised: "rgb(var(--paper-raised) / <alpha-value>)", sunk: "rgb(var(--paper-sunk) / <alpha-value>)" },
        ink: { DEFAULT: "rgb(var(--ink) / <alpha-value>)", 2: "rgb(var(--ink-2) / <alpha-value>)", 3: "rgb(var(--ink-3) / <alpha-value>)", 4: "rgb(var(--ink-4) / <alpha-value>)" },
        rule: { DEFAULT: "rgb(var(--rule) / <alpha-value>)", strong: "rgb(var(--ink) / <alpha-value>)" },
        edge: "rgb(var(--edge) / <alpha-value>)",
        brand: { DEFAULT: "rgb(var(--brand) / <alpha-value>)", dark: "rgb(var(--brand-dark) / <alpha-value>)", navy: "rgb(var(--brand-navy) / <alpha-value>)", wash: "rgb(var(--brand-wash) / <alpha-value>)" },
        signal: { DEFAULT: "rgb(var(--signal) / <alpha-value>)", deep: "rgb(var(--signal-deep) / <alpha-value>)", wash: "rgb(var(--signal-wash) / <alpha-value>)" },
        caution: "rgb(var(--caution) / <alpha-value>)",
        medium: "rgb(var(--medium) / <alpha-value>)",
        safe: "rgb(var(--safe) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        // "serif" kept as an alias of the display face so older classes stay valid. No serif in the system.
        serif: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Shape lock: pills for buttons, 12px for media and panels, 10px for inputs.
      borderRadius: {
        // Square photos and panels, as on major news sites; buttons stay pill-shaped.
        md: "3px",
        lg: "4px",
        xl: "0px",
        "2xl": "0px",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      letterSpacing: {
        kicker: "0.14em",
      },
      maxWidth: {
        page: "1680px",
        prose: "68ch",
      },
      zIndex: {
        rail: "10",
        header: "30",
        overlay: "40",
        modal: "50",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        sweep: {
          to: { transform: "rotate(360deg)" },
        },
        ring: {
          "0%": { transform: "scale(0.4)", opacity: "0.9" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animation: {
        rise: "rise 420ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        blink: "blink 1.6s ease-in-out infinite",
        sweep: "sweep 9s linear infinite",
        ring: "ring 2.6s cubic-bezier(0.32, 0.72, 0, 1) infinite",
        marquee: "marquee 60s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
