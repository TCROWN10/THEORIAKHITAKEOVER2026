"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Great_Vibes, DM_Sans } from "next/font/google";

const script = Great_Vibes({ subsets: ["latin"], weight: "400" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

/** Portrait picks — swap paths anytime for dedicated groom/bride shots. */
const GROOM_IMAGE = "/ARONN-1223.jpg";
const BRIDE_IMAGE = "/ARONN-1390.jpg";

function SectionDivider() {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-sm items-center justify-center gap-3 md:mb-10">
      <span className="h-px flex-1 bg-accent-green/70" aria-hidden />
      <svg
        className="h-4 w-10 shrink-0 text-accent-green"
        viewBox="0 0 40 12"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 6h32M20 2v8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="6" r="2" fill="currentColor" opacity="0.35" />
      </svg>
      <span className="h-px flex-1 bg-accent-green/70" aria-hidden />
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

    const showIfInView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const margin = vh * 0.15;
      if (r.bottom > margin && r.top < vh - margin) {
        setVisible(true);
        return true;
      }
      return false;
    };

    if (showIfInView()) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05, rootMargin: "0px 0px 10% 0px" }
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
function AboutImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex w-full justify-center">
      <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgba(45,45,45,0.25)] md:max-w-none">
        <div className="relative aspect-[3/4] w-full md:aspect-[4/5]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-[center_20%]"
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
      className={`relative z-10 scroll-mt-24 bg-white py-12 md:py-16 ${body.className}`}
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <h2
          className={`${script.className} text-center text-[2.1rem] leading-none text-[#9d3d72] sm:text-[2.35rem] md:text-[2.55rem]`}
        >
          About the Couple
        </h2>
        <SectionDivider />

        {/* Row 1 — image left, letter right */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:items-start md:gap-10 lg:gap-12">
          <div className="self-start">
            <RevealOnScroll from="left">
              <AboutImage src={GROOM_IMAGE} alt="Whyte Ibierebo Sunjuye" />
            </RevealOnScroll>
          </div>
          <div className="min-w-0 self-start text-left">
            <h3
              className={`${script.className} mb-1 text-[1.85rem] leading-tight text-[#9d3d72] sm:text-[2rem] md:text-[2.15rem]`}
            >
              Whyte Ibierebo Sunjuye
            </h3>
            <p className="mb-0 text-base font-bold leading-tight text-foreground">
              To my darling woman,
            </p>
            <div className="mt-1 space-y-1 text-base leading-snug text-[#2d2d2d]">
              <p>
                <span className="font-semibold text-foreground">The</span> one I have chosen to spend
                my entire life with… <br /> Words will never truly be enough to express how <br /> much you mean to
                me. My love for you goes beyond <br /> What i can say it is something I feel deeply every
                Single day.
              </p>
              <p>
                I am endlessly grateful to have you by my side. <br /> Loving you has been one of the
                greatest <br /> blessings of my life, and I am so certain, so happy,<br /> and so at peace knowing
                that I get to do forever with you. <br />You don&apos;t just complete me, you bring light,
                meaning, <br /> and joy into every part of my life. <br /> With you, everything feels right,
                everything feels whole.
              </p>
              <p>
                You are not just my other half…you are my answered prayer, my safe place, my best
                friend, and my forever after. I promise to love you, stand by you, grow with you, and
                choose you over and over again for the rest of my life.
              </p>
              <p className="font-medium text-foreground">Forever yours. 💕</p>
            </div>
          </div>
        </div>

        {/* Row 2 — letter left, image right (image first on small screens) */}
        <div className="mt-14 grid grid-cols-1 items-start gap-8 md:mt-20 md:grid-cols-2 md:items-start md:gap-10 lg:gap-12">
          <div className="order-2 min-w-0 self-start text-left md:order-1">
            <h3
              className={`${script.className} mb-1 text-[1.85rem] leading-tight text-[#9d3d72] sm:text-[2rem] md:text-[2.15rem]`}
            >
              Damilola Daniel Adeleye
            </h3>
            <p className="mb-0 text-base font-bold leading-tight text-foreground">
              My dearest Man,
            </p>
            <div className="mt-1 space-y-1 text-base leading-snug text-[#2d2d2d]">
              <p>
                <span className="font-semibold text-foreground">Loving</span> you has been the most
                beautiful part of my life. <br /> You bring me peace, joy, and a kind of happiness <br /> I never knew
                I needed.
              </p>
              <p>
                Every day with you feels like a blessing,<br /> and I can&apos;t wait to spend forever by your
                side.<br /> You are my greatest gift. With you,<br /> I have found love, friendship, and a home.
                <br />Choosing you is the easiest <br /> decision I&apos;ve ever made, <br />and I look forward to a
                lifetime of <br /> loving you more each day.
              </p>
              <p className="font-medium text-foreground">I love you every second❤️</p>
            </div>
          </div>
          <div className="order-1 self-start md:order-2">
            <RevealOnScroll from="right">
              <AboutImage src={BRIDE_IMAGE} alt="Damilola Daniel Adeleye" />
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
