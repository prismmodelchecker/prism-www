---
layout: layouts/base.njk
title: PRISM
description: PRISM is a probabilistic model checker, a tool for formal modelling and analysis of systems that exhibit random or probabilistic behaviour.
newsSidebar: true
---
<h1 class="visually-hidden">PRISM probabilistic model checker</h1>

**PRISM** is a probabilistic model checker, a tool for formal modelling and analysis
of systems that exhibit random or uncertain behaviour.
It has been used to formally verify
the correctness, safety and reliability
of, for example, communication protocols, distributed consensus algorithms, mobile robot navigation and [much more](/casestudies/).

:::: banner
::: slideshow
![Surface plot of the maximum probability of a robot reaching its goal](/images/home/robots-surface.png)

![Surface plot of the minimum expected time for a user to send a packet](/images/home/aloha-surface.png)

![Graph of the minimum probability of reaching a stable configuration within k steps](/images/home/self-stabilisation.png)

![A road network for UAV missions](/images/home/uav-map.png)

![The FGF signalling pathway](/images/home/fgf-pathway.png)

![The stepping mechanics of a DNA walker](/images/home/dna-walker.png)
:::

## Applications of PRISM

PRISM has been used for formal verification and analysis
of systems from a huge range of [application domains](/casestudies/).

It has been used to analyse systems from many different [application domains](/casestudies/), including communication and multimedia protocols, randomised distributed algorithms, security protocols, biological systems and many others.
::::

:::: columns
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

::: questions
## Quantitative guarantees

What is the probability of a failure causing the system to shut down within 4 hours?

```prism
P=? [ F<=4 "shutdown" ]
```

What is the worst-case probability of the protocol terminating in error, over all possible initial configurations?

```prism
filter(max, P=? [ F "error" ], "init")
```

What is the expected size of the message queue after 30 minutes?

```prism
R{"queue"}=? [ I=30 ]
```

What is the worst-case expected time taken for the algorithm to terminate?

```prism
R{"time"}max=? [ F "done" ]
```
:::
::::

---

## Citing PRISM

To cite PRISM, please use the most recent tool paper, from CAV’11:

<p class="bib-entry">{{ bib.items | bibItem("KNP11") | citation | safe }}</p>
