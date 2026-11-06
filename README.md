# PRISM website

The source of [www.prismmodelchecker.org](https://www.prismmodelchecker.org/): a static site, using
[Eleventy](https://www.11ty.dev/) for page generation and [Pagefind](https://pagefind.app/) for search.

## Building

```bash
npm install
npm run export-bib   # snapshot the bibliography database (runs on qav over SSH; keeps the old snapshot if it fails)
npm run build        # copy in the manual, build into _site/ with Eleventy, then the Pagefind search index
node scripts/check-links.js   # check internal links and anchors in _site/
```

The manual is copied from a PRISM repo checkout (`doc/manual`): set `PRISM_MANUAL` to its path,
or it defaults to `../prism/doc/manual`. Its conventions are in `doc/README.md` there.
Besides the pages, the build makes the manual on one page (`/manual/all/`). PRISM's `make doc` builds a
self-contained copy of that page for distributions, from its own `doc/manual`, with
`npm run manual-offline -- <doc/manual> <output folder> [version]` (just the manual: no bib export or other files needed).

The benchmark pages are generated from the `models.json` files in a checkout of
[prism-benchmarks](https://github.com/prismmodelchecker/prism-benchmarks): set `PRISM_BENCHMARKS` to its path,
or it defaults to `../prism-benchmarks`.

To preview, serve `_site/` with any static server, e.g. `python3 -m http.server 8080 -d _site`.
(`npm run serve` gives live reload while editing, but doesn't rebuild the search index.)

## Publishing

The site is built on qav itself, by `scripts/qav-build.sh` from cron (every 5 minutes). Each run fetches this repo,
the manual and the benchmark suite's data from GitHub and exports the bibliography, and rebuilds only if one of them changed; a push (or a
bibliography edit) is live within a few minutes. The build is copied into the web folder with rsync, and the
folders of large files are symlinks there (see below), which it leaves alone. On qav, the checkouts it uses are in
`~/prism/` (`prism-www`, `prism`, `prism-benchmarks`), and the web folder is `~/prism-www-public`. Its log is
`~/prism/prism-www-build/build.log`; `scripts/qav-build.sh --force` rebuilds regardless.
Node is installed in `~/opt/node` there (not the system's).

## Layout

- `src/_includes/layouts/` – page templates: `base.njk` (all pages), `manual.njk` (manual pages)
- `src/_data/site.js` – site settings and menus; `releases.js` – current PRISM and PRISM-games releases
  (edit this for a new release: download pages, home page and manual follow); `news.json` – news items;
  `bib.json` – bibliography snapshot (not in git)
- `src/_lib/` – build code: `bib.js` (citations), `prism-highlight.js`
  (PRISM and PEPA syntax highlighting), `manual.js`, `legacy.js` (old URLs), `assets.js` (large files)
- `src/css/site.css` – all styles; colours are tokens at the top, with a dark-mode set.
- `src/**/*.md`, `src/**/*.njk` – pages: Markdown for anything written by hand; Nunjucks (HTML) for pages that are built
  from data or are mostly script (home page, news, `bibitem`, `listing`, `search`, `view`, and so on).
  Markdown pages may use the same template tags (`{% cite "KNP11" %}`,
  `{% prismCode "casestudies/examples/die.pm" %}`, `{% task %}`, `{{ releases.prism.version }}`); the manual is plain Markdown
  An image alone in a paragraph is shown as a figure, and a heading can set its own anchor (`## Introduction { #intro }`;
  the space matters, as `{#` starts a Nunjucks comment). The manual uses neither
  Styles from `site.css` can be added to blocks (`::: answer` ... `:::`) and to inline elements (`*(by ...)*{.note}`).
  Tables can have merged cells, row groups and column groups (see `src/_lib/tables.js`). The manual uses none of these,
  so that it reads properly on GitHub
- `src/htaccess.njk` – generates the server's redirects from old URLs
- `scripts/` – `sync-manual.js` and `manual-offline.js` (manual), `export-bib.php` and `export-bib.js` (database export),
  `qav-build.sh` and `linked-folders.txt` (publishing), `check-links.js`

## Large files

Files that belong to a page (course handouts, slides, figures as PDF) are in git, next to the page.
Bigger collections are not: papers, talks and BibTeX files (shared with other sites and the bibliography database,
outside the web folder), and this site's releases and artefacts (`/dl/`, `/files/`, ...), in `~/prism-www-files/`
on qav. `scripts/linked-folders.txt` lists them; in the web folder each one is a symlink, made by `qav-build.sh`.
New releases, papers and so on go straight into those folders, not through git.
Local builds don't have them, so links to them go to the live site (`LARGE_FILE_ORIGIN` in `src/_lib/assets.js`).

## Old URLs

Pages are at `/page/`, bibliography items at `/bibitem/KEY/`, and the publication lists under `/publications/`.
Links to older URLs (such as `/page.php`) are fixed at build time if they are inside pages, and
`src/htaccess.njk` generates redirects for links from elsewhere (`src/_lib/legacy.js` lists the special cases).
