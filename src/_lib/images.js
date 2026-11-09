// Images in Markdown pages: their pixel size (so pages can give width and height, and lay out before
// images load), and figures with captions: an image with a title, ![alt](file.png "Caption"),
// alone in a paragraph or in a "::: plots" grid, becomes <figure> with the title as its caption.
// Not in the manual, which keeps to plain Markdown images.

import fs from "node:fs";
import path from "node:path";

const sizes = new Map();

// Width and height of a PNG, GIF or JPEG file, from its header (or null)
export function imageSize(file) {
	if (sizes.has(file)) return sizes.get(file);
	let size = null;
	try {
		const fd = fs.openSync(file, "r");
		const b = Buffer.alloc(64 * 1024);
		const n = fs.readSync(fd, b, 0, b.length, 0);
		fs.closeSync(fd);
		if (b.toString("ascii", 1, 4) === "PNG") size = [b.readUInt32BE(16), b.readUInt32BE(20)];
		else if (b.toString("ascii", 0, 3) === "GIF") size = [b.readUInt16LE(6), b.readUInt16LE(8)];
		else if (b[0] === 0xff && b[1] === 0xd8) {
			// JPEG: the first start-of-frame marker (C0-CF, except C4, C8 and CC) has the size
			for (let i = 2; i + 9 < n; ) {
				if (b[i] !== 0xff) break;
				const marker = b[i + 1];
				if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
					size = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
					break;
				}
				i += 2 + b.readUInt16BE(i + 2);
			}
		}
	} catch {}
	sizes.set(file, size);
	return size;
}

// The file an image URL in a page refers to (absolute, or relative to the page's own folder)
function imageFile(src, inputPath) {
	if (/^[a-z]+:|^\/\//i.test(src)) return null;
	const clean = decodeURIComponent(src.split(/[?#]/)[0]);
	return clean.startsWith("/") ? path.join("src", clean) : path.join(path.dirname(inputPath), clean);
}

export function images(md) {
	// Mark the images to show as figures, and hide the paragraphs around them
	md.core.ruler.push("image_figures", (state) => {
		const file = state.env?.page?.inputPath;
		if (!file || file.includes("/manual/")) return;
		let plots = 0;
		state.tokens.forEach((t, i) => {
			if (t.type === "container_plots_open") plots++;
			if (t.type === "container_plots_close") plots--;
			if (t.type !== "inline" || state.tokens[i - 1]?.type !== "paragraph_open") return;
			const items = t.children.filter((c) => !/^(softbreak|link_open|link_close)$/.test(c.type) && !(c.type === "text" && !c.content.trim()));
			if (!items.length || items.some((c) => c.type !== "image")) return;
			if (plots) {
				for (const image of items) image.meta = { ...image.meta, figure: true };
			} else if (items.length === 1 && items[0].attrGet("title") && !t.children.some((c) => c.type === "link_open")) {
				items[0].meta = { ...items[0].meta, figure: true, single: true };
			} else return;
			state.tokens[i - 1].hidden = state.tokens[i + 1].hidden = true;
		});
	});
	const image = md.renderer.rules.image;
	md.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const file = env?.page?.inputPath;
		// (width and height from the file, unless given: the browser keeps the space while the image loads)
		if (file && !file.includes("/manual/") && !token.attrGet("width")) {
			const size = imageFile(token.attrGet("src"), file) && imageSize(imageFile(token.attrGet("src"), file));
			if (size) {
				token.attrSet("width", String(size[0]));
				token.attrSet("height", String(size[1]));
				// (a named size never stretches an image beyond its own pixels)
				if (/\b(small|medium|large)\b/.test(token.attrGet("class") || "")) token.attrSet("style", `max-width: min(100%, ${size[0]}px)`);
			}
		}
		if (!token.meta?.figure) return image(tokens, idx, options, env, self);
		const caption = token.attrGet("title");
		token.attrs = token.attrs.filter(([name]) => name !== "title");
		const cls = token.meta.single ? "figure figure--single" : "figure";
		return `<figure class="${cls}">${image(tokens, idx, options, env, self)}${caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : ""}</figure>`;
	};
}
