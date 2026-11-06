// Folders of downloadable files (example models, logs, ...) that have no page of their own.
// The old server showed automatic directory listings for these; listing.njk makes a page for each.

import fs from "node:fs";
import path from "node:path";

const ROOT = "src";
const SKIP_DIRS = new Set(["css", "js", "images", "manual", "bibitem", "design", "search"]);

function walk(dir, out) {
	const entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true });
	const names = entries.map((e) => e.name);
	const hasIndex = names.some((n) => /^index\.(njk|md|html)$/.test(n))
		|| [".njk", ".md"].some((ext) => fs.existsSync(path.join(ROOT, dir + ext))); // a page at the same URL, e.g. games/examples.md
	const files = entries.filter((e) => e.isFile() && !e.name.startsWith(".") && !/\.(njk|md)$/.test(e.name))
		.map((e) => ({ name: e.name, size: fs.statSync(path.join(ROOT, dir, e.name)).size }));
	const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
	if (dir && !hasIndex && (files.length || dirs.length)) out.push({ dir, files, dirs });
	for (const d of dirs) {
		if (d.startsWith("_") || d.startsWith(".") || (!dir && SKIP_DIRS.has(d))) continue;
		walk(dir ? `${dir}/${d}` : d, out);
	}
}

export default function () {
	const out = [];
	walk("", out);
	return out;
}
