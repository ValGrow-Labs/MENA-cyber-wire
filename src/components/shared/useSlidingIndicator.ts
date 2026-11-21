"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Measures the active item inside a container (aria-current="page" or aria-selected="true")
 * and returns a style for an absolutely positioned pill that slides to it.
 * Also scrolls the active item into view when the container scrolls horizontally.
 */
export function useSlidingIndicator<T extends HTMLElement>(dep: unknown) {
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const first = useRef(true);

  useIso(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const active = el.querySelector<HTMLElement>('[aria-current="page"], [aria-selected="true"]');
      if (!active) return setStyle((s) => ({ ...s, opacity: 0 }));
      // Measure relative to the container's box, so horizontal scrolling never skews it.
      const box = el.getBoundingClientRect();
      const r = active.getBoundingClientRect();
      if (r.width === 0) return; // container hidden at this breakpoint
      setStyle({
        opacity: 1,
        width: r.width,
        height: r.height,
        transform: `translate(${r.left - box.left - el.clientLeft}px, ${r.top - box.top - el.clientTop}px)`,
        transition: first.current ? "none" : undefined,
      });
      first.current = false;
    };

    const center = () => {
      const active = el.querySelector<HTMLElement>('[aria-current="page"], [aria-selected="true"]');
      const scroller = el.closest<HTMLElement>("[data-scroll-x]");
      if (!active || !scroller || scroller.scrollWidth <= scroller.clientWidth) return;
      const sRect = scroller.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const delta = aRect.left - sRect.left - (sRect.width - aRect.width) / 2;
      scroller.scrollBy({ left: delta, behavior: "smooth" });
    };

    measure();
    center();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(() => { measure(); center(); }).catch(() => {});
    const t = setTimeout(measure, 350);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [dep]);

  return { ref, style };
}
