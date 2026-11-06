// Text in the benchmark suite's models.json files, as HTML

import { itemUrl } from "./bib.js";

const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const cite = (key) => `[<a class="prism-cite" href="${itemUrl(key)}">${key}</a>]`;

// Descriptions and notes: plain text, with citations as [KEY]
export function benchmarkText(text) {
	return escapeHtml(text || "").replace(/\[([A-Za-z0-9+]+)\]/g, (m, key) => cite(key));
}

export function benchmarkCite(key) {
	return key ? cite(key) : "";
}

// A model or property parameter: N (number of processes: e.g. 2,4,6)
export function benchmarkParam(param) {
	const values = param["suggested-values"];
	const details = [param.description && escapeHtml(param.description),
		values && (Array.isArray(values) ? `e.g. ${values.join(",")}` : escapeHtml(values))].filter(Boolean).join(": ");
	return `<code>${escapeHtml(param.name)}</code>` + (details ? ` (${details})` : "");
}
