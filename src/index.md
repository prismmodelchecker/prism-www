---
layout: layouts/base.njk
title: PRISM
description: PRISM is a probabilistic model checker, a tool for formal modelling and analysis of systems that exhibit random or probabilistic behaviour.
newsSidebar: true
---
<h1 class="visually-hidden">PRISM probabilistic model checker</h1>

**PRISM**{.wordmark} is a probabilistic model checker, a tool for formal modelling and analysis
of systems that exhibit **random** or **uncertain** behaviour.
It can formally verify many quantitative aspects of system behaviour,
such as correctness, safety, reliability or timeliness,
and can synthesise policies or controllers to optimise them.

<div class="release-strip">
<p><strong>PRISM {{ releases.prism.version }}</strong> <span>released {{ releases.prism.released | monthYear }}</span></p>
<p class="release-strip__links"><a class="release-strip__download" href="/download/"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Download</a> <a href="/manual/">Manual</a> <a href="/tutorial/">Tutorial</a></p>
</div>

:::: banner
::: slideshow
![Surface plot of the maximum probability that a robot can ensure it reaches its goal within a deadline](/images/home/robot-deadline.png)

![Graph of probability against the number of restorative stages](/images/home/restorative-stages.svg)

![Surface plot of the minimum probability of electing a leader by a deadline](/images/home/firewire-surface.png)

![Graph of the worst-case expected time for Herman's self-stabilisation algorithm to stabilise, for different coin biases p and numbers of processes N](/images/home/herman-bias.png)

![Graph of the probability of a Bluetooth device hearing two replies within time T](/images/home/bluetooth-replies.png)

![Graph of simulation results for the average amount of activated MAPK over time](/images/home/mapk-simulation.png)
:::

## Applications of PRISM

PRISM has been used for formal verification and analysis
of systems from a wide range of [application domains](/casestudies/):

* communication protocols
* safety critical systems
* security protocols
* robot navigation
* software architectures
* biological processes
::::

::::: columns
::: box
## Probabilistic models

PRISM can build and analyse many types of probabilistic models:
**Markov chains** (in either discrete or continuous time)
and **Markov decision processes**,
plus extensions for **real time**, **partial observability** and **epistemic uncertainty**.
[PRISM-games](/games/) adds multi-agent models:
turn-based or concurrent **stochastic games**.

![Word cloud of the model types supported by PRISM and PRISM-games: MDP, DTMC, CTMC, PTA, POMDP, SMG, IMDP, POPTA, CSG, IDTMC, TPTG, LTS, PA and TSG](/images/home/model-types.svg)
:::

:::: box
## Quantitative guarantees

PRISM can verify/analyse many system properties:

::: questions
What is the probability of a failure causing the system to shut down within 4 hours?

```prism
P=? [ F<=4 "shutdown" ]
```

What is the worst-case expected time taken for the algorithm to terminate, over all possible initial configurations?

```prism
filter(max, R{"time"}max=? [ F "end" ])
```

Which navigation policy maximises the probability of safely executing the mission?

```prism
Pmax=? [ !"hazard" U ("room1" & (F "room2")) ]
```
:::
::::
:::::

## Citing PRISM

To reference PRISM, please cite this tool paper:

<p class="bib-entry">{{ bib.items | bibItem("KNP11") | citation | safe }}</p>
