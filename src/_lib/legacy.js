// Old URLs and where they now live. Used both to fix links in pages at build time and to
// generate the server's redirects, so that links from elsewhere keep working.

import { readRedirects, readContents, SINGLE_URL } from "./manual.js";

// Pages whose new URL isn't simply their old path without ".php"
export const PAGE_URLS = {
	"/index.php": "/",
	"/publications.php": "/publications/",
	"/publ-selected.php": "/publications/selected/",
	"/bib.php": "/publications/bibliography/",
	"/bib-ext.php": "/publications/external/",
	"/publ-lists.php": "/publications/",
	"/publ-search.php": "/publications/bibliography/",
	"/publications/lists": "/publications/",
	"/publications/lists/": "/publications/",
	"/publ-parker.php": "/publications/parker/",
	"/courses/pmc2526/practical4_new.php": "/courses/pmc2526/practical4/",
	"/courses/pmc2526/practical4_new/": "/courses/pmc2526/practical4/",
};

// Other old paths (from the old site's .htaccess, and very old links in news items)
export const OLD_PATHS = {
	"/doc/VERSIONS.txt": "/doc/CHANGELOG.txt",
	"/download.html": "/download/",
	"/manual/Main/Search": "/search/?section=Documentation",
	"/qr": "/",
	"/lectures/marktoberdorf11": "/courses/marktoberdorf11/",
	"/casestudies/biology.php": "/casestudies/molecules/",
	"/sbml": "/manual/RunningPRISM/SupportForSBML/",
	"/sbml/": "/manual/RunningPRISM/SupportForSBML/",
	"/sbml/index.php": "/manual/RunningPRISM/SupportForSBML/",
	"/video": "/about/",
	"/video/": "/about/",
	"/video.php": "/about/",
	"/casestudies/prismcode.php": "/casestudies/",
	"/byzantine": "/casestudies/byzantine/",
	"/byzantine/": "/casestudies/byzantine/",
	"/byzantine/index.php": "/casestudies/byzantine/",
	"/consensus": "/casestudies/consensus/",
	"/consensus/": "/casestudies/consensus/",
	"/consensus/index.php": "/casestudies/consensus/",
	"/power": "/casestudies/power/",
	"/power/": "/casestudies/power/",
	"/power/index.php": "/casestudies/power/",
	"/wiki/Developers/SettingUpEclipse": "https://github.com/prismmodelchecker/prism/wiki/Setting-up-Eclipse",
	"/casestudies/examples/two_dice.php": "/view/?f=/casestudies/examples/two_dice.nm",
	"/casestudies/examples/cell100.php": "/view/?f=/casestudies/examples/cell.sm",
	"/casestudies/examples/kronos10000.php": "/casestudies/examples/abs.kronos10000",
	"/casestudies/contract_egl2_5.php": "/view/?f=/casestudies/examples/contract_egl2_5.pm",
	"/casestudies/contract_egl2_5": "/view/?f=/casestudies/examples/contract_egl2_5.pm",
	"/casestudies/contract_egl2_5/": "/view/?f=/casestudies/examples/contract_egl2_5.pm",
	"/casestudies/contract_egl3_5.php": "/view/?f=/casestudies/examples/contract_egl3_5.pm",
	"/casestudies/contract_egl3_5": "/view/?f=/casestudies/examples/contract_egl3_5.pm",
	"/casestudies/contract_egl3_5/": "/view/?f=/casestudies/examples/contract_egl3_5.pm",
	"/casestudies/contract_egl4_5.php": "/view/?f=/casestudies/examples/contract_egl4_5.pm",
	"/casestudies/contract_egl4_5": "/view/?f=/casestudies/examples/contract_egl4_5.pm",
	"/casestudies/contract_egl4_5/": "/view/?f=/casestudies/examples/contract_egl4_5.pm",
	"/courses/aims2526/dave-aims25-sysver.pdf": "/talks/dave-aims25-sysver.pdf",
	"/courses/aims2627/dave-aims26-sysver.pdf": "/talks/dave-aims26-sysver.pdf",
	"/courses/essai23/essai23part5.pdf": "/talks/essai23part5.pdf",
	"/courses/aims1819/marta-qver-p2.pdf": "/talks/marta-aims1819-qver-p2.pdf",
};
export const GITHUB_WIKI = "https://github.com/prismmodelchecker/prism/wiki";

// Old manual page names -> new URLs: the manual's own list (its redirects/ folder), plus the old
// "all on one page" versions of the manual and its sections
// (read once: this is used for every page built)
let manualUrls;
export function manualRedirects() {
	if (manualUrls) return manualUrls;
	try {
		manualUrls = readRedirects();
		for (const s of readContents().sections.filter((s) => s.url)) {
			const group = s.file.replace(/\/README\.md$/, "");
			manualUrls[`${group}/AllOnOnePage`] = `${SINGLE_URL}#${group}`;
		}
		manualUrls["Main/AllOnOnePage"] = SINGLE_URL;
	} catch {
		manualUrls = {}; // manual not synced yet
	}
	return manualUrls;
}

// Map an old site path (no origin) to its new URL; returns the path unchanged if nothing applies
export function mapLegacyUrl(url, manual = manualRedirects()) {
	const [, p, rest = ""] = url.match(/^([^?#]*)(.*)$/);
	if (OLD_PATHS[p]) return OLD_PATHS[p] + rest;
	if (PAGE_URLS[p]) return PAGE_URLS[p] + (rest.startsWith("#") ? rest : "");
	if (/^\/(wiki|manual\/Developers)\//.test(p)) return GITHUB_WIKI;
	let m;
	if ((m = p.match(/^\/manual\/uploads\/(.+)$/))) return `/manual/files/${m[1]}${rest}`;
	if ((m = p.match(/^\/manual\/([^/]+)\/?([^/]*)\/?$/)) && !/\.\w+$/.test(p)) {
		const page = m[2] ? `${m[1]}/${m[2]}` : `${m[1]}/Main`;
		// (an anchor in the old link wins over one in the redirect)
		if (manual[page]) return rest.includes("#") ? manual[page].replace(/#.*/, "") + rest : manual[page];
		if (!m[2]) return url; // a group (now a section's page) or the manual itself
		return `/manual/${page}/${rest}`;
	}
	// Generated "printable version" pages of example files: the file itself
	if ((m = p.match(/^(.*\/examples\/.+)\.php$/))) return m[1] + rest;
	if (p.endsWith(".php")) return p.replace(/(^|\/)index\.php$/, "$1").replace(/\.php$/, "/") + rest;
	return url;
}

// Fix links to old URLs in a page's HTML
export function fixLegacyLinks(html) {
	const manual = manualRedirects();
	return html.replace(/\b(href|src)="(\/[^"]*)"/g, (m, attr, url) => {
		const fixed = mapLegacyUrl(url.replace(/&amp;/g, "&"), manual);
		return fixed === url ? m : `${attr}="${fixed.replace(/&/g, "&amp;")}"`;
	}).replace(/\bhref="https?:\/\/(?:www\.)?prismmodelchecker\.org(\/[^"]*)"/g, (m, url) => `href="${mapLegacyUrl(url, manual)}"`);
}
