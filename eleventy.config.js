import fs from "node:fs";
import path from "node:path";
import { highlightPepa, highlightPrism } from "./src/_lib/prism-highlight.js";
import { citation, itemUrl, itemTitle, notes, searchLinks, selectItems, groupItems, LIST_VIEWS } from "./src/_lib/bib.js";
import markdownItContainer from "markdown-it-container";
import { classes } from "./src/_lib/classes.js";
import { tables } from "./src/_lib/tables.js";
import { headingIds, rewriteLinks, pageHeadings, singlePageContent, manualUrl, MANUAL_DIR, SINGLE_URL, OFFLINE_URL } from "./src/_lib/manual.js";
import { LARGE_FILE, LARGE_FILE_ORIGIN } from "./src/_lib/assets.js";
import { fixLegacyLinks } from "./src/_lib/legacy.js";
import { benchmarkText, benchmarkCite, benchmarkParam } from "./src/_lib/benchmarks.js";

export default function (eleventyConfig) {
	// The manual is copied in from the PRISM repo and git-ignored here, so don't let .gitignore hide it
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.ignores.add("_site/**");

	// Pages are .njk and .md; every other file under src/ (images, example models, old static
	// HTML pages, ...) is copied as it is. Data, templates and the bib export are left out.
	// (Listed here rather than by a glob: Eleventy's glob library can't express "not .md" reliably)
	eleventyConfig.setTemplateFormats(["njk", "md"]);
	// MANUAL_ONLY=1 (scripts/manual-offline.js): build just the manual and its offline copy,
	// which needs none of the site's other pages or files (nor the bib export)
	const manualOnly = !!process.env.MANUAL_ONLY;
	if (manualOnly) {
		for (const f of fs.readdirSync("src")) {
			if (f.startsWith("_") || ["manual", "manual-offline.njk"].includes(f)) continue;
			eleventyConfig.ignores.add(`src/${f}`);
			eleventyConfig.ignores.add(`src/${f}/**`);
		}
	} else {
		eleventyConfig.ignores.add("src/manual-offline.njk");
		for (const f of staticFiles("src")) eleventyConfig.addPassthroughCopy(f);
		eleventyConfig.addPassthroughCopy("src/css");
		eleventyConfig.addPassthroughCopy("src/js");
		// (the highlighter also runs in the browser, for the file viewer at /view/)
		eleventyConfig.addPassthroughCopy({ "src/_lib/prism-highlight.js": "js/prism-highlight.js" });
	}

	// Code blocks in Markdown: ```prism gets PRISM highlighting
	eleventyConfig.amendLibrary("md", (md) => {
		md.set({
			highlight: (code, lang) => (lang === "prism" ? highlightPrism(code) : lang === "pepa" ? highlightPepa(code) : ""),
		});
		md.use(headingIds);
		md.use(tables);
		// Styles for site pages, defined in site.css and listed in README.md: "::: box" around blocks,
		// {.note} after an element (a block inside another has fewer colons)
		for (const name of ["answer", "banner", "slideshow", "columns", "box", "questions", "labels"]) md.use(markdownItContainer, name);
		md.use(classes);
		// Images alone in a paragraph are figures, side by side if there are several; not in the manual, which has its own style
		md.core.ruler.push("figures", (state) => {
			const file = state.env?.page?.inputPath;
			if (!file || file.includes("/manual/")) return;
			state.tokens.forEach((t, i) => {
				if (t.type !== "inline" || state.tokens[i - 1]?.type !== "paragraph_open") return;
				const items = t.children.filter((c) => !/^(softbreak|link_open|link_close)$/.test(c.type) && !(c.type === "text" && !c.content.trim()));
				if (!items.length || items.some((c) => c.type !== "image")) return;
				for (const image of items) if (!/\bright\b/.test(image.attrGet("class"))) image.attrJoin("class", "prism-image");
				if (items.length > 1) state.tokens[i - 1].attrJoin("class", "gallery");
			});
		});
		// (```prism scroll gives a long listing a limited height, as {% prismCode file, true %} does)
		const fence = md.renderer.rules.fence;
		md.renderer.rules.fence = (tokens, idx, ...rest) => {
			const html = fence(tokens, idx, ...rest).replace("<pre", '<pre tabindex="0"');
			return /\bscroll\b/.test(tokens[idx].info) ? html.replace("<pre ", '<pre class="code-scroll" ') : html;
		};
	});

	// {% task %}: the icon that marks something to do in practicals and tutorials
	eleventyConfig.addShortcode("task", () => '<img class="prism-task" src="/images/task.png" alt="Task">');

	// {% prismCode "casestudies/examples/die.pm" %}: highlighted listing of a model file, with download link.
	// scroll=true limits the height of long listings; links=false leaves out the download link.
	eleventyConfig.addShortcode("prismCode", (file, scroll = false, links = true) => {
		const name = file.split("/").pop();
		if (!fs.existsSync(`src/${file}`)) {
			console.warn(`[prismCode] missing file: src/${file}`);
			return `<p class="todo">[Missing example file: ${name}]</p>`;
		}
		const code = fs.readFileSync(`src/${file}`, "utf8").replace(/\s+$/, "");
		const caption = links ? `<figcaption><a href="/${file}" download>Download ${name}</a></figcaption>` : "";
		// All on one line (newlines in the code as &#10;): in Markdown pages, a blank line would
		// otherwise end the HTML block and the rest of the listing would be read as Markdown
		const listing = highlightPrism(code).replace(/\n/g, "&#10;");
		return `<figure class="code">${caption}<pre class="language-prism${scroll ? " code-scroll" : ""}" tabindex="0"><code>${listing}</code></pre></figure>`;
	});

	// {% cite "KNP04b", "Par02" %}: links into the bibliography, like prism_cite() did
	eleventyConfig.addShortcode("cite", (...keys) =>
		"[" + keys.map((k) => `<a class="cite" href="${itemUrl(k)}">${k}</a>`).join(", ") + "]");

	// Benchmark suite
	eleventyConfig.addFilter("benchmarkText", benchmarkText);
	eleventyConfig.addFilter("benchmarkCite", benchmarkCite);
	eleventyConfig.addFilter("benchmarkParam", benchmarkParam);

	// Bibliography
	eleventyConfig.addFilter("citation", (item, opts) => citation(item, opts));
	eleventyConfig.addFilter("itemUrl", itemUrl);
	eleventyConfig.addFilter("bibTitle", itemTitle);
	eleventyConfig.addFilter("bibNotes", notes);
	eleventyConfig.addFilter("bibSearchLinks", searchLinks);
	eleventyConfig.addFilter("bibSelect", selectItems);
	eleventyConfig.addFilter("withCat", (items, cat) => items.filter((i) => i.cats.includes(cat)));
	eleventyConfig.addFilter("sortByDate", (items) =>
		[...items].sort((a, b) => (b.year || 0) - (a.year || 0) || (b.month || 0) - (a.month || 0)));
	eleventyConfig.addFilter("typeName", (types, type) =>
		(types.find((t) => t.type === type) || {}).type_description || type);
	eleventyConfig.addFilter("bibItem", (items, key) => items.find((i) => i.key === key));
	eleventyConfig.addFilter("bibGroups", groupItems);
	eleventyConfig.addGlobalData("bibViews", LIST_VIEWS);

	eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
	// A path as a mod_rewrite pattern: escape regex characters
	eleventyConfig.addFilter("regexPath", (p) => p.replace(/[.+?()[\]^$|]/g, "\\$&"));
	// Index pages of the folders under /courses/, newest first (folder names end in a year, e.g. pmc2526 or aims1415)
	eleventyConfig.addFilter("coursePages", (pages) => pages
		.filter((p) => /^\/courses\/[^/]+\/$/.test(p.url))
		.sort((a, b) => courseYear(b.url) - courseYear(a.url) || a.url.localeCompare(b.url)));
	eleventyConfig.addFilter("prism", highlightPrism);

	// Group items into [{year, items}], newest first; year comes from field (number or "YYYY-MM")
	eleventyConfig.addFilter("groupByYear", (arr, field = "date") => {
		const groups = new Map();
		for (const item of arr) {
			const year = String(item[field] ?? "").slice(0, 4) || "Undated";
			if (!groups.has(year)) groups.set(year, []);
			groups.get(year).push(item);
		}
		return [...groups].sort(([a], [b]) => b.localeCompare(a)).map(([year, items]) => ({ year, items }));
	});

	// "2026-10-09" -> "9 October 2026"
	eleventyConfig.addFilter("longDate", (ymd) =>
		new Date(ymd + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }));

	// "2026-10" -> "October 2026"
	eleventyConfig.addFilter("monthYear", (ym) => {
		const [y, m] = ym.split("-");
		return new Date(Date.UTC(+y, +m - 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
	});

	// Menu entry for the current section, if it has sub-pages
	// (with any=true, return the entry even if it has no sub-pages)
	eleventyConfig.addFilter("sectionMenu", (nav, section, any = false) =>
		nav.find((item) => item.id === section && (any || item.children)) || null);

	// Manual: relative links in the Markdown (Page.md, ../files/x) become site URLs
	const manualFile = (inputPath) => path.posix.relative(MANUAL_DIR, inputPath.replace(/^\.\//, ""));
	eleventyConfig.addTransform("manual-links", function (content) {
		const input = this.page.inputPath;
		if (!input.startsWith("./" + MANUAL_DIR + "/") || !input.endsWith(".md")) return content;
		return rewriteLinks(content, path.posix.dirname(manualFile(input)));
	});
	// The manual on one page (and offline): each page's rendered content, with its links made into
	// links within the page; headings move down `shift` levels
	eleventyConfig.addGlobalData("manualSingleUrl", SINGLE_URL);
	// (the version the offline copy is for: a PRISM build passes its own; otherwise the latest release)
	eleventyConfig.addGlobalData("manualVersion", process.env.MANUAL_VERSION || "");
	eleventyConfig.addFilter("manualPageItem", (items, url) => items.find((i) => i.url === url));
	eleventyConfig.addFilter("manualAnchor", (file) => manualUrl(file).replace(/^\/manual\/|\/$/g, ""));
	eleventyConfig.addFilter("manualSingle", (item, shift, offline = false) => {
		const file = manualFile(item.inputPath);
		const html = fixLegacyLinks(rewriteLinks(item.content, path.posix.dirname(file)));
		return singlePageContent(html, file, shift, offline);
	});
	// (the offline copy has its own copy of the manual's files)
	if (manualOnly) eleventyConfig.addPassthroughCopy({ [`${MANUAL_DIR}/files`]: `${OFFLINE_URL.slice(1)}files` });
	eleventyConfig.addFilter("manualHeadings", pageHeadings);
	eleventyConfig.addFilter("readJson", (file) => JSON.parse(fs.readFileSync(file, "utf8")));
	// Entry before (-1), at (0) or after (+1) the one with this url, in an ordered list of {url} entries
	eleventyConfig.addFilter("neighbourUrl", (pages, url, step) => {
		const i = pages.findIndex((p) => p.url === url);
		return (i >= 0 && pages[i + step]) || null;
	});

	// Wide tables in pages scroll inside their own box rather than widening the page on phones:
	// wrap each outermost table (old pages nest layout tables) in a scrollable region
	// (tables written in Markdown are wrapped when it's rendered; HTML tables in Markdown pages are wrapped here)
	eleventyConfig.addTransform("scrolling-tables", function (content) {
		if (!(this.page.outputPath || "").endsWith(".html")) return content;
		let depth = 0;
		let wrapped = false; // whether the current outermost table got a wrapper here
		return content.replace(/<table\b|<\/table>/gi, (tag, offset) => {
			if (tag[1] === "/") {
				if (depth === 0) return tag; // stray closing tag (some old pages have them): browsers ignore it
				return --depth === 0 && wrapped ? `${tag}</div>` : tag;
			}
			if (depth++ > 0) return tag;
			// Markdown tables come already wrapped
			wrapped = !/<div class="table-scroll"[^>]*>\s*$/.test(content.slice(Math.max(0, offset - 120), offset));
			return wrapped ? '<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table' : tag;
		});
	});

	// Links to old URLs (.php pages, renamed manual pages, ...) go to the new ones
	eleventyConfig.addTransform("legacy-links", function (content) {
		if (this.page.url === OFFLINE_URL) return content; // (its links all go to the live site)
		return (this.page.outputPath || "").endsWith(".html") ? fixLegacyLinks(content) : content;
	});

	// Folders of large files live outside git (see src/_lib/assets.js); when they aren't served from
	// this build's own server (a local build), point links at the server that has them
	if (LARGE_FILE_ORIGIN) {
		eleventyConfig.addTransform("large-file-links", function (content) {
			if (!(this.page.outputPath || "").endsWith(".html") || this.page.url === OFFLINE_URL) return content;
			return content.replace(/\b(href|src)="(\/[^"]*)"/g, (m, attr, url) =>
				LARGE_FILE.test(url) ? `${attr}="${LARGE_FILE_ORIGIN}${url}"` : m);
		});
	}

	return {
		dir: { input: "src", output: "_site" },
		// Markdown pages can use template tags ({% cite %}, {{ releases.prism.version }}, ...);
		// the manual opts out (src/manual/manual.11tydata.js), as it's plain Markdown shared with GitHub
		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",
	};
}

// Files under dir that aren't pages, data or templates (skipping Eleventy's own _folders,
// hidden folders and .DS_Store, but keeping .htaccess files)
function staticFiles(dir) {
	const out = [];
	for (const f of fs.readdirSync(dir)) {
		const p = path.join(dir, f);
		if (f.startsWith("_") || f === ".DS_Store") continue;
		if (fs.statSync(p).isDirectory()) {
			if (!f.startsWith(".")) out.push(...staticFiles(p));
		} else if (!/\.(njk|md|js|json)$/.test(f)) out.push(p);
	}
	return out;
}

// Start year of a course from its folder name: "pmc2526" -> 2025, "kth15" -> 2015, "essai23" -> 2023
function courseYear(url) {
	const d = url.match(/(\d{2,4})\/$/)?.[1] || "0";
	const yy = d.length === 4 ? +d.slice(0, 2) : +d.slice(-2);
	return yy + (yy > 70 ? 1900 : 2000);
}
