// Copy the manual's Markdown from a PRISM repo checkout into src/manual/ for the build.
// Usage: node scripts/sync-manual.js [--watch] [path to doc/manual]   (default: $PRISM_MANUAL or ../prism/doc/manual)
// Site-specific files in src/manual/ (manual.11tydata.js) are kept.
// With --watch, it doesn't copy everything, but keeps watching the manual and copies each file that changes
// (or removes it, if it's deleted), so that `eleventy --serve` rebuilds (see `npm run dev`). Files are only
// written if their contents differ, so saving a file unchanged, or touching it, causes no rebuild.

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const from = args.find((a) => !a.startsWith("--")) || process.env.PRISM_MANUAL || "../prism/doc/manual";
const to = "src/manual";
const KEEP = ["manual.11tydata.js"];

if (!fs.existsSync(path.join(from, "README.md"))) {
	console.error(`No manual found at ${from} (expected README.md there)`);
	process.exit(1);
}

if (!watch) {
	fs.mkdirSync(to, { recursive: true });
	for (const f of fs.readdirSync(to)) if (!KEEP.includes(f)) fs.rmSync(path.join(to, f), { recursive: true });
	fs.cpSync(from, to, { recursive: true });
	console.error(`Copied manual from ${from}`);
	process.exit(0);
}

// Editors' temporary and backup files (.x.swp, x~, .#x, 4913, ...) aren't part of the manual
const ignored = (rel) => rel.split(path.sep).some((p) => p.startsWith(".") || p.endsWith("~") || /^\d+$/.test(p))
	|| KEEP.includes(rel);

// Make src/manual/rel match the manual's rel: a file is copied if its contents differ,
// a folder is copied as a whole, and anything that no longer exists is removed
function update(rel) {
	const source = path.join(from, rel), target = path.join(to, rel);
	const stat = fs.statSync(source, { throwIfNoEntry: false });
	if (!stat) {
		if (fs.existsSync(target)) {
			fs.rmSync(target, { recursive: true, force: true });
			console.error(`Removed ${rel}`);
		}
	} else if (stat.isDirectory()) {
		fs.cpSync(source, target, { recursive: true });
	} else if (stat.isFile()) {
		const data = fs.readFileSync(source);
		if (fs.existsSync(target) && data.equals(fs.readFileSync(target))) return;
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, data);
		console.error(`Copied ${rel}`);
	}
}

// Changes are collected for a moment, since editors often write a file in several steps
const pending = new Set();
let timer;
fs.watch(from, { recursive: true }, (event, rel) => {
	if (!rel || ignored(rel)) return;
	pending.add(rel);
	clearTimeout(timer);
	timer = setTimeout(() => {
		for (const r of pending) {
			try { update(r); } catch (e) { console.error(`Couldn't update ${r}: ${e.message}`); }
		}
		pending.clear();
	}, 100);
});
console.error(`Watching ${from} for changes to the manual`);
