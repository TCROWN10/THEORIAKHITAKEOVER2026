"use client";

import { useEffect, useState } from "react";
import { WEDDING_COUNTDOWN_UTC } from "@/lib/wedding-calendar";

const WEDDING_DATE = WEDDING_COUNTDOWN_UTC;

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer() {
  const [diff, setDiff] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date();
      const d = WEDDING_DATE.getTime() - now.getTime();
      if (d <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff({
        days: Math.floor(d / (1000 * 60 * 60 * 24)),
        hours: Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((d % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((d % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 sm:gap-3">
            <div
              className="countdown-attention w-16 sm:w-24 rounded-xl bg-white/80 shadow-sm py-4 px-2 flex flex-col items-center"
              style={{ animationDelay: `${i * 140}ms` }}
            >
              <span className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">--</span>
              <span className="text-pink text-xs sm:text-sm font-light tracking-widest uppercase mt-1">
                {label}
              </span>
            </div>
            {i < 3 && <span className="text-text-muted/50 text-xl">·</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {[
        { value: diff.days, label: "DAYS" },
        { value: diff.hours, label: "HOURS" },
        { value: diff.minutes, label: "MINUTES" },
        { value: diff.seconds, label: "SECONDS" },
      ].map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div
            className="countdown-attention w-16 sm:w-24 rounded-xl bg-white/80 shadow-sm py-4 px-2 flex flex-col items-center"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <span className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              {label === "DAYS" ? value : pad(value)}
            </span>
            <span className="text-pink text-xs sm:text-sm font-light tracking-widest uppercase mt-1">
              {label}
            </span>
          </div>
          {i < 3 && <span className="text-text-muted/50 text-xl">·</span>}
        </div>
      ))}
    </div>
  );
}
