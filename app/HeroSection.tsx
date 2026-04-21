"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";

/** Bold display serif for logo + hero names — weights 700–900 read strong at large sizes. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
const ui = DM_Sans({ subsets: ["latin"], weight: ["600", "700", "800"] });

const HERO_FRAMES = [
  { src: "/ARONN-0890.jpg", className: "scale-[1.45] object-[center_16%] sm:scale-[1.35] sm:object-[center_18%] md:scale-[1.1] md:object-[center_7%] lg:scale-[1.13] lg:object-[center_8%]" },
  { src: "/ARONN-0900.jpg", className: "scale-[1.42] object-[center_17%] sm:scale-[1.34] sm:object-[center_18%] md:scale-[1.1] md:object-[center_8%] lg:scale-[1.13] lg:object-[center_9%]" },
  { src: "/ARONN-0968.jpg", className: "scale-[1.4] object-[center_14%] sm:scale-[1.3] sm:object-[center_16%] md:scale-[1.08] md:object-[center_6%] lg:scale-[1.11] lg:object-[center_7%]" },
  { src: "/ARONN-0992.jpg", className: "scale-[1.46] object-[center_19%] sm:scale-[1.36] sm:object-[center_20%] md:scale-[1.12] md:object-[center_9%] lg:scale-[1.15] lg:object-[center_10%]" },
  { src: "/ARONN-1086.jpg", className: "scale-[1.43] object-[center_15%] sm:scale-[1.33] sm:object-[center_16%] md:scale-[1.09] md:object-[center_6%] lg:scale-[1.12] lg:object-[center_7%]" },
  { src: "/ARONN-1179.jpg", className: "scale-[1.44] object-[center_17%] sm:scale-[1.34] sm:object-[center_18%] md:scale-[1.1] md:object-[center_8%] lg:scale-[1.13] lg:object-[center_9%]" },
  { src: "/ARONN-1162.jpg", className: "scale-[1.45] object-[center_18%] sm:scale-[1.35] sm:object-[center_20%] md:scale-[1.11] md:object-[center_9%] lg:scale-[1.14] lg:object-[center_10%]" },
  { src: "/ARONN-1223.jpg", className: "scale-[1.43] object-[center_18%] sm:scale-[1.33] sm:object-[center_20%] md:scale-[1.1] md:object-[center_9%] lg:scale-[1.13] lg:object-[center_10%]" },
  { src: "/ARONN-1361.jpg", className: "scale-[1.42] object-[center_17%] sm:scale-[1.32] sm:object-[center_18%] md:scale-[1.09] md:object-[center_8%] lg:scale-[1.12] lg:object-[center_9%]" },
  { src: "/ARONN-1382.jpg", className: "scale-[1.45] object-[center_19%] sm:scale-[1.35] sm:object-[center_21%] md:scale-[1.11] md:object-[center_10%] lg:scale-[1.14] lg:object-[center_11%]" },
  { src: "/ARONN-1390.jpg", className: "scale-[1.44] object-[center_16%] sm:scale-[1.34] sm:object-[center_18%] md:scale-[1.1] md:object-[center_7%] lg:scale-[1.13] lg:object-[center_8%]" },
  { src: "/ARONN-1398.jpg", className: "scale-[1.43] object-[center_18%] sm:scale-[1.33] sm:object-[center_20%] md:scale-[1.1] md:object-[center_9%] lg:scale-[1.13] lg:object-[center_10%]" },
] as const;

/**
 * Each slide uses a different full-screen entrance on the same rotating photos.
 * Order cycles: rise (original) → circle iris → left → right → top → bottom.
 */
const HERO_ENTER_TRANSITIONS = [
  "hero-image-rise",
  "hero-image-circle",
  "hero-slide-left",
  "hero-slide-right",
  "hero-slide-top",
  "hero-slide-bottom",
] as const;

const HERO_ROTATE_MS = 6000;
/** Must be ≥ longest hero entrance animation (see globals.css) */
const HERO_TRANSITION_MS = 1250;

const HERO_IMAGE_BASE_CLASS = "origin-center object-cover";

