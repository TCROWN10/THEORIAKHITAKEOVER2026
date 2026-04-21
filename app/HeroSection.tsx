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

const HERO_IMAGES = [
  "/ARONN-0890.jpg",
  "/ARONN-0900.jpg",
  "/ARONN-0968.jpg",
  "/ARONN-0992.jpg",
  "/ARONN-1086.jpg",
  "/ARONN-1179.jpg",
  "/ARONN-1162.jpg",
  "/ARONN-1223.jpg",
  "/ARONN-1361.jpg",
  "/ARONN-1382.jpg",
  "/ARONN-1390.jpg",
  "/ARONN-1398.jpg",
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

const HERO_IMAGE_CLASS =
  "origin-center scale-[1.38] object-cover object-[center_18%] sm:scale-[1.32] sm:object-[center_20%] md:object-[center_19%]";

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
        const next = (prev + 1) % HERO_IMAGES.length;
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
    <section className={`relative flex min-h-screen flex-col bg-white ${ui.className}`}>
      {/* Top bar */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-pink-light/40 bg-white px-4 py-4 md:px-10 lg:px-14">
        <a href="#" className="group flex flex-col items-start gap-1">
          <div
            className={`${playfair.className} flex items-baseline gap-1 text-2xl font-black tracking-tight text-[#16161c] sm:text-3xl md:text-[1.85rem] lg:text-4xl`}
          >
            <span className="font-black">I</span>
            <span className="translate-y-px text-base font-black text-[#9e4a5c] sm:text-lg md:text-xl lg:text-2xl">
              &amp;
            </span>
            <span className="font-black">D</span>
          </div>
          <span
            className={`${playfair.className} text-[0.62rem] font-extrabold uppercase tracking-[0.32em] text-[#2a2a32] sm:text-[0.68rem] md:text-xs`}
          >
            IDLoveStory
          </span>
        </a>

        <nav
          className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3a3a44] lg:flex lg:gap-x-7 lg:text-[0.7rem]"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.href === "#"
                  ? "text-[#b76e79] transition-colors hover:text-[#8b4d5c]"
                  : "transition-colors hover:text-[#b76e79]"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-pink-light/60 text-[#3a3a44] transition-colors hover:border-pink hover:bg-pink-light/30 lg:hidden"
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
          className={`absolute right-0 top-0 flex h-full w-[min(20rem,88vw)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between border-b border-pink-light/40 px-5 py-4">
            <span className={`${playfair.className} text-lg font-bold text-[#16161c]`}>Menu</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#3a3a44] hover:bg-pink-light/40"
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
                  className="block rounded-xl px-4 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#3a3a44] transition-colors hover:bg-pink-light/35 hover:text-[#b76e79]"
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
        <div className="absolute inset-0 bg-[#2a2220]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={HERO_IMAGES[visibleIndex]}
              alt=""
              fill
              className={HERO_IMAGE_CLASS}
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
                src={HERO_IMAGES[incomingIndex]}
                alt=""
                fill
                className={HERO_IMAGE_CLASS}
                sizes="100vw"
              />
            </div>
          ) : null}
          {/* Light romantic wash — keeps photos bright; soft tint for text contrast */}
          <div
            className="absolute inset-0 z-10 bg-linear-to-b from-[#fff8fa]/45 via-[#f5d4dc]/28 to-[#d9a8b8]/38"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-10 bg-linear-to-t from-[#6b4a58]/25 via-transparent to-transparent"
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

            {/* Divider with flourish */}
            <div className="my-9 flex w-full max-w-lg items-center justify-center gap-4 md:my-11 lg:max-w-xl">
              <span className="h-0.5 flex-1 bg-white/60" aria-hidden />
              <svg
                className="h-5 w-12 shrink-0 text-white drop-shadow-sm md:h-6 md:w-14"
                viewBox="0 0 40 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 8 Q10 2 20 8 T38 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="h-0.5 flex-1 bg-white/60" aria-hidden />
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
