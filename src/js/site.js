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

	// The slideshow on the home page: a new image slides in every 5 seconds, except while the pointer
	// is over it or the page isn't in view. Without JS, or for people who prefer less motion, it stays on the first
	const show = document.querySelector(".slideshow");
	if (show && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		const slides = [...show.children];
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
