// Tables in Markdown pages (not the manual, which sticks to what GitHub shows).
// Besides plain pipe tables, markdown-it-multimd-table allows merged cells ("||" joins a cell to the one
// on its left, "^^" to the one above), row groups (a blank line) and tables with no header.
// Column groups, marked with a heavier line, come from the top row of the header: each cell there
// starts a group, and cells spanning all of the header rows at its start form one. For other tables,
// give the sizes of the groups on a line of their own above the table: {: columns="1 2" }

import multimdTable from "markdown-it-multimd-table";

const COLUMNS = /^\{:\s*columns="([\d ]+)"\s*\}$/;

const span = (token, name) => Number(token.attrGet(name) || 1);

// The sizes of the column groups, from the tokens of a table's header
function headerGroups(tokens, open) {
	if (tokens[open + 1]?.type !== "thead_open") return [];
	const firstRow = [];
	for (let i = open + 3; tokens[i].type !== "tr_close"; i++) if (tokens[i].type === "th_open") firstRow.push(tokens[i]);
	const headerRows = tokens.slice(open).findIndex((t) => t.type === "thead_close");
	const rows = tokens.slice(open, open + headerRows).filter((t) => t.type === "tr_open").length;
	if (rows < 2 && firstRow.every((t) => span(t, "colspan") === 1)) return [];
	const groups = [];
	let leading = 0;
	let i = 0;
	for (; i < firstRow.length && span(firstRow[i], "rowspan") === rows; i++) leading += span(firstRow[i], "colspan");
	if (leading) groups.push(leading);
	for (; i < firstRow.length; i++) groups.push(span(firstRow[i], "colspan"));
	return groups;
}

export function tables(md) {
	// (for markdown-it 14.3 on: the plugin dates from before this was removed)
	md.utils.assign ??= Object.assign;
	md.use(multimdTable, { multiline: true, rowspan: true, headerless: true, multibody: true });

	md.core.ruler.push("table_columns", (state) => {
		const file = state.env?.page?.inputPath?.includes("/manual/") ? null : state.env?.page?.inputPath;
		const tokens = state.tokens;
		for (let i = tokens.length - 1; i >= 0; i--) {
			// (column alignment is for the data: headers are centred)
			if (tokens[i].type === "th_open" && file) tokens[i].attrs = tokens[i].attrs?.filter(([name]) => name !== "style") ?? null;
			if (tokens[i].type !== "table_open") continue;
			const given = tokens[i - 2]?.type === "inline" && tokens[i - 2].content.match(COLUMNS);
			tokens[i].meta = { columns: given ? given[1].trim().split(/\s+/).map(Number) : headerGroups(tokens, i) };
			if (given) {
				tokens.splice(i - 3, 3);
				i -= 3;
			}
		}
	});

	// Wide tables scroll inside their own box on small screens, and can be scrolled with the keyboard
	md.renderer.rules.table_open = (tokens, idx, options, env) => {
		const file = env?.page?.inputPath;
		const cls = file && !file.includes("/manual/") ? ' class="prism-table"' : "";
		const groups = tokens[idx].meta?.columns || [];
		const cols = groups.length > 1 ? groups.map((n) => (n > 1 ? `<colgroup span="${n}"></colgroup>` : "<colgroup></colgroup>")).join("") + "\n" : "";
		return `<div class="table-scroll" tabindex="0" role="region" aria-label="Table">\n<table${cls}>\n${cols}`;
	};
	md.renderer.rules.table_close = () => "</table>\n</div>\n";
}
