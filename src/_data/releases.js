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
	// Pre-built binaries, as /dl/<file>-<version>-<id><ext>, grouped by operating system
	// (os: as the download page's script recognises the visitor's system)
	platforms: [
		{ os: "linux", name: "Linux", files: [
			{ id: "linux64-x86", label: "x86", note: "64-bit", ext: ".tar.gz" },
			{ id: "linux64-arm", label: "Arm", note: "64-bit", ext: ".tar.gz" },
		] },
		{ os: "mac", name: "macOS", files: [
			{ id: "mac64-arm", label: "Apple silicon", note: "Arm", ext: ".tar.gz" },
			{ id: "mac64-x86", label: "Intel", note: "x86", ext: ".tar.gz" },
		] },
		{ os: "windows", name: "Windows", files: [
			{ id: "win64-x86-installer", label: "Installer", note: "64-bit x86", ext: ".exe" },
		] },
	],
};
