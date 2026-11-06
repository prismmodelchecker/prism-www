---
layout: layouts/base.njk
title: "Rabin’s Choice Coordination Problem"
section: casestudies
permalink: /casestudies/rabin_choice/
---
# Rabin’s Choice Coordination Problem

*[Contributed by Ukachukwu Ndukwu and Annabelle McIver]*{.note}

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [The Model](#model)
-   [A Performance Criterion](#performance)

**Related publications**: {% cite "NM10" %}

## Introduction { #intro }

The choice coordination problem (aka distributed consensus) is a typical example of the use of probability for symmetry breaking: identical processes with identical initial conditions must reach an asymmetric state collectively, all choosing one alternative or all choosing the other. The simplest example is a coin flipped between two people in a contest - each has equal chance to win if the coin is fair, the initial conditions are thus symmetric; yet, in the end, one person has won and not the other. In this example, however, the situation is made more complex by insisting that the processes be distributed: they cannot share a central "coin".

## The Protocol {% cite "Rab82b", "MM04" %} { #protocol }

A group of tourists are to decide between two meeting places (we call them "left" and "right"). A major constraint is that they may not communicate as a group; nor is there a central "authority" (e.g. a tour guide) whose decision overrides theirs.

Each tourist carries a notepad on which he will write various numbers; outside each of the two potential meeting places is a noticeboard on which various messages will be written. Initially the number zero appears on all the notepads and on the two noticeboards.

Each tourist decides independently (demonically) which meeting place to visit first, after which he strictly alternates his visits between them. At each place he looks at the noticeboard, and if it displays "here'', he goes inside. If it does not display "here'' it will display a number instead, in which case the tourist compares that number K with the number k on his notepad and takes one of the following three actions:

-   If k < K - The tourist writes K on his notepad (erasing k), and goes to the other place.
-   If k > K - The tourist writes "here'' on the noticeboard (erasing K), and goes inside.
-   If k = K - The tourist chooses K’, the next even number larger than K, and then flips a coin: if it comes up heads, he increases K’ by a further one. He then writes K’ on the noticeboard and on his notepad (erasing k and K), and goes to the other place - for example, if K is 2 or 3, then K’ becomes 4 and then possibly 5.

An interesting characterisation of the Rabin's algorithm is that: on termination all the tourists will converge at the same meeting place, and that happens with probability 1.

However, it is not always the case that an "observer" can witness every state of the program that will lead to termination. For example, it is possible that the tourists will forever (according to an observer) keep updating their notepads and the noticeboards without deciding on a meeting place. This behaviour imposes an unbounded state nature on the algorithm.

## The Model { #model }

The tourists’ initial locations are set at verification point. Since the protocol behaviour enforces an unbounded state nature on the algorithm, the constant parameter BOUND helps keep a check on the state explosion of the PRISM model. Below, we show a PRISM implementation for a single tourist. A similar implementation holds for N tourists by simply renaming the tourists’ module parameters.

{% prismCode "casestudies/examples/rabin_choice.nm", true, true %}

## A Performance Criterion { #performance }

As mentioned earlier, an important characterisation of the Rabin’s algorithm is that, on termination all the tourists converge at the same meeting place, and the probability of convergence is 1. However, given a concrete system representing this algorithm, it is impossible to verify that the convergence condition holds on a model checking platform. This is easily investigated by model checking the PCTL formula

{% prismCode "casestudies/examples/rabin_choice_bound.pctl", false, true %}

i.e. we compute the minimum probability Pmin, that within a finite number of steps T, all the tourists would have converged at the same meeting place.

Given a simple scenario consisting of just two tourists (where the first tourist starts at the left and the second at the right door respectively), we see in Fig. 1 that this probability is constrained by the value of the constant parameter BOUND. This also restricts future model checking results of the algorithm to the value of BOUND

![ATM Network](/images/cs/rabin_choice.bound.jpg)

*Fig. 1*{.caption}

### An N-tourist scenario

Since we have shown (Fig.1) that the overall performance attribute of the algorithm as captured by the expression above is bounded by the value of the input parameter BOUND, we can therefore study the performance of the algorithm for an N-tourist scenario by setting a value for BOUND prior to verification. We also allow a verifier to set the initial configuration for the tourists’ locations with the proviso that all the tourists cannot start from the same initial location. Fig.2 shows the performance result for N = 2..6 tourists for BOUND = 8.

![ATM Network](/images/cs/rabin_choice.6_tourists.jpg)

*Fig. 2*{.caption}

We also tabulate the minimum and maximum expected number of rounds until the tourists all meet the convergence condition. The reward formula below captures that idea:

{% prismCode "casestudies/examples/rabin_choice_rew.pctl", false, true %}

where states that have not yet met the convergence condition are worth reward values of 1; we summarize the results below:

| Number of tourists | Rmin | Rmax     |
|--------------------|------|----------|
| N = 2              | 4    | Infinity |
| N = 3              | 5    | Infinity |
| N = 4              | 7    | Infinity |
| N = 5              | 8    | Infinity |
| N = 6              | 10   | Infinity |

However, to defeat the overhead incurred by model checking the original (concrete) infinite state protocol by eliminating the BOUND parameter, we have constructed a precise predicate abstraction representation of the protocol. We have similarly reported its performance results for the base cases of even and odd number of tourists. For a detailed description of our abstraction technique and results, readers are referred to {% cite "NM10" %}.
