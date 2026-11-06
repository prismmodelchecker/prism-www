---
layout: layouts/base.njk
title: "Cell Cycle Control in Eukaryotes"
section: casestudies
permalink: /casestudies/cyclin/
---
# Cell Cycle Control in Eukaryotes

(Lecca and Priami)

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [Model Checking](#results)

## Introduction { #intro }

In this case study we consider a probabilistic model of cell cycle control in eukaryotes, a very commonly occurring class of single-celled or multi-cellular organisms. The model is a translation of the formal specification in the biochemical stochastic π-calculus given in {% cite "LP03" %} which studies the relative concentration of a number types of proteins, partaking concurrently in several complex chemical reactions.

In this approach, the time until a reaction between proteins is modelled as an exponential distribution, and therefore we construct a CTMC model of the system where the states of the CTMC correspond to the number of proteins of each type and the transitions correspond to the possible reactions between the proteins. The rate of a reaction is determined by a *base rate* and the concentrations of the reactants (i.e. the number of each type of molecule that takes part in the reaction).

Note that, for each reaction we consider, the rate of the reaction is the base rate multiplied by the product of the number of elements of each type that take part in the reaction. Therefore, to model this is PRISM, we use the fact that in PRISM the rate of synchronous transition is defined as the product of the rates of the local transitions which form this synchronous transition.

## The Model { #model }

The PRISM source code for this pathway is given below.

{% prismCode "casestudies/examples/cyclin.sm", false, true %}

The table below shows statistics for the CTMCs we have built for different numbers values of the constants `N1` and `N2`. The tables include:

-   the number of **states** and **transitions** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| `N`: | Model:    || MTBDD:  || Construction: ||
| ^^   | States:   | Transitions: | Nodes:  | Leaves: | Time (s):     | Iter.s: |
|------|-----------|--------------|---------|---------|---------------|---------|
| 2    | 4,666     | 18,342       | 6,880   | 31      | 0.317         | 27      |
| 3    | 57,667    | 305,502      | 22,406  | 48      | 1.627         | 40      |
| 4    | 431,101   | 2,742,012    | 81,145  | 78      | 10.025        | 53      |
| 5    | 2,326,666 | 16,778,785   | 179,015 | 105     | 32.997        | 66      |
| 6    | 9,960,861 | 78,768,799   | 352,833 | 139     | 86.077        | 79      |

## Model Checking { #results }

We analyse this pathway through the following properties:

-   The probability that there are k **cyclin\_bound** elements at time T.
-   The expected quantity of **CDC14**, **CDH1** and **cyclin\_bound** at time T

These property can be specified by the following CSL formula:

{% prismCode "casestudies/examples/cyclin.csl", false, true %}

The following graph plots, in the cases when N equals 2, 3 and 4, the probability that there are k **cyclin\_bound** elements at time as the value of T varies.

-   **N = 2**
    
    ![plot: probability k cyclin\_bound elements at time instant T (T small and N=2)](/images/graphs/cyclin.prob2.small.png)

    ![plot: probability k cyclin\_bound elements at time instant T (T large and N=2)](/images/graphs/cyclin.prob2.large.png)

-   **N = 3**
    
    ![plot: probability k cyclin\_bound elements at time instant T (T small and N=3)](/images/graphs/cyclin.prob3.small.png)

    ![plot: probability k cyclin\_bound elements at time instant T (T large and N=3)](/images/graphs/cyclin.prob3.large.png)

-   **N = 4**
    
    ![plot: probability k cyclin\_bound elements at time instant T (T small and N=4)](/images/graphs/cyclin.prob4.small.png)

    ![plot: probability k cyclin\_bound elements at time instant T (T large and N=4)](/images/graphs/cyclin.prob4.large.png)

In the graph below we have plotted the above expected values as T varies.

-   **N = 2**
    
    ![plot: expected number of proteins at time instant T (N=2)](/images/graphs/cyclin.expected2.png)

-   **N = 3**
    
    ![plot: expected number of proteins at time instant T (N=3)](/images/graphs/cyclin.expected3.png)

-   **N = 4**
    
    ![plot: expected number of proteins at time instant T (N=4)](/images/graphs/cyclin.expected4.png)

-   **N = 5**
    
    ![plot: expected number of proteins at time instant T (N=5)](/images/graphs/cyclin.expected5.png)
