---
layout: layouts/base.njk
title: "Futures Market Investor"
section: casestudies
permalink: /casestudies/investor/
---
# Futures Market Investor

(McIver and Morgan)

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [Modelling the system in PRISM](#pmodel)
-   [Value of the Game](#value)
-   [Verification with PRISM](#mc)

## Introduction: { #intro }

This case study is based on an investor in a futures market; it is taken from {% cite "MM07", "MM02" %}, where it is used to explore the interaction of angelic, demonic and probabilistic choice in the context of a *minimax*\-valued logic. This example can be considered as a two player game where one player (the *investor*) tries to maximize his or her return against the other player (the *futures market*) which attempts to minimise this return.

**The Investor** (**I**) has been given the right to make an investment in \`futures': a fixed number of shares in a specific company that he can *reserve* on the first day of any month he chooses. Exactly one month later, the shares will be *delivered* and will collectively have a market *value* on that day — he or she can then *sell* the shares. The investors problem is to decide when to make the reservation so that the subsequent sale has maximum value. If the investor *never* reserves, then his or her return is zero.

**The futures market** (**M**) has the following structure:

1.  The market value **v** of the shares is a whole number of pounds between £0 and £10 inclusive; it has a probability **p** of going up by £1 in any month, and **1-p** of going down by £1 — but it remains within those bounds. The probability **p** represents short-term market uncertainty.
2.  The probability **p** itself varies month-by-month in steps of **0.1** between zero and one: when **v** is less than £5 the probability that **p** will rise is **2/3**; when **v** is more than £5 the probability of **p**'s falling is **2/3**; and when **v** is £5 exactly the probability is **1/2** of going either way. The movement of **p** represents investors' knowledge of long-term \`cyclic second-order' trends.
3.  There is a cap **c** on the value of **v**, initially £10, which has probability **1/2** of falling by £1 in any month; otherwise it remains where it is. The \`falling cap' models the fact that the company is in a slow decline.
4.  If in a given month the investor does not reserve, then at the very next month the market can temporarily *bar* the investor from reserving. But the market cannot bar the investor in two consecutive months.

## The Model { #model }

The situation of the game can be summed up as follows:

-   During each month there are three probabilistic transitions that occur: the share value **v** rises or falls, according to **p**; probability **p** itself rises or falls, according to long-term trends; and the capped value **c** of the stock either falls or stays the same. The compounded effect of these choices determine a transition representing one month's stock market activity.
-   At the beginning of each month, the investor makes a maximising choice of whether to reserve; but, if he does not, then
-   At the beginning of the next month, the market makes a minimising choice of whether to bar the investor or not.

Graphically, the behaviour of the model is given by the transition system below.

![behaviour of the system](/images/cs/investor.trans.gif)

## Modelling the system in PRISM { #pmodel }

Below we give the PRISM code for this model. The model has 6,688 states and in PRISM it takes 0.169 seconds to construct this model.

{% prismCode "casestudies/examples/investor.nm", false, true %}

## Value of the Game { #value }

Using the game interpretation, we can generate a probabilistic tree from the transition system above by duplicating nodes with multiple incoming arcs, \`unfolding' back-loops, and making minimising or maximising choices as they are encountered. In this example, at each unfolding both the investor **I** (making choices as to whether to invest) and the stock market **M** (making choices whether to impose a bar) need to choose between two ongoing branches — and their choice could be different each time they revisit their respective decision points. Each of **I** and **M** will be using a *strategy*.

For example, the investor **I**'s strategy (maximising, he or she hopes) for dealing with the falling cap might be: *wait until the share value **v** (rising) meets the cap **c** (falling), and then reserve.* Waiting for **v** to rise is a good idea, but when it has met the cap **c** there is clearly no point in waiting further. We call this strategy **I**'s \`seat-of-the-pants' strategy.

On the other hand, **M**'s strategy (minimising, the investor fears) might be: *bar the investor, if possible, whenever the shares' probability **p** of rising exceeds 1/2*.

As is usual in game theory, when the actual strategies of the two players are unknown, we define the *value* of the game to be the the *minimax* over all strategy sequences of the expected payoff — but it is well-defined only when it is the same as the *maximin*. From the results presented in {% cite "MM07" %} the game's value is indeed well-defined.

We have used both [Mathematica](http://www.wolfram.com/products/mathematica/) and PRISM in conjunction with [Matlab](http://www.mathworks.com/) for this calculation. The scripts are available online from [here](http://www.cse.unsw.edu.au/~carrollm/qmu/) and further details are available in {% cite "MM07" %}.

For example, if **p** is initially **0.5** and the cap **c** is 10, then the optimal expected sale-value for the investor is given in the table below. In the table we also include the results when the investor follows the \`seat-of-the-pants' strategy given above.

| initial share value: | expected sale price: ||
| ^^                   | optimal strategy     | \`seat-of-the-pants' strategy |
|----------------------|----------------------|-------------------------------|
| 0                    | 4.16                 | 3.68                          |
| 1                    | 4.30                 | 3.79                          |
| 2                    | 4.55                 | 3.97                          |
| 3                    | 4.88                 | 4.17                          |
| 4                    | 5.24                 | 4.29                          |
| 5                    | 5.52                 | 4.17                          |
| 6                    | 6.00                 | 4.16                          |
| 7                    | 7.00                 | 4.65                          |
| 8                    | 8.00                 | 5.61                          |
| 9                    | 9.00                 | 6.78                          |
| 10                   | 9.50                 | 9.50                          |

We see that, even when the share value is only \`moderately high', there is nothing to be gained by waiting, since the cap is likely to drop. For low initial values, however, some benefit can be gained by delaying the reservation for a while. Furthermore, by following the \`seat-of-the-pants' strategy we see a significantly lower expected return against \`worst-case' play by **M**. From this we might guess that when **v** is at least £6 it is better to \`reserve now' than to follow the \`seat-of-the-pants' strategy and wait.

Due to the simple structure of this game, using theorems presented in {% cite "MM97", "MM04" %}, the strategy which actually achieves the optimal return states that the investor should follow the following strategy: *make an immediate reservation just when the expected value of the stock in one month's time is at least as great as the expected value of the whole game played from this point; otherwise wait.*

## Verification with PRISM { #mc }

By replacing the non-deterministic choices of the market as to whether to bar or not with a probabilistic choice we reach a situation where the investor is trying to maximize his or her return against a purely probabilistic market. For such a game we can use PRISM directly to calculate the optimal reward of the investor.

In the table and graph below we give the optimal return of the investor (in the case when **p** is initially **0.5** and the cap **c** is 10) as the probability of the market choosing to bar and the initial value of **v** varies.

| initial share value: | maximum expected sale price:   |||||||||||
| ^^                   | probability of choosing to bar |||||||||||
| ^^                   | 0                              | 0.1  | 0.2  | 0.3  | 0.4  | 0.5  | 0.6  | 0.7  | 0.8  | 0.9  | 1    |
|----------------------|--------------------------------|------|------|------|------|------|------|------|------|------|------|
| 0                    | 4.57                           | 4.50 | 4.47 | 4.45 | 4.43 | 4.41 | 4.39 | 4.37 | 4.36 | 4.35 | 4.34 |
| 1                    | 4.67                           | 4.63 | 4.61 | 4.58 | 4.56 | 4.54 | 4.52 | 4.51 | 4.50 | 4.48 | 4.47 |
| 2                    | 4.91                           | 4.88 | 4.85 | 4.82 | 4.80 | 4.78 | 4.77 | 4.75 | 4.74 | 4.73 | 4.73 |
| 3                    | 5.22                           | 5.19 | 5.16 | 5.14 | 5.12 | 5.10 | 5.08 | 5.07 | 5.06 | 5.05 | 5.04 |
| 4                    | 5.53                           | 5.49 | 5.47 | 5.45 | 5.43 | 5.41 | 5.40 | 5.39 | 5.38 | 5.38 | 5.37 |
| 5                    | 5.80                           | 5.77 | 5.75 | 5.73 | 5.71 | 5.70 | 5.68 | 5.67 | 5.66 | 5.65 | 5.64 |
| 6                    | 6.22                           | 6.19 | 6.17 | 6.15 | 6.13 | 6.11 | 6.10 | 6.08 | 6.07 | 6.06 | 6.05 |
| 7                    | 7.02                           | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 | 7.00 |
| 8                    | 8.00                           | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 | 8.00 |
| 9                    | 9.00                           | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 | 9.00 |
| 10                   | 9.50                           | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 | 9.50 |

  
![graphical representation of results](/images/graphs/investor.gif)

The results demonstrate that, as the probability of the market barring the investor increases, the return of the investor decreases. This is to be expected since as this probability increases the choices the investor has available decrease (there is more chance of the investor being barred in a month).
