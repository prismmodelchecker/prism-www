---
layout: layouts/base.njk
title: "Randomised Self-Stabilising Algorithms"
section: casestudies
permalink: /casestudies/self-stabilisation/
---
# Randomised Self-Stabilising Algorithms

## Contents

-   [Introduction](#intro)
-   [Herman](#herman)
-   [Israeli and Jalfon](#ij)
-   [Beauquier, Gradinariu and Johnen](#beauquier)

**Related publications**: {% cite "KNP12a" %}

## Introduction { #intro }

In this case study we consider a number of self-stabilising algorithms from the literature.

A self-stabilising protocol for a network of processes is a protocol which, when started from some possibly illegal start configuration, returns to a legal/stable configuration without any outside intervention within some finite number of steps. For further details on self-stabilisation see [here](http://www.cs.uiowa.edu/ftp/selfstab/bibliography/index.html).

In each of the protocols we consider, the network is a ring of identical processes. The stable configurations are those where there is exactly one process designated as "privileged" (has a token). This privilege (token) should be passed around the ring forever in a fair manner.

For each of the protocols, we compute the *minimum probability of reaching a stable configuration* and the *maximum expected time (number of steps) to reach a stable configuration* (given that the above probability is 1) over every possible initial configuration of the protocol.

## Herman {% cite "Her90" %} { #herman }

The first protocol we consider is due to Herman {% cite "Her90" %}. The protocol operates synchronously, the ring is oriented, and communication is unidirectional in the ring. In this protocol the number of processes in the ring must be odd.

Each process in the ring has a local boolean variable `xi`, and there is a token in place `i` if `xi=x(i-1)`. In a basic step of the protocol, if the current values of `xi` and `x(i-1)` are equal, then it makes a (uniform) *random* choice as to the next value of `xi`, and otherwise it sets it equal to the current value of `x(i-1)`.

### The Model

By way of example, the PRISM source code for the case where there are three processes in the ring is given below.

{% prismCode "casestudies/examples/herman3.pm", false, true %}

### Model Statistics

The table below shows statistics for protocol we have built for different numbers of processes (size of the ring). The first section gives the number of states and transitions in the DTMC representing the model. The second part refers to the MTBDD used to store it: the total number of nodes and the number of leaves (terminal nodes).

| N:  | Model:    || MTBDD: ||
| ^^  | States:   | Transitions:   | Nodes: | Leaves: |
|-----|-----------|----------------|--------|---------|
| 3   | 8         | 28             | 24     | 3       |
| 5   | 32        | 244            | 75     | 4       |
| 7   | 128       | 2,188          | 158    | 5       |
| 9   | 512       | 19,684         | 273    | 6       |
| 11  | 2,048     | 177,148        | 420    | 7       |
| 13  | 8,192     | 1,594,324      | 599    | 8       |
| 15  | 32,768    | 14,348,908     | 810    | 9       |
| 17  | 131,072   | 129,140,164    | 1,053  | 10      |
| 19  | 524,288   | 1,162,261,468  | 1,328  | 11      |
| 21  | 2,097,152 | 10,460,353,204 | 1,635  | 12      |

### Model Checking

We first check the correctness of the protocol, namely that:

-   From any configuration, a stable configuration is reached with probability 1

We then study its performance, in particular:

-   The maximum/minimum expected time to reach a stable configuration

For the latter, we consider the worst-case behaviour over all possible initial configurations and over all initial configurations with `k` tokens.

These properties can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/herman.pctl", false, true %}

The minimum probability of reaching a stable state is 1 for all models built (up to `N` = 21).

The worst-case expected time, over all initial configurations, is shown in the plot below (marked "PRISM"). For comparison, we also plot the upper bound on this value proved by Kiefer et al. {% cite "KMO+11" %} of (approximately) 0.64`N`<sup>2</sup>. As the graph illustrates, the actual worst-case value is considerably lower. Elsewhere, McIver and Morgan {% cite "MM05a" %} showed that the the worst-case time for initial configurations with 3 tokens is 4`abc/N`, where `a`, `b` and `c` are the distances between the three tokens. This therefore represents a lower bound on the worst-case expected time and is also shown in the plot. Kiefer, conjecture that this represents the worst-case for any number of tokens. Our results corroborate this conjecture precisely for all models built.

![plot: expected time to reach a stable configuration from any initial state](/images/graphs/self.stabilisation.herman.max.png)

Further evidence of the correctness of McIver and Morgan's conjecture is shown in the graph below, where we plot, as `k` varies, the maximum expected time to reach a stable configuration given that the initial number of tokens equals `k`. As can be seen, for all models up to `N` = 21, the worst case *is* for `k` = 3 tokens and the maximum expected time decreases for increasing values of `k`.

![plot: expected time to reach a configuration when the initial number of tokens equals k](/images/graphs/self.stabilisation.herman.png)

Lastly, we examine the effect of the probabilistic value used for the random choice in Herman's algorithm (`p` in the PRISM code above).

As the plot below indicates, for values of `N` = 9 or below, `p` = 0.5 *is* the optimum value. However, interestingly, for larger values of `N`, this does *not* hold. In fact, in these case, values of `p` other than 0.5 (i.e. biased coins) result in better performance (lower expected execution time) for the protocol.

![plot: optimum performance for differing p](/images/graphs/self.stabilisation.herman.p.png)

Moreover, zooming in on the above plots reveals unexpected trends for values of `p` close to 0.5:

<table><tbody><tr><td><center><code>N</code> = 7:</center><img class="prism-image" src="/images/graphs/self.stabilisation.herman.p7.png" alt="plot: optimum performance for differing p"></td><td><center><code>N</code> = 9:</center><img class="prism-image" src="/images/graphs/self.stabilisation.herman.p9.png" alt="plot: optimum performance for differing p"></td></tr><tr><td colspan="2"><center><code>N</code> = 11:</center><img class="prism-image" src="/images/graphs/self.stabilisation.herman.p11.png" alt="plot: optimum performance for differing p"></td></tr></tbody></table>

See {% cite "KNP12a" %} for further results on this model.

## Israeli and Jalfon {% cite "IJ90" %} { #ij }

The protocol we consider in this section is due to Israeli and Jalfon {% cite "IJ90" %}. It operates asynchronously with an arbitrary scheduler, the ring is oriented and communication is bidirectional in the ring.

Each process has a boolean variable `qi` which represents the fact that a token is in place `i`. A process is active if it has a token and only active processes can be scheduled. When an active process is scheduled, it makes a (uniform) *random* choice as to whether to move the token to its left or right. Note that if a process ends up with two tokens, these tokens are merged into a single token.

### The Model

By way of example, the PRISM source code for the case where there are three processes in the ring is given below.

{% prismCode "casestudies/examples/ij3.nm", false, true %}

### Model Statistics

The table below shows statistics for protocol we have built for different numbers of processes (size of the ring). The first section gives the number of states in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of nodes and the number of leaves (terminal nodes).

| N:  | Model:    | MTBDD: ||
| ^^  | States:   | Nodes: | Leaves: |
|-----|-----------|--------|---------|
| 3   | 7         | 48     | 3       |
| 4   | 15        | 85     | 3       |
| 5   | 31        | 129    | 3       |
| 6   | 63        | 177    | 3       |
| 7   | 127       | 229    | 3       |
| 8   | 255       | 285    | 3       |
| 9   | 511       | 345    | 3       |
| 10  | 1,023     | 409    | 3       |
| 11  | 2,047     | 477    | 3       |
| 12  | 4,095     | 549    | 3       |
| 13  | 8,191     | 625    | 3       |
| 14  | 16,383    | 705    | 3       |
| 15  | 32,767    | 789    | 3       |
| 16  | 65,535    | 877    | 3       |
| 17  | 131,071   | 969    | 3       |
| 18  | 262,143   | 1,065  | 3       |
| 19  | 524,287   | 1,165  | 3       |
| 20  | 1,048,575 | 1,269  | 3       |
| 21  | 2,097,151 | 1,377  | 3       |

### Model Checking

We analysed the protocol through the following properties.

-   From any configuration, a stable configuration is reached with probability 1;
-   What ‎is the maximum/minimum expected time to reach a stable configuration (for all configurations and for configurations with k tokens)?
-   What is the minimum probability of reaching a stable configuration within K steps (for all configurations)?

Which can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/ij.pctl", false, true %}

The table below gives the model checking statistics when checking that from any configuration, a stable configuration is reached with probability 1 and calculating the maximum expected time to reach a stable configuration.

| N:  | A stable configuration is reached with probability 1 || Maximum expected time to reach a stable configuration ||
| ^^  | Iterations:                                          | Result: | Iterations:                                           | Result: |
|-----|------------------------------------------------------|---------|-------------------------------------------------------|---------|
| 3   | 3                                                    | true    | 21                                                    | 3.0     |
| 4   | 5                                                    | true    | 39                                                    | 6.0     |
| 5   | 7                                                    | true    | 61                                                    | 10.0    |
| 6   | 9                                                    | true    | 87                                                    | 15.0    |
| 7   | 12                                                   | true    | 116                                                   | 21.0    |
| 8   | 14                                                   | true    | 149                                                   | 28.0    |
| 9   | 16                                                   | true    | 186                                                   | 36.0    |
| 10  | 19                                                   | true    | 226                                                   | 45.0    |
| 11  | 23                                                   | true    | 270                                                   | 55.0    |
| 12  | 25                                                   | true    | 317                                                   | 66.0    |
| 13  | 28                                                   | true    | 367                                                   | 78.0    |
| 14  | 31                                                   | true    | 420                                                   | 91.0    |
| 15  | 35                                                   | true    | 477                                                   | 105.0   |
| 16  | 38                                                   | true    | 537                                                   | 120.0   |
| 17  | 41                                                   | true    | 599                                                   | 136.0   |
| 18  | 44                                                   | true    | 665                                                   | 153.0   |
| 19  | 48                                                   | true    | 733                                                   | 171.0   |
| 20  | 52                                                   | true    | 805                                                   | 190.0   |
| 21  | 55                                                   | true    | 879                                                   | 210.0   |

In all the cases considered, the configurations which achieve the maximum expected time are those where all the processes have tokens. To illustrate this fact, in the graph below we have plotted, as `k` varies, the maximum expected time to reach a stable configuration given that the initial number of tokens equals `k`.

![plot: expected time to reach a configuration when the initial number of tokens equals k](/images/graphs/self.stabilisation.ij.png)

In addition, below we have plotted the minimum expected time to reach a stable configuration given that the initial number of tokens `k`.

![plot: minimum expected time to reach a configuration when the initial number of tokens equals k](/images/graphs/self.stabilisation.ij.min.png)

Lastly, we have also plotted the minimum probability of reaching a stable configuration within `k` steps.

![plot: minimum probability of reaching a stable configuration within k steps](/images/graphs/self.stabilisation.ij.bounded.png)

## Beauquier, Gradinariu and Johnen {% cite "BGJ99" %} { #beauquier }

Now we consider the self-stabilising protocol of Beauquier, Gradinariu and Johnen {% cite "BGJ99" %} for an arbitrary scheduler. It operates asynchronously, the ring is oriented, communication is unidirectional in the ring, and the number processes in the ring must be odd.

Each process two boolean variables: `di` and `pi` where:

-   `di=d(i-1)` process `i` is said to have a *deterministic token*;
-   if `pi=p(i-1)` process `i` is said to have a *probabilistic token*.

The stable configurations are those where there is only one probabilistic token. A process is active if it has a deterministic token and only active processes can be scheduled. When an active process is scheduled, it sets `di` to be the negation of it current value (passes the deterministic token), and if it also has a probabilistic token, it makes a (uniform) *random* choice as to the next value of `pi` (randomly selects whether to pass the probabilistic token or not).

### The Model

By way of example, the PRISM source code for the case where there are three processes in the ring is given below.

{% prismCode "casestudies/examples/beauquier3.nm", false, true %}

### Model Statistics

The table below shows statistics for protocol we have built for different numbers of processes (size of the ring). The first section gives the number of states in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of nodes and the number of leaves (terminal nodes).

| N:  | Model:    | MTBDD: ||
| ^^  | States:   | Nodes: | Leaves: |
|-----|-----------|--------|---------|
| 3   | 64        | 141    | 3       |
| 5   | 1,024     | 336    | 3       |
| 7   | 16,384    | 559    | 3       |
| 9   | 262,144   | 810    | 3       |
| 11  | 4,194,304 | 1,089  | 3       |

### Model Checking

The table below gives the model checking statistics when calculating, over all configurations, the minimum probability that a stable configuration is reached and the maximum expected time to reach a stable configuration.

| N:  | A stable configuration is reached with probability 1 || Maximum expected time to reach a stable configuration ||
| ^^  | Iterations:                                          | Result: | Iterations:                                           | Result: |
|-----|------------------------------------------------------|---------|-------------------------------------------------------|---------|
| 3   | 2                                                    | true    | 20                                                    | 2.00    |
| 5   | 8                                                    | true    | 64                                                    | 11.9    |
| 7   | 21                                                   | true    | 170                                                   | 37.8    |
| 9   | 40                                                   | true    | 380                                                   | 84.4    |
| 11  | 65                                                   | true    | 732                                                   | 162     |

In all the cases considered, the configurations which achieve the maximum expected time are those where only three processes have probabilistic tokens. To illustrate this fact, in the graph below we have plotted, as `k` varies, the maximum expected time to reach a stable configuration given that the initial number of tokens `k`.

![plot: expected time to reach a configuration when the initial number of tokens equals k](/images/graphs/self.stabilisation.beauquier.png)

In addition, below we have plotted the minimum expected time to reach a stable configuration given that the initial number of tokens equals `k`.

![plot: minimum expected time to reach a configuration when the initial number of tokens equals k](/images/graphs/self.stabilisation.beauquier.min.png)

Lastly, we have also plotted the minimum probability of reaching a stable configuration within `k` steps.

![plot: minimum probability of reaching a stable configuration within k steps](/images/graphs/self.stabilisation.beauquier.bounded.png)
