// Data for every page of the manual (the Markdown copied from the PRISM repo)
import path from "node:path";
import { pageTitle, manualUrl, MANUAL_DIR } from "../_lib/manual.js";

export default {
	layout: "layouts/manual.njk",
	// Plain Markdown, no template tags: PRISM code in the manual uses { } freely
	templateEngineOverride: "md",
	section: "doc",
	isManual: true,
	// (collected for the manual on one page)
	tags: ["manualPage"],
	eleventyComputed: {
		// Group/Page.md -> /manual/Group/Page/, README.md -> /manual/
		permalink: (data) => {
			if (!data.page.inputPath.endsWith(".md")) return data.permalink;
			return manualUrl(path.relative(MANUAL_DIR, data.page.inputPath));
		},
		title: (data) => (data.page.inputPath.endsWith(".md") ? pageTitle(data.page.inputPath) : data.title),
		manualSource: (data) => path.relative(MANUAL_DIR, data.page.inputPath),
	},
};
