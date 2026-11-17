---
layout: layouts/base.njk
title: About PRISM
section: about
permalink: /about/
---
{%- macro ref(key) %}{{ bib.items | bibItem(key) | shortCitation | safe }}{% endmacro -%}
# About PRISM

**PRISM**{.wordmark} is a probabilistic model checker: it can be used to build, analyse
and formally verify a wide range of probabilistic models, including
discrete- and continuous-time **Markov chains** (DTMCs/CTMCs), **Markov decision processes** (MDPs),
and various extensions of these models to support real-time, partial observability and epistemic uncertainty.

**PRISM-games**{.wordmark} extends PRISM, adding support for several types of **stochastic games**,
to reason about multi-agent systems and game-theoretic concepts.

These tools are free and [open source](https://github.com/prismmodelchecker/prism),
and include contributions from many [people](/people/).

The [manual](/manual/) is the definitive guide to using PRISM and to the PRISM language,
and the [tutorial](/tutorial/) provides some guided walk-throughs of its functionality.

Pointers to more detailed **background reading** are given below.

## Citing PRISM

To reference PRISM, please cite the tool paper:

-   {{ ref("KNP11") }} ([slides](/talks/dave-cav11.pdf))

To reference [PRISM-games](/games/), please cite the tool paper:

-   {{ ref("KNPS20") }}

## Overviews

An introduction to probabilistic model checking:

-   {{ ref("KNP22") }}

A guide to the many **applications** of probabilistic model checking:

-   {{ ref("KNP25") }}

## Background

Detailed tutorial papers on probabilistic model checking, one per type of model:

-   DTMCs and CTMCs: {{ ref("KNP07a") }}
-   MDPs: {{ ref("FKNP11") }}
-   Probabilistic timed automata: {{ ref("NPS13") }}
-   Stochastic games: {{ ref("SK16") }}

See also:

-   [Lectures](/lectures/): slides from courses on probabilistic model checking and PRISM.
