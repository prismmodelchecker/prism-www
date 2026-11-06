// Snapshot the bibliography database into src/_data/bib.json.
// Runs export-bib.php on the server that hosts bib-db-prism (over SSH), and only replaces
// bib.json if the export succeeded and produced valid JSON with items in it, so a failed
// connection or PHP error leaves the previous snapshot in place.
//   node scripts/export-bib.js   (npm run export-bib)
// The PHP is sent to BIB_HOST and run there with php; on the server itself (the build on qav),
// set BIB_HOST="" to run it locally instead.

import { spawnSync } from "node:child_process";
import fs from "node:fs";

const HOST = process.env.BIB_HOST ?? "dxp@qav.cs.ox.ac.uk";
const OUT = "src/_data/bib.json";

const [cmd, args] = HOST ? ["ssh", [HOST, "php"]] : ["php", []];
const res = spawnSync(cmd, args, {
	input: fs.readFileSync("scripts/export-bib.php"),
	stdio: ["pipe", "pipe", "inherit"],
	maxBuffer: 256 * 1024 * 1024,
});
if (res.error) fail(`could not run ${cmd}: ${res.error.message}`);
if (res.status !== 0) fail(`${[cmd, ...args].join(" ")} exited with status ${res.status}`);

let data;
try {
	data = JSON.parse(res.stdout);
} catch (e) {
	fail(`output is not valid JSON (${e.message}); it starts: ${res.stdout.toString().slice(0, 200)}`);
}
if (!Array.isArray(data.items) || data.items.length === 0) fail("export has no items");

// Leave bib.json alone (and its date) if only the export time differs, so the build on qav can
// tell whether the bibliography changed
const sameData = (a, b) => JSON.stringify({ ...a, exported: null }) === JSON.stringify({ ...b, exported: null });
try {
	if (sameData(JSON.parse(fs.readFileSync(OUT, "utf8")), data)) {
		console.log(`${OUT}: unchanged (${data.items.length} items)`);
		process.exit(0);
	}
} catch {
	// no previous export (or unreadable): write the new one
}

// Write to a temporary file, then rename, so bib.json is never left half-written
fs.writeFileSync(OUT + ".tmp", res.stdout);
fs.renameSync(OUT + ".tmp", OUT);
console.log(`${OUT}: ${data.items.length} items, exported ${data.exported ?? "(no date)"}`);

function fail(msg) {
	console.error(`export-bib: ${msg}\n${OUT} not changed.`);
	process.exit(1);
}
