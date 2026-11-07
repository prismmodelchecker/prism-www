---
layout: layouts/base.njk
title: "Microgrid demand-side management"
section: casestudies
permalink: /casestudies/mdsm/
---
# Microgrid demand-side management

## Contents

-   [Introduction](#intro)
-   [Modelling](#model)
-   [Model Checking](#mc)
-   [Statistics](#stats)

**Related publications**

-   PRISM case study {% cite "CFK+13b", "Sim14" %}
-   Original algorithm {% cite "HS11" %}

## Introduction { #intro }

This case study is based on the distributed energy management algorithm for smart grids by Hildmann & Saffre {% cite "HS11" %}. We performed model checking of the system using [PRISM-games](/games/), an extension of PRISM with support for stochastic multi-player games. For property specifications, we used the logic rPATL, introduced in {% cite "CFK+12", "CFK+13b" %}.

Microgrid is an increasingly popular model for the future energy markets where neighbourhoods use electricity generation from local sources (e.g. wind/solar power) to satisfy local demand. The success of microgrids is highly dependent on the active management of demand by users to avoid peaks. Hildmann & Saffre in {% cite "HS11" %} proposed a distributed algorithm which, if followed by the system users, has been show to reduce the peak demand.

The system in {% cite "HS11" %} consists of **N** *households* connected to a single *distribution manager*. At every time-step, the distribution manager randomly contacts a household for submission of a load for execution. The probability of the household generating a load is determined by a daily demand curve (see below). The duration of a load is chosen uniformly at random between 1 and **D** time-steps. The cost of executing a load for a single step is the number of tasks currently running. Hence, the total cost increases quadratically with households executing more loads in a single step.

Each household follows a very simple algorithm, the essence of which is that, when it generates a load, if the cost is below an agreed limit **c<sub>lim</sub>**, it executes it, otherwise it only does so with a pre-agreed probability **P<sub>start</sub>**. In {% cite "HS11" %}, the *value* for each household in a time-step is measured by **V**\= <sup>loads executing</sup>⁄<sub>cost of execution</sub> and it is shown (through simulations) that, *provided every household sticks to this algorithm*, the peak demand and the total cost of energy are reduced significantly while still providing a good (expected) value **V** for each household.

## Modelling { #model }

We modelled the system as a stochastic multiplayer game (SMG) with **N** players, one per household. We vary **N** from 2 to 7 and fix **D**\=4 and **c<sub>lim</sub>**\=1.5. We analyse a period of 3 days, each of 16 time-steps, using a piecewise approximation of the daily demand curve from {% cite "HS11" %}:

![Daily energy demand curve](/images/cs/mdsm.demand.png)

The model for three households is shown below.

{% prismCode "casestudies/examples/mdsm.prism", true, true %}

The source code for larger models can be found [here](/files/fmsd-smg/).

## Model Checking { #mc }

First, as a benchmark, we assume that all households follow the algorithm of {% cite "HS11" %}. We define several reward structures of the form `valueC`, where **C** is a coalition of households and the reward structure is defined **V**\= <sup>total loads executing</sup>⁄ <sub> total cost of execution</sub> for the coalition **C** and each step. Because each household can execute at most one load in each timestep, for three households, we have:

{% prismCode "casestudies/examples/mdsm_r.prism", false, false %}

To compute the expected value per household, we use the rPATL query:

{% prismCode "casestudies/examples/mdsm1.props", false, false %}

which uses a coalition of all **N** players (households). We use this to determine the optimal value of **P<sub>start</sub>** achievable by a memoryless strategy for each player, which we will then fix. These results are shown by the bold lines in the graphs below, where we vary the total number of households **N**. We also plot (as a dotted line) the values obtained if no demand-side management is applied.

![](/images/cs/mdsm.graph1.png)

Next, we consider the situation where a set of households **C** is allowed to deviate from the pre-agreed strategy, by choosing to ignore the limit **c<sub>lim</sub>** if they wish. We check the same rPATL query as above, but using varying coalitions **C** of sizes from 1 to **N**. For the model of 3 households the following rPATL queries were used:

{% prismCode "casestudies/examples/mdsm2.props", false, false %}

The resulting values are also plotted in graph (a) above, shown as horizontal dashes of width proportional to |**C**|: the shortest dash represents individual deviation, the longest is a collaboration of all households. The former shows the maximum value that can be achieved by following the optimal collaborative strategy, and in itself presents a benchmark for the performance of the original algorithm. The key result is that deviations by individuals or small coalitions guarantee a better expected value for the households than *any* larger collaboration: a highly undesired weakness for an MDSM system.

### Modifying the infrastructure

We propose a simple punishment mechanism that addresses the problem: we allow the distribution manager to cancel *one* job per step if the cost exceeds **c<sub>lim</sub>**. The intuition is that, if a household is constantly abusing the system, its job could be cancelled. The code for the modified scheduler module is shown below.

{% prismCode "casestudies/examples/mdsm_p.prism", false, true %}

The results are shown in graph (b) above. This modification inverts the incentives so that now, for the individual agent, it is better to cooperate. Furthermore, there is a risk of getting a considerably lower payoff if the individual deviation is exercised. The best option now is full collaboration and small coalitions who deviate *cannot* guarantee better expected values any more.

## Model Statistics { #stats }

Finally, we show, in the table below, some statistics for model size, construction time and time for model checking the property:

{% prismCode "casestudies/examples/mdsm3.props", false, true %}

The model checking was performed on a 2.80GHz PC with 32Gb of RAM.

| N:  | Model:    || Model checking:   ||
| ^^  | States:   | Transitions: | Construction (s): | Property (s): |
|-----|-----------|--------------|-------------------|---------------|
| 2   | 5,302     | 8,328        | 0.585             | 0.349         |
| 3   | 33,528    | 82,560       | 1.062             | 3.0           |
| 4   | 178,272   | 473,088      | 2.898             | 16.562        |
| 5   | 743,904   | 2,145,120    | 14.488            | 69.936        |
| 6   | 2,384,369 | 7,260,756    | 56.859            | 232.12        |
| 7   | 6,241,312 | 19,678,246   | 214.974           | 749.62        |
