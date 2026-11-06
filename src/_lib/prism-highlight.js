// Syntax highlighting for PRISM model/property files and PEPA models, done at build time.

// Keywords from PRISM's parser grammar (PrismParser.jj), plus model types
// and PRISM-games constructs that it doesn't list as tokens.
const KEYWORDS = new Set(`
	A C E F G I P R S U W X
	Pmax Pmaxmax Pmaxmin Pmin Pminmax Pminmin Rmax Rmaxmax Rmaxmin Rmin Rminmax Rminmin
	array bool clock const double endinit endinvariant endmodule endobservables endrewards
	endsystem false filter formula func global init int invariant label max maxmax maxmin min
	minmax minmin module nondeterministic observable observables of prob probabilistic rate
	rewards stochastic system true
	dtmc ctmc mdp pomdp pta popta idtmc imdp ipomdp lts smg csg tsg player endplayer
`.trim().split(/\s+/));

const TOKEN = new RegExp([
	/(\/\/[^\n]*)/,                          // 1: comment
	/("(?:[^"\\\n]|\\.)*")/,                 // 2: string / label name
	/(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/,      // 3: number
	/([A-Za-z_][A-Za-z0-9_]*'?)/,            // 4: identifier or keyword
	/(#[^\n#]*#)/,                           // 5: preprocessor (prismpp)
].map((r) => r.source).join("|"), "g");

function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// (many of the model files have Windows line endings: each \r would show as another line break)
const normalise = (code) => code.replace(/\r\n?/g, "\n");

export function highlightPrism(code) {
	code = normalise(code);
	let html = "";
	let last = 0;
	for (const m of code.matchAll(TOKEN)) {
		html += escapeHtml(code.slice(last, m.index));
		const [text, comment, string, number, word, preproc] = m;
		const cls = comment ? "comment" : string ? "string" : number ? "num"
			: preproc ? "preproc" : KEYWORDS.has(word) ? "keyword" : "ident";
		html += `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
		last = m.index + text.length;
	}
	return html + escapeHtml(code.slice(last));
}

// PEPA models, as PRISM imports them: % comments, #Process definitions, and the rate infty
const PEPA_TOKEN = new RegExp([
	/(%[^\n]*)/,                             // 1: comment
	/(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/,      // 2: number
	/(#[A-Za-z_][A-Za-z0-9_]*)/,             // 3: process definition
	/([A-Za-z_][A-Za-z0-9_]*)/,              // 4: identifier or keyword
].map((r) => r.source).join("|"), "g");

export function highlightPepa(code) {
	code = normalise(code);
	let html = "";
	let last = 0;
	for (const m of code.matchAll(PEPA_TOKEN)) {
		html += escapeHtml(code.slice(last, m.index));
		const [text, comment, number, process, word] = m;
		const cls = comment ? "comment" : number ? "num" : process ? "preproc" : word === "infty" ? "keyword" : "ident";
		html += `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
		last = m.index + text.length;
	}
	return html + escapeHtml(code.slice(last));
}
