---
layout: layouts/base.njk
title: "Randomised dining philosophers (Lehmann & Rabin)"
section: casestudies
permalink: /casestudies/phil/
---
# Randomised dining philosophers (Lehmann & Rabin)

(Lehmann and Rabin)

## Contents

-   [Introduction](#intro)
-   [Original Algorithm](#orig)
-   [Model Statistics](#orig_stats)
-   [Model Checking](#orig_mc)
-   [Algorithm Without Fairness Assumptions](#nofair)
-   [Model Statistics](#nofair_stats)
-   [Model Checking](#nofair_mc)

## Introduction { #intro }

This case study is based on Lehmann and Rabin's {% cite "LR81" %} randomised solution to the well known dining philosophers problem. Note that this protocol has also been studies in {% cite "PZ86" %}. We consider both the original algorithm and the version presented in {% cite "DFP04" %} which removes the need to consider 'fairness' assumptions on the scheduling mechanism.

## Original Algorithm { #orig }

This algorithm is Lehmann and Rabin's {% cite "LR81" %} solution to the well known dining philosophers problem. The model is represented as an MDP. We let **N** denotes the number of philosophers. By way of example, the PRISM source code for the original algorithm in the case where **N = 3** is given below.

{% prismCode "casestudies/examples/phil3.nm", false, true %}

## Model Statistics { #orig_stats }

The table below shows statistics for the MDPs we have built for different values of the constants `N` and `K`. The tables include:

-   the number of **states** and **transitions** in the MDP representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| N:  | Model:        || MTBDD:  || Construction: ||
| ^^  | States:       | Transitions:    | Nodes:  | Leaves: | Time (s):     | Iter.s: |
|-----|---------------|-----------------|---------|---------|---------------|---------|
| 3   | 956           | 3,696           | 910     | 3       | 0.124         | 18      |
| 4   | 9,440         | 48,656          | 1,958   | 3       | 0.141         | 24      |
| 5   | 93,068        | 599,600         | 3,335   | 3       | 0.311         | 30      |
| 6   | 917,424       | 7,092,696       | 5,008   | 3       | 0.782         | 36      |
| 7   | 9,043,420     | 81,568,144      | 6,968   | 3       | 1.568         | 42      |
| 8   | 89,144,512    | 918,913,056     | 9,215   | 3       | 2.942         | 48      |
| 9   | 878,732,012   | 10190,342,448   | 11,749  | 3       | 5.025         | 54      |
| 10  | 8,662,001,936 | 111,611,282,280 | 14,570  | 3       | 7.532         | 60      |
| 15  | 8.06e+15      | 1.56e+17        | 32,980  | 3       | 37.85         | 90      |
| 20  | 7.50e+19      | 1.93e+21        | 58,565  | 3       | 105.3         | 120     |
| 25  | 6.98e+24      | 2.24e+26        | 91,325  | 3       | 1,000         | 150     |
| 30  | 6.45e+29      | 2.51e+31        | 13,1260 | 3       | 2,719         | 180     |

## Model Checking { #orig_mc }

When model checking, we have the following requirement:

-   **Scheduler-Liveness:** "For each time *t* and any philosopher *P*<sub><i>i</i></sub>, there exists a time *t*' > *t* in which *P*<sub><i>i</i></sub> makes a move."

This corresponds to the conditions on the *adversary/scheduler* which we impose by model checking against only *fair* adversaries.

We have model checked the following liveness property: 'If a philosopher is hungry, then eventually some philosopher eats'.

{% prismCode "casestudies/examples/phil3.pctl", false, true %}

**Model checking times:**  
  

| N:  | Precomputation: || Main Algorithm: ||
| ^^  | Time (s):       | Iterations: | Time (s):       | Iterations: |
|-----|-----------------|-------------|-----------------|-------------|
| 3   | 0.01            | 6           | -               | -           |
| 4   | 0.03            | 6           | -               | -           |
| 5   | 0.07            | 6           | -               | -           |
| 6   | 0.08            | 6           | -               | -           |
| 7   | 0.13            | 6           | -               | -           |
| 8   | 0.17            | 6           | -               | -           |
| 9   | 0.23            | 6           | -               | -           |
| 10  | 0.29            | 6           | -               | -           |
| 15  | 0.73            | 6           | -               | -           |
| 20  | 1.36            | 6           | -               | -           |
| 25  | 2.20            | 6           | -               | -           |
| 30  | 5.22            | 6           | -               | -           |

**Conclusion:** the property holds in all states

  
## Algorithm Without Fairness Assumptions { #nofair }

This algorithm is the version of Lehmann and Rabin's dining philosopher algorithm presented in {% cite "DFP04" %} and does not require any fairness assumptions. The model is represented as an MDP. We let **N** denotes the number of philosophers. By way of example, the PRISM source code for the algorithm of {% cite "DFP04" %} in the case of 3 philosophers is given below. The difference between this algorithm and that originally presented by Lehmann and Rabin is that the philosophers cannot be scheduled if their next transition is a 'loop', i.e. such transitions are removed from the model.

{% prismCode "casestudies/examples/phil-nofair3.nm", false, true %}

## Model Statistics { #nofair_stats }

The table below shows statistics for the MDPs we have built for different values of the constants `N` and `K`. The tables include:

-   the number of **states** and **transitions** in the MDP representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| N:  | Model:        || MTBDD: || Construction: ||
| ^^  | States:       | Transitions:   | Nodes: | Leaves: | Time (s):     | Iter.s: |
|-----|---------------|----------------|--------|---------|---------------|---------|
| 3   | 956           | 3,048          | 765    | 3       | 0.065         | 18      |
| 4   | 9,440         | 40,120         | 1,650  | 3       | 0.121         | 24      |
| 5   | 93,068        | 494,420        | 2,854  | 3       | 0.259         | 30      |
| 6   | 917,424       | 5,848,524      | 4,339  | 3       | 0.612         | 36      |
| 7   | 9,043,420     | 67,259,808     | 6,101  | 3       | 1.18          | 42      |
| 8   | 89,144,512    | 757,721,264    | 8,150  | 3       | 2.31          | 48      |
| 9   | 878,732,012   | 8,402,796,252  | 10,486 | 3       | 3.74          | 54      |
| 10  | 8,662,001,936 | 92,032,909,540 | 13,109 | 3       | 5.83          | 60      |

  
## Model Checking { #nofair_mc }

We have model checked the following properties:

{% prismCode "casestudies/examples/phil-nofair3.pctl", false, true %}

-   **Liveness:** the model checking statistics for this property are given below.
    
    | N:  | Precomputation: || Main Algorithm: ||
    | ^^  | Time (s):       | Iterations: | Time (s):       | Iterations: |
    |-----|-----------------|-------------|-----------------|-------------|
    | 3   | 0.03            | 20          | -               | -           |
    | 4   | 0.34            | 34          | -               | -           |
    | 5   | 1.70            | 54          | -               | -           |
    | 6   | 8.20            | 74          | -               | -           |
    | 7   | 33.2            | 100         | -               | -           |
    | 8   | 122             | 130         | -               | -           |
    | 9   | 818             | 166         | -               | -           |
    | 10  | 1,673           | 202         | -               | -           |
    
      
    
    **Conclusion:** the property holds in all states
    
-   **Bounded waiting:** in the graph below we have plotted these probabilities as **L** varies for a range of values of **N**.
    
    ![plot: the minimum probability of some philosopher eating within L steps](/images/graphs/phil.bounded.png)
    
-   **Expected time:** in the graph below we have plotted these expected values as **N** varies.
    
    ![plot: maximum expected number of steps until between a philosopher becoming hungry and some philosopher eating](/images/graphs/phil.expected.png)
