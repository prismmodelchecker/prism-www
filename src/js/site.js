// Small-screen behaviour: collapsible section contents and menu toggle. Without JS, everything is shown.

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
	// On small screens, start the section contents (e.g. manual) collapsed so the page text comes first
	if (window.matchMedia("(max-width: 59.99rem)").matches) {
		for (const d of document.querySelectorAll(".local-nav__details")) d.open = false;
	}

	// Keep the current page visible in a long, independently scrolling contents sidebar
	const current = document.querySelector(".manual-nav a[aria-current=page]");
	const sidebar = current && current.closest(".manual-nav");
	if (sidebar && window.matchMedia("(min-width: 60rem)").matches) {
		sidebar.scrollTop = current.offsetTop - sidebar.clientHeight / 3; // offsetTop is relative to the (sticky) sidebar
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
