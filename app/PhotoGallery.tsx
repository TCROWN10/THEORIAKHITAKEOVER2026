"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * One unique `caption` per `src` (hover overlay). Change only the string next to each `src`.
 */
const GALLERY_SOURCE = [
  { src: "/ARONN-0890.jpg", caption: "The day our eyes said what words hadn’t yet learned to say." },
  { src: "/ARONN-0900.jpg", caption: "Laughter like this: proof that hearts can dance out loud." },
  { src: "/ARONN-0968.jpg", caption: "Sun on our faces, peace in our souls—grateful for this chapter." },
  { src: "/ARONN-0992.jpg", caption: "Side by side, step by step—my favourite journey starts with you." },
  { src: "/ARONN-1086.jpg", caption: "A quiet moment where forever stopped rushing and simply stayed." },
  { src: "/ARONN-1162.jpg", caption: "Wrapped in light, held by love—this is our kind of holy." },
  { src: "/ARONN-1179.jpg", caption: "Your smile still does that thing to my heart—every single time." },
  { src: "/ARONN-1223.jpg", caption: "Two stories became one—and the plot keeps getting sweeter." },
  { src: "/ARONN-1361.jpg", caption: "Small frames, giant joy—thank God for ordinary days with you." },
  { src: "/ARONN-1382.jpg", caption: "Dressed in grace, anchored in love—walking into forever together." },
  { src: "/ARONN-1390.jpg", caption: "If home is a person, I’ve already found mine in you." },
  { src: "/ARONN-1398.jpg", caption: "This happiness? Ours. This promise? Sealed with a soft amen." },
] as const;

export type GalleryItem = { src: string; caption: string; key: string };

export const GALLERY_ITEMS = GALLERY_SOURCE;

const ITEMS_PER_VIEW = 8;
const ROTATE_INTERVAL_MS = 11000;
const TRANSITION_DURATION_MS = 1400;
/** In spotlight mode the grid stays 2×4; each tick shifts the window by one; every cell runs the roll animation. */
const SPOTLIGHT_INTERVAL_MS = 8500;
/** Delay between each cell’s roll starting (top-left → … → bottom-right, row by row). */
const ROLL_STAGGER_MS = 220;

type ViewMode = "grid" | "spotlight";

function getPageSlice(
  items: readonly { src: string; caption: string }[],
  pageIdx: number,
  perView: number,
): GalleryItem[] {
  const pageCount = Math.max(1, Math.ceil(items.length / perView));
  const safePage = ((pageIdx % pageCount) + pageCount) % pageCount;
  const start = safePage * perView;
  return Array.from({ length: perView }, (_, i) => {
    const item = items[(start + i) % items.length];
    return { ...item, key: `${item.src}-${start + i}` };
  });
}

