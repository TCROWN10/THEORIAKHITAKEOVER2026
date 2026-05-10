#!/usr/bin/env node
/**
 * Legacy external output path (used only by `clean-turbopack.mjs` to remove old `out-*` dirs).
 * Do not symlink `.next` here — it breaks Next's `require("next/...")` from compiled server chunks.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

/**
 * @param {string} projectRootResolved - absolute path to project root
 * @param {{ ensureDir?: boolean }} [opts]
 * @returns {string | null} absolute dist path, or null → use `.next`
 */
export function getSafeDistDir(projectRootResolved, { ensureDir = false } = {}) {
  /** Do not use CI here — many machines set `CI=true` globally and would force a real `.next` under the apostrophe path and break Next. */
  if (process.env.VERCEL === "1" || process.env.NEXT_USE_PROJECT_DOT_NEXT === "1") {
    return null;
  }
  const id = createHash("sha256").update(projectRootResolved).digest("hex").slice(0, 14);
  const dir = path.resolve(
    projectRootResolved,
    "..",
    "..",
    "damilola-wedding-invitation-next",
    `out-${id}`
  );
  if (!path.isAbsolute(dir)) {
    return null;
  }
  if (ensureDir) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      /* non-fatal */
    }
  }
  return dir;
}
