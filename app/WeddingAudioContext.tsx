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

export const WEDDING_AUDIO_SRC = "/Tjan_-_Your_Smile_47vibez.net.mp3";

/** Set from the landing page CTA so playback can start on `/celebration` (same user gesture chain). */
export const WEDDING_PLAY_AFTER_NAV_KEY = "weddingPlayAfterNav";

type WeddingAudioContextValue = {
  tryPlay: () => Promise<void>;
  needsUserPlay: boolean;
  /** True only after the guest clicked Open Invitation on the landing page. */
  musicEnabled: boolean;
};

const WeddingAudioContext = createContext<WeddingAudioContextValue | null>(null);

export function useWeddingAudio() {
  const ctx = useContext(WeddingAudioContext);
  if (!ctx) {
    throw new Error("useWeddingAudio must be used within WeddingAudioProvider");
  }
  return ctx;
}

/** Shared audio for `/celebration` only — stays paused until Open Invitation is clicked. */
export function WeddingAudioProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const isLanding = pathname === "/";

  const tryPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return Promise.resolve();
    el.loop = true;
    return el.play().then(
      () => setNeedsUserPlay(false),
      () => {
        setNeedsUserPlay(true);
      },
    );
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
      setMusicEnabled(false);
      setNeedsUserPlay(false);
      return;
    }

    let unlocked = false;
    try {
      unlocked = sessionStorage.getItem(WEDDING_PLAY_AFTER_NAV_KEY) === "1";
      if (unlocked) {
        sessionStorage.removeItem(WEDDING_PLAY_AFTER_NAV_KEY);
      }
    } catch {
      /* storage blocked */
    }

    if (!unlocked) {
      el.pause();
      setMusicEnabled(false);
      setNeedsUserPlay(false);
      return;
    }

    setMusicEnabled(true);

    const attempt = () =>
      tryPlay().catch(() => {
        setNeedsUserPlay(true);
      });

    attempt();
    const t1 = setTimeout(attempt, 150);
    const t2 = setTimeout(attempt, 600);

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
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [isLanding, tryPlay]);

  const value: WeddingAudioContextValue = { tryPlay, needsUserPlay, musicEnabled };

  return (
    <WeddingAudioContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={WEDDING_AUDIO_SRC}
        loop
        preload="metadata"
        aria-hidden
        onError={() => {
          setNeedsUserPlay(false);
          setMusicEnabled(false);
        }}
      />
      {children}
    </WeddingAudioContext.Provider>
  );
}
