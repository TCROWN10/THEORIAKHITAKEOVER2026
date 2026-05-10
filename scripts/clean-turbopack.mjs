#!/usr/bin/env node
/**
 * Turbopack/Webpack mixing or interrupted writes leave output inconsistent (ENOENT on
 * build-manifest.json, missing `[turbopack]_runtime.js`, etc.).
 * Also removes the external distDir used when the project path contains problematic characters.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getSafeDistDir } from "./safe-dist-dir.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const externalDist = getSafeDistDir(root);
/** Leftovers when distDir was joined incorrectly — must not sit in the repo root */
const mistaken = [path.join(root, "Users"), path.join(root, "var")];
const targets = [
  path.join(root, ".next"),
  ...(externalDist ? [externalDist] : []),
  ...mistaken,
  path.join(root, "node_modules", ".cache"),
  path.join(root, ".turbo"),
  path.join(root, "out"),
];

for (const dir of targets) {
  try {
    const dotNext = path.join(root, ".next");
    if (dir === dotNext) {
      if (fs.existsSync(dotNext) && fs.lstatSync(dotNext).isSymbolicLink()) {
        fs.unlinkSync(dotNext);
        console.log("removed:", path.relative(root, dotNext), "(symlink)");
        continue;
      }
      const lock = path.join(dotNext, "lock");
      if (fs.existsSync(lock)) {
        fs.rmSync(lock, { force: true });
        console.log("removed:", path.relative(root, lock));
      }
    }
    fs.rmSync(dir, { recursive: true, force: true });
    console.log("removed:", path.relative(root, dir) || dir);
  } catch (e) {
    console.warn("skip:", dir, e instanceof Error ? e.message : e);
  }
}

console.log("Cache clean done.");
