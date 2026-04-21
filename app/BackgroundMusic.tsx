"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/Savy_Henry_-_The_Best_Part_Vistanaij.com_.ng_.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);

  const tryPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return Promise.resolve();
    el.loop = true;
    return el.play().then(() => setNeedsUserPlay(false));
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.loop = true;
    el.volume = 0.75;

    const onEnded = () => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.play().catch(() => {});
    };

    el.addEventListener("ended", onEnded);

    /** Browsers often block autoplay without a gesture — retry + unlock on first interaction. */
    const attempt = () =>
      tryPlay().catch(() => {
        setNeedsUserPlay(true);
      });

    attempt();
    const t1 = setTimeout(attempt, 150);
    const t2 = setTimeout(attempt, 600);
    const t3 = setTimeout(attempt, 1500);

    const unlock = () => {
      attempt();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);

    const onVis = () => {
      if (!document.hidden) attempt();
    };
    document.addEventListener("visibilitychange", onVis);

    attempt();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      el.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [tryPlay]);

  const handleButtonPlay = useCallback(() => {
    tryPlay().catch(() => {});
  }, [tryPlay]);

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        playsInline
        autoPlay
        aria-hidden
      />
      {needsUserPlay ? (
        <button
          type="button"
          onClick={handleButtonPlay}
          className="fixed bottom-6 left-6 z-[100] rounded-full border border-pink/60 bg-background/95 px-5 py-2.5 text-sm font-light text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-pink-light/40"
        >
          Tap to play music ♪
        </button>
      ) : null}
    </>
  );
}
