// Building the manual from the Markdown kept in the PRISM repo (doc/manual, copied to src/manual).
// The repo's conventions are GitHub-friendly; this module maps them onto the website:
//  - README.md is the contents: its "- [Title](Page.md)" items are pages, in order, and an item
//    linking to Folder/README.md is a section, whose own README.md lists the section's pages
//    (indented items linking to anchors add menu entries for parts of a page)
//  - Group/Page.md is published at /manual/Group/Page/, and Group/README.md at /manual/Group/
//  - relative links (Page.md, ../Group/Page.md#anchor, ../files/x) are rewritten to site URLs
//  - redirects/*.json map old page names to the files that replaced them

import fs from "node:fs";
import path from "node:path";

export const MANUAL_DIR = "src/manual";
// The manual on one page, and the same page made self-contained, for the copy in PRISM distributions
export const SINGLE_URL = "/manual/all/";
export const OFFLINE_URL = "/manual/offline/";
const SITE = "https://www.prismmodelchecker.org";

// "Group/Page.md#x" (relative to the manual root) -> "/manual/Group/Page/#x"; README.md -> its folder
export function manualUrl(rel) {
	const [file, anchor] = rel.split("#");
	const base = "/manual/" + file.replace(/(^|\/)README\.md$/, "$1").replace(/\.md$/, "/");
	return base + (anchor ? "#" + anchor : "");
}

