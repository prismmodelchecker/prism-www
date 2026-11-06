// Formatting of bibliography items, ported from bib-db-prism/bib_stuff.php
// (bib_display_item and bib_display_item_detailed).
// Plain functions returning HTML strings, so they can also run in the browser.

const MONTHS = ["", "January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];

// Keys use only letters, digits and "+", all literal in a URL path, so no encoding is needed
export function itemUrl(key) {
	return `/bibitem/${key}/`;
}

function esc(s) {
	return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function itemTitle(item) {
	return item.type !== "inbook" ? item.title : item.chapter;
}

// "X (editor)" or "X and Y (editors)"
function editors(e) {
	return `${e} (editor${e.includes(" and ") ? "s" : ""})`;
}

// The "source" part of a citation: where it was published
function source(it) {
	let src = "";
	const vol = it.volume && it.series ? `, volume ${it.volume} of ${it.series}` : "";
	const pages = it.pages ? `, pages ${it.pages}` : "";
	const note = it.note ? `. ${it.note}` : "";
	switch (it.type) {
	case "inproceedings":
	case "inbook":
		src = "In " + (it.editor ? editors(it.editor) + ", " : "");
		src += `<em>${it.type === "inbook" ? it.title : it.booktitle}</em>` + vol + pages;
		if (it.organization) src += ", " + it.organization;
		if (it.publisher) src += ", " + it.publisher;
		return src + note;
	case "article":
		src = `<em>${it.journal}</em>`;
		if (it.volume) src += ", " + it.volume;
		if (it.number) src += `(${it.number})`;
		src += pages;
		if (it.publisher) src += ", " + it.publisher;
		return src + note;
	case "book":
	case "proceedings":
		if (it.volume && it.series) src += `Volume ${it.volume} of ${it.series}. `;
		if (it.publisher) src += it.publisher;
		return src + note;
	case "phdthesis":
		return `${it.type2 || "Ph.D. thesis"}, ${it.school}` + note;
	case "mastersthesis":
		return `${it.type2 || "Masters thesis"}, ${it.school}` + note;
	case "techreport":
		return `${it.type2 || "Technical report"} ${it.number}, ${it.institution}` + note;
	case "unpublished":
		return it.note || "";
	}
	return "";
}

// Escape all plain-text fields (abstract and links are stored as HTML)
function escaped(item) {
	const it = {};
	for (const [k, v] of Object.entries(item)) {
		it[k] = (typeof v === "string" && k !== "abstract" && k !== "links") ? esc(v) : v;
	}
	if (it.note && it.note.endsWith(".")) it.note = it.note.slice(0, -1);
	return it;
}

// One-paragraph citation, as used in lists. If link is true, the title links to the item page;
// synopsis adds the item's one-line note on its connection to PRISM.
export function citation(item, { link = true, synopsis = true } = {}) {
	const it = escaped(item);
	let auth = it.author ? it.author + "." : "";
	if ((it.type === "book" || it.type === "proceedings") && it.editor) {
		auth += (auth ? " " : "") + editors(it.editor) + ",";
	}
	const title = esc(itemTitle(item));
	const src = source(it);
	const date = [MONTHS[it.month || 0], it.year].filter(Boolean).join(" ");
	const files = item.files.map((f) => `<a href="${esc(f.url)}">${esc(f.ext)}</a>`).join(" ");
	return [
		`<span class="bib-key">[${esc(item.key)}]</span>`,
		auth && `<span class="bib-auth">${auth}</span>`,
		`<span class="bib-title">${link ? `<a href="${itemUrl(item.key)}">${title}</a>` : title}.</span>`,
		src && `<span class="bib-src">${src}.</span>`,
		date && `<span class="bib-date">${date}.</span>`,
		files && `<span class="bib-files">${files}</span>`,
		synopsis && it.synopsis && `<span class="bib-synop">[${it.synopsis.replace(/^\[|\]$/g, "")}]</span>`,
	].filter(Boolean).join("\n").replace(/\s*\n\s*\n\s*/g, "\n"); // (a blank line would end an HTML block in a Markdown page)
}

// Extra notes shown on the item page (from the "links" field, plus publisher hints)
export function notes(item) {
	const out = [];
	if (item.links) {
		out.push(item.links.replace(/\[([A-Za-z0-9_\-+]+)\]/g, (m, k) => `[<a href="${itemUrl(k)}">${k}</a>]`));
	}
	if ((item.publisher || "").includes("Springer")) {
		const url = "https://link.springer.com/search?query=" + encodeURIComponent(itemTitle(item));
		out.push(`The original publication is available at <a href="${esc(url)}">link.springer.com</a>.`);
	}
	const entcs = /^(Electronic Notes in Theoretical Computer Science|ENTCS)$/i;
	if (entcs.test(item.series || "") || entcs.test(item.journal || "")) {
		out.push(`ENTCS is available at <a href="https://www.sciencedirect.com/journal/electronic-notes-in-theoretical-computer-science">sciencedirect.com</a>.`);
	}
	return out;
}

export function searchLinks(item) {
	const q = encodeURIComponent(`"${itemTitle(item)}"`);
	return [
		{ name: "Google", url: `https://www.google.com/search?q=${q}` },
		{ name: "Google Scholar", url: `https://scholar.google.com/scholar?q=${q}` },
	];
}

// Google Scholar indexing tags for an item page
export function scholarMeta(item) {
	const meta = [["citation_title", itemTitle(item)]];
	for (const a of (item.author || "").split(/,\s*|\s+and\s+/).filter(Boolean)) meta.push(["citation_author", a]);
	if (item.year) meta.push(["citation_publication_date", String(item.year)]);
	if (item.booktitle) meta.push(["citation_conference_title", item.booktitle]);
	if (item.journal) meta.push(["citation_journal_title", item.journal]);
	if (item.volume) meta.push(["citation_volume", item.volume]);
	const pdf = item.files.find((f) => f.ext === "pdf");
	if (pdf) meta.push(["citation_pdf_url", "https://www.prismmodelchecker.org" + pdf.url]);
	return meta.map(([n, c]) => `<meta name="${n}" content="${esc(c)}">`).join("\n");
}

// Select items, like the old bib_add/bib_filter calls:
//   { keys: [...] }    these items, in this order
//   { cats: [...] }    items in any of these categories
//   { notCats: [...] } ...and in none of these
export function selectItems(items, spec = {}) {
	if (spec.keys) {
		const byKey = new Map(items.map((i) => [i.key, i]));
		return spec.keys.map((k) => byKey.get(k)).filter(Boolean);
	}
	return items.filter((i) =>
		(!spec.cats || spec.cats.some((c) => i.cats.includes(c))) &&
		(!spec.notCats || !spec.notCats.some((c) => i.cats.includes(c))));
}

// The ways a publication list can be ordered (as the old lists' "Sort by" links).
// "date" is the list's main page; the others are at by-<id>/ under it.
export const LIST_VIEWS = [
	{ id: "date", name: "date" },
	{ id: "type", name: "type" },
	{ id: "title", name: "title" },
	{ id: "subject", name: "subject" },
];

// Subject groups: each item goes in the first one whose category it has
const SUBJECTS = [
	{ cat: "casestudies", title: "Case studies using PRISM" },
	{ cat: "techniques", title: "Underlying techniques in PRISM" },
	{ cat: "extensions", title: "Extensions and adaptions to PRISM" },
	{ cat: "connections", title: "Tool/language connections to PRISM" },
	{ cat: "toolpapers", title: "PRISM tool papers" },
	{ cat: "tutorials", title: "PRISM-related tutorials and surveys" },
];

const byDate = (a, b) => (b.year || 0) - (a.year || 0) || (b.month || 0) - (a.month || 0);

function byYear(items) {
	const groups = new Map();
	for (const item of items) {
		const year = String(item.year || "Undated");
		if (!groups.has(year)) groups.set(year, []);
		groups.get(year).push(item);
	}
	return [...groups].map(([year, items]) => ({ id: "y" + year, title: year, items }));
}

// Items grouped for one view: [{id, title, items, groups?}] (subject groups are split by year again).
// A view with a single group of untitled items (title) has title "".
export function groupItems(items, view, types) {
	const sorted = [...items].sort(byDate);
	switch (view) {
	case "type": {
		const groups = new Map();
		for (const t of [...types].sort((a, b) => a.type_index - b.type_index)) {
			if (!groups.has(t.type_index)) groups.set(t.type_index, { id: "t" + t.type_index, title: t.type_description, items: [] });
		}
		const index = Object.fromEntries(types.map((t) => [t.type, t.type_index]));
		const other = { id: "tother", title: "Other", items: [] };
		for (const item of sorted) (groups.get(index[item.type]) || other).items.push(item);
		return [...groups.values(), other].filter((g) => g.items.length);
	}
	case "title": {
		// ignoring case, spaces and punctuation, as the database's ORDER BY did
		const collator = new Intl.Collator("en", { sensitivity: "base", ignorePunctuation: true });
		const title = (i) => (itemTitle(i) || "").trim();
		return [{ id: "all", title: "", items: [...items].sort((a, b) => collator.compare(title(a), title(b))) }];
	}
	case "subject": {
		const groups = [...SUBJECTS.map((s) => ({ ...s, items: [] })), { cat: null, title: "Others", items: [] }];
		for (const item of sorted) groups.find((g) => !g.cat || item.cats.includes(g.cat)).items.push(item);
		return groups.filter((g) => g.items.length).map((g) => ({
			id: g.cat || "others", title: g.title, items: g.items,
			groups: byYear(g.items).map((y) => ({ ...y, id: `${g.cat || "others"}-${y.id}` })),
		}));
	}
	default:
		return byYear(sorted);
	}
}
