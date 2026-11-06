#!/bin/bash
# Build the site on qav and copy it into the web folder; run from cron every few minutes:
#   */5 * * * * $HOME/prism/prism-www/scripts/prism-www-build.sh >> $HOME/prism/prism-www-build/build.log 2>&1
# Each run fetches the site, the manual and the benchmark suite's data from GitHub and exports the
# bibliography; it only rebuilds if one of them changed (or with --force). A failed build leaves the web folder as it was.
# First time: git clone https://github.com/prismmodelchecker/prism-www.git ~/prism/prism-www; mkdir ~/prism/prism-www-build
# The checkouts in ~/prism are side by side, as on a development machine, and belong to this script: it resets them.
# The folders in scripts/linked-folders.txt are symlinks in the web folder, made here; nothing deletes them.
# Settings (environment): PRISM_WWW_DEST (web folder).

set -euo pipefail

# (All in a function, so bash has read the whole script before git updates it)
main() {
	local src="$HOME/prism" work="$HOME/prism/prism-www-build"
	local dest="${PRISM_WWW_DEST:-$HOME/prism-www-public}"
	local manual_repo=https://github.com/prismmodelchecker/prism.git manual_ref=master
	local benchmarks_repo=https://github.com/prismmodelchecker/prism-benchmarks.git
	export PATH="$HOME/opt/node/bin:$PATH"
	# (the linked folders are on this server, so links to them stay local)
	export LARGE_FILE_ORIGIN=""

	# One build at a time: skip this run if the last one is still going
	exec 9> "$work/build.lock"
	flock -n 9 || exit 0

	# Site: this repo
	cd "$src/prism-www"
	git fetch -q origin main
	git reset -q --hard origin/main

	# Manual: just doc/manual from the PRISM repo
	if [ ! -d "$src/prism" ]; then
		git clone -q --filter=blob:none --sparse --single-branch --branch "$manual_ref" "$manual_repo" "$src/prism"
		git -C "$src/prism" sparse-checkout set doc/manual
	fi
	git -C "$src/prism" fetch -q origin "$manual_ref"
	git -C "$src/prism" reset -q --hard FETCH_HEAD

	# Benchmark suite: just the models.json files
	if [ ! -d "$src/prism-benchmarks" ]; then
		git clone -q --filter=blob:none --sparse --single-branch --branch master "$benchmarks_repo" "$src/prism-benchmarks"
		git -C "$src/prism-benchmarks" sparse-checkout set --no-cone '/models/*/models.json'
	fi
	git -C "$src/prism-benchmarks" fetch -q origin master
	git -C "$src/prism-benchmarks" reset -q --hard FETCH_HEAD

	# Bibliography: export locally (bib.json is only rewritten if the data changed)
	BIB_HOST="" node scripts/export-bib.js > /dev/null

	# Rebuild if anything is different from the last build
	local state
	state="$(git rev-parse HEAD) $(git -C "$src/prism" rev-parse HEAD) $(git -C "$src/prism-benchmarks" rev-parse HEAD) $(sha256sum src/_data/bib.json | cut -c1-16)"
	if [ "${1:-}" != "--force" ] && [ "$state" = "$(cat "$work/built" 2>/dev/null)" ]; then
		exit 0
	fi

	echo "$(date '+%F %T') building: $state"
	# (dependencies only change with the lock file)
	local deps
	deps="$(sha256sum package-lock.json | cut -c1-16) $(node -v)"
	if [ "$deps" != "$(cat "$work/deps" 2>/dev/null)" ]; then
		npm ci --no-audit --no-fund --loglevel=error
		echo "$deps" > "$work/deps"
	fi
	npm run --silent build
	# Linked folders: make (or update) the symlinks, and protect them from rsync --delete
	# (as well as /.well-known, where the server's certificate tools keep their files)
	local name target protect=(--filter="P /.well-known")
	while read -r name target; do
		if [ -e "$dest/$name" ] && [ ! -L "$dest/$name" ]; then
			echo "$dest/$name is not a symlink: leaving it" >&2
		elif [ "$(readlink "$dest/$name")" != "$target" ]; then
			ln -sfn "$target" "$dest/$name"
		fi
		protect+=(--filter="P /$name")
	done < <(grep -E '^\w' scripts/linked-folders.txt)
	rsync -rlpt --delete "${protect[@]}" _site/ "$dest/"
	echo "$state" > "$work/built"
	echo "$(date '+%F %T') done"
}

main "$@"
