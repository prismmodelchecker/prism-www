// Small-screen behaviour: collapsible side menus and menu toggle. Without JS, everything is shown.

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
	// On small screens, side menus start collapsed so the page text comes first, and their title bars
	// show and hide them instead of linking to the section's index page (which is in the main menu)
	const small = window.matchMedia("(max-width: 59.99rem)");
	const menus = [];
	for (const list of document.querySelectorAll(".local-nav__details")) {
		const title = list.parentElement.querySelector(".local-nav__title, .manual-nav__title");
		const link = title.querySelector("a");
		menus.push({ list, link });
		title.addEventListener("click", (e) => {
			if (!small.matches) return;
			e.preventDefault();
			list.hidden = !list.hidden;
			link.setAttribute("aria-expanded", String(!list.hidden));
		});
		link.addEventListener("keydown", (e) => {
			if (small.matches && e.key === " ") { e.preventDefault(); link.click(); }
		});
	}
	const fitMenus = () => {
		for (const { list, link } of menus) {
			list.hidden = small.matches;
			if (small.matches) {
				link.setAttribute("role", "button");
				link.setAttribute("aria-expanded", "false");
			} else {
				link.removeAttribute("role");
				link.removeAttribute("aria-expanded");
			}
		}
	};
	fitMenus();
	small.addEventListener("change", fitMenus);

	// Keep the current page visible in a long, independently scrolling contents sidebar
	const current = document.querySelector(".manual-nav a[aria-current=page]");
	const sidebar = current && current.closest(".manual-nav");
	if (sidebar && window.matchMedia("(min-width: 60rem)").matches) {
		sidebar.scrollTop = current.offsetTop - sidebar.clientHeight / 3; // offsetTop is relative to the (sticky) sidebar
	}

	// Slideshows (::: slideshow, as on the home page): a new image slides in every 5 seconds, except while the pointer
	// is over it or the page isn't in view. Without JS, or for people who prefer less motion, each stays on its first
	const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	for (const show of still ? [] : document.querySelectorAll(".slideshow")) {
		const slides = [...show.children];
		if (slides.length < 2) continue;
		let current = 0;
		let paused = false;
		slides[0].classList.add("is-current");
		show.classList.add("is-running");
		show.addEventListener("mouseenter", () => { paused = true; });
		show.addEventListener("mouseleave", () => { paused = false; });
		setInterval(() => {
			if (paused || document.hidden) return;
			for (const s of slides) s.classList.remove("is-leaving");
			slides[current].classList.replace("is-current", "is-leaving");
			current = (current + 1) % slides.length;
			slides[current].classList.add("is-current");
		}, 5000);
	}

	// Download pages: highlight the row for the visitor's operating system (from the browser; not phones and tablets)
	const ua = navigator.userAgentData?.platform || navigator.userAgent;
	const os = /Android|iPhone|iPad/.test(navigator.userAgent) ? null
		: /win/i.test(ua) ? "windows" : /mac/i.test(ua) ? "mac" : /linux/i.test(ua) ? "linux" : null;
	if (os) document.querySelector(`.downloads__row[data-os="${os}"]`)?.classList.add("is-yours");

	// Code boxes: a "Copy" button at the top right (the box is wrapped, so the button stays put when the code scrolls sideways)
	const copyOldWay = (text) => {
		const area = Object.assign(document.createElement("textarea"), { value: text });
		area.style.cssText = "position:fixed;opacity:0";
		document.body.append(area);
		area.select();
		let ok = false;
		try { ok = document.execCommand("copy"); } catch {}
		area.remove();
		return ok;
	};
	{
		const icon = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="9" rx="1.5"/><path d="M3.5 10.5h-.5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v.5"/></svg>';
		for (const pre of document.querySelectorAll(".content pre")) {
			let box = pre.parentElement;
			if (!box.matches("figure.code")) {
				box = document.createElement("div");
				box.className = "codebox";
				pre.before(box);
				box.append(pre);
			}
			const copy = document.createElement("button");
			copy.type = "button";
			copy.className = "copy-code";
			copy.innerHTML = `${icon}<span>Copy</span>`;
			copy.setAttribute("aria-label", "Copy code");
			copy.addEventListener("click", async () => {
				// (just the commands, if the box shows commands and their output)
				const cmds = [...pre.querySelectorAll(".cmd")].map((c) => c.textContent);
				const text = cmds.length ? cmds.join("\n") : pre.textContent.replace(/\n$/, "");
				let ok = true;
				try {
					await navigator.clipboard.writeText(text); // (throws if there is no clipboard API)
				} catch {
					ok = copyOldWay(text); // (where the clipboard API is refused, e.g. some embedded browsers)
				}
				copy.lastChild.textContent = ok ? "Copied" : "Failed";
				copy.classList.add("is-done");
				setTimeout(() => { copy.lastChild.textContent = "Copy"; copy.classList.remove("is-done"); }, 1500);
			});
			box.append(copy);
		}
	}

	const button = document.querySelector(".menu-toggle");
	const nav = document.getElementById("site-nav");
	if (!button || !nav) return;
	button.hidden = false;
	button.addEventListener("click", () => {
		const open = button.getAttribute("aria-expanded") !== "true";
		button.setAttribute("aria-expanded", String(open));
		nav.classList.toggle("is-open", open);
	});
});
