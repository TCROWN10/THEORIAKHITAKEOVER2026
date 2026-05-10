#!/usr/bin/env node
/**
 * Runs before npm dev/build/start (see package.json `pre*` scripts).
 * - Removes stale `.next` symlinks to old external `out-*` dirs
 * - Deletes `.next/lock` placeholder (Next also uses native flock; stale file can confuse retries)
 * - Optionally purges `node_modules/.cache` so Webpack/Next caches cannot reference old absolute paths
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { clearStaleNextLock, ensureLocalDotNext } from "./ensure-local-dot-next.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

ensureLocalDotNext(root);
clearStaleNextLock(root);

const skipCache =
  process.env.NEXT_PREP_NO_PURGE_CACHE === "1" ||
  process.env.NEXT_PREP_NO_PURGE_CACHE === "true";

if (!skipCache) {
  const cacheDir = path.join(root, "node_modules", ".cache");
  try {
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
  } catch {
    /* ignore */
  }
}
