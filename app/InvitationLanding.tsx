"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { LANDING_RING_PHOTOS } from "@/lib/wedding-photos";
import { WEDDING_PLAY_AFTER_NAV_KEY } from "./WeddingAudioContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
const ui = DM_Sans({ subsets: ["latin"], weight: ["600", "700", "800"] });

const RING_STROKE = "#e8a0a8";

const RING_LIGHT_STOPS = [
  { offset: "0%", color: "#fbbf24" },
  { offset: "16%", color: "#f59e0b" },
  { offset: "32%", color: "#a3e635" },
  { offset: "48%", color: "#34d399" },
  { offset: "64%", color: "#22d3ee" },
  { offset: "80%", color: "#60a5fa" },
  { offset: "100%", color: "#6366f1" },
] as const;

const VIEWBOX = 480;
const VIEWBOX_CENTER = VIEWBOX / 2;

const RING_RADII = [236, 222, 208, 194, 182, 170] as const;

const RING_CONFIG = RING_RADII.map((radius, i) => ({
  radius,
  src: LANDING_RING_PHOTOS[i].src,
  alt: LANDING_RING_PHOTOS[i].alt,
}));

const RING_MAX = RING_CONFIG[0].radius;
const INNER_RING_RADIUS = RING_CONFIG[RING_CONFIG.length - 1].radius;
const RING_STROKE_WIDTH = 3.6;
const INNER_CONTENT_INSET = RING_STROKE_WIDTH + 8;
const INNER_CONTENT_RADIUS = INNER_RING_RADIUS - INNER_CONTENT_INSET;
const INNER_DISC_PCT = `${((2 * INNER_CONTENT_RADIUS) / VIEWBOX) * 100}%`;
const RING_STROKE_DASH = "22 58";
const RING_LIGHT_ARC = 16;
const RING_OPACITY = [0.96, 0.92, 0.88, 0.84, 0.8, 0.76] as const;

/** Portrait bubbles on rings — capped so they never cover the invite. */
function orbitBubbleSize(ringRadius: number): string {
  const t = ringRadius / RING_MAX;
  const minPx = 44 + 10 * t;
  const maxPx = 56 + 14 * t;
  return `clamp(${minPx}px, ${9 + 5 * t}vw, ${maxPx}px)`;
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
  const bubbleSide = orbitBubbleSize(ringRadius);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
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
        <div className="absolute left-1/2 top-0 z-[6] -translate-x-1/2 -translate-y-1/2">
          <div
            className={`relative shrink-0 overflow-hidden rounded-full border-[3px] bg-transparent shadow-md ${face}`}
            style={
              {
                width: bubbleSide,
                height: bubbleSide,
                minWidth: bubbleSide,
                minHeight: bubbleSide,
                maxWidth: bubbleSide,
                maxHeight: bubbleSide,
                borderColor: RING_STROKE,
                "--orbit-dur": `${durationSec}s`,
                animationDelay: delay,
              } as CSSProperties
            }
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="scale-110 object-cover"
              sizes="72px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function InvitationLanding() {
  return (
    <section
      className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#f5f5f0] px-2 py-10 sm:px-4 md:px-8 ${ui.className}`}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[min(92vw,1040px)] -translate-y-7 origin-center sm:max-w-[min(100vw,1040px)] sm:translate-y-0">
        <svg
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <linearGradient id="ring-rainbow-light" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="480" y2="480">
              {RING_LIGHT_STOPS.map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>

            <filter
              id="ring-light-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {RING_CONFIG.map((ring, i) => {
            const durationSec = 4 + i * 0.85;

            return (
              <g key={ring.radius}>
                <circle
                  cx={VIEWBOX_CENTER}
                  cy={VIEWBOX_CENTER}
                  r={ring.radius}
                  stroke={RING_STROKE}
                  strokeWidth={RING_STROKE_WIDTH}
                  strokeDasharray={RING_STROKE_DASH}
                  strokeLinecap="round"
                  opacity={RING_OPACITY[i] * 0.55}
                />
                <circle
                  cx={VIEWBOX_CENTER}
                  cy={VIEWBOX_CENTER}
                  r={ring.radius}
                  pathLength={100}
                  stroke="url(#ring-rainbow-light)"
                  strokeWidth={RING_STROKE_WIDTH + 1.8}
                  strokeDasharray={`${RING_LIGHT_ARC} ${100 - RING_LIGHT_ARC}`}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#ring-light-glow)"
                  opacity={0.98}
                  className={`landing-ring-light-beam${i % 2 === 1 ? " landing-ring-light-beam--reverse" : ""}`}
                  style={
                    {
                      "--ring-dur": `${durationSec}s`,
                      animationDelay: `${i * 0.2}s`,
                    } as CSSProperties
                  }
                />
                <circle
                  cx={VIEWBOX_CENTER}
                  cy={VIEWBOX_CENTER}
                  r={ring.radius}
                  pathLength={100}
                  stroke="url(#ring-rainbow-light)"
                  strokeWidth={RING_STROKE_WIDTH + 1.2}
                  strokeDasharray={`${RING_LIGHT_ARC * 0.72} ${100 - RING_LIGHT_ARC * 0.72}`}
                  strokeDashoffset={0}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#ring-light-glow)"
                  opacity={0.72}
                  className={`landing-ring-light-beam landing-ring-light-beam--soft${i % 2 === 1 ? " landing-ring-light-beam--reverse" : ""}`}
                  style={
                    {
                      "--ring-dur": `${durationSec * 1.1}s`,
                      animationDelay: `${i * 0.2 + durationSec * 0.45}s`,
                    } as CSSProperties
                  }
                />
              </g>
            );
          })}
        </svg>

        {ORBIT_BY_RING.map((orbit) => (
          <OrbitPhotoBubble key={orbit.ringRadius} {...orbit} />
        ))}

        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="flex min-w-0 flex-col items-center justify-center px-[7%] py-[6%] text-center md:px-[5%]"
            style={{ width: INNER_DISC_PCT, maxWidth: INNER_DISC_PCT }}
          >
            <h1
              className={`${playfair.className} text-balance font-black leading-tight tracking-tight text-foreground text-[clamp(1.35rem,calc(0.85rem+3.8vw),2.85rem)]`}
            >
              Motunrayo <span className="font-black text-foreground/90">&amp;</span> Thomson
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
              className="mt-5 inline-flex min-h-10 w-auto shrink-0 items-center justify-center self-center whitespace-nowrap rounded-full border-2 border-[#e85d6f] bg-[#fce4e8] px-4 py-2 text-sm font-semibold tracking-wide text-foreground shadow-sm transition-colors hover:bg-[#f8d0d8] md:mt-6 md:px-5 md:py-2.5"
            >
              Open Invitation
            </Link>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-2 max-w-sm rounded-xl border border-[#e85d6f]/45 bg-[#fce4e8]/90 px-4 py-3 text-center shadow-sm sm:mt-4"
        role="note"
      >
        <p className="text-sm font-bold tracking-wide text-[#c44556]">
          No Access Card — No Entry
        </p>
        <p className="mt-1 text-xs font-semibold text-foreground/75">
        Kindly contact the organizer for your access card.
        </p>
        <p className="mt-1 text-xs font-semibold text-foreground/75">
          Thank you
        </p>
      </div>
    </section>
  );
}
