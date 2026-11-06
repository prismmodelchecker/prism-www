---
layout: layouts/base.njk
title: "CPSWeek 2013"
section: doc
permalink: /lectures/cpsweek13/
pageStyle: ".biblist-count { display:none; }"
---
# Lectures - CPSWeek 2013

Model Checking for Probabilistic Hybrid Systems  
Monday, 8 April, 8.30 am - 12 noon

## Abstract

Probabilistic model checking aims at establishing the correctness of probabilistic system models against quantitative probabilistic specifications, such as those capable of expressing, e.g., the probability of an unsafe event occurring, expected time to termination, or expected power consumption in the startup phase. The theory of hybrid systems, on the other hand, is well-established as a model for real-world systems that captures continuous behaviour and discrete control. By combining these approaches, we can analyse the behaviour of hybrid systems in presence of uncertainties, such as measurement errors, or when using randomised control algorithms. Examples of such probabilistic hybrid systems can be found, e.g., in wireless plant controllers. In this tutorial, we present the foundations of probabilistic model checking and its recent extensions into the hybrid systems area. We give an overview of a range of models, from Markov chains and Markov decision processes, to various flavours of stochastic hybrid automata. We next summarise the core model checking and abstraction techniques applicable to typical quantitative specifications, mainly highlighting safety properties. All the modelling and analysis approaches presented are supported by existing tools, where we focus on the [PRISM model checker](/) {% cite "KNP11" %} and the hybrid extension of the [Modest modelling language](http://www.modestchecker.net/) HModest {% cite "HHHK12" %}. We also demonstrate applicability of the techniques and tools through a selection of case studies.

<ul class="bib-list">{% for item in bib.items | bibSelect({ keys: ["KNP11", "HHHK12"] }) %}<li>{{ item | citation | safe }}</li>{% endfor %}</ul>

## Topic

This tutorial introduces the main approaches to probabilistic modelling and analysis that are applicable to cyber-physical systems, typically modelled as variants of stochastic hybrid automata. We emphasise existing tool support, with a focus on the [PRISM probabilistic model checker](/) and the [Modest modelling language](http://www.modestchecker.net/), and introduce subclasses of probabilistic hybrid automata of increasing complexity, starting from Markov chains and Markov decision process models, through probabilistic timed automata which enhance those with continuous time, to models that allow for hybrid behaviour in presence of probabilistic decisions. PRISM is a probabilistic model checker which uses an extension of Reactive Modules as a modelling formalism and provides native support for discrete-probabilistic models (Markov chains, Markov decision processes and probabilistic timed automata) against probabilistic and timed extensions of CTL and LTL. Such models often arise via discretisation of more complex models. Modest, a high-level modelling language with a formal semantics in terms of stochastic hybrid automata, has been linked to PRISM for probabilistic timed systems based on a translation into PRISM's modelling language, and allows safety verification of stochastic hybrid systems via the [ProHVer tool](http://depend.cs.uni-saarland.de/tools/prohver/). Both PRISM and Modest have been applied to a wide range of case studies, including wireless sensor networks, decentralised control algorithms for electric power generation, microgrid demand management and avionic systems.

These topics are intimately connected to the modelling and analysis of cyber-physical systems. Such systems combine discrete control and continuous behaviour but are subject to uncertainty w.r.t. failures or outside influences. Therefore, when analysing safety/dependability, as well as performability, of such systems we must consider failure probabilities, probabilistic delays and randomisation, for which probabilistic model checking is typically employed.

## Format of the Tutorial

The tutorial is divided into 3 parts of equal duration.

-   [Part 1: Probabilistic models and probabilistic model checking](/lectures/cpsweek13/prob-part1.pdf) ([Part 1b: MDP demos](/lectures/cpsweek13/prob-demo-part1b.pdf))
-   [Part 2: Probabilistic hybrid systems](/lectures/cpsweek13/pha-part2.pdf)
-   [Part 3: Tools and case studies](/lectures/cpsweek13/tools-part3.pdf)

The speakers have presented the underlying theories implemented in the tools and illustrate them with several concrete examples. For the latter, the speakers have used tool demonstrations. Most of the examples are derived from national and European projects.

## Organisers

### Marta Kwiatkowska

[University of Oxford, UK](http://www.ox.ac.uk/)

[Marta Kwiatkowska](http://www.cs.ox.ac.uk/people/Marta.Kwiatkowska/) is Professor of Computing Systems and Fellow of [Trinity College, University of Oxford](http://www.trinity.ox.ac.uk/). She led the development of probabilistic and quantitative methods in verification on the international scene. The PRISM model checker is the leading software tool in the area and is widely used for research and teaching. Applications of probabilistic model checking have spanned communication and security protocols, nanotechnology designs, power management and systems biology. Kwiatkowska's research is currently supported by £3.7m of grant funding from EPSRC, EU and ERC, including [the ERC Advanced Grant VERIWARE "From software verification to everyware verification"](http://www.veriware.org/). Marta Kwiatkowska was Milner Lecturer 2012 and invited speaker at LICS, ETAPS/FASE and SAFECOMP. She is a member of Academia Europea and serves on editorial boards of several journals, including IEEE Transactions on Software Engineering, Science of Computer Programming and Formal Methods in System Design.

### Holger Hermanns

[Saarland University, Germany](http://www.uni-saarland.de/)

[Prof. Holger Hermanns](http://depend.cs.uni-saarland.de/hermanns) is chair for [Dependable Systems and Software](http://depend.cs.uni-saarland.de/), and former Dean of the Faculty of Mathematics and Computer Science at Saarland University, Saarbrücken, Germany. He studied at the University of Bordeaux, France, and the University of Erlangen-Nürnberg, Germany, where he received a Doctoral degree with honours in 1998. He held research positions at University of Twente, the Netherlands and INRIA Grenoble, France. He is the first ever computer science laureate of the Dutch national innovation award 'Vernieuwingsimpuls'. His research interests include modelling and verification of concurrent systems, resource-aware embedded systems, and compositional performance and dependability evaluation, including dependable energy distributiion grids. In these areas he has authored or co-authored more than 140 peer-reviewed scientific papers (h-index 38). He was invited speaker among others at CONCUR, SEFM and ETAPS/TACAS, has co-chaired the programme committees of major international conferences such as CAV, CONCUR, QEST and TACAS. He serves on the steering committees of ETAPS and QEST, is a founding member and principal investigator of [the German special research initiative AVACS](http://www.avacs.org), and holds several other national and European research grants.

## Attendee Profile

The main target audience are researchers and students from academia. However, in view of our focus on software tools our tutorial is of interest and accessible to industry participants as well.
