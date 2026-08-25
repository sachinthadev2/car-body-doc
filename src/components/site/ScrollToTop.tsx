"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { scrollToTop } from "@/components/site/SmoothScroll";
import { cn } from "@/lib/utils";

/** Bottom-left "back to top" button. Appears once you are a screen down. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrolled > 500);
      setProgress(max > 0 ? Math.min(1, scrolled / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "group fixed bottom-20 left-5 z-40 flex size-12 items-center justify-center rounded-full border border-hairline bg-panel/90 text-white backdrop-blur transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 lg:bottom-7 lg:left-7",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {/* Ring showing how far down the page you are */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--color-brand-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 22}
          strokeDashoffset={2 * Math.PI * 22 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <ArrowUp className="relative size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
