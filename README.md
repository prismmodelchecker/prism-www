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

The site is built on qav itself, by `scripts/prism-www-build.sh` from cron (every 5 minutes). Each run fetches this repo,
the manual and the benchmark suite's data from GitHub and exports the bibliography, and rebuilds only if one of them changed; a push (or a
bibliography edit) is live within a few minutes. The build is copied into the web folder with rsync, and the
folders of large files are symlinks there (see below), which it leaves alone. On qav, the checkouts it uses are in
`~/prism/` (`prism-www`, `prism`, `prism-benchmarks`), and the web folder is `~/prism-www-public`. Its log is
`~/prism/prism-www-build/build.log`; `scripts/prism-www-build.sh --force` rebuilds regardless.
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
  from data or are mostly script (home page, news, `bibitem`, `search`, `view`, and so on).
  Markdown pages may use the same template tags (`{% cite "KNP11" %}`,
  `{% prismCode "casestudies/examples/die.pm" %}`, `{% task %}`, `{{ releases.prism.version }}`); the manual is plain Markdown
  An image alone in a paragraph is shown as a figure, and a heading can set its own anchor (`## Introduction { #intro }`;
  the space matters, as `{#` starts a Nunjucks comment). The manual uses neither
  Styles from `site.css` can be added to blocks and inline elements: see "Styles for Markdown pages" below.
  Tables can have merged cells, row groups and column groups (see `src/_lib/tables.js`). The manual uses none of these,
  so that it reads properly on GitHub
- `src/htaccess.njk` – generates the server's redirects from old URLs
- `scripts/` – `sync-manual.js` and `manual-offline.js` (manual), `export-bib.php` and `export-bib.js` (database export),
  `prism-www-build.sh` and `linked-folders.txt` (publishing), `check-links.js`
- `archive/` – old material kept with the source but not published (extract into `src/courses/` to build it):
  `courses-pmc-2010-2023.tar.xz`, the PMC practicals 2010–11 to 2022–23, and `courses-aims-2014-2019.tar.xz`,
  the AIMS quantitative verification sessions 2014–15 to 2018–19, as they were on this site (Markdown)

## Styles for Markdown pages

All styles are in `src/css/site.css`, with colours, corner radii and so on as tokens at the top
(and a dark-mode set). In Markdown, a block style goes around blocks with `:::` lines, and an inline style
goes in `{.name}` straight after an element. A block inside another needs fewer colons than the outer one:

```
:::: columns
::: box
## Heading
Text...
:::
::::
```

Blocks (registered in `eleventy.config.js`; the home page, `src/index.md`, uses most of them):

- `::: banner` – white text on the blue gradient. A list inside it shows as outlined labels, without bullets.
- `::: slideshow` – the images inside (one per paragraph) shown one at a time, a new one sliding in every
  5 seconds (`src/js/site.js`); in a banner it floats on the right
- `::: columns` – the blocks inside side by side, as many as fit (one on phones)
- `::: box` – a white panel with a border and light shadow; its `##` heading is smaller
- `::: questions` – each paragraph and the code block after it as one item, with a blue bar down the side
- `::: answer` – the same bar and tint, around an answer in a tutorial or practical
- `::: labels` – a list as pale labels in the word cloud's colours, for a white background
- `::: plots` – the images inside (one per line) as a grid of figures, two or three across (one on phones),
  each captioned by its Markdown title: `![plot of ...](/images/graphs/x.png "Caption")`;
  `::: plots pairs` keeps exactly two across

Inline:

- `{.wordmark}` – text in the blue gradient of the site title: `**PRISM**{.wordmark}`
- `{.note}` – smaller, muted text: `*(by James Broad)*{.note}`; `{.caption}` – a centred caption under an image
- Images: an image alone in a paragraph with a title is a figure, with the title as its caption
  (`![plot of ...](x.png "Caption")`). Images are shown at most their own size (the width and height
  are read from the file when the site is built), and one shown smaller than its file can be clicked to see it
  full size. Sizes: `{.small}`, `{.medium}`, `{.large}` (at most 16, 28 and 44rem wide); `{.right}` floats an image right.
  Several images in one paragraph are shown side by side (`::: plots` is better for a set of plots).

