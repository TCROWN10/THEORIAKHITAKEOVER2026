/** Celebration hero + photo gallery (includes newly added gallery shots). */
export const GALLERY_PHOTOS = [
  "/DAV_8915-Edited.jpeg",
  "/DAV_8932edit.jpeg",
  "/DAV_8964edited.jpeg",
  "/DAV_8970-Edit.jpeg",
  "/DAV_8989-Edit.jpeg",
  "/DAV_9003-Edit.jpeg",
  "/DAV_9011edit.jpeg",
  "/DAV_9017-Edit.jpeg",
  "/DAV_9054-Edit.jpeg",
  "/DAV_9065-Edit.jpeg",
  "/DAV_9070edit.jpeg",
  "/DAV_9102x.jpeg",
  "/DAV_9121x.jpeg",
] as const;

export type GalleryPhotoSrc = (typeof GALLERY_PHOTOS)[number];

/** @deprecated Use GALLERY_PHOTOS — kept for existing imports */
export const WEDDING_PHOTOS = GALLERY_PHOTOS;
export type WeddingPhotoSrc = GalleryPhotoSrc;

export const GROOM_PORTRAIT: GalleryPhotoSrc = "/DAV_9065-Edit.jpeg";
export const BRIDE_PORTRAIT: GalleryPhotoSrc = "/DAV_8989-Edit.jpeg";
/** About the Couple — bride letter section (studio portrait). */
export const ABOUT_BRIDE_IMAGE: GalleryPhotoSrc = "/DAV_8932edit.jpeg";
export const SITE_ICON: GalleryPhotoSrc = "/DAV_8989-Edit.jpeg";

/** Hero background slideshow — face-forward shots with tuned crop anchors. */
export const HERO_PHOTOS = [
  { src: "/DAV_8989-Edit.jpeg", objectPosition: "50% 18%" },
  { src: "/DAV_9017-Edit.jpeg", objectPosition: "50% 28%" },
  { src: "/DAV_9054-Edit.jpeg", objectPosition: "50% 16%" },
  { src: "/DAV_9121x.jpeg", objectPosition: "50% 30%" },
  { src: "/DAV_9102x.jpeg", objectPosition: "50% 24%" },
  { src: "/DAV_9003-Edit.jpeg", objectPosition: "50% 20%" },
] as const;

/** Circular portraits beside the hero title. */
export const HERO_PORTRAITS = {
  bride: {
    src: BRIDE_PORTRAIT,
    alt: "Motunrayo",
    objectPosition: "50% 10%",
  },
  groom: {
    src: GROOM_PORTRAIT,
    alt: "Thomson",
    objectPosition: "50% 12%",
  },
} as const;

/**
 * Landing page orbit rings only — separate from gallery.
 * Do not add gallery-only photos here.
 */
export const LANDING_RING_PHOTOS = [
  { src: "/DAV_9065-Edit.jpeg", alt: "Thomson" },
  { src: "/DAV_8989-Edit.jpeg", alt: "Motunrayo" },
  { src: "/DAV_9121x.jpeg", alt: "Together" },
  { src: "/DAV_8970-Edit.jpeg", alt: "Wedding moment" },
  { src: "/DAV_9054-Edit.jpeg", alt: "Joy" },
  { src: "/DAV_8964edited.jpeg", alt: "Celebration" },
] as const;

/** Gallery captions — one per photo, same order as `GALLERY_PHOTOS`. */
export const GALLERY_CAPTIONS: readonly string[] = [
  "Every glance between us writes another line of our love story.",
  "Held close, hearts aligned—this is the joy we prayed for.",
  "Golden moments like these remind us how blessed we are.",
  "In your arms, the world feels softer and forever feels real.",
  "The day our eyes said what words hadn’t yet learned to say.",
  "Laughter like this: proof that hearts can dance out loud.",
  "Sun on our faces, peace in our souls—grateful for this chapter.",
  "Side by side, step by step—my favourite journey starts with you.",
  "A quiet moment where forever stopped rushing and simply stayed.",
  "Wrapped in light, held by love—this is our kind of holy.",
  "Your smile still does that thing to my heart—every single time.",
  "Two stories became one—and the plot keeps getting sweeter.",
  "This happiness? Ours. This promise? Sealed with a soft amen.",
];
