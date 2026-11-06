---
layout: layouts/base.njk
title: Download PRISM-games
section: games
permalink: /games/download/
---
{% set release = releases.games %}

# PRISM-games: Download

PRISM-games is **free** and **open source** software,
distributed under the [GNU General Public License](https://www.gnu.org/licenses/) (GPL), version 2.

## Download

PRISM-games should run on 32/64-bit versions of all major operating systems.

{% include "partials/download-list.njk" %}

## Latest version: {{ release.version }}

The current version of PRISM-games is **{{ release.version }}** (first released {{ release.released | longDate }}).

The main changes since the last major release ({{ release.previous }}) are listed below.
See the [CHANGELOG](https://github.com/prismmodelchecker/prism-games/blob/master/CHANGELOG.txt) for full details.

- Import/export from/to [UMB (Unified Markov Binary)](https://github.com/pmc-tools/umb/) format
- Improved support for external libraries (Z3/Yices/PPL) including PPL on Windows
- Symbolic (MTBDD) model checking of turn-based stochastic games (SMGs) (see {% cite "KNPS22b" %})
- Correlated and fair equilibria for CSGs (see {% cite "KNPS22" %})
- Add instantaneous (`I=k`) and cumulative (`C<=k`) rewards for SMGs
- Merged latest changes from PRISM (up to v4.10.1) and extensions:
  - [improved strategy generation](/manual/RunningPRISM/Strategies/) (`-exportstrat` and GUI)
  - major code refactoring, e.g., generic model classes
- Refactoring of CSG related classes

## Installation

See [here](/games/installation/) for installation instructions.

If you are stuck, post a message in the
[forum](https://groups.google.com/group/prismmodelchecker).
