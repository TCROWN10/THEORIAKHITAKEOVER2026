"use client";

import { useEffect, useState } from "react";

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={[
        "back-to-top-float fixed right-5 bottom-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 text-white shadow-lg",
        "bg-cover bg-center bg-no-repeat",
        "transition-all duration-300 ease-out md:right-7 md:bottom-7",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-3 opacity-0 pointer-events-none",
      ].join(" ")}
      style={{ backgroundImage: "linear-gradient(rgba(31,42,68,0.24), rgba(31,42,68,0.24)), url('/icon.png')" }}
    >
      <ChevronUpIcon className="h-5 w-5" />
    </button>
  );
}
