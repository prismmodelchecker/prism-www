// Folders of files that aren't in git (papers, releases, artefacts, ...): on the server they're
// symlinks to storage outside the web folder, listed in scripts/linked-folders.txt.

import fs from "node:fs";

export const LINKED_FOLDERS = fs.readFileSync(new URL("../../scripts/linked-folders.txt", import.meta.url), "utf8")
	.split("\n").filter((l) => /^\w/.test(l)).map((l) => l.split(/\s+/)[0]);

// URL paths inside those folders
export const LARGE_FILE = new RegExp(`^/(${LINKED_FOLDERS.join("|")})/`);

// Local builds don't have them, so links to them go to the live site; the build on qav sets this to ""
export const LARGE_FILE_ORIGIN = process.env.LARGE_FILE_ORIGIN ?? "https://www.prismmodelchecker.org";
