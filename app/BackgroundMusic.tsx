"use client";

import { useCallback } from "react";
import { useWeddingAudio } from "./WeddingAudioContext";

export default function BackgroundMusic() {
  const { tryPlay, needsUserPlay } = useWeddingAudio();

  const handleButtonPlay = useCallback(() => {
    tryPlay().catch(() => {});
  }, [tryPlay]);

  return needsUserPlay ? (
    <button
      type="button"
      onClick={handleButtonPlay}
      className="fixed bottom-6 left-6 z-[100] rounded-full border border-pink/60 bg-background/95 px-5 py-2.5 text-sm font-light text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-pink-light/40"
    >
      Tap to play music ♪
    </button>
  ) : null;
}
