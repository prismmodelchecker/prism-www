---
layout: layouts/base.njk
title: "Public good game"
section: casestudies
permalink: /casestudies/public_good_game/
---
# Public good game

## Contents

-   [Introduction](#intro)
-   [CSG Model](#simple)
-   [Analysis](#analysis)

**Related publications**: {% cite "KNPS20" %}

## Introduction: { #intro }

Repeated public good games are a well studied model of social choice in economics. See, for example, the survey {% cite "Led95" %} and recent paper {% cite "HHCN19" %}. In the basic version of this game, a group of players each receives an endowment in each round and every player chooses how much of this to share with the group and how much to keep for themselves. The amounts that the players share with the group are combined and then multiplied by a factor *f* and then the resulting amount is shared equally between the players.

More formally, assuming there are two players and in a round each player *i* decides to contributes a share *s*<sub>i</sub> of their endowment *e*<sub>i</sub>, then at the end of the round player *i* will receive in total:

$$(e_i - s_i) + f \cdot (s_1 + s_2)/2$$

i.e., the share of the player's endowment it keeps for itself plus the return it gets from the part it shares with the group.

## CSG Model { #simple }

We consider a concurrent stochastic game (CSG) model where each player receives a fixed endowment as its initial capital and then in any round the player can choose to share a portion of its current capital. To keep the model finite state, we allow each player to share only fixed fractions of their capital. In the model presented below, a player can either share all, three quarters, one half, one quarter or none of its current capital.

The model contains a module for each player which keeps track of both the players overall capital and the share it decides to invest in a round. The updates of the capital of each player, i.e., the variable `c1` and `c2`, are dependent on the amount each player decided to invest in the current round and therefore thier updates use the primed values of the corresponding variable, i.e. the primed value of the variable `s1` and `s2`.

There is an additional module that keeps track of the number of rounds that have been completed. Since this modules updates are independent of the choices of the players the commands of this module are unlabelled.

The model contains two reward structures for each player: the first returns for any state the current profit of that player (the current capital minus its initial capital); the second returns the final profit of the player once all rounds have been completed.

{% prismCode "casestudies/examples/public_good_game2.prism", true, true %}

## Analysis { #analysis }

We consider the following two non-zero properties where each player tries to maximise their expected profit either after all rounds have been completed or at the end of a specific round. We will fix the cap on capital held by each player at `emax=100` and the initial endowment for each player at `einit=4`.

{% prismCode "casestudies/examples/public_good_game2.props", false, true %}

We now analyse the values and strategies for the first property, where both players try to maximise their capital as the number of rounds and the parameter *f* vary.

First, in the graphs below we the have plotted the optimal values for the players over `kmax` = 2, 4 and 6 rounds, first as the parameter *f* varies between 0 and 2 and then zoomed in on the area where the values of the players vary. In each case we see, for values of *f* close to 1 the optimal choice for each player is not to share any of its capital in any round, while for values close to 2 the optimal choice for each player is to share all of their capital in every round. For other values of *f*, as we will see, then the optimal choice of the players is to share different amounts in different rounds and in some cases this choice can be probabilistic.

![](/images/graphs/public_good_k2_e4_graph1_new.png){.w40} ![](/images/graphs/public_good_k2_e4_graph2_new.png){.w40}

*Optimal expected final profit for both players (2 rounds): for f in [1,2] (left) and zoomed in (right)*{.caption}

  
  

![](/images/graphs/public_good_k4_e4_graph1_new.png){.w40} ![](/images/graphs/public_good_k4_e4_graph2_new.png){.w40}

*Optimal expected final profit for both players (4 rounds): for f in [1,2] (left) and zoomed in (right)*{.caption}

  
  

![](/images/graphs/public_good_k6_e4_graph1_new.png){.w40} ![](/images/graphs/public_good_k6_e4_graph2_new.png){.w40}

*Optimal expected final profit for both players (6 rounds): for f in [1,2] (left) and zoomed in (right)*{.caption}

### Strategy Synthesis when `kmax=2`

If `f=1`.78, then the following graph gives the optimal strategies for the two players (the dot files have been edited to replace floating point numbers with rationals to improve readability).

![plot: optimal strategies for the players when f=1.78](/images/graphs/public_good_strat2_178_new.png){.w25}

In the graph, the vertices correspond to the states of the game and are labelled with tuples corresponding to the values of the variables of the model: (`k,c1,s1,c2,s2`). The edges of the graph are labelled `CSG` followed by the choices for the two players (the probabilities of choosing available actions) with the choices for the different players separated by `--`. The graph is generated by running the command:

```shell
prism-games public_good_game2.prism public_good_game2.props -const einit=4,emax=100,kmax=2,f=1.78 -prop 1 -exportstrat public_good_strat2_178.dot
```

On the other hand, if `f=1`.80, then the optimal strategies are given below.

![plot: optimal strategies for the players when f=1.80](/images/graphs/public_good_strat2_180_new.png){.w20}

### Strategy Synthesis when `kmax=4`

If `f=1`.91, then the following graph gives the optimal strategies for the two players.

![plot: optimal strategies for the players when f=1.91](/images/graphs/public_good_strat4_191_new.png){.w70}

On the other hand, if `f=1`.92, then the optimal strategies are given below.

![plot: optimal strategies for the players when f=1.92](/images/graphs/public_good_strat4_192_new.png){.w20}

### Strategy Synthesis when `kmax=6`

If `f=1`.98, then the following graph gives the optimal strategies for the two players.

![plot: optimal strategies for the players when f=1.98](/images/graphs/public_good_strat6_198_new.png){.w75}

On the other hand, if `f=1`.99, then the optimal strategies are given below.

![plot: optimal strategies for the players when f=1.99](/images/graphs/public_good_strat6_199_new.png){.w20}
