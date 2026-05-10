#!/usr/bin/env node
/**
 * Older setups symlinked `.next` → `.../damilola-wedding-invitation-next/out-*`.
 * Next then `lstat`s files on the target path; if that folder is gone or half-cleaned → ENOENT.
 *
 * A real `.next` directory in the project is required; never a symlink to an external distDir.
 *
 * Mixed Turbopack/Webpack or interrupted writes leave **stale per-route build-manifest.json**
 * paths (~/.next/server/app/..., server/pages/_app/...) → ENOENT. `resetDotNextBeforeDev`
 * clears output before `next dev` so the first compile repopulates everything consistently.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Only removes a bad symlink to an external `out-*` dir — safe for `build` / `start`.
 * @param {string} projectRootResolved
 */
export function ensureLocalDotNext(projectRootResolved) {
  const dotNext = path.join(projectRootResolved, ".next");
  try {
    if (!fs.existsSync(dotNext)) return;
    if (!fs.lstatSync(dotNext).isSymbolicLink()) return;
    fs.unlinkSync(dotNext);
    console.warn(
      "[next] Removed stale `.next` symlink (build output must stay inside this project). If errors persist, run `npm run clean` then `npm run dev`."
    );
  } catch (e) {
    console.warn("[next] ensure-local-dot-next:", e instanceof Error ? e.message : e);
  }
}

/**
 * Full wipe of `.next` before dev — avoids missing `build-manifest.json` after bundler mixing.
 * Skip with `NEXT_DEV_NO_CLEAR=1` (faster restarts; use only when dev is already stable).
 * @param {string} projectRootResolved
 */
export function resetDotNextBeforeDev(projectRootResolved) {
  if (
    process.env.NEXT_DEV_NO_CLEAR === "1" ||
    process.env.NEXT_DEV_NO_CLEAR === "true"
  ) {
    ensureLocalDotNext(projectRootResolved);
    return;
  }

  const dotNext = path.join(projectRootResolved, ".next");
  try {
    if (!fs.existsSync(dotNext)) return;
    if (fs.lstatSync(dotNext).isSymbolicLink()) {
      fs.unlinkSync(dotNext);
    } else {
      fs.rmSync(dotNext, { recursive: true, force: true });
    }
    console.warn(
      "[next] Cleared `.next` for a clean dev session (avoids stale or mixed Turbopack/Webpack output). Set NEXT_DEV_NO_CLEAR=1 to skip."
    );
  } catch (e) {
    console.warn("[next] resetDotNextBeforeDev:", e instanceof Error ? e.message : e);
  }
}

export function clearStaleNextLock(projectRootResolved) {
  try {
    const lock = path.join(projectRootResolved, ".next", "lock");
    if (fs.existsSync(lock)) {
      fs.rmSync(lock, { force: true });
    }
  } catch {
    /* ignore */
  }
}

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const selfPath = fileURLToPath(import.meta.url);
const invokedAs = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedAs && invokedAs === path.resolve(selfPath)) {
  ensureLocalDotNext(root);
}