// The "- [Title](Page.md)" items of a contents page (file relative to the manual root), in order,
// with indented items as children of the one above. Only links to .md files count, so other lists
// on a section's page are left alone.
function contentsItems(file) {
	const dir = path.posix.dirname(file);
	const items = [];
	for (const line of fs.readFileSync(path.join(MANUAL_DIR, file), "utf8").split("\n")) {
		const m = line.match(/^(\s*)[-*]\s+\[(.*?)\]\(([^):]+?\.md(?:#[^)]*)?)\)/);
		if (!m) continue;
		const target = path.posix.normalize(path.posix.join(dir, m[3]));
		const entry = { title: m[2], file: target.split("#")[0], url: manualUrl(target), children: [] };
		if (m[1].length > 0 && items.length) items.at(-1).children.push(entry);
		else items.push(entry);
	}
	return items;
}

// Parse the contents into { sections: [{title, url, pages: [{title, url, children}]}], pages: [flat, in order] }.
// Pages listed in README.md itself are grouped into untitled sections (url "") between the real ones.
export function readContents() {
	const sections = [];
	for (const item of contentsItems("README.md")) {
		if (/^[^/]+\/README\.md$/.test(item.file)) {
			sections.push({ title: item.title, url: item.url, file: item.file, pages: contentsItems(item.file) });
		} else {
			if (!sections.length || sections.at(-1).url) sections.push({ title: "", url: "", pages: [] });
			sections.at(-1).pages.push(item);
		}
	}
	const pages = sections.flatMap((s) => s.pages.map((p) => ({ ...p, section: s.title, sectionUrl: s.url })));
	return { sections, pages };
}

// Old page names (as in URLs: "Group/Page") -> their new URLs, from redirects/*.json (whose targets
// are files, maybe with an anchor, and maybe themselves renamed later)
export function readRedirects() {
	const dir = path.join(MANUAL_DIR, "redirects");
	const names = {};
	if (fs.existsSync(dir)) {
		for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
			Object.assign(names, JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
		}
	}
	const urls = {};
	for (const from of Object.keys(names)) {
		let to = names[from];
		for (let i = 0; i < 5 && names[to.replace(/\.md(#.*)?$/, "")]; i++) to = names[to.replace(/\.md(#.*)?$/, "")];
		if (!fs.existsSync(path.join(MANUAL_DIR, to.split("#")[0]))) console.warn(`[manual] redirect ${from}: no file ${to}`);
		urls[from] = manualUrl(to);
	}
	return urls;
}

// Title of a manual page: its first "# " heading
export function pageTitle(inputPath) {
	const m = fs.readFileSync(inputPath, "utf8").match(/^#\s+(.*)$/m);
	return m ? m[1].trim() : path.basename(inputPath, ".md");
}

// GitHub-style heading ids, so that Page.md#some-heading links work both on GitHub and on the site
export function slugify(text) {
	return text.trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
}

// markdown-it plugin: add ids to h2/h3 headings (GitHub's scheme, with -1, -2... for repeats)
export function headingIds(md) {
	md.core.ruler.push("heading_ids", (state) => {
		const seen = new Map();
		const tokens = state.tokens;
		// An id given in the heading ("## Introduction { #intro }": with a space, as "{#" starts a Nunjucks comment) comes first, so generated ones can't clash with it
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].type !== "heading_open") continue;
			const inline = tokens[i + 1];
			const match = inline.content.match(/\s*\{ #([^\s{}]+) \}$/);
			if (!match) continue;
			tokens[i].attrSet("id", match[1]);
			seen.set(match[1], 1);
			inline.content = inline.content.slice(0, match.index);
			const last = inline.children[inline.children.length - 1];
			last.content = last.content.slice(0, -match[0].length);
		}
		for (let i = 0; i < tokens.length; i++) {
			const t = tokens[i];
			if (t.type !== "heading_open" || !/^h[23]$/.test(t.tag) || t.attrGet("id")) continue;
			const base = slugify(tokens[i + 1].content);
			const n = seen.get(base) || 0;
			seen.set(base, n + 1);
			const id = n ? `${base}-${n}` : base;
			t.attrSet("id", id);
			// An anchor just above the heading with the same name (for links on GitHub) would repeat the id
			const anchor = `<a id="${id}"></a>`;
			if (tokens[i - 1]?.type === "html_block" && tokens[i - 1].content.trim() === anchor) tokens.splice(--i, 1);
			else if (tokens[i - 1]?.type === "paragraph_close" && tokens[i - 2].content.trim() === anchor) tokens.splice((i -= 3), 3);
		}
	});
}

// Rewrite relative links/images in a rendered manual page; sourceDir is the page's folder relative to the manual root
export function rewriteLinks(html, sourceDir) {
	return html.replace(/(href|src)="([^"#:?][^":?]*?)(#[^"]*)?"/g, (m, attr, rel, anchor = "") => {
		if (rel.startsWith("/")) return m;
		const target = path.posix.normalize(path.posix.join(sourceDir, rel));
		if (target.endsWith(".md")) return `${attr}="${manualUrl(target + anchor)}"`;
		return `${attr}="/manual/${target}${anchor}"`;
	}).replace(/(href|src)="https:\/\/www\.prismmodelchecker\.org\//g, '$1="/');
}

// A rendered page (its links already site URLs), for the manual on one page: links between manual pages become links within
// the page, and the page's ids are prefixed with its name ("Group/Page/heading"), so they stay unique.
// Headings move down by `shift` levels. For the offline copy (offline=true), files are local and
// other links go to the website.
export function singlePageContent(html, sourceFile, shift = 0, offline = false) {
	const own = manualUrl(sourceFile).replace(/^\/manual\//, "").replace(/\/$/, "");
	html = html
		.replace(/\bid="([^"]+)"/g, (m, id) => `id="${own}/${id}"`)
		.replace(/\bhref="#([^"]+)"/g, (m, id) => `href="#${own}/${id}"`)
		.replace(/\bhref="\/manual\/([^"#.]*?)\/?(#[^"]*)?"/g, (m, page, anchor = "") =>
			page === "" && !anchor ? 'href="#contents"' : `href="#${[page, anchor.slice(1)].filter(Boolean).join("/")}"`)
		.replace(/<(\/?)h([1-6])\b/g, (m, close, n) => `<${close}h${Math.min(6, +n + shift)}`);
	if (offline) {
		html = html.replace(/\b(href|src)="\/manual\/files\//g, '$1="files/').replace(/\b(href|src)="\//g, `$1="${SITE}/`);
	}
	return html;
}

// Citations: links to an entry of the References page, [[KNP11](../Main/References.md#KNP11)]
const CITATION = /\]\((?:\.\.\/)*(?:Main\/)?References\.md#([^)\s]+)\)/g;

// Keys cited anywhere in the manual in dir (default: the copy in src/manual), and those listed on its References page
export function citations(dir = MANUAL_DIR) {
	const cited = new Set();
	const walk = (d) => {
		for (const f of fs.readdirSync(d, { withFileTypes: true })) {
			const p = path.join(d, f.name);
			if (f.isDirectory()) walk(p);
			else if (f.name.endsWith(".md") && p !== path.join(dir, "Main", "References.md")) {
				for (const m of fs.readFileSync(p, "utf8").matchAll(CITATION)) cited.add(m[1]);
			}
		}
	};
	walk(dir);
	const refs = path.join(dir, "Main", "References.md");
	const listed = new Set(fs.existsSync(refs) ? [...fs.readFileSync(refs, "utf8").matchAll(/<a id="([^"]+)"><\/a>/g)].map((m) => m[1]) : []);
	return { cited, listed };
}

// h2 headings of a rendered page, for the in-page entries in the menu
export function pageHeadings(html) {
	return [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(([, id, text]) => ({ id, text: text.replace(/<[^>]+>/g, "") }));
}
