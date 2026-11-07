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

::: banner
![Surface plot of the maximum probability of a robot reaching its goal](/images/home-plot.png)

**Formal modelling and analysis of systems with random or probabilistic behaviour**

It has been used to analyse systems from many different [application domains](/casestudies/), including communication and multimedia protocols, randomised distributed algorithms, security protocols, biological systems and many others.
:::

:::: columns
::: box
## Describe a model

Models are written in the [PRISM language](/manual/ThePRISMLanguage/Introduction/), a simple, state-based language:

```prism
dtmc

module die

	s : [0..7] init 0;
	d : [0..6] init 0;

	[] s=0 -> 0.5 : (s'=1) + 0.5 : (s'=2);
	[] s=1 -> 0.5 : (s'=3) + 0.5 : (s'=4);
	[] s=2 -> 0.5 : (s'=5) + 0.5 : (s'=6);
	[] s=3 -> 0.5 : (s'=1) + 0.5 : (s'=7) & (d'=1);
	[] s=4 -> 0.5 : (s'=7) & (d'=2) + 0.5 : (s'=7) & (d'=3);
	[] s=5 -> 0.5 : (s'=7) & (d'=4) + 0.5 : (s'=7) & (d'=5);
	[] s=6 -> 0.5 : (s'=2) + 0.5 : (s'=7) & (d'=6);
	[] s=7 -> (s'=7);

endmodule
```
:::

::: questions
## Ask quantitative questions

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
