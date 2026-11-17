---
layout: layouts/base.njk
title: "PRISM tutorial"
section: doc
permalink: /tutorial/
cards:
  - title: Knuth's die algorithm
    url: /tutorial/die/
    icon: tutorial/die
    note: Start here
    text: A randomised algorithm, due to Knuth, for modelling a 6-sided die with a fair coin. Introduces the basics of the PRISM modelling language and the PRISM tool.
    tags: [DTMC]
  - title: Herman's self-stabilisation algorithm
    url: /tutorial/herman/
    icon: tutorial/herman
    text: Another simple randomised algorithm, a self-stabilisation protocol due to Herman, introducing more features of PRISM's modelling and property languages.
    tags: [DTMC]
  - title: Robot navigation
    url: /tutorial/robot/
    icon: tutorial/robot
    text: A robot navigating through an uncertain environment, using Markov decision processes to generate control policies from temporal logic specifications.
    tags: [MDP, strategies]
  - title: Autonomous drone
    url: /tutorial/drone/
    icon: tutorial/drone
    text: An autonomous drone, using interval MDPs to add epistemic uncertainty about the precise values of transition probabilities.
    tags: [IMDP, uncertainty]
  - title: Dynamic power management
    url: /tutorial/power/
    icon: tutorial/power
    text: A controller for a dynamic power management system, as a multi-component system in continuous time.
    tags: [CTMC]
  - title: Circadian clock
    url: /tutorial/circadian/
    icon: tutorial/circadian
    text: A biological system, the circadian clock, studied with PRISM.
    tags: [CTMC, biology]
  - title: EGL contract signing protocol
    url: /tutorial/egl/
    icon: tutorial/egl
    text: A case study from computer security, the EGL contract signing protocol.
    tags: [DTMC, security]
  - title: Dining philosophers problem
    url: /tutorial/phil/
    icon: tutorial/phil
    text: Verifying a simple distributed randomised algorithm, the dining philosophers problem.
    tags: [MDP]
---
# PRISM tutorial

This tutorial introduces PRISM using a selection of example models.
If you are new to the tool, start by working through the first part (Knuth's die algorithm) to see the basics.
After that, you can look at the remaining parts in any order, depending on which models or applications interest you.
If anything is unclear, the best place to look for answers is the [PRISM manual](/manual/).

{% include "partials/cards.njk" %}
