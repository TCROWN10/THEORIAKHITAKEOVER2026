"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Great_Vibes, DM_Sans, Poppins } from "next/font/google";

const script = Great_Vibes({ subsets: ["latin"], weight: "400" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const letter = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

import { ABOUT_BRIDE_IMAGE, GROOM_PORTRAIT } from "@/lib/wedding-photos";

/** Portrait picks — swap paths in `lib/wedding-photos.ts`. */
const GROOM_IMAGE = GROOM_PORTRAIT;
const BRIDE_IMAGE = ABOUT_BRIDE_IMAGE;

function SectionDivider() {
  return (
    <div className="mx-auto mb-8 w-full max-w-md md:mb-10" aria-hidden>
      <svg
        className="h-8 w-full text-[#D4AF37]"
        viewBox="0 0 420 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 21H120"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M300 21H412"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />

        <path
          d="M120 21c18 0 20-13 38-13s20 13 52 13s34-13 52-13s20 13 38 13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M185 20.5c0-7.5 6.4-13.5 14.2-13.5c5.2 0 9.8 2.6 12.3 6.6c2.5-4 7.1-6.6 12.3-6.6C231.6 7 238 13 238 20.5c0 10.2-11.4 15.8-26.5 20.2c-15.1-4.4-26.5-10-26.5-20.2Z"
          fill="currentColor"
          opacity="0.22"
        />
        <path
          d="M191.5 20.5c0-5.4 4.5-9.8 10.1-9.8c4.1 0 7.5 2.2 9.9 5.7c2.4-3.5 5.8-5.7 9.9-5.7c5.6 0 10.1 4.4 10.1 9.8c0 7.3-8.1 11.7-20 15.4c-11.9-3.7-20-8.1-20-15.4Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.9"
        />

        <circle cx="158" cy="8.5" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="265" cy="8.5" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="211.5" cy="5.7" r="1.7" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

/** Wraps content so it fades and slides in when the section enters the viewport. */
function RevealOnScroll({
  from,
  children,
}: {
  from: "left" | "right";
  children: ReactNode;
}) {
  const { ref, visible } = useRevealOnScroll();
  const hidden =
    from === "left"
      ? "-translate-x-8 translate-y-3 opacity-0 sm:-translate-x-10"
      : "translate-x-8 translate-y-3 opacity-0 sm:translate-x-10";
  const shown = "translate-x-0 translate-y-0 opacity-100";

  return (
    <div
      ref={ref}
      className={`w-full transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? shown : hidden
      }`}
    >
      {children}
    </div>
  );
}

/** Portrait — fills its grid column (zigzag layout). */
function AboutImage({
  src,
  alt,
  objectPosition = "center 20%",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgba(45,45,45,0.25)] md:max-w-none">
        <div className="relative aspect-[3/4] w-full md:aspect-[4/5]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            style={{ objectPosition }}
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </div>
    </div>
  );
}

export default function AboutTheCouple() {
  return (
    <section
      id="about-the-couple"
      className={`relative z-10 scroll-mt-24 bg-background py-12 md:py-16 ${body.className}`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2
          className={`${script.className} text-center text-[2.45rem] leading-none text-[#800000] sm:text-[2.8rem] md:text-[3.1rem]`}
        >
          About the Couple
        </h2>
        <SectionDivider />

        {/* Row 1 — groom image left, groom's letter right */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:items-start md:gap-10 lg:gap-12">
          <div className="self-start">
            <RevealOnScroll from="left">
              <AboutImage src={GROOM_IMAGE} alt="Thomson ORIAKHI" />
            </RevealOnScroll>
          </div>
          <div className="min-w-0 self-start text-left">
            <RevealOnScroll from="right">
              <h3
                className={`${script.className} mb-1 text-[2rem] font-bold leading-tight text-[#800000] sm:text-[2.3rem] md:text-[2.6rem]`}
              >
                Thomson ORIAKHI
              </h3>
              <p className="mb-0 text-base font-bold leading-tight text-foreground">
                To my forever,
              </p>
              <div className={`${letter.className} mt-1 space-y-3 text-[0.84rem] leading-snug text-foreground`}>
                <p>
                  Today I thank God for the blessing of having you in my life. You&apos;ve brought
                  happiness, wealth, strength and courage into my world. I&apos;m honored to become
                  your husband. When I see you I see my half — how can I live without my half? You in
                  my life brings completeness.
                </p>
                <p>
                  I promise to love you forever through every season of life. I promise to respect
                  you and support you until you fully become the woman you&apos;ve always desired to
                  become. I bless God for this wonderful union.
                </p>
                <p className="font-medium text-foreground">
                  Ecclesiastes 4:9, 12 — I love you forever, to my forever. ❤️
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Row 2 — bride's letter left, bride image right */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 md:mt-20 md:grid-cols-2 md:items-start md:gap-10 lg:gap-12">
          <div className="order-2 min-w-0 self-start text-left md:order-1">
            <RevealOnScroll from="left">
              <h3
                className={`${script.className} mb-1 text-[2rem] font-bold leading-tight text-[#800000] sm:text-[2.3rem] md:text-[2.6rem]`}
              >
                Gbadamosi Motunrayo
              </h3>
              <p className="mb-0 text-base font-bold leading-tight text-foreground">
                My love 😍 oko mi,
              </p>
              <div className={`${letter.className} mt-1 space-y-3 text-[0.84rem] leading-snug text-foreground`}>
                <p>
                  Loving you has been the most beautiful part of my life. You have filled my days
                  with peace, joy, and a happiness I never knew I needed. With you, I have found not
                  only love but also my best friend, my safe place, and my greatest blessing.
                </p>
                <p>
                  Choosing you is the easiest decision I have ever made, and I would choose you
                  again and again without hesitation. You make me feel cherished, understood, and
                  deeply loved.
                </p>
                <p>
                  As we look forward to forever, I promise to love you faithfully, stand by your
                  side through every season, and cherish every moment we share. My love for you grows
                  stronger every day, and I cannot wait to spend a lifetime making beautiful
                  memories with you.
                </p>
                <p className="font-medium text-foreground">
                  You are my forever, my always, and the love of my life. ❤️✨
                </p>
              </div>
            </RevealOnScroll>
          </div>
          <div className="order-1 self-start md:order-2">
            <RevealOnScroll from="right">
              <AboutImage
                src={BRIDE_IMAGE}
                alt="Gbadamosi Motunrayo"
                objectPosition="32% 18%"
              />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
