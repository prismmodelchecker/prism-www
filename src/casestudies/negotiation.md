---
layout: layouts/base.njk
title: "Alternating offers protocol"
section: casestudies
permalink: /casestudies/negotiation/
---
# Alternating offers protocol

(Rubinstein)

*[Contributed by Paolo Ballarini, Michael Fisher &amp; Michael Wooldridge]*{.note}

## Contents

-   [Introduction](#intro)
-   [Players' strategies (conceder/boulware)](#strat)
-   [Acceptance probability](#accept)
-   [The model](#model)
-   [Analysis](#analysis)

**Related publications**: {% cite "BFW06" %}

## Introduction { #intro }

This case study is about the analysis of a Negotiation Framework known as Rubinstein's Alternating Offers Protocol {% cite "OR90" %}. In such a framework two agents, the *Buyer* (B) and the *Seller* (S), bargain over an item. Players alternatively take it in turns to make an action which can be either (i) throwing a proposal (offer), or (ii) accepting the most recent proposal. In theory both players can keep Rejecting offers so that an agreement may never be reached (in that case we talk about *disagreement* or *conflict deal*). However a player's utility depends on the value at which an agreement is reached (as well as on the time at which it is reached), hence *disagreement* is the worst possible outcome for both players and it is ruled out. The following assumptions are considered:

-   **Disagreement is the worst outcome:** players prefer any outcome at least as much as disagreement
-   **Players seek to maximise utility:** players really do prefer to get larger utility values.
-   **Time is valuable:** for any outcome *x* and times *t1* and *t2* with *t1*<*t2*, outcome *x* at time *t1* has a higher utility than outcome *x* at time *t2* for both players.

## Players' strategies (conceder/boulware) { #strat }

Players' offers are calculated by means of the so-called Negotiation Decision Function (NDF), a function of time that determines a player's strategy. Strategies can be linear or non-linear, the latter being either *conceder*, if the player is willing to concede a lot in the early phase of negotiation, or *boulware* if a player is willing to concede considerably only when its time deadline is approaching. The following parameters are relevant for the characterisation of a player strategy.

-   **T\_b (Time-deadline ):** player **b** quits negotiation if an agreement has not been reached within **T\_b**.
-   **IP\_b (Initial Price):** player **b**'s first offer.
-   **RP\_b (Reserved Price):** the threshold above (below) which player **b** will certainly reject offer (hence also its maximum/minimum offered value, i.e. player **b** offers **RP\_b** only at time **T\_b**).

The picture below shows how different *buyer*'s strategies graphically compare.

![plot: different strategies](/images/cs/negotiation.strategies.gif)

## Acceptance probability { #accept }

The uncertain nature of an offer evaluation outcome is represented by making the decision whether to accept or reject a player's offer a probabilistic one. The will of a player (**b**) to accept an offer is affected by both the offered value and the player's reserved price (**RP\_b**). The following points are considered for the characterisation of players' *acceptance probability* (functions **S\_AP()** and **B\_AP()** below):

1.  Any offer below (above) the **S\_RP** (**B\_RP**) will be certainly rejected by the *Seller* (*Buyer*).
2.  The probability of accepting an offer (counter-offer) asymptotically tend to 1 as the offer (counter-offer) increases (decreases).
3.  For the sake of symmetry, players should have an equal attitude towards acceptance/rejection of an offer, which is: players are equally likely to accept offers of *equal utility* (i.e. offers whose distance from their respective RP is the same).

The resulting *acceptance probability* functions are as follows:

$$
\mathbf{S\_AP}(x) = \begin{cases} 0 & \text{if } x \le \mathbf{S\_RP} \\ 1 - \mathbf{S\_RP}/2 & \text{if } x > \mathbf{S\_RP} \end{cases}
$$

$$
\mathbf{B\_AP}(x) = \begin{cases} 1 & \text{if } x \le 0 \\ 1 + \mathbf{S\_RP}/(x - (\mathbf{B\_RP} + \mathbf{S\_RP})) & \text{if } 0 < x < \mathbf{B\_RP} \\ 0 & \text{if } x > \mathbf{B\_RP} \end{cases}
$$

The following picture depicts the graph for functions **S\_AP**, **B\_AP** with **S\_RP** = 1000 and **B\_RP** = 10000. It is straightforward to see that functions **S\_AP**, **B\_AP** as in the above definition actually fulfil the described guidelines.

![plot: graph for functions S\_AP(), B\_AP()](/images/cs/negotiation.sap_bap.gif)

## The model { #model }

Rubinstein's Negotiation Protocol has been modelled in PRISM as a DTMC consisting of two parallel modules which synchronise on certain actions. The behaviour of each module is based on the following state-chart diagrams:

![plot: diagram of buyer and seller](/images/cs/negotiation.buyerandseller.gif)

The model is designed to cope with different negotiation strategies (linear, non-linear), the desired strategy being set through model's configuration. The set of configuration parameters is listed below.

-   **Players' strategy:** any possible combination of strategies can be chosen for the two players (e.g. (Boul,Conc) represents a setting such that the *Buyer* is using a *Boulware* strategy whereas the *Seller* a *Conceder* one). Player **b**'s (either **B** or **S**) strategy is set by means of the module's **b** boolean variable **bcon** (either **Bcon** or **Scon**). A true value for such a variable denotes a *conceder* strategy, whereas *false* denotes a *boulware* one. Linear strategies can be obtained by setting a *switch time* greater than the *time deadline*, hence the value given to **bcon** is irrelevant when the desired strategy is a *linear*.
-   **Accepting interval** \[**S\_RP**,**B\_RP**\]**:** set by means of the 2 (global) constants **S\_RP** and **B\_RP**. The chosen interval affects the *acceptance probability* functions, hence the probabilistic outcome of negotiation. The interval's halves, \[**S\_RP**,(**S\_RP** + **B\_RP**)/2\] and \[(**S\_RP** + **B\_RP**)/2,**B\_RP**\] are classified accordingly to a player's utility. Hence \[**S\_RP**,(**S\_RP** + **B\_RP**)/2\] is the buyer's *higher utility* half (whereas \[(**S\_RP** + **B\_RP**)/2,**B\_RP**\] is the buyer's *lower utility* half), as any agreement in \[**S\_RP**,(**S\_RP** + **B\_RP**)/2\] has a higher utility, from the buyer point of view, than an agreement within \[(**S\_RP** + **B\_RP**)/2,**B\_RP**\]. Conversely, \[**S\_RP**,(**S\_RP** + **B\_RP**)/2\] and \[(**S\_RP** + **B\_RP**)/2,**B\_RP**\] are respectively the *lower utility* and *higher utility* half from the *Seller* point of view.
-   **Strategies gradients:** set by means of the (global) constants **bCinc**, **bBinc** (for the buyer) and **sCdec**, **sBdec** (for the seller). Non-linear strategies are approximated via 2-segments-linear ones, consisting of a *conceder* segment followed by a *boulware* one, in a *conceder* tactic, or vice-versa in a *boulware* strategy. The gradient of the 2 segments are specified separately for the 2 players by assigning a specific value to these constants.
-   **Bargaining Time Deadlines:** set by means of the (global) constants **T\_s**, **T\_b**. These values determine the players' bargaining deadlines.
-   **Boulware Strategy Switch Time:** set by means of the (global) constants **TbB**, **TsB**. In a *Boulware* strategy, **TbB** ( **TsB**) is the time instants at which the buyer (seller) starts conceding.
-   **Conceder Strategy Switching Factor:** set by means of the (global) constants **Kb**, **Ks**. In a *Conceder* strategy the *buyer* (*seller*) stops conceding when its next offered value is closer than **Kp** (**Ks**) times the *conceding gradient* from its RP.
-   **Accepting Interval's Offset:** set by means of the (global) constant **Offset**. This constant helps for minimising the model's complexity. If one wants to study the probabilistic outcome for an *acceptance interval* equal to, say, \[a,b\], with 0 < a < b < ∞, and width w = b - a, then in order to get the lowest possible model's complexity the actual interval should be set equal to \[1,1 + w\] (i.e. **S\_RP** = 1 and **B\_RP** = 1 + w) and **Offset** = a - 1.

The PRISM source code is given below.

{% prismCode "casestudies/examples/negotiation.pm", false, true %}

## Analysis { #analysis }

The probabilistic outcome of the Negotiation process is evaluated by computing the probability that an agreement is reached within the *Accepting Interval*. In practise this is obtained by model-checking the PCTL formula:

```prism
P = ? [ true U s=2 & b=3 & (bid=PVAL | cbid=PVAL)]
```

which captures all the system's evolutions representing a reached agreement.

The Negotiation probabilistic outcome for a given configuration is calculated through experimentation by varying **PVAL** ∈ \[**S\_RP**, **B\_RP**\]. Different negotiation strategies can be compared once results for the corresponding configurations are obtained. In the graph below the probabilistic outcome of bargaining (i.e. the *acceptance probability*) in the interval \[10000,11000\], is compared for *linear* symmetric strategies with different gradients (both players use a *linear* tactic, but what is changed is the increment/decrement value).

![plot: graph1](/images/graphs/negotiation.graph1.gif)

### Linear strategies: Slow is better than Fast.

More interesting, from an analytical point of view, is the *cumulative acceptance probability* (directly derived from result of experimentation). In the next picture the Cumulative Acceptance Probability is compared for *linear* strategies with different gradients. One can notice that any curve corresponding to a *Seller* (slow) decrement equal to 10 (i.e. **Lin**(10)-**Lin**(10) or **Lin**(50)-**Lin**(10) or **Lin**(100)-**Lin**(10)) is "probabilistically" better than any curve corresponding to a *Seller* (fast) decrement of 100, as it concentrates most of the probability close to the *supremum* of the *Accepting interval*, independently of the *Buyer*'s increment. Hence the following general criteria can be devised: from a player's point of view, a *slower* strategy is to be preferred to a *fast* one. In other words, for a player **p** moving the offered value slowly, rather than quickly, towards its RP makes more likely that the outcome of bargaining will fall in its *higher utility* half of the *accepting interval*.

![plot: graph2](/images/graphs/negotiation.graph2.gif)

### Non-Linear Strategies: the shorter Conceding time, the better.

In our framework Non-Linear strategies are approximated via 2-segments-linear NDFs. Several relevant parameter must be chosen with a non-linear strategy (either *conceder* or *boulware*), like the gradients for both segments and the *switch-time*, if *boulware*, or the *switching factor*, if *conceder*. The criteria for segments' gradient is as for *linear* strategies. Hence, in general, slow gradients are to be preferred to fast ones, no matter what non-linear strategies is considered. Furthermore, a comparative analysis of non-linear strategies, has proved that the shorter the *conceding* segment is, the higher is the probability for the player to get a greater utility out of the negotiation.

This is shown in the figure below where acceptance probability (cumulative) for different combination of *Conceder* strategies (both player adopting a *conceder* strategy) are compared by changing the instant of time when the *Seller* switches from the fast to the slow behaviour. One can observe that the earlier this *switching* takes place (i.e. **TS\_sw**:4 rather than **TS\_sw**:8 ), the higher is the probability the negotiation outcome will fall close to the interval's *supremum*, which is good from the *Seller* point of view.

![plot: graph3](/images/graphs/negotiation.graph3.gif)

The above considerations are valid in general, independently of the chosen non-linear strategy. The graphs depicted in the figure below, compares the acceptance probability (cumulative) for different value of the *Seller's switching time* (i.e. **Ts**:9, **Ts**:6, **Ts**:2 ) when the *Buyer* has a *boulware* tactic, whereas the *Seller* a *conceder* one. The curves in there, prove that, independently of the *Buyer*'s tactic, a short *conceding time* is really in the interest of the *Seller*.

![plot: graph4](/images/graphs/negotiation.graph4.gif)