const NAV_LINKS = [
  { href: "#", label: "Home" },
  { href: "#about-the-couple", label: "Our Story" },
  { href: "#events", label: "Events" },
  { href: "#gallery", label: "Gallery" },
  { href: "#dress-code", label: "Dress Code" },
  { href: "#gifts", label: "Gifts" },
  { href: "#rsvp", label: "RSVP" },
] as const;

/** Wide stroke “V” with the tip pointing down — reads clearly as a scroll-down cue. */
function ScrollDownV({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 10 L24 28 L42 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  );
}

export default function HeroSection() {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [incomingClass, setIncomingClass] = useState<string>(HERO_ENTER_TRANSITIONS[0]);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Incoming slide animates **on top** of the previous image so gaps never show the page background.
   * After the animation, the base layer updates and the overlay unmounts.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => {
        const next = (prev + 1) % HERO_FRAMES.length;
        const anim =
          HERO_ENTER_TRANSITIONS[next % HERO_ENTER_TRANSITIONS.length];
        setIncomingIndex(next);
        setIncomingClass(anim);
        if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = setTimeout(() => {
          setVisibleIndex(next);
          setIncomingIndex(null);
          revealTimeoutRef.current = null;
        }, HERO_TRANSITION_MS);
        return prev;
      });
    }, HERO_ROTATE_MS);
    return () => {
      clearInterval(interval);
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <section className={`relative flex min-h-screen flex-col bg-background ${ui.className}`}>
      {/* Top bar */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-pink-light/40 bg-background px-4 py-4 md:px-10 lg:px-14">
        <a href="#" className="group flex flex-col items-start gap-1">
          <div
            className={`${playfair.className} flex items-baseline gap-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-[1.85rem] lg:text-4xl`}
          >
            <span className="font-black">I</span>
            <span className="translate-y-px text-base font-black text-[#800000] sm:text-lg md:text-xl lg:text-2xl">
              &amp;
            </span>
            <span className="font-black">D</span>
          </div>
          <span
            className={`${playfair.className} text-[0.62rem] font-extrabold uppercase tracking-[0.32em] text-foreground sm:text-[0.68rem] md:text-xs`}
          >
            IDLoveStory
          </span>
        </a>

        <nav
          className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-foreground lg:flex lg:gap-x-7 lg:text-[0.7rem]"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.href === "#"
                  ? "text-pink transition-colors hover:text-pink-light"
                  : "transition-colors hover:text-pink"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-pink-light/60 text-foreground transition-colors hover:border-pink hover:bg-pink-light/30 lg:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </header>

      {/* Mobile / tablet slide-over nav */}
      <div
        id="mobile-nav-panel"
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu overlay"
        />
        <nav
          className={`absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between border-b border-pink-light/40 px-5 py-4">
            <span className={`${playfair.className} text-lg font-bold text-foreground`}>Menu</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-pink-light/40"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <MenuIcon open />
            </button>
          </div>
          <ul className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-pink-light/35 hover:text-pink"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Hero visual */}
      <div className="relative min-h-[calc(100dvh-5.5rem)] flex-1 overflow-hidden">
        {/* Rotating backgrounds — entrance cycles; overlay animates over previous photo (no white flash) */}
        <div className="absolute inset-0 bg-foreground/90">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={HERO_FRAMES[visibleIndex].src}
              alt=""
              fill
              className={`${HERO_IMAGE_BASE_CLASS} ${HERO_FRAMES[visibleIndex].className}`}
              sizes="100vw"
              priority={visibleIndex === 0}
            />
          </div>
          {incomingIndex !== null ? (
            <div
              key={`${incomingIndex}-${incomingClass}`}
              className={`absolute inset-0 z-[1] overflow-hidden ${incomingClass}`}
            >
              <Image
                src={HERO_FRAMES[incomingIndex].src}
                alt=""
                fill
                className={`${HERO_IMAGE_BASE_CLASS} ${HERO_FRAMES[incomingIndex].className}`}
                sizes="100vw"
              />
            </div>
          ) : null}
          {/* Light romantic wash — keeps photos bright; soft tint for text contrast */}
          <div
            className="absolute inset-0 z-10 bg-linear-to-b from-background/20 via-pink-soft/20 to-pink-soft/35"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-10 bg-linear-to-t from-foreground/30 via-transparent to-transparent"
            aria-hidden
          />
        </div>

        {/* Copy: main block centered; scroll CTA pinned toward bottom */}
        <div className="relative z-20 flex min-h-[calc(100dvh-5.5rem)] flex-col items-center px-5 pb-6 pt-8 text-center text-white md:px-8">
          <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-6">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] md:mb-6 md:text-base lg:text-lg">
              The Beginning of Always
            </p>

            <h1
              className={`${playfair.className} max-w-[100vw] whitespace-nowrap px-1 text-center font-black leading-none tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] text-[clamp(1.75rem,calc(0.75rem+4.2vw),7.25rem)]`}
            >
              Ibierebo <span className="font-black text-white/95">&amp;</span> Damilola
            </h1>

            {/* Divider with baroque motif */}
            <div className="my-9 w-full max-w-xl md:my-11">
              <svg
                className="h-9 w-full text-white drop-shadow-sm"
                viewBox="0 0 560 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M8 22H150"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path
                  d="M410 22H552"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.65"
                />
                <path
                  d="M150 22c18 0 20-10 32-10s14 10 42 10s30-10 42-10s14 10 32 10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M250 22.2c0-9 7.5-16.2 16.8-16.2c6 0 11.5 3.1 14.7 7.8c3.2-4.7 8.7-7.8 14.7-7.8c9.3 0 16.8 7.2 16.8 16.2c0 12-13.6 18.5-31.5 23.7c-17.9-5.2-31.5-11.7-31.5-23.7Z"
                  fill="currentColor"
                  opacity="0.18"
                />
                <path
                  d="M257 22.2c0-6.1 5.2-11.1 11.5-11.1c4.6 0 8.4 2.5 13.3 7.2c4.9-4.7 8.7-7.2 13.3-7.2c6.3 0 11.5 5 11.5 11.1c0 8.2-9.2 13.1-24.8 17.4c-15.6-4.3-24.8-9.2-24.8-17.4Z"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  fill="none"
                  opacity="0.95"
                />
                <path
                  d="M332 22c18 0 20-10 32-10s14 10 42 10s30-10 42-10s14 10 32 10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M208 22c0-5.6 4.7-10.1 10.6-10.1c3.4 0 6.5 1.6 8.5 4.2c2-2.6 5.1-4.2 8.5-4.2c5.9 0 10.6 4.5 10.6 10.1c0 6.7-7.5 10.7-19.1 14.1c-11.6-3.4-19.1-7.4-19.1-14.1Z"
                  stroke="currentColor"
                  strokeWidth="1.05"
                  opacity="0.9"
                />
                <path
                  d="M317 22c0-5.6 4.7-10.1 10.6-10.1c3.4 0 6.5 1.6 8.5 4.2c2-2.6 5.1-4.2 8.5-4.2c5.9 0 10.6 4.5 10.6 10.1c0 6.7-7.5 10.7-19.1 14.1c-11.6-3.4-19.1-7.4-19.1-14.1Z"
                  stroke="currentColor"
                  strokeWidth="1.05"
                  opacity="0.9"
                />
                <circle cx="282" cy="6.7" r="1.9" fill="currentColor" opacity="0.72" />
                <circle cx="227" cy="9.4" r="1.6" fill="currentColor" opacity="0.5" />
                <circle cx="337" cy="9.4" r="1.6" fill="currentColor" opacity="0.5" />
              </svg>
            </div>

            <p className="max-w-2xl text-base font-semibold leading-relaxed text-white drop-shadow-[0_1px_5px_rgba(0,0,0,0.38)] md:text-lg lg:text-xl">
              A perfect blend of love, faith, and friendship — building a future grounded in God,
              laughter, and shared dreams.
            </p>
          </div>

          <a
            href="#about-the-couple"
            className="mt-auto mb-4 flex flex-col items-center gap-0.5 text-white transition-opacity hover:opacity-95 md:mb-8 md:gap-1"
            aria-label="Scroll down to our story"
          >
            <span className="text-xs font-semibold uppercase leading-none tracking-[0.22em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:text-sm">
              Scroll
            </span>
            <span className="hero-scroll-arrow drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]" aria-hidden>
              <ScrollDownV className="h-6 w-9 md:h-7 md:w-10 lg:h-8 lg:w-11" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
