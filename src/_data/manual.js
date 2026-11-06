// The manual's table of contents, from its README.md files: used for the menu and previous/next links
import { readContents, citations } from "../_lib/manual.js";

export default function () {
	// (warn if the References page, maintained by hand, doesn't match the citations)
	const { cited, listed } = citations();
	const missing = [...cited].filter((k) => !listed.has(k));
	const unused = [...listed].filter((k) => !cited.has(k));
	if (missing.length) console.warn(`[manual] cited but not in References: ${missing.join(", ")}`);
	if (unused.length) console.warn(`[manual] in References but not cited: ${unused.join(", ")}`);
	return readContents();
}
