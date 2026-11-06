// {.name} straight after an inline element gives it that class, for styles in site.css:
//   *(by Frank Werner)*{.note}   ![plot](x.png){.half}
// (markdown-it-attrs does this and more, but it rewrites the tables of markdown-it-multimd-table)

const CLASSES = /^\{((?:\.[\w-]+\s*)+)\}/;

// The token that opens the element ending at children[end]
function opening(children, end) {
	const close = children[end];
	if (close.nesting === 0) return close;
	for (let i = end - 1; i >= 0; i--) if (children[i].level === close.level && children[i].nesting === 1) return children[i];
	return null;
}

export function classes(md) {
	md.core.ruler.push("inline_classes", (state) => {
		for (const token of state.tokens) {
			if (token.type !== "inline") continue;
			const children = token.children;
			for (let i = 1; i < children.length; i++) {
				const match = children[i].type === "text" && children[i].content.match(CLASSES);
				if (!match) continue;
				const target = opening(children, i - 1);
				if (!target || target.type === "text") continue;
				for (const name of match[1].trim().split(/[.\s]+/).filter(Boolean)) target.attrJoin("class", name);
				children[i].content = children[i].content.slice(match[0].length);
			}
		}
	});
}
