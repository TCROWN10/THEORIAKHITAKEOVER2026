"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { WEDDING_PLAY_AFTER_NAV_KEY } from "./WeddingAudioContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
const ui = DM_Sans({ subsets: ["latin"], weight: ["600", "700", "800"] });

const RING_STROKE = "#e8a0a8";

/** ViewBox side length — must match the landing hero SVG `viewBox` (larger canvas = bigger rings on screen). */
const VIEWBOX = 480;
const VIEWBOX_CENTER = VIEWBOX / 2;

/**
 * Six concentric rings — **480** artboard, outer near the edge, uniform **23** px radial step,
 * inner **121** for a large center disk. Heavier stroke + dashes at this scale.
 */
const RING_CONFIG = [
  { radius: 236, src: "/ARONN-1223.jpg", alt: "Damilola" },
  { radius: 213, src: "/ARONN-1390.jpg", alt: "Ibierebo" },
  { radius: 190, src: "/ARONN-0968.jpg", alt: "Together" },
  { radius: 167, src: "/ARONN-0890.jpg", alt: "Wedding moment" },
  { radius: 144, src: "/ARONN-1179.jpg", alt: "Joy" },
  { radius: 121, src: "/ARONN-1382.jpg", alt: "Celebration" },
] as const;

const RING_MAX = RING_CONFIG[0].radius;
const RING_STROKE_WIDTH = 3.6;
const RING_STROKE_DASH = "22 58";

/** One orbit per dashed ring: path diameter matches ring; wider ring → larger portrait bubble. */
function bubbleSideClamp(ringRadius: number): string {
  const t = ringRadius / RING_MAX;
  const minRem = 1.9 + 1.55 * t;
  const vmax = 6 + 10.5 * t;
  const maxRem = 2.85 + 2.55 * t;
  return `clamp(${minRem.toFixed(2)}rem, ${vmax.toFixed(1)}vmin, ${maxRem.toFixed(2)}rem)`;
}

function OrbitPhotoBubble({
  src,
  alt,
  ringRadius,
  durationSec,
  clockwise,
  phaseDelaySec,
}: {
  src: string;
  alt: string;
  ringRadius: number;
  durationSec: number;
  clockwise: boolean;
  phaseDelaySec: number;
}) {
  const spin = clockwise ? "hero-orbit-spin-cw" : "hero-orbit-spin-ccw";
  const face = clockwise ? "hero-orbit-face-cw" : "hero-orbit-face-ccw";
  const diameterPct = `${((2 * ringRadius) / VIEWBOX) * 100}%`;
  const delay = `-${phaseDelaySec.toFixed(2)}s`;
  const bubbleSide = bubbleSideClamp(ringRadius);
  const imgSizes =
    ringRadius >= 200 ? "120px" : ringRadius >= 150 ? "96px" : ringRadius >= 120 ? "80px" : "56px";

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-5 -translate-x-1/2 -translate-y-1/2"
      style={{ width: diameterPct, height: diameterPct }}
    >
      <div
        className={`relative h-full w-full rounded-full ${spin}`}
        style={
          {
            "--orbit-dur": `${durationSec}s`,
            animationDelay: delay,
          } as CSSProperties
        }
      >
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative overflow-hidden rounded-full border-[3px] bg-white shadow-md ${face}`}
            style={
              {
                width: bubbleSide,
                height: bubbleSide,
                borderColor: RING_STROKE,
                "--orbit-dur": `${durationSec}s`,
                animationDelay: delay,
              } as CSSProperties
            }
          >
            <Image src={src} alt={alt} fill className="object-cover" sizes={imgSizes} />
          </div>
        </div>
      </div>
    </div>
  );
}

const RING_OPACITY = [0.96, 0.92, 0.88, 0.84, 0.8, 0.76] as const;

const ORBIT_BY_RING = RING_CONFIG.map((ring, i) => {
  const durationSec = 36 - (i % 4) * 2 + (i === 0 ? 4 : 0);
  return {
    ringRadius: ring.radius,
    src: ring.src,
    alt: ring.alt,
    durationSec,
    clockwise: i % 2 === 0,
    phaseDelaySec: (i * durationSec) / 6,
  };
});

/** Landing gate only — no site header; full invitation lives at `/celebration`. */
export default function InvitationLanding() {
  return (
    <section
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#f5f2f3] px-2 py-10 sm:px-4 md:px-8 ${ui.className}`}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[min(100vw,1040px)]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {RING_CONFIG.map((ring, i) => (
            <circle
              key={ring.radius}
              cx={VIEWBOX_CENTER}
              cy={VIEWBOX_CENTER}
              r={ring.radius}
              stroke={RING_STROKE}
              strokeWidth={RING_STROKE_WIDTH}
              strokeDasharray={RING_STROKE_DASH}
              strokeLinecap="round"
              opacity={RING_OPACITY[i]}
            />
          ))}
        </svg>

        {ORBIT_BY_RING.map((orbit) => (
          <OrbitPhotoBubble key={orbit.ringRadius} {...orbit} />
        ))}

        <div className="absolute inset-0 z-10 flex items-center justify-center p-5 sm:p-7">
          <div className="flex max-w-[min(94%,18.5rem)] flex-col items-center justify-center text-center sm:max-w-[min(90%,20rem)]">
            <p className="text-[0.72rem] font-semibold uppercase leading-snug tracking-[0.22em] text-foreground/85 md:text-xs">
              You are invited to the wedding of
            </p>
            <h1
              className={`${playfair.className} mt-3 text-balance font-black leading-tight tracking-tight text-foreground text-[clamp(1.5rem,calc(0.75rem+4vw),2.85rem)]`}
            >
              Ibierebo <span className="font-black text-foreground/90">&amp;</span> Damilola
            </h1>
            <Link
              href="/celebration"
              onClick={() => {
                try {
                  sessionStorage.setItem(WEDDING_PLAY_AFTER_NAV_KEY, "1");
                } catch {
                  /* private mode */
                }
              }}
              className="mt-5 inline-flex w-auto shrink-0 self-center rounded-full border-2 border-[#e85d6f] bg-[#fce4e8] px-6 py-2.5 text-sm font-semibold tracking-wide text-foreground shadow-sm transition-colors hover:bg-[#f8d0d8] md:mt-6 md:px-7 md:py-3 md:text-base"
            >
              Open Invitation
              <span className="ml-1.5 inline-block" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
