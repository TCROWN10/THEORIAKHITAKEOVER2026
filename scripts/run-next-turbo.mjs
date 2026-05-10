#!/usr/bin/env node
/**
 * Explicit Turbopack dev — clears Webpack test flags so `parseBundlerArgs` does not
 * throw "Multiple bundler flags set".
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { clearStaleNextLock, resetDotNextBeforeDev } from "./ensure-local-dot-next.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

if (!fs.existsSync(nextBin)) {
  console.error("Next.js CLI not found at", nextBin);
  process.exit(1);
}

resetDotNextBeforeDev(root);

clearStaleNextLock(root);

const env = { ...process.env };
delete env.NEXT_SAFE_DIST_DIR;
delete env.DIST_DIR;

delete env.IS_WEBPACK_TEST;
env.TURBOPACK = "1";

const port = process.env.PORT || "3001";
const extra = process.argv.slice(2);
const defaultArgs = ["dev", "-H", "0.0.0.0", "-p", port];
const nextArgs = extra.length > 0 ? ["dev", ...extra] : defaultArgs;

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: root,
  env,
  stdio: "inherit",
  windowsHide: true,
});

child.on("exit", (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