function galleryDownloadFileName(src: string) {
  const base = src.split("/").pop();
  return base && base.length > 0 ? base : "wedding-photo.jpg";
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="m7 12 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function downloadGalleryImage(imageSrc: string, fileName: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const absolute = imageSrc.startsWith("http")
    ? imageSrc
    : `${origin}${imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`}`;

  fetch(absolute)
    .then((res) => {
      if (!res.ok) throw new Error("fetch failed");
      return res.blob();
    })
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      const a = document.createElement("a");
      a.href = absolute;
      a.download = fileName;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
}

function GalleryImage({ src, caption }: { src: string; caption: string }) {
  const [error, setError] = useState(false);
  const handleError = useCallback(() => setError(true), []);
  const fileName = useMemo(() => galleryDownloadFileName(src), [src]);

  const onDownload = useCallback(() => {
    downloadGalleryImage(src, fileName);
  }, [src, fileName]);

  return (
    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg border-2 border-foreground/10 bg-foreground/10 group">
      {error ? (
        <div
          className="absolute inset-0 bg-pink-light/30 flex items-center justify-center p-3"
          aria-hidden
        >
          <p className="text-foreground/60 text-sm sm:text-base text-center font-serif leading-snug">
            Add your photo to{" "}
            <code className="text-xs sm:text-sm bg-white/50 px-1 rounded">public/</code>
          </p>
        </div>
      ) : (
        <>
          <Image
            src={src}
            alt={caption}
            fill
            loading="eager"
            className="object-cover transition-transform duration-1000 ease-out motion-reduce:transition-none sm:group-hover:scale-105"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 22vw"
            onError={handleError}
          />
          <button
            type="button"
            onClick={onDownload}
            className="absolute top-2 right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            aria-label={`Download photo (${fileName})`}
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
          {/* Caption only on hover (sm+); hidden on small phones — download icon always visible */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/35 to-transparent opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
            <p className="gallery-caption-text max-w-[95%] px-4 pb-6 text-center font-serif text-base italic leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-lg md:text-xl">
              {caption}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function GalleryGrid({
  items,
  rollKey,
}: {
  items: GalleryItem[];
  /** When set, each cell rolls in sequence (staggered) when this value changes. */
  rollKey?: number;
}) {
  return (
    <ul
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 list-none p-0 m-0 w-full h-full bg-transparent"
      role="list"
    >
      {items.map((item, idx) => (
        <li key={item.key} className="min-w-0">
          {rollKey !== undefined ? (
            <div
              key={`${rollKey}-${item.key}`}
              className="gallery-spotlight-roll origin-center will-change-transform"
              style={{ animationDelay: `${idx * ROLL_STAGGER_MS}ms` }}
            >
              <GalleryImage src={item.src} caption={item.caption} />
            </div>
          ) : (
            <GalleryImage src={item.src} caption={item.caption} />
          )}
        </li>
      ))}
    </ul>
  );
}

function getSpotlightWindowItems(
  items: readonly { src: string; caption: string }[],
  start: number,
  count: number,
): GalleryItem[] {
  const n = items.length;
  return Array.from({ length: count }, (_, k) => {
    const i = (start + k) % n;
    const item = items[i];
    return {
      src: item.src,
      caption: item.caption,
      key: `spotlight-${start}-${k}-${i}`,
    };
  });
}

export default function PhotoGallery() {
  const items = GALLERY_ITEMS;
  const [mode, setMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(0);
  const [overlayPage, setOverlayPage] = useState<number | null>(null);
  const [swapping, setSwapping] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const pageRef = useRef(0);
  const busyRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_VIEW));

  const baseItems = useMemo(
    () => getPageSlice(items, page, ITEMS_PER_VIEW),
    [items, page],
  );

  const overlayItems = useMemo(() => {
    if (overlayPage === null) return null;
    return getPageSlice(items, overlayPage, ITEMS_PER_VIEW);
  }, [items, overlayPage]);

  const spotlightGridItems = useMemo(
    () => getSpotlightWindowItems(items, spotlightIndex, ITEMS_PER_VIEW),
    [items, spotlightIndex],
  );

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const enterSpotlight = useCallback(() => {
    setOverlayPage(null);
    setSwapping(false);
    busyRef.current = false;
    setSpotlightIndex(0);
    setMode("spotlight");
  }, []);

  /** One full grid fits on screen: hold the grid, then move into the spotlight sequence. */
  useEffect(() => {
    if (mode !== "grid") return;
    if (items.length > ITEMS_PER_VIEW) return;

    const t = setTimeout(enterSpotlight, ROTATE_INTERVAL_MS);

    return () => clearTimeout(t);
  }, [mode, items.length, enterSpotlight]);

  /** Multi-page grid: advance pages on a timer; after a full cycle (last → first), open spotlight. */
  useEffect(() => {
    if (mode !== "grid") return;
    if (items.length <= ITEMS_PER_VIEW) return;

    const runTransition = () => {
      if (busyRef.current) return;
      const current = pageRef.current;
      const next = (current + 1) % pageCount;

      busyRef.current = true;
      setOverlayPage(next);
      setSwapping(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSwapping(true);
        });
      });

      transitionTimeoutRef.current = setTimeout(() => {
        setPage(next);
        pageRef.current = next;
        setSwapping(false);
        setOverlayPage(null);
        busyRef.current = false;
        transitionTimeoutRef.current = null;

        if (current === pageCount - 1 && next === 0) {
          setSpotlightIndex(0);
          setMode("spotlight");
        }
      }, TRANSITION_DURATION_MS);
    };

    const timer = setInterval(runTransition, ROTATE_INTERVAL_MS);
    return () => {
      clearInterval(timer);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [mode, items.length, pageCount, enterSpotlight]);

  /** Spotlight: rolling entrance; interval SPOTLIGHT_INTERVAL_MS per step; then back to the grid. */
  useEffect(() => {
    if (mode !== "spotlight") return;

    const id = setInterval(() => {
      setSpotlightIndex((prev) => {
        if (prev >= items.length - 1) {
          setMode("grid");
          setPage(0);
          pageRef.current = 0;
          return 0;
        }
        return prev + 1;
      });
    }, SPOTLIGHT_INTERVAL_MS);

    return () => clearInterval(id);
  }, [mode, items.length]);

  const swapClasses =
    "transition-opacity ease-in-out motion-reduce:transition-none";
  const durationClass = "duration-[1400ms]";

  return (
    <div className="w-full">
      {mode === "grid" ? (
        <div className="relative w-full overflow-hidden rounded-xl bg-foreground/10">
          <div className="relative z-0">
            <GalleryGrid items={baseItems} />
          </div>

          {overlayPage !== null && overlayItems ? (
            <div
              className={`pointer-events-none absolute inset-0 z-10 ${swapClasses} ${durationClass} ${
                swapping ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            >
              <GalleryGrid items={overlayItems} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-xl bg-foreground/10">
          <GalleryGrid items={spotlightGridItems} rollKey={spotlightIndex} />
        </div>
      )}
    </div>
  );
}
