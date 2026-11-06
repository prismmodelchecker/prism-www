// Publication lists: the "Search this list" box filters the list as you type, like the old site's search:
// items must contain every word (anywhere in the citation or synopsis), and matches are highlighted.
// The search is kept in the URL (?search=...), so it can be bookmarked, and carried over to the other sort orders.
// Without JS the box stays hidden and the whole list is shown.

(() => {
	const form = document.querySelector(".bib-filter");
	if (!form) return;
	const input = form.querySelector("input");
	const status = form.querySelector(".bib-filter-status");
	const items = [...document.querySelectorAll(".bib-list > li")].map((li) => ({
		li, html: li.innerHTML, text: li.textContent.replace(/\s+/g, " ").toLowerCase(), marked: false,
	}));
	const groups = [...document.querySelectorAll("[data-bib-group]")];
	const navLinks = [...document.querySelectorAll(".year-nav a")];
	const sortLinks = [...document.querySelectorAll("a[data-keep-search]")];
	form.hidden = false;

	const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	// Wrap each match of re in the text of el in <mark>
	function highlight(el, re) {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		for (const node of nodes) {
			const text = node.nodeValue;
			re.lastIndex = 0;
			if (!re.test(text)) continue;
			const frag = document.createDocumentFragment();
			let last = 0;
			text.replace(re, (m, offset) => {
				frag.append(text.slice(last, offset));
				const mark = document.createElement("mark");
				mark.className = "bib-highlight";
				mark.textContent = m;
				frag.append(mark);
				last = offset + m.length;
			});
			frag.append(text.slice(last));
			node.replaceWith(frag);
		}
	}

	function setSearch(url, query) {
		if (query) url.searchParams.set("search", query);
		else url.searchParams.delete("search");
		return url;
	}

	function apply() {
		const query = input.value.trim();
		const words = query.toLowerCase().split(/\s+/).filter(Boolean);
		// longest words first, so that e.g. "games" is marked rather than just "game"
		const re = words.length ? new RegExp([...words].sort((a, b) => b.length - a.length).map(escape).join("|"), "gi") : null;
		let shown = 0;
		for (const it of items) {
			if (it.marked) {
				it.li.innerHTML = it.html;
				it.marked = false;
			}
			const match = words.every((w) => it.text.includes(w));
			it.li.hidden = !match;
			if (match) {
				shown++;
				if (re) {
					highlight(it.li, re);
					it.marked = true;
				}
			}
		}
		// Section counts, and hide sections (and their links at the top) with nothing left in them
		for (const g of groups) {
			const n = g.querySelectorAll(".bib-list > li:not([hidden])").length;
			g.hidden = n === 0;
			const count = g.querySelector(":scope > .bib-head [data-count]");
			if (count) count.textContent = n;
		}
		for (const a of navLinks) {
			const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
			a.parentElement.hidden = Boolean(target && target.closest("[data-bib-group]").hidden);
		}
		status.textContent = !words.length ? ""
			: shown === 0 ? "No publications match."
			: `${shown} of ${items.length} publications match.`;
		history.replaceState(null, "", setSearch(new URL(location.href), query));
		for (const a of sortLinks) a.href = setSearch(new URL(a.href), query);
	}

	input.value = new URLSearchParams(location.search).get("search") || "";
	let timer;
	input.addEventListener("input", () => {
		clearTimeout(timer);
		timer = setTimeout(apply, 150);
	});
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		apply();
	});
	if (input.value) apply();
})();
