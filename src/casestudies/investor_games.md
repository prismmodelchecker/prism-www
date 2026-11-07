---
layout: layouts/base.njk
title: "Futures market investor (stochastic games)"
section: casestudies
permalink: /casestudies/investor_games/
---
# Futures market investor (stochastic games)

(McIver and Morgan)

## Contents

-   [Introduction](#intro)
-   [Basic Turn-Based Stochastic Game Model](#model)
-   [Extended Concurrent Stochastic Game Models - Zero-Sum Properties](#zerosum)
-   [Extended Concurrent Stochastic Game Models - Nonzero-Sum Properties](#nonzerosum)

**Related publications**: {% cite "KNPS18" %}

## Introduction: { #intro }

This case study is based on an investor in a futures market; it is taken from {% cite "MM07", "MM02" %}, where it is used to explore the interaction of angelic, demonic and probabilistic choice in the context of a *minimax*\-valued logic. The original model can be considered as a turn-based two player game where one player (the *investor*) tries to maximize his or her return against the other player (the *futures market*) which attempts to minimise this return.

**The Investor** (**player 1**) has been given the right to make an investment in \`futures': a fixed number of shares in a specific company that he can *reserve* on the first day of any month he chooses. Exactly one month later, the shares will be *delivered* and will collectively have a market *value* on that day — he or she can then *sell* the shares. The investors problem is to decide when to make the reservation so that the subsequent sale has maximum value. If the investor *never* reserves, then his or her return is zero.

**The futures market** (**player 2**) has the following choice: if in given month the investor does not reserve, then the market can temporarily *bar* the investor from reserving in the next month, with the restriction that the market cannot bar the investor in two consecutive months nor in the first month.

In adition, the market has the following variables.

1.  The value **v** of the shares is a whole number of pounds between ￡0 and ￡10 inclusive; it has a probability **p** of going up by ￡1 in any month, and **1-p** of going down by ￡1 — but it remains within those bounds. The probability **p** represents short-term market uncertainty.
2.  The probability **p** itself varies month-by-month in steps of **0.1** between zero and one:
    
    -   when **v** is less than ￡5 the probability that **p** will rise is **2/3**;
    -   when **v** is ￡5 exactly the probability is **1/2** of both rising and falling;
    -   when **v** is more than ￡5 the probability of **p**'s falling is **2/3**.
    
    The movement of the probability **p** represents an investor's knowledge of long-term 'cyclic second-order' trends.
3.  There is a cap **c** on the value of **v**, initially ￡10, which has probability **1/2** of falling by ￡1 in any month and otherwise remaining unchanged. The 'falling cap' models the fact that the company is in a slow decline.

## Basic Turn-Based Stochastic Game Model { #model }

The behavior in any month can be split into the following steps:

-   first the investor (player 1) decides whether to reserve;
-   second, if the investor does not reserve and was not barred in the previous month and it is not the first month, then the market (player 2) can decide to bar the investor in the next month;
-   finally, there are three probabilistic transitions that occur: the share value **v** rises or falls, according to **p**; probability **p** itself rises or falls, according to long-term trends; and the capped value **c** of the stock either falls or stays the same.

The compounded effect of these choices determine a transition representing one month's stock market activity.

Below we give the PRISM code for this model where `vinit` is a unspecified parameter corresponding to the initial value of the shares.

{% prismCode "casestudies/examples/investor_basic_tsg.prism", true, true %}

The property we consider is the maximum possible expected profit the investor can guarantee. Notice the use of the **Fc** operator, as otherwise the investor's optimal strategy would be to never invest yielding a reward of infinity.

{% prismCode "casestudies/examples/investor_basic.props", false, true %}

The graph below plots the expected profit the investor can guarantee as the initial value of the shares varies.

![plot: expected profit the investor can guarantee as the initial value of the shares varies](/images/graphs/investor_basic_tsg.png){.w50}

We have considered several variants of the basic model, to allow for the analysis of optimal strategies for investors under adversarial conditions. We first consider those for zero-sum properties and then for non-zero sum properties.

## Extended Concurrent Stochastic Game Models - Zero-Sum Properties { #zerosum }

First, we made the investor and market take their decisions concurrently and the PRISM code for this model is presented below. As can be seen, due to the different syntax for concurrent games a number of changes to the model were required.

{% prismCode "casestudies/examples/investor_basic_csg.prism", true, true %}

Considering the above property as for the turn-based model, i.e. the expected profit the investor can guarantee as the initial value of the shares varies, one can verify that the results are the same as for the turn-based game. This means concurrency yields no additional gain for the investor, as previously the market knew the investor's decision before making its decision. This is because the market and investor have the same information, and therefore the market knows when it is optimal for the investor to invest without needing to see its decision.

We next modelled two competing investors who simultaneously decide whether to invest (and, as above, the market simultaneously decides whether to bar each of them) over a fixed number of months. If the two investors cash in their shares in the same month, then their profits are reduced.

The CSG PRISM model given below has 3 players: one for each investor, one for the market (deciding on whether to bar investors or not). The model has one parameter: `months` corresponding to the number of months in which the investors could invest.

{% prismCode "casestudies/examples/two_investors_csg.prism", true, true %}

The CSG also include three reward structures referenting distinct profit models: 'normal market', 'later cash-ins' and 'later cash-ins with fluctuation'. The first is from {% cite "MM07" %} and the latter two reward the investor postponing cashing in shares and are illustrated in the graphs below.

![plot: payoff profiles](/images/graphs/investor_payoffs.png){.w50}

For comparison, we have also build a TSG model, given below, in which the investors first take turns to decide whether to invest (the ordering decided by the market) and then the market decides on whether to bar any of the investors.

{% prismCode "casestudies/examples/two_investors_tsg.prism", true, true %}

We study both the maximum profit of one investor and the maximum combined profit of both investors given by the following properties.

{% prismCode "casestudies/examples/two_investors.props", false, true %}

The figure shows the maximum expected value over a fixed number of months under the 'normal market' for both the profit of first investor and the combined profit of the two investors. For the former, we show results for the first investor acting alone and when in a coalition with the second investor. We plot the corresponding results from the TSG model for comparison.

![plot: payoffs for the normal market](/images/graphs/two_investors_normal.png){.w75}

The figures below shows first the same results for the 'later cash-ins' profit model and then for the 'later cash-ins with fluctuation' two profit model.

![plot: payoffs for the later cash-ins market](/images/graphs/two_investors_late.png){.w75}
  
![plot: payoffs for the later cash-ins with fluctutations market](/images/graphs/two_investors_late_fluctuations.png){.w75}

When investors cooperate to maximise the profit of the first, results for the CSG and TSG models coincide. This follows from the discussion above since all the second investor can do is make sure it does not invest at the same time as the first. For the remaining cases and given sufficient months, there is always a strategy in the concurrent setting that outperforms all turn-based strategies.

The increase in profit for a single investor in the CSG model is due to the fact that, as the investors decisions are concurrent, the second cannot ensure it invests at the same time as the first, and hence decrease the profit of the first. In the case of combined profit, the difference arises because, although the market knows when it is optimal for one investor to invest, in the CSG model the market does not know which one will, and therefore may choose the wrong investor to bar. On the other hand, in the TSG version, the market's choice is made after both investors have made their decisions and can therefore see which investor to block.

We performed strategy synthesis to study the optimal actions of the first investor when in single coalitions. By way of example, consider the case over three months and for a normal market. The optimal TSG strategy for the first investor is to invest in the first month (which the market cannot bar) ensuring an expected profit of 3.75. The optimal (randomised) CSG strategy is to invest:

-   in the first month with probability 0.494949;
-   in the second month with probability 1, if the second investor has cashed in;
-   in the second month with probability 0.964912, if the second investor did not cash in at the end of the first month and the shares went up;
-   in the second month with probability 0.954023, if the second investor did not cash in at the end of the first month and the shares went down;
-   in the third month with probability 1 (this is the last month to invest).

Following this strategy, the first investor ensures an expected profit of approximately 4.33.

## Extended Concurrent Stochastic Game Models - Nonzero-Sum Properties { #nonzerosum }

In this version of the model we again consider two investors, however here the market is randomised and each investor tries to maximise their own profit. The PRISM model is given below. The model has two parameters `months` and `pbar` corresponding to the number of months in which the investors could invest and the probability that the market bars an investor in a month this is possible, i.e. either when the inestor was not barred in the previous month or it is the first month.

{% prismCode "casestudies/examples/two_investors_nash.prism", true, true %}

Regarding the properties, we consider both when the investors are in the same market and when the investors are in different markets (the first investor in markerts favouring late cash-ins and the first early cash-ins).

{% prismCode "casestudies/examples/two_investors_nash.props", false, true %}

The following graphs plot the results when `pbar=0`.5 as the number of months varies.

![plot: payoffs forwhen pbar equals 0.5](/images/graphs/two_investors_nash05.png){.w75}

In addition, the follow graphs consider the case when `pbar=0`.2.

![plot: payoffs forwhen pbar equals 0.2](/images/graphs/two_investors_nash02.png){.w75}
