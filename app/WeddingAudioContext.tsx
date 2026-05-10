"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const WEDDING_AUDIO_SRC = "/Morenikeji%20-%20Konstant.mp3";

/** Set from the landing page CTA so playback can start on `/celebration` (same user gesture chain). */
export const WEDDING_PLAY_AFTER_NAV_KEY = "weddingPlayAfterNav";

type WeddingAudioContextValue = {
  tryPlay: () => Promise<void>;
  needsUserPlay: boolean;
};

const WeddingAudioContext = createContext<WeddingAudioContextValue | null>(null);

export function useWeddingAudio() {
  const ctx = useContext(WeddingAudioContext);
  if (!ctx) {
    throw new Error("useWeddingAudio must be used within WeddingAudioProvider");
  }
  return ctx;
}

/** Shared audio for `/celebration` only — stays paused on `/` (landing gate). */
export function WeddingAudioProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const isLanding = pathname === "/";

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
    return () => {
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isLanding) {
      el.pause();
      setNeedsUserPlay(false);
      return;
    }

    const attempt = () =>
      tryPlay().catch(() => {
        setNeedsUserPlay(true);
      });

    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(WEDDING_PLAY_AFTER_NAV_KEY) === "1") {
        sessionStorage.removeItem(WEDDING_PLAY_AFTER_NAV_KEY);
        void tryPlay().catch(() => setNeedsUserPlay(true));
      }
    } catch {
      /* storage blocked */
    }

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

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [isLanding, tryPlay]);

  const value: WeddingAudioContextValue = { tryPlay, needsUserPlay };

  return (
    <WeddingAudioContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={WEDDING_AUDIO_SRC}
        loop
        preload="auto"
        playsInline
        aria-hidden
      />
      {children}
    </WeddingAudioContext.Provider>
  );
}