Code blocks (fenced, with a language), in the colours of the `--tok-*` tokens:

- ```` ```prism ```` and ```` ```pepa ```` – highlighted by our own code (`src/_lib/prism-highlight.js`)
- ```` ```shell ```` – commands, each shown after a blue `$` (not part of the text, so not copied); lines starting `#`
  are the commands' output, shown in grey without the `#` (the manual's convention). A block starting `#!` is a script,
  highlighted as one
- other languages (```` ```xml ````, ```` ```java ````, ```` ```python ````, ...) – highlighted by highlight.js
  when the site is built; ```` ```text ```` is left plain
- Every code box has a Copy button at its top right (`src/js/site.js`); where a box shows commands and their output,
  it copies just the commands

Maths: LaTeX between dollar signs, as on GitHub: `$p_f$` inline, `$$ ... $$` for a displayed formula.
KaTeX renders it when the site is built (`markdown-it-texmath`), and only pages with maths load its stylesheet
and fonts (`/css/katex/`, copied from `node_modules`). A `$` in ordinary text would need escaping as `\$`.
The offline manual has its own copy, in `katex/` next to its `index.html`.

## Page titles

Each page has a `title` in its front matter (the browser tab, as "Title – PRISM", and search results)
and its own `# Heading` at the top of the body; the two match.

- **Sentence case**: "Bounded retransmission protocol", "Installing PRISM-games". Proper nouns, product
  names and acronyms keep their capitals (PRISM, PRISM-games, IEEE 802.11, FireWire, Zeroconf, Knuth & Yao).
- **No "PRISM" prefix** just to say where you are ("PRISM - People" is "People"); keep it where it means
  something ("Download PRISM", "PRISM publications" next to "External publications").
- **Self-contained**: a title makes sense on its own in a browser tab or a search result, without
  "Section: page" or "Section - page" ("PRISM-games: Installation" is "Installing PRISM-games",
  "PRISM Benchmark Suite - Models" is "Benchmark models"). Pages that would otherwise share a title
  say how they differ ("Randomised dining philosophers (Lynch, Saias & Segala)").
- **No separators** inside a title; where one is unavoidable, a colon ("Dynamic power management: IBM disk drive").
- The heading is plain text: links (e.g. to a summer school's site) and badges go in the text below it.
- Pages inside a course or lecture series: the heading is the page's own ("Practical 1"), and the title adds
  the course's short name in brackets ("Practical 1 (PMC practicals 2025–26)"), as several years have the same pages.

Above the heading, the layout adds a breadcrumb: the pages above this one, from its URL (each folder above it that
has a page). Front matter can change it: `crumb: "PMC practicals 2025–26"` on a page gives it a shorter label in
the breadcrumbs of the pages below it; `parent: /casestudies/power/` puts a page under one outside its folder;
`breadcrumb: false` leaves it out.

## Large files

Files that belong to a page (course handouts, slides, figures as PDF) are in git, next to the page.
Bigger collections are not: papers, talks and BibTeX files (shared with other sites and the bibliography database,
outside the web folder), and this site's releases and artefacts (`/dl/`, `/files/`, ...), in `~/prism-www-files/`
on qav. `scripts/linked-folders.txt` lists them; in the web folder each one is a symlink, made by `prism-www-build.sh`.
New releases, papers and so on go straight into those folders, not through git.
Local builds don't have them, so links to them go to the live site (`LARGE_FILE_ORIGIN` in `src/_lib/assets.js`).

## Old URLs

Pages are at `/page/`, bibliography items at `/bibitem/KEY/`, and the publication lists under `/publications/`.
Links to older URLs (such as `/page.php`) are fixed at build time if they are inside pages, and
`src/htaccess.njk` generates redirects for links from elsewhere (`src/_lib/legacy.js` lists the special cases).
