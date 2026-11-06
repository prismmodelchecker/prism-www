// Copy the manual's Markdown from a PRISM repo checkout into src/manual/ for the build.
// Usage: node scripts/sync-manual.js [path to doc/manual]   (default: $PRISM_MANUAL or ../prism/doc/manual)
// Site-specific files in src/manual/ (manual.11tydata.js) are kept.

import fs from "node:fs";
import path from "node:path";

const from = process.argv[2] || process.env.PRISM_MANUAL || "../prism/doc/manual";
const to = "src/manual";
const KEEP = ["manual.11tydata.js"];

if (!fs.existsSync(path.join(from, "README.md"))) {
	console.error(`No manual found at ${from} (expected README.md there)`);
	process.exit(1);
}
fs.mkdirSync(to, { recursive: true });
for (const f of fs.readdirSync(to)) if (!KEEP.includes(f)) fs.rmSync(path.join(to, f), { recursive: true });
fs.cpSync(from, to, { recursive: true });
console.error(`Copied manual from ${from}`);
