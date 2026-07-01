"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BACK_TO_TOP_IMAGE = "/DAV_9054-Edit.jpeg";

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
        "back-to-top-float fixed right-5 bottom-5 z-40 h-12 w-12 overflow-hidden rounded-full border border-white/70 shadow-lg",
        "transition-all duration-300 ease-out md:right-7 md:bottom-7",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-3 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <span className="relative block h-full w-full">
        <Image
          src={BACK_TO_TOP_IMAGE}
          alt=""
          fill
          className="object-cover object-top"
          sizes="48px"
        />
      </span>
    </button>
  );
}
