// Build the self-contained copy of the manual (index.html plus files/) from a PRISM doc/manual folder,
// for the manual/ folder of PRISM distributions, built from the given folder (so from the PRISM version
// being built, not the site's). The site doesn't publish it: this is the only way it's built.
// Usage: node scripts/manual-offline.js <doc/manual> <output folder> [version]
// (run from anywhere; the output folder is replaced; version defaults to the latest release)

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const [from, to, version] = process.argv.slice(2);
if (!from || !to) {
	console.error("Usage: node scripts/manual-offline.js <doc/manual> <output folder> [version]");
	process.exit(1);
}
// (relative to where it was run from, also via npm run, which runs it in this repo)
const cwd = process.env.INIT_CWD || process.cwd();
const manual = path.resolve(cwd, from);
const out = path.resolve(cwd, to);
process.chdir(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

// (this checkout's own copy of the manual, in src/manual, is put back afterwards)
const saved = fs.mkdtempSync(path.join(os.tmpdir(), "prism-manual-src-"));
fs.cpSync("src/manual", saved, { recursive: true });
const env = { ...process.env, MANUAL_ONLY: "1", ...(version && { MANUAL_VERSION: version }) };
const site = fs.mkdtempSync(path.join(os.tmpdir(), "prism-manual-"));
try {
	execFileSync(process.execPath, ["scripts/sync-manual.js", manual], { stdio: "inherit" });
	// (the command line, as its --output overrides the config's output folder)
	execFileSync(process.execPath, ["node_modules/@11ty/eleventy/cmd.cjs", "--quiet", `--output=${site}`], { stdio: "inherit", env });
	fs.rmSync(out, { recursive: true, force: true });
	fs.cpSync(path.join(site, "manual/offline"), out, { recursive: true });
	console.error(`Wrote ${out}`);
} finally {
	fs.rmSync("src/manual", { recursive: true, force: true });
	fs.cpSync(saved, "src/manual", { recursive: true });
	for (const d of [site, saved]) fs.rmSync(d, { recursive: true, force: true });
}
