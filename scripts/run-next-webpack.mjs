#!/usr/bin/env node
/**
 * Next.js 16 defaults to Turbopack for `next dev`. Environment variables can force Turbopack
 * even when you pass `--webpack`, which mixes outputs and breaks `.next` (ENOENT on
 * build-manifest, `[turbopack]_runtime.js` missing from webpack builds, etc.).
 *
 * This runner:
 * - Sanitizes env so no `TURBOPACK*` variable is set (otherwise Next looks for Turbopack
 *   manifest paths and throws ENOENT under webpack output).
 * - Sets `IS_WEBPACK_TEST` (Next’s internal switch) so `parseBundlerArgs` always picks Webpack
 *   even if the shell had `TURBOPACK=1` from an IDE or profile (after we delete it)
 *
 * Use `npm run dev` / `npm run build` only — bare `next dev` omits `--webpack` and can leave
 * `.next` half-built (missing routes-manifest / per-route build-manifest). If that happens:
 * `npm run clean` then `npm run dev`, or rely on the dev runner clearing `.next` each start
 * (set `NEXT_DEV_NO_CLEAR=1` to skip that and restart faster once stable).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import {
  clearStaleNextLock,
  ensureLocalDotNext,
  resetDotNextBeforeDev,
} from "./ensure-local-dot-next.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

if (!fs.existsSync(nextBin)) {
  console.error("Next.js CLI not found at", nextBin);
  process.exit(1);
}

const nextSubcommand = process.argv[2];
if (nextSubcommand === "dev") {
  resetDotNextBeforeDev(root);
} else {
  ensureLocalDotNext(root);
}

clearStaleNextLock(root);

const env = { ...process.env };
delete env.NEXT_SAFE_DIST_DIR;
delete env.DIST_DIR;

/** Any truthy `TURBOPACK` env makes Next use Turbopack manifest paths → ENOENT under webpack `.next` (see `route-module.js`). */
for (const key of Object.keys(env)) {
  if (key === "TURBOPACK" || key === "IS_TURBOPACK_TEST" || key.startsWith("TURBOPACK")) {
    delete env[key];
  }
}

/** Forces Webpack in `next/dist/lib/bundler.js` `parseBundlerArgs` — stable dev/build with --webpack */
env.IS_WEBPACK_TEST = "1";

const args = process.argv.slice(2);
const child = spawn(process.execPath, [nextBin, ...args], {
  cwd: root,
  env,
  stdio: "inherit",
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
