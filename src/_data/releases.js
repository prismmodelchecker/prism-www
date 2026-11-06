// Current releases: edit here when there's a new release. Used by the download pages
// (partials/download-list.njk), the home page and the manual's version badge.

export default {
	prism: {
		name: "PRISM",
		file: "prism", // download file names start with this
		version: "4.11",
		released: "2026-10-09",
		previous: "4.10.1", // the last major release, for "main changes since ..."
		github: "prismmodelchecker/prism",
	},
	games: {
		name: "PRISM-games",
		file: "prism-games",
		version: "3.2.4",
		released: "2026-04-10",
		previous: "3.1",
		github: "prismmodelchecker/prism-games",
	},
	// Pre-built binaries, as /dl/<file>-<version>-<id><ext>
	platforms: [
		{ id: "linux64-x86", label: "Linux (64-bit, x86)", ext: ".tar.gz" },
		{ id: "linux64-arm", label: "Linux (64-bit, Arm)", ext: ".tar.gz" },
		{ id: "mac64-x86", label: "macOS (64-bit, x86)", ext: ".tar.gz" },
		{ id: "mac64-arm", label: "macOS (64-bit, Arm)", ext: ".tar.gz" },
		{ id: "win64-x86-installer", label: "Windows installer (64-bit, x86)", ext: ".exe" },
	],
};
