"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "mcw-theme-v3";

/** Runs before paint (inlined in <head>). Dark (red and black) by default; light if the reader chose it. */
export const themeInitScript = `(function(){try{var q=new URLSearchParams(location.search).get('theme');var t=q||localStorage.getItem('${KEY}');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState<boolean | null>(null);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem(KEY, next ? "light" : "dark");
    } catch {}
    setLight(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Dark mode" : "Light mode"}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full text-ink-2 transition-colors duration-200 hover:bg-paper-sunk hover:text-ink ${className}`}
    >
      {light === null ? (
        <span className="h-[18px] w-[18px]" />
      ) : light ? (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
