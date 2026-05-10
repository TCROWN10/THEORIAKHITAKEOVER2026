import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

function getProjectRoot(): string {
  try {
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    return process.cwd();
  }
}

const projectRoot = getProjectRoot();

/**
 * Only register `turbopack.root` when actually using Turbopack (`npm run dev:turbo` sets
 * `TURBOPACK=1`). If this block is always present while you run `next dev --webpack`, Next can
 * treat the project as Turbopack-backed and look for per-route manifests under
 * `server/pages/_app`, `server/app/.../build-manifest.json`, etc. → ENOENT.
 */
const useTurbopackRoot =
  process.env.TURBOPACK === "1" || process.env.TURBOPACK === "true";

/**
 * Keep output in `./.next` under this repo. Moving `distDir` outside the project breaks
 * server `require("next/...")` resolution. If Next misbehaves because of `'` in a parent folder
 * name, clone or rename the folder so the path has no apostrophe (e.g. `Simi-friend-Invite`).
 */
const nextConfig: NextConfig = {
  /**
   * Monorepo / stray lockfiles: Next inferred `/Users/.../package-lock.json` as workspace root.
   * Pin tracing to this app so dev/build stay consistent.
   */
  outputFileTracingRoot: projectRoot,

  reactStrictMode: true,
  distDir: ".next",

  /**
   * Disable Turbopack's persistent dev filesystem cache (RocksDB .sst files). Corrupted caches
   * cause Rust panics like "Unable to open static sorted file … .sst". Only affects `next dev`
   * when using Turbopack (`npm run dev:turbo`); Webpack dev ignores this.
   *
   * `isolatedDevBuild` defaults to true in Next 16 and puts dev artifacts under `.next/dev/`.
   * If that folder is deleted mid-run or caches desync, you can get ENOENT on
   * `routes-manifest.json`. Using the classic `.next/` layout avoids that class of bugs.
   */
  experimental: {
    turbopackFileSystemCacheForDev: false,
    isolatedDevBuild: false,
  },

  /** Avoid native optimizer issues on some machines / deployments (local files still serve from /public). */
  images: {
    unoptimized: true,
  },

  /** Pin Turbopack root only when Turbopack runs (`npm run dev:turbo`). */
  ...(useTurbopackRoot
    ? {
        turbopack: {
          root: projectRoot,
        },
      }
    : {}),
};

export default nextConfig;
