"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { HERO_PHOTOS, HERO_PORTRAITS } from "@/lib/wedding-photos";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
const ui = DM_Sans({ subsets: ["latin"], weight: ["600", "700", "800"] });

const HERO_IMAGE_BASE_CLASS = "origin-center object-cover";

const HERO_FRAMES = HERO_PHOTOS.map((photo) => ({
  src: photo.src,
  objectPosition: photo.objectPosition,
}));

const HERO_ENTER_TRANSITIONS = [
  "hero-image-rise",
  "hero-image-circle",
  "hero-slide-left",
  "hero-slide-right",
  "hero-slide-top",
  "hero-slide-bottom",
] as const;

const HERO_ROTATE_MS = 6000;
const HERO_TRANSITION_MS = 1250;

function HeroPortrait({
  src,
  alt,
  objectPosition,
}: {
  src: string;
  alt: string;
  objectPosition: string;
}) {
  return (
    <div
      className="relative h-[clamp(3.5rem,11vw,7.5rem)] w-[clamp(3.5rem,11vw,7.5rem)] shrink-0 overflow-hidden rounded-full border-2 border-white/80 shadow-[0_8px_28px_rgba(0,0,0,0.5)] ring-2 ring-[#D4AF37]/50"
      aria-hidden={alt === ""}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition }}
        sizes="(max-width: 768px) 18vw, 120px"
      />
    </div>
  );
}

const NAV_LINKS = [
  { href: "/celebration", label: "Home" },
  { href: "/celebration#about-the-couple", label: "Our Story" },
  { href: "/celebration#events", label: "Events" },
  { href: "/celebration#gallery", label: "Gallery" },
  { href: "/celebration#dress-code", label: "Dress Code" },
  { href: "/celebration#gifts", label: "Gifts" },
  { href: "/celebration#rsvp", label: "RSVP" },
] as const;

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

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prev) => {
        const next = (prev + 1) % HERO_FRAMES.length;
        const anim = HERO_ENTER_TRANSITIONS[next % HERO_ENTER_TRANSITIONS.length];
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
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-pink-light/40 bg-background px-4 py-4 md:px-10 lg:px-14">
        <a href="/celebration" className="group flex flex-col items-start gap-1">
          <div
            className={`${playfair.className} flex items-baseline gap-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-[1.85rem] lg:text-4xl`}
          >
            <span className="font-black">M</span>
            <span className="translate-y-px text-base font-black text-[#800000] sm:text-lg md:text-xl lg:text-2xl">
              &amp;
            </span>
            <span className="font-black">T</span>
          </div>
          <span
            className={`${playfair.className} text-[0.62rem] font-extrabold uppercase tracking-[0.32em] text-foreground sm:text-[0.68rem] md:text-xs`}
          >
            #TheOriakhiTakeover2026
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
                link.href === "/celebration"
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

      <div className="relative min-h-[calc(100dvh-5.5rem)] flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-foreground/90">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={HERO_FRAMES[visibleIndex].src}
              alt=""
              fill
              className={HERO_IMAGE_BASE_CLASS}
              style={{ objectPosition: HERO_FRAMES[visibleIndex].objectPosition }}
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
                className={HERO_IMAGE_BASE_CLASS}
                style={{ objectPosition: HERO_FRAMES[incomingIndex].objectPosition }}
                sizes="100vw"
              />
            </div>
          ) : null}
          <div
            className="absolute inset-0 z-10 bg-linear-to-b from-background/20 via-pink-soft/20 to-pink-soft/35"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-10 bg-linear-to-t from-foreground/30 via-transparent to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-20 flex min-h-[calc(100dvh-5.5rem)] flex-col items-center px-5 pb-6 pt-8 text-center text-white md:px-8">
          <div className="flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-6">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)] md:mb-6 md:text-base lg:text-lg">
              The Beginning of Always
            </p>

            <div className="flex w-full max-w-[min(100vw,58rem)] items-center justify-center gap-2 sm:gap-4 md:gap-7">
              <HeroPortrait
                src={HERO_PORTRAITS.bride.src}
                alt={HERO_PORTRAITS.bride.alt}
                objectPosition={HERO_PORTRAITS.bride.objectPosition}
              />

              <h1
                className={`${playfair.className} min-w-0 flex-1 text-center font-black leading-none tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] text-[clamp(1.35rem,calc(0.55rem+3.8vw),6.5rem)]`}
              >
                Motunrayo <span className="font-black text-white/95">&amp;</span> Thomson
              </h1>

              <HeroPortrait
                src={HERO_PORTRAITS.groom.src}
                alt={HERO_PORTRAITS.groom.alt}
                objectPosition={HERO_PORTRAITS.groom.objectPosition}
              />
            </div>

            <div className="my-9 w-full max-w-xl md:my-11">
              <svg
                className="h-9 w-full text-[#D4AF37] drop-shadow-sm"
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
            href="/celebration#about-the-couple"
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
