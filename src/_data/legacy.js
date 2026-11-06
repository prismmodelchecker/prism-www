// Old URLs, for generating the server's redirects (htaccess.njk)
import { PAGE_URLS, OLD_PATHS, GITHUB_WIKI, manualRedirects } from "../_lib/legacy.js";

export default function () {
	const strip = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/^\//, ""), v]));
	return { pageUrls: strip(PAGE_URLS), oldPaths: strip(OLD_PATHS), githubWiki: GITHUB_WIKI, manual: manualRedirects() };
}
