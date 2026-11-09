---
layout: layouts/base.njk
title: "Dice programs"
section: casestudies
permalink: /casestudies/dice/
---

# Dice programs

This case study considers two probabilistic programs, due to Knuth and Yao {% cite "KY76" %},
which model fair dice using only fair coins.
We have reimplemented work done by [Joe Hurd](https://www.cl.cam.ac.uk/~jeh1004/research/probability/),
the key difference being that the latter uses a *theorem prover* (HOL)
whereas we use a *model checker* (PRISM)
to show the correctness of such probabilistic programs.

## Value of a die

The following program models a die using only fair coins.
Starting at the root vertex (state **0**), one repeatedly tosses a coin.
Every time *heads* appears, one takes the upper branch and when *tails* appears, the lower branch.
This continues until the value of the die is decided.

![Coin-toss diagram where every edge has probability 0.5. State 0 goes to states 1 or 2. State 1 goes to 3 or 4, and state 2 to 5 or 6. State 3 gives die value 1 or returns to state 1; state 4 gives 2 or 3; state 5 gives 4 or 5; state 6 gives 6 or returns to state 2.](/tutorial/images/dice.pic.jpg){.medium}

The PRISM code for this program is as follows.

{% prismCode "casestudies/examples/die.pm" %}

This model has 13 states and in PRISM it takes 4 iterations to find these reachable states.

To prove the above program is correct, we show that the probability of reaching a state where
`d=k` for `k=1,...,6` is 1/6.
In PRISM this corresponds to calculating the probability of satisfying the formula

```prism
P=? [ F s=7 & d=k ]
```

for `k=1..6`.
Performing this verification in PRISM using iterative numerical methods,
we find that the probability for each `k` is indeed 1/6 (up to an accuracy of six decimal places),
with each case requiring 22 iterations.

As shown in {% cite "KY76" %}, this program takes on average 11/3 coin tosses to
output a dice throw and this value is optimal.
The expected time can be calculated in PRISM through the formula

```prism
R=? [ F s=7 ]
```

Performing this verification in PRISM using iterative numerical methods,
we find that the expected number of coin tosses is indeed 11/3 (up to an accuracy of six decimal places),
requiring 21 iterations.

## Sum of two dice

To generate the sum of two dice throws using the above program,
we combine two such processes in asynchronous parallel composition as follows:

{% prismCode "casestudies/examples/two_dice.nm" %}

To prove the above program is correct for calculating the sum of two dice, we show that both the minimum and maximum
probability of reaching a state where `s1=7`, `s2=7` and `d1+d2=k`
for `k=2,...,12` are as follows:

| k  | Probability |
|----|-------------|
| 2  | 1/36 |
| 3  | 1/18 |
| 4  | 3/36 |
| 5  | 1/9  |
| 6  | 5/36 |
| 7  | 1/6  |
| 8  | 5/36 |
| 9  | 1/9  |
| 10 | 3/36 |
| 11 | 1/18 |
| 12 | 1/36 |

In PRISM this corresponds to verifying the formulae:

```prism
Pmin=? [ F s1=7 & s2=7 & d1+d2=k ]
Pmax=? [ F s1=7 & s2=7 & d1+d2=k ]
```

for `k=2,...,12`.
Performing this verification in PRISM we find that the probability for each `k`
is as shown in the table and each calculation requires 29 iterations.

Again we can calculate the expected number of coin flips; in this case the minimum and maximum number of coin flips
can be calculated through the following formulae:

```prism
Rmin=? [ F s1=7 & s2=7 ]
Rmax=? [ F s1=7 & s2=7 ]
```

Verifying these properties we find that both the minimum and maximum number of coin flips to find the sum of two dice
is 22/3 (two times the expected time to find the value of one die).

We note that this approach is not optimal and {% cite "KY76" %} shows that the optimal program has
an expected 79/18 coin flips and is realised by the following program:

![Larger coin-toss tree for the optimal two-dice program: each toss branches two ways, leaves are labelled with sums from 2 to 12, and two branches loop back to the second level of the tree.](/images/cs/dice.twodice.gif)

The PRISM code for this program is given below. Verifying the formula
<code>{{ "R=? [ F s=34 ]" | prism | safe }}</code>
with PRISM shows that the expected number of coin flips in this case is indeed 79/18
(up to an accuracy of six decimal places), requiring 21 iterations.

{% prismCode "casestudies/examples/optimal_two_dice.pm" %}
