---
layout: layouts/base.njk
title: Download PRISM
section: downloads
permalink: /download/
---
{% set release = releases.prism %}

# Download PRISM

PRISM is **free** and **open source** software,
distributed under the [GNU General Public License](https://www.gnu.org/licenses/) (GPL), version 2.

<div class="release-strip">
<p><strong>{{ release.name }} {{ release.version }}</strong> <span>released {{ release.released | longDate }}</span></p>
<p><a href="#new">What's new in {{ release.version }}</a></p>
</div>

{% include "partials/download-list.njk" %}

## What's new in {{ release.version }} { #new }

The main changes since the last major release ({{ release.previous }}) are listed below.
See the [CHANGELOG](https://github.com/prismmodelchecker/prism/blob/master/CHANGELOG.txt) for full details.

- Expanded support for reward properties
  - full support for total reward (`R[C]`)
  - discounted rewards for DTMCs/MDPs
  - extra support for MTBDD/hybrid engines
- Other model checking improvements
  - SCC/EC computation optimisations (iterative Tarjan, speed/memory fixes)
  - MDP solution via linear programming in explicit engine (`-lp`)
  - counterexamples/witnesses for `E[F]`, `A[G]` in the explicit engine
  - various fixes and extensions to optimal strategy generation
- Import/export functionality
  - new combined explicit model format (`.pexp`): single file with
    transitions, states, labels, rewards, observations
  - explicit exports all include (optional) comment headers
  - import/export of zipped (gzip/xz) explicit model files
  - strategy export to full (annotated) induced model, e.g. `.pexp`, `.umb`
  - `-exporttrans`, `-exportstates`, etc. take options (e.g. `precision=x`)
  - faster, lower-memory import/export of UMB files

## Installation

See the [installation instructions](/manual/GettingStarted/Installing/),
included in the [PRISM manual](/manual/) (which is also distributed with the tool).

If you have any problems, first check the list of
[common problems and questions](/manual/GettingStarted/Troubleshooting/).

If you are still stuck, post a message in the
[forum](https://groups.google.com/group/prismmodelchecker).

Once you have installed PRISM, you might want to look at:

- the [PRISM tutorial](/tutorial/)
- these pointers to [introductory information](/about/)
