---
layout: layouts/base.njk
title: "PRISM-games: Compositional Strategy Synthesis"
section: games
permalink: /games/compositional/
---
# PRISM-games: Compositional Strategy Synthesis

## Compositional Modelling { #modelling }

In order to support compositional (assume-guarantee) strategy synthesis, PRISM-games[\*](#footnote1) provides an additional, *compositional* approach to modelling. This is specifically for the case of stochastic *two-player* games. Two composition operators are supported. Using the `system` ... `endsystem` construct, several subsystems can be composed into a top-level system. Each subsystem comprises several modules, combined using PRISM's usual parallel composition. Rather than using `player` ... `endplayer` constructs for player assignments, player 1 transitions are denoted by appending an ! to the action label; similarly, player 2 transitions are those with actions ending in ?. See the example below for a top-level system consisting of two subsystems `S1` and `S1`, each of which consists of one module.

{% prismCode "games/examples/comp_example.prism", false, true %}

## Assume Guarantee { #ag }

To support compositional (assume-guarantee) synthesis, the `comp` keyword allows you to specify a property for each subsystem of a top-level system. This allows you, in particular, to display compositional Pareto sets by being able to associate the properties of the respective components with each other.

See the example below for a set of specifications for the compositional model above, indicating synthesis according to the asymmetric synthesis rule of {% cite "BKW14" %}.

{% prismCode "games/examples/comp_example.props", false, false %}

For an example of the compositional strategy synthesis functionality, see the [room temperature control](https://github.com/prismmodelchecker/prism-games/tree/compo/prism/examples-distr/games/temperature) case study, described in more detail in {% cite "Wil15" %}.

* * *

<a id="footnote1"></a>\* *Currently, compositional functionality is kept in a [separate branch](https://github.com/prismmodelchecker/prism-games/tree/compo) of PRISM-games.*
