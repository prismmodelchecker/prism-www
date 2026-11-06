---
layout: layouts/base.njk
title: "Stable Matchings"
section: casestudies
permalink: /casestudies/stable_matching/
---
# Stable Matchings

## Contents

-   [Introduction](#intro)
-   [Example 1 (Gale & Shapley)](#example1)
-   [Example 2 (Knuth)](#example2)
-   [Example 3 (Molis)](#example3)
-   [Case study](#casestudy)

**Related publications**: {% cite "BN12" %}

## Introduction { #intro }

The Stable Roommates problem is a classical combinatorial problem (**SR**) that has been studied extensively. The **SR** problem and its variants arise in many practical applications, such as matching graduating medical students to hospital posts, residents or in college admissions.

An instance **I** of **SR** contains an undirected graph *G*(*V*, *E*), where *V* = {*v<sub>1</sub>*, . . . , *v<sub>n</sub>*} and *m*\=|*E*(*G*)|. We refer to *G* as the underlying graph of **I**, and the vertices of *G* as the agents. If (*u*, *v*) is an edge in *G*(*V*, *E*), then we say that *u* and *v* find each other acceptable. Each agent *u* has a linear order ><sub>u</sub> over her acceptable partners, where *v* ><sub>u</sub> *w* means that *u* prefers *v* to *w*. Let **M**(*u*) denote the partner of *u* in a given matching **M**. An edge (*u*,*v*) is said to be *blocking* with respect to M if:

-   either *u* is unmatched in **M** or prefers *v* to **M**(*u*);
    
-   either *v* is unmatched in **M** or prefers *u* to **M**(*v*).
    

A matching is called *stable* if it admits no blocking edge.

If *G* is bipartite, then the problem of finding a stable matching is called the Stable Marriage problem (**SM**) In this case, if the graph is *G*(*U*,*V*,*E*), then we refer to U={*m<sub>1</sub>*, . . . , *m<sub>n1</sub>*} and W ={*w<sub>1</sub>*, . . . , *w<sub>n2</sub>* } as the sets of men and women, respectively.

Knuth {% cite "Knu76" %} asked the following question (Problem 8 from his twelve famous research problems). Suppose that we are given an instance of **SM** with complete lists and an unstable matching **M** . If (*m*,*w*) is a blocking pair for **M** , then a matching can be obtained from **M** and (*m*,*w*) by an *interchange*, i.e., by matching the blocking pair and matching their partners to each other. Does there always exist a sequence of interchanges from **M** to some stable matching?

Although Tamura {% cite "Tam93" %} answers Knuth's question negatively by giving a counterexample, Roth and Vande Vate {% cite "RV90" %} show that, given an instance of **SR**, starting from any unstable matching we always obtain a stable matching by successively satisfying blocking pairs, i.e., by adding the blocking pair to the matching and leaving their partners (if there were any) unmatched. Diamantoudi et al. {% cite "DMX04" %} show a similar result holds for the roommates problem, namely, for a given instance of sr that admits a stable matching and starting from any unstable matching, one obtains a stable matching by successively satisfying blocking pairs.

We study the dynamics of matching markets where two agents meet with each other randomly and behave in a myopic way (they form a new pair if they both would be better off). More precisely, we suppose that in each step of the process, each blocking edge is chosen with equal probability and then the matching is updated to satisfy the blocking pair. This is called the *better response dynamics* by Ackermann et al. {% cite "AGM+08" %}, while Klaus et al. {% cite "KKW08" %} refer to it as *unperturbed blocking dynamics*.

## Example 1 (Gale & Shapley) { #example1 }

We start with a classical instance by Gale and Shapley {% cite "GS62" %} with three men and three women and the following preferences:

-   m1 : w1,w2,w3
-   m2 : w2,w3,w1
-   m1 : w1,w2,w3
-   w1 : m2,m3,m1
-   w2 : m3,m1,m2
-   w3 : m1,m2,m3

The PRISM source code for this instance is given below.

{% prismCode "casestudies/examples/stable_matching1.pm", true, true %}

Constructing the model in PRISM we find the Markov chain has 34 states, 123 transitions, and the following deadlock/absorbing states:

-   `17:(1,2,3)`
-   `26:(2,3,1)`
-   `31:(3,1,2)`

which correspond to the stable matchings:

-   M<sub>m</sub> = {(m1, w1), (m2,w2), (m3,w3)} (*man-optimal*);
-   M<sub>e</sub> ={(m1, w2), (m2,w3), (m3, w1)} (*egalitarian*);
-   M<sub>w</sub> = {(m1, w3), (m2,w1), (m3,w2)} (*woman-optimal*).

Calculating the steady state probabilities, PRISM returns:

-   `17:(1,2,3)=0.219529`
-   `26:(2,3,1)=0.560937`
-   `31:(3,1,2)=0.219529`

which shows the egalitarian stable matching is therefore more likely than both the extreme solutions together.

Next, we study the convergence of this instance by verifying the following properties:

-   the probability of reaching a stable matching within r rounds;
    
-   the expected number of rounds to reach a stable matching.
    

These properties can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/stable_matching1.pctl", false, true %}

Analysing these properties in PRISM we find the expected number of rounds equals `9.115955` and the probabilities are plotted in the graph below.

![plot: probability of reaching a stable matching within r rounds](/images/graphs/stable.matching.bounded1.png)

## Example 2 (Knuth) { #example2 }

The following classical instance was proposed by Knuth {% cite "Knu76" %} with four men and four women and the following preferences:

-   m1 : w1, w2, w3, w4
-   m2 : w2, w1, w4, w3
-   m3 : w3, w4, w1, w2
-   m4 : w4, w3, w2, w1
-   w1 : m4, m3, m2, m1
-   w2 : m3, m4, m1, m2
-   w3 : m2, m1, m4, m3
-   w4 : m1, m2, m3, m4

The PRISM source code for this instance is given below.

{% prismCode "casestudies/examples/stable_matching2.pm", true, true %}

In this case, the Markov chain has 209 states, 1280 transitions, and the following 10 deadlocks/absorbing states:

-   `90:(1,2,3,4)`
-   `92:(1,2,4,3)`
-   `124:(2,1,3,4)`
-   `126:(2,1,4,3)`
-   `138:(2,4,1,3)`
-   `160:(3,1,4,2)`
-   `172:(3,4,1,2)`
-   `174:(3,4,2,1)`
-   `206:(4,3,1,2)`
-   `208:(4,3,2,1)`

which corresponds to the following stable matchings:

-   M<sub>1</sub> = {(m1, w1), (m2, w2), (m3, w3), (m4, w4)}
-   M<sub>2</sub> = {(m1, w1), (m2, w2), (m4, w3), (m3, w4)}
-   M<sub>3</sub> = {(m2, w1), (m1, w2), (m3, w3), (m4, w4)}
-   M<sub>4</sub> = {(m2, w1), (m1, w2), (m4, w3), (m3, w4)}
-   M<sub>5</sub> = {(m2, w1), (m4, w2), (m1, w3), (m3, w4)}
-   M<sub>6</sub> = {(m3, w1), (m1, w2), (m4, w3), (m2, w4)}
-   M<sub>7</sub> = {(m3, w1), (m4, w2), (m1, w3), (m2, w4)}
-   M<sub>8</sub> = {(m3, w1), (m4, w2), (m2, w3), (m1, w4)}
-   M<sub>9</sub> = {(m4, w1), (m3, w2), (m1, w3), (m2, w4)}
-   M<sub>10</sub> = {(m4, w1), (m3, w2), (m2, w3), (m1, w4)}

Calculating the steady state probabilities, PRISM returns:

-   `90:(1,2,3,4)=0.057738`
-   `92:(1,2,4,3)=0.083140`
-   `124:(2,1,3,4)=0.083140`
-   `126:(2,1,4,3)=0.116445`
-   `138:(2,4,1,3)=0.159531`
-   `160:(3,1,4,2)=0.159531`
-   `172:(3,4,1,2)=0.116445`
-   `174:(3,4,2,1)=0.083140`
-   `206:(4,3,1,2)=0.083140`
-   `208:(4,3,2,1)=0.057738`

Again, to study the convergence of this instance we consider:

-   the probability of reaching a stable matching within r rounds;
    
-   the expected number of rounds to reach a stable matching;
    

which as for Example 1 can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/stable_matching1.pctl", false, true %}

Analysing these properties in PRISM we find the expected number of rounds equals `16.72144` and the probabilities are plotted in the graph below.

![plot: probability of reaching a stable matching within r rounds](/images/graphs/stable.matching.bounded2.png)

## Example 3 (Molis) { #example3 }

In this example we consider the roommates instance from {% cite "KKW08" %} (Example 3, page 25), provided by Elena Molis. This instance concerns eight agents with the following preferences:

-   a1 : a2,a3,a4,a6,a5,a7,a8
-   a2 : a3,a1,a4,a5,a6,a8,a7
-   a3 : a1,a2,a4,a5,a6,a7,a8
-   a4 : a6,a3,a5,a1,a2,a7,a8
-   a5 : a4,a7,a1,a2,a3,a6,a8
-   a6 : a7,a4,a2,a3,a1,a5,a8
-   a7 : a5,a6,a1,a2,a3,a4,a8
-   a8 : a3

It is an unsolvable instance, it admits two stable half-matchings (with no even cycles), namely *h1* and *h2*, where

-   h1((4,5))=h1((6,7))=1 and h1((1,2))=h1((2,3))=h1((3,1))=1/2;
    
-   h2((4,6))=h2((5,7))=1 and h2((1,2))=h2((2,3))=h2((3,1))=1/2.
    

The *h1*\-stable matchings are:

-   M1 = {(2,3) , (4,5) , (6,7)}
-   M2 = {(1,2) , (4,5) , (6,7)}
-   M3 = {(1,3) , (4,5) , (6,7)}

while the *h2*\-stable matchings are:

-   M4 = {(2,3) , (4,6) , (5,7)}
-   M5 = {(1,2) , (4,6) , (5,7)}
-   M6 = {(1,3) , (4,6) , (5,7)}

From results presented in {% cite "ILM08" %} it follows that, starting from any matching, we can always reach one of these matchings by successively satisfying blocking pairs. This implies that any ergodic set of the corresponding Markov chain must contain some of the above matchings.

The PRISM code for this instance is given below.

{% prismCode "casestudies/examples/stable_matching3.pm", true, true %}

Constructing this instance in PRISM, we find there are 308 matchings and a single ergodic set:

-   `43:(1,3,2,6,7,4,5,8)`
-   `109:(2,1,3,6,7,4,5,8)`
-   `135:(2,1,8,6,7,4,5,3)`
-   `145:(3,2,1,6,7,4,5,8)`

which corresponds to the matchings M4, M5, M7(={(1,2) , (3,8) , (4,6) , (5,7)}) and M6 respectively. This corresponds to the results presented in {% cite "KKW08" %}. Computing the long-term likelihood of being in any one of the matching (i.e. the steady state probabilities of the Markov chain) we find:

-   `43:(1,3,2,6,7,4,5,8)=0.285714`
-   `109:(2,1,3,6,7,4,5,8)=0.285714`
-   `135:(2,1,8,6,7,4,5,3)=0.142857`
-   `145:(3,2,1,6,7,4,5,8)=0.285714`

We now study the converge of the instance through the following properties:

-   the probability of reaching the ergodic set within r rounds;
    
-   the expected number of rounds to reach the ergodic set.
    

For this roommates instance, these properties can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/stable_matching3.pctl", false, true %}

Analysing these properties in PRISM we find the expected number of rounds equals `16.49788` and the probabilities are plotted in the graph below.

![plot: probability of reaching a stable matching within r rounds](/images/graphs/stable.matching.bounded3.png)

## Case study { #casestudy }

We now compare the performance characteristics of a number of different instances of the **SM** problem, as the number of men and women *k*(=*n*/2) varies between 4 and 8.

-   **Symmetric*:* in this instance the preferences of the men and women are of the form:
    
    -   mj : wj,...,wk,w1,...,w(j-1)
    -   wj : mj,...,mk,m1,...,m(j-1).
-   **Uncoord*:* this instance is used in {% cite "AGM+08" %} to show an exponential lower bound for the convergence time. The preference lists in this instance are given by:
    
    -   mj : w(j+1),...,wk,w1,...,wj
    -   wj : mj,m(j+1),...,mk,m1,..,m(j-1).
-   **Uniform*:* in this case the preference lists of all men and all women are the same and equal w1,w2,...,wk and m1,m2,...,m\_k respectively.
    

For comparison, in our results we also includes the minimum, average and maximum values obtained from a sample of 1,000 random instances for *k* equal to 4, 5, 6 and 7.

The specification for these instances follow those for Examples 1 and 2. To simplify this construction, we use the [PRISM preprocessing language](/prismpp/). For example, the specification in the PRISM preprocessing language for the *Uncoord* instances is given below.

{% prismCode "casestudies/examples/stable_matching_uncoord.pp", true, true %}

In the specification above we suppose that the system starts with a (random) complete matching. In our experiments we also consider the case when the system starts in the empty matching. This case can be specified by simply removing the initial state specification and then (by default) in the initial state each variable takes its least value, i.e. each variable is initialised with the value 0.

* * *

### Model Statistics

The table below shows the model statistics for the different instances we have built when starting from a random complete matching.

-   Specific Instances:
    
    | N:  | *Symmetric*: || *Uncoord*: || *Uniform*: ||
    | ^^  | states:      | transitions: | states:    | transitions: | states:    | transitions: |
    |-----|--------------|--------------|------------|--------------|------------|--------------|
    | 4   | 208          | 1,433        | 208        | 1,268        | 87         | 369          |
    | 5   | 1,545        | 15,901       | 1,545      | 14,205       | 665        | 4,746        |
    | 6   | 13,326       | 189,691      | 13,326     | 170,886      | 5,972      | 64,341       |
    | 7   | 130,921      | 2,450,001    | 130,921    | 2,222,745    | 61,215     | 926,095      |
    | 8   | 1,441,728    | 34,194,273   | 1,441,728  | 31,209,032   | 702,311    | 14,175,310   |
    
-   1,000 random samples:
    
    | N:  | Minimum: || Average: || Maximum: ||
    | ^^  | states:  | transitions: | states:  | transitions: | states:  | transitions: |
    |-----|----------|--------------|----------|--------------|----------|--------------|
    | 4   | 102      | 461          | 193      | 1,247        | 208      | 1,460        |
    | 5   | 993      | 8,524        | 1,562    | 15,618       | 1,545    | 16,660       |
    | 6   | 9,272    | 119,035      | 13,317   | 192,465      | 13,326   | 202,560      |
    | 7   | 130,884  | 2,378,889    | 130,918  | 2,524,157    | 130,921  | 2,657,024    |
    

When starting from the empty matching, all instances gave the same model statistics which are given in the following table.

{: columns="1 2" }

| N:  | states:    | transitions: |
|-----|------------|--------------|
| 4   | 1,284      | 28.04        |
| 5   | 14,230     | 97.16        |
| 6   | 170,922    | 416.5        |
| 7   | 2,222,794  | 2,220        |
| 8   | 31,209,096 | 14,388       |

* * *

### Stable Matchings

We first consider the number of different stable matchings of instances, which correspond to the number of deadlock states in each PRISM model. In the tables below we give these results for each the different instances and also the minimum, average and maximum number of stable matchings for the 1,000 randomly generated instances of each size.

-   Specific Instances:
    
    {: columns="1 1 1 1" }

    | N:  | Stable Matchings: |||
    | ^^  | *Symmetric*:      | *Uncoord*: | *Uniform*: |
    |-----|-------------------|------------|------------|
    | 4   | 1                 | 4          | 1          |
    | 5   | 1                 | 5          | 1          |
    | 6   | 1                 | 6          | 1          |
    | 7   | 1                 | 7          | 1          |
    | 8   | 1                 | 8          | 1          |
    
-   1,000 random samples:
    
    {: columns="1 1 1 1" }

    | N:  | Stable Matchings: |||
    | ^^  | Minimum:          | Average: | Maximum: |
    |-----|-------------------|----------|----------|
    | 4   | 1                 | 1.506    | 5        |
    | 5   | 1                 | 1.657    | 5        |
    | 6   | 1                 | 1.961    | 7        |
    | 7   | 1                 | 2.187    | 9        |
    

* * *

### Convergence

To study the convergence of the different instances we consider:

-   the probability of reaching a stable matching within r rounds when starting from the empty matching;
    
-   the expected number of rounds to reach a stable matching both when starting from a random complete matching and starting from an empty matching.
    

These properties can be expressed in PRISM as follows.

{% prismCode "casestudies/examples/stable_matching.pctl", false, true %}

Notice that to compute the average and maximum value of the expected rounds we use the filter command which is currently only available in a prototype version of PRISM (however it will be included in the next release of PRISM).

Concerning the probability of reaching a stable matching within r rounds, the following graphs plot these results for each of the specific instances.

-   **Symmetric*:*
    
    ![plot: probability of reaching a stable matching within r rounds (symmetric)](/images/graphs/stable.matching.bounded.symmetric.png)

-   **Uncoord*:*
    
    ![plot: probability of reaching a stable matching within r rounds (uncoordinated)](/images/graphs/stable.matching.bounded.uncoordinated.png)

-   **Uniform*:*
    
    ![plot: probability of reaching a stable matching within r rounds (uniform)](/images/graphs/stable.matching.bounded.uniform.png)

With regards to the expected time properties, the tables below give the expected number of rounds to reach a stable matching for each of the specific instances and also the minimum, average and maximum values over 1,000 random samples. We have also included plots showing how the values differ over the random samples for the expected number of rounds when starting from the empty initial matching.

-   Specific Instances:
    
    {: columns="1 2 2 2 1 1 1" }

    | N:  | expected rounds to reach a stable matching: |||||||||
    | ^^  | complete initial matching:                  |||||| empty initial matching: |||
    | ^^  | *Symmetric*:                                || *Uncoord*: || *Uniform*: || *Symmetric*:            | *Uncoord*: | *Uniform*: |
    | ^^  | av.:                                        | max:  | av.:       | max:   | av.:       | max:  | ^^                      | ^^         | ^^         |
    |-----|---------------------------------------------|-------|------------|--------|------------|-------|-------------------------|------------|------------|
    | 4   | 3.595                                       | 5.713 | 18.97      | 25.22  | 6.822      | 9.160 | 7.469                   | 28.04      | 11.31      |
    | 5   | 5.456                                       | 7.919 | 84.23      | 93.74  | 12.04      | 14.92 | 10.51                   | 97.16      | 17.66      |
    | 6   | 7.692                                       | 11.05 | 399.2      | 413.5  | 19.08      | 22.73 | 13.95                   | 416.5      | 25.82      |
    | 7   | 10.30                                       | 14.09 | 2,197      | 2,216  | 28.18      | 32.42 | 17.78                   | 2,220      | 36.03      |
    | 8   | 13.27                                       | 17.97 | 14,361     | 14,385 | 39.61      | 44.56 | 21.99                   | 14,388     | 48.56      |
    
-   Minimum of 1,000 random samples:
    
    {: columns="1 2 1" }

    | N:  | expected rounds to reach a stable matching: |||
    | ^^  | complete initial matching:                  || empty initial<br>matching: |
    | ^^  | av.:                                        | max:  | ^^                         |
    |-----|---------------------------------------------|-------|----------------------------|
    | 4   | 4.735                                       | 6.932 | 7.851                      |
    | 5   | 8.082                                       | 11.21 | 11.53                      |
    | 6   | 11.61                                       | 15.59 | 15.77                      |
    | 7   | 15.93                                       | 20.89 | 21.04                      |
    
-   Average of 1,000 random samples:
    
    {: columns="1 2 1" }

    | N:  | expected rounds to reach a stable matching: |||
    | ^^  | complete initial matching:                  || empty initial<br>matching: |
    | ^^  | av.:                                        | max:  | ^^                         |
    |-----|---------------------------------------------|-------|----------------------------|
    | 4   | 8.032                                       | 10.65 | 11.02                      |
    | 5   | 13.83                                       | 17.34 | 17.54                      |
    | 6   | 22.84                                       | 27.28 | 27.39                      |
    | 7   | 37.34                                       | 42.74 | 42.80                      |
    
-   Maximum of 1,000 random samples:
    
    {: columns="1 2 1" }

    | N:  | expected rounds to reach a stable matching: |||
    | ^^  | complete initial matching:                  || empty initial<br>matching: |
    | ^^  | av.:                                        | max:  | ^^                         |
    |-----|---------------------------------------------|-------|----------------------------|
    | 4   | 17.25                                       | 20.30 | 20.35                      |
    | 5   | 46.28                                       | 50.68 | 50.61                      |
    | 6   | 115.8                                       | 121.1 | 121.2                      |
    | 7   | 164.9                                       | 170.7 | 170.8                      |
    

-   Plots of the expected number rounds when starting from the empty initial matching for the 1,000 random samples.
    
    -   **k=4**
        
        ![plot: expected rounds to reach a stable matching from the empty initial maching (1,000 samples and k=4)](/images/graphs/stable.matching.sample4.png)

    -   **k=5**
        
        ![plot: expected rounds to reach a stable matching from the empty initial maching (1,000 samples and k=5)](/images/graphs/stable.matching.sample5.png)

    -   **k=6**
        
        ![plot: expected rounds to reach a stable matching from the empty initial maching (1,000 samples and k=6)](/images/graphs/stable.matching.sample6.png)

    -   **k=7**
        
        ![plot: expected rounds to reach a stable matching from the empty initial maching (1,000 samples and k=7)](/images/graphs/stable.matching.sample7.png)
