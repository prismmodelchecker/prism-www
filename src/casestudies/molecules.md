---
layout: layouts/base.njk
title: "Simple molecular reactions"
section: casestudies
permalink: /casestudies/molecules/
---
# Simple molecular reactions

(Shapiro)

## Contents

-   [Introduction](#intro)
-   The reaction [**Na** + **Cl** ↔ **Na<sup>+</sup>** + **Cl<sup>-</sup>**](#nacl)
-   The reaction [**K** + **Na** + 2**Cl** ↔ **K<sup>+</sup>** + **Na<sup>-</sup>** + 2**Cl<sup>-</sup>**](#knacl)
-   The reaction [**Mg** + 2**Cl** ↔ **Mg<sup>+2</sup>** + 2**Cl<sup>-</sup>**](#mgcl)

## Introduction { #intro }

In this case study we consider a number of molecular reactions taken from Ehud Shapiro's lecture notes on [Biomolecular Processes as Concurrent Computation](http://www.wisdom.weizmann.ac.il/~biopsi/bpcc2001/).

In this approach, the time until a reaction between two molecules is modelled as an exponential distribution, and therefore we construct a CTMC model of the system where the states of the CTMC correspond to the number of molecules of each type and the transitions correspond to the possible reactions between the molecules. The rate of a reaction is determined by a *base rate* and the concentrations of the reactants (i.e. the number of each type of molecule that takes part in the reaction).

Note that, for each of the chemical reactions we consider, the rate of the reaction is the base rate multiplied by the product of the number of molecules of each type that take part in the reaction. Therefore, to model this is PRISM, we use the fact that in PRISM the rate of synchronous transition is defined as the product of the rates of the local transitions which form this synchronous transition.

## The reaction Na + Cl ↔ Na<sup>+</sup> + Cl<sup>-</sup> { #nacl }

The PRISM source code for this reaction is given below.

{% prismCode "casestudies/examples/nacl.sm", false, true %}

The table below shows statistics for the CTMCs we have built for different numbers values of the constants `N1` and `N2`. The tables include:

-   the number of **states** and **transitions** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| `N1`: | `N2`: | Model:  || MTBDD: || Construction: ||
| ^^    | ^^    | States: | Transitions: | Nodes: | Leaves: | Time (s):     | Iter.s: |
|-------|-------|---------|--------------|--------|---------|---------------|---------|
| 10    | 10    | 11      | 20           | 247    | 21      | 0.061         | 11      |
| 20    | 20    | 21      | 40           | 577    | 41      | 0.065         | 21      |
| 40    | 40    | 41      | 80           | 1,317  | 81      | 0.104         | 41      |
| 60    | 60    | 61      | 120          | 1,967  | 81      | 0.159         | 61      |
| 80    | 80    | 81      | 160          | 2,957  | 161     | 0.280         | 81      |
| 100   | 100   | 101     | 200          | 3,695  | 201     | 0.351         | 101     |
| 250   | 250   | 251     | 500          | 10,231 | 501     | 2.742         | 251     |

**Properties:**

-   Probability of there being i Na molecules at time T?
-   Expected percentage of Na molecules at time T?
-   Expected long-run percentage of Na molecules?

These properties are expressed in PRISM as follows.

{% prismCode "casestudies/examples/nacl.csl", false, true %}

-   The following graph plots, in the case when `N1=N2=10`, the probability of there being i Na molecules at time as the value of T varies.
    
    ![plot: probability l  Na molecules at the time instant T](/images/graphs/nacl10.png)

-   In the graph below we have plotted the expected values percentage of Na molecules at time T as T varies.
    
    ![plot: expected percentage of Na molecules at the time instant T](/images/graphs/nacl.png)

-   In the graph below we have plotted the expected long-run percentage of Na molecules as **N1** varies.
    
    ![plot: expected percentage of Na molecules in the long run](/images/graphs/nacl_ss.png)

## The reaction K + Na + 2Cl ↔ K<sup>+</sup> + Na<sup>-</sup> + 2Cl<sup>-</sup> { #knacl }

The PRISM source code for this reaction is given below.

{% prismCode "casestudies/examples/knacl.sm", false, true %}

The table below shows statistics for the CTMCs we have built for different numbers values of the constants `N1` and `N2`. The tables include:

-   the number of **states** and **transitions** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| `N1`: | `N2`: | `N3`: | Model:  || MTBDD:    || Construction: ||
| ^^    | ^^    | ^^    | States: | Transitions: | Nodes:    | Leaves: | Time (s):     | Iter.s: |
|-------|-------|-------|---------|--------------|-----------|---------|---------------|---------|
| 10    | 10    | 10    | 66      | 220          | 2,554     | 93      | 0.073         | 11      |
| 20    | 20    | 20    | 231     | 840          | 11,200    | 357     | 0.15          | 21      |
| 40    | 40    | 40    | 861     | 3,280        | 48,830    | 1,192   | 0.512         | 41      |
| 60    | 60    | 40    | 1,891   | 7,320        | 107,376   | 2,615   | 1.262         | 61      |
| 80    | 80    | 80    | 3,321   | 12,960       | 215,205   | 4,583   | 2.232         | 81      |
| 100   | 100   | 100   | 5,151   | 20,200       | 332,351   | 6,821   | 3.618         | 101     |
| 250   | 250   | 250   | 31,626  | 125,500      | 2,272,315 | 40,105  | 26.44         | 251     |

**Properties:**

-   Probability of there being i Na/K molecules at time T?
-   Expected percentage of Na/K molecules at time T?
-   Expected long-run percentage of Na/K molecules?

These properties are expressed in PRISM as follows.

{% prismCode "casestudies/examples/knacl.csl", false, true %}

-   The following graph plots, in the case when `N1=N2=N3=10`, the probability of there being i Na/K molecules at time T as the value of T varies.
    
    ![plot: probability l Na molecules at the time instant T](/images/graphs/knacl_1.png)

    ![plot: probability l K molecules at the time instant T](/images/graphs/knacl_2.png)

-   In the graph below we have plotted the expected percentage of Na/K molecules at time T as T varies.
    
    ![plot: expected percentage of Na molecules at the time instant T](/images/graphs/knacl_na.png)

    ![plot: expected percentage of K molecules at the time instant T](/images/graphs/knacl_k.png)

-   In the graph below we have plotted the expected long-run percentage of Na/K molecules as **N1** varies.
    
    ![plot: expected percentage of Na/K molecules in the long run](/images/graphs/knacl_ss.png)

## The reaction **Mg** + 2**Cl** ↔ **Mg<sup>+2</sup>** + 2**Cl<sup>-</sup>** { #mgcl }

The PRISM source code for this reaction is given below.

{% prismCode "casestudies/examples/mc.sm", false, true %}

The table below shows statistics for the CTMCs we have built for different numbers values of the constants `N1` and `N2`. The tables include:

-   the number of **states** and **transitions** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| `N1`: | `N2`: | Model:  || MTBDD:  || Construction: ||
| ^^    | ^^    | States: | Transitions: | Nodes:  | Leaves: | Time (s):     | Iter.s: |
|-------|-------|---------|--------------|---------|---------|---------------|---------|
| 10    | 10    | 36      | 110          | 1,214   | 64      | 0.070         | 11      |
| 20    | 20    | 121     | 420          | 5,110   | 224     | 0.123         | 21      |
| 40    | 40    | 441     | 1,640        | 21,727  | 765     | 0.402         | 41      |
| 60    | 60    | 961     | 3,660        | 47,064  | 1,630   | 0.798         | 61      |
| 80    | 80    | 1,681   | 6,480        | 94,413  | 2,818   | 1.623         | 81      |
| 100   | 100   | 2,601   | 10,100       | 145,234 | 4,262   | 2.536         | 101     |
| 250   | 250   | 15,876  | 62,750       | 987,393 | 247,53  | 25.12         | 251     |

**Properties:**

-   Probability of there being i Mg/Mg+/Mg+2 molecules at time T?
-   Expected percentage of Mg/Mg+/Mg+2 molecules at time T?
-   Expected long-run percentage of Mg/Mg+/Mg+2 molecules?

These properties are expressed in PRISM as follows.

{% prismCode "casestudies/examples/mc.csl", false, true %}

-   The following graph plots, in the case when `N1=N2=10`, the probability of there being i Mg and Mg+2 molecules at time T as the value of T varies.
    
    ![plot: probability k Mg molecules at the time instant T](/images/graphs/mg10.png)

    ![plot: probability k Mg+2 molecules at the time instant T](/images/graphs/mg10_2.png)

-   In the graphs below we have plotted the expected percentage of Mg and Mg+2 molecules at time T as T varies.
    
    ![plot: expected number of Mg molecules at the time instant T](/images/graphs/mg_mg.png)

    ![plot: expected number of Mg+2 molecules at the time instant T](/images/graphs/mg_mg2+.png)

-   In the graph below we have plotted the expected long-run percentage of Mg/Mg+/Mg+2 molecules as **N1** varies.
    
    ![plot: expected percentage of Mg/Mg+/Mg+2 molecules in the long run](/images/graphs/mg_ss.png)
