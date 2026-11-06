// Check internal links and images in the built site (_site/): every href/src to a site path must
// exist, and #anchors must exist on the target page. External links aren't checked.
// Usage: node scripts/check-links.js [--by-target]

import fs from "node:fs";
import path from "node:path";

const SITE = "_site";
const byTarget = process.argv.includes("--by-target");

const pages = [];
(function walk(d) {
	for (const f of fs.readdirSync(d)) {
		const p = path.join(d, f);
		if (fs.statSync(p).isDirectory()) walk(p);
		else if (f.endsWith(".html")) pages.push(p);
	}
})(SITE);

const ids = new Map();
function idsOf(file) {
	if (!ids.has(file)) {
		const html = fs.readFileSync(file, "utf8");
		ids.set(file, new Set([...html.matchAll(/\b(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
	}
	return ids.get(file);
}

function target(url) {
	let p = decodeURIComponent(url.split(/[?#]/)[0]);
	let file = path.join(SITE, p);
	if (p.endsWith("/")) file = path.join(file, "index.html");
	else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
	return file;
}

const broken = new Map(); // url -> [pages]
let links = 0;
for (const page of pages) {
	const html = fs.readFileSync(page, "utf8");
	const from = "/" + path.relative(SITE, page).replace(/index\.html$/, "");
	for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
		const url = m[1].replace(/&amp;/g, "&");
		if (url.length > 1 && url.startsWith("#")) {
			links++;
			if (!idsOf(page).has(decodeURIComponent(url.slice(1)))) {
				const problem = `${from}${url}`;
				if (!broken.has(problem)) broken.set(problem, []);
				broken.get(problem).push(from);
			}
			continue;
		}
		if (!url.startsWith("/") || url.startsWith("//")) continue;
		links++;
		const file = target(url);
		let problem = null;
		if (!fs.existsSync(file)) problem = url.split("#")[0];
		else if (url.includes("#") && file.endsWith(".html")) {
			const anchor = decodeURIComponent(url.split("#")[1]);
			if (anchor && !idsOf(file).has(anchor)) problem = url;
		}
		if (problem) {
			if (!broken.has(problem)) broken.set(problem, []);
			broken.get(problem).push(from);
		}
	}
}

console.log(`${pages.length} pages, ${links} internal links, ${broken.size} broken targets`);
const list = [...broken].sort((a, b) => b[1].length - a[1].length);
for (const [url, from] of list) {
	console.log(`${String(from.length).padStart(4)}  ${url}${byTarget ? "\n        from " + [...new Set(from)].slice(0, 3).join(", ") : ""}`);
}
process.exitCode = broken.size ? 1 : 0;
