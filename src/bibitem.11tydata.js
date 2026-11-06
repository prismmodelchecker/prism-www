import { itemTitle, scholarMeta } from "./_lib/bib.js";

// Computed in JS rather than front matter so titles and meta tags aren't HTML-escaped twice
export default {
	eleventyComputed: {
		title: (data) => itemTitle(data.item),
		headExtra: (data) => scholarMeta(data.item),
	},
};
