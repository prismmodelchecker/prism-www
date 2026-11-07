---
layout: layouts/base.njk
title: "Randomised dining philosophers (Lynch, Saias & Segala)"
section: casestudies
permalink: /casestudies/phil_lss/
---
# Randomised dining philosophers (Lynch, Saias & Segala)

(Lynch, Saias and Segala)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Checking](#mc)

## Introduction { #intro }

This case study is based on Lehmann and Rabin's solution to the well known dining philosophers problem {% cite "LR81" %} and the analysis of this algorithm by Lynch, Saias and Segala {% cite "LSS94" %}. In particular, Lynch, Saias and Segala consider proving **time bounds** for this algorithm by making the following assumption:

-   *"A philosopher in its* trying region *cannot wait more than one time unit before it is given a chance to perform a step."*

Under this assumption, Lynch, Saias and Segala proved that the following property holds:

-   *"If some philosopher is in its* trying region, *then with probability at least 1/8, some philosopher enters its critical section within 13 time units."*

However, since we only model discrete time we cannot make the assumption given above. Instead we make the following assumption:

-   *"If a philosopher is in its* trying region *then at most **K** transitions can occur between it being scheduled."*

This is a stronger assumption than that of Lynch, Saias and Segala, and hence we consider a smaller class of adversaries or schedulers. As a result, we can prove stronger properties than that given above (dependent on the value of **K**).

The model is represented as an MDP. In the following, **N** denotes the number of philosophers and **K** is as above, i.e. the maximum number of transitions that can occur between a philosopher in its trying region being scheduled. By way of example, the PRISM source code for the case where **N=3** is given below.

{% prismCode "casestudies/examples/phil_lss3.nm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for the MDPs we have built for different values of the constants `N` and `K`. The tables include:

-   the number of **states** and **transitions** in the MDP representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

  

| N:  | K:  | Model:     || MTBDD:  || Construction: ||
| ^^  | ^^  | States:    | Transitions: | Nodes:  | Leaves: | Time (s):     | Iter.s: |
|-----|-----|------------|--------------|---------|---------|---------------|---------|
| 3   | 4   | 28,940     | 77,292       | 11,805  | 3       | 1.465         | 27      |
| ^^  | 5   | 47,204     | 135,636      | 15,235  | 3       | 1.630         | 27      |
| ^^  | 6   | 69,986     | 211,344      | 18,691  | 3       | 2.358         | 28      |
| ^^  | 7   | 97,298     | 304,152      | 21,063  | 3       | 2.757         | 29      |
| ^^  | 8   | 129,254    | 414,318      | 25,014  | 3       | 3.649         | 30      |
| ^^  | 9   | 165,746    | 541,908      | 27,072  | 3       | 3.534         | 31      |
| ^^  | 10  | 206,864    | 686,820      | 28,506  | 3       | 5.024         | 32      |
| 4   | 4   | 729,080    | 1,876,960    | 76,041  | 3       | 17.87         | 34      |
| ^^  | 5   | 1,692,144  | 5,035,016    | 121,758 | 3       | 32.17         | 42      |
| ^^  | 6   | 3,269,200  | 10,704,752   | 179,714 | 3       | 50.34         | 36      |
| ^^  | 7   | 5,609,336  | 19,662,904   | 242,666 | 3       | 75.78         | 37      |
| ^^  | 8   | 8,865,024  | 32,653,704   | 314,314 | 3       | 57.07         | 38      |
| ^^  | 9   | 13,192,376 | 50,438,968   | 374,738 | 3       | 98.06         | 39      |
| ^^  | 10  | 18,740,512 | 73,785,912   | 425,481 | 3       | 102.5         | 40      |

## Model Checking { #mc }

When model checking, we have the following requirements:

-   **Scheduler-Liveness:** for each time *t* and any philosopher *P*<sub><i>i</i></sub>, there exists a time *t*' > *t* in which *P*<sub><i>i</i></sub> makes a move.
-   **Bounded-Waiting:** if a philosopher is in its *trying region*, then at most **m** transitions can occur between it being scheduled.

These correspond to the conditions on the *adversary/scheduler* with the first being imposed by model checking against only *fair* adversaries.

The properties we have model checked are given below.

{% prismCode "casestudies/examples/phil_lss3.pctl", false, true %}

-   **Theorem 5 from {% cite "LR81" %} (Lockout Free)** the model checking statistics for this property are given below.
    
    <table class="prism-table">
    <colgroup span="2"></colgroup><colgroup span="4"></colgroup><colgroup span="2"></colgroup>
    <thead>
    <tr><th rowspan="3">N:</th><th rowspan="3">K:</th><th colspan="4">Precomputation:</th><th colspan="2" rowspan="2">Main Algorithm:</th></tr>
    <tr><th colspan="2">Prob0E:</th><th colspan="2">Prob1A:</th></tr>
    <tr><th>Time (s):</th><th>Iterations:</th><th>Time (s):</th><th>Iterations:</th><th>Time (s):</th><th>Iterations:</th></tr>
    </thead>
    <tbody>
    <tr><td rowspan="7">3</td><td>4</td><td>0.64</td><td>0.64</td><td>1</td><td>0.01</td><td>-</td><td>-</td></tr>
    <tr><td>5</td><td>0.85</td><td>0.85</td><td>1</td><td>0.02</td><td>-</td><td>-</td></tr>
    <tr><td>6</td><td>1.52</td><td>1.52</td><td>1</td><td>0.02</td><td>-</td><td>-</td></tr>
    <tr><td>7</td><td>1.96</td><td>1.96</td><td>1</td><td>0.02</td><td>-</td><td>-</td></tr>
    <tr><td>8</td><td>3.02</td><td>3.02</td><td>1</td><td>0.03</td><td>-</td><td>-</td></tr>
    <tr><td>9</td><td>3.27</td><td>3.27</td><td>1</td><td>0.03</td><td>-</td><td>-</td></tr>
    <tr><td>10</td><td>3.76</td><td>3.76</td><td>1</td><td>0.03</td><td>-</td><td>-</td></tr>
    <tr><td rowspan="7">4</td><td>4</td><td>6.33</td><td>23</td><td>1</td><td>0.09</td><td>-</td><td>-</td></tr>
    <tr><td>5</td><td>13.5</td><td>28</td><td>1</td><td>0.14</td><td>-</td><td>-</td></tr>
    <tr><td>6</td><td>26.4</td><td>31</td><td>1</td><td>0.20</td><td>-</td><td>-</td></tr>
    <tr><td>7</td><td>45.1</td><td>34</td><td>1</td><td>0.28</td><td>-</td><td>-</td></tr>
    <tr><td>8</td><td>70.7</td><td>37</td><td>1</td><td>0.35</td><td>-</td><td>-</td></tr>
    <tr><td>9</td><td>114</td><td>41</td><td>1</td><td>0.40</td><td>-</td><td>-</td></tr>
    <tr><td>10</td><td>160</td><td>45</td><td>1</td><td>0.58</td><td>-</td><td>-</td></tr>
    </tbody>
    </table>
    
      
    
    **Conclusion:** the property holds in all states
    
-   **Bounded waiting:** in the graphs below we have plotted these expected values as **L** varies for a range of values of **N** and **K**.
    
    ![plot: the minimum probability of some philosopher entering its critical section within L steps (N=3)](/images/graphs/phil.LSS.bounded3.png)

    ![plot: the minimum probability of some philosopher entering its critical section within L steps (N=4)](/images/graphs/phil.LSS.bounded4.png)
    
-   **Expected time:** in the graph below we have plotted these expected values for a range of values of **N** and **K**.
    
    ![plot: maximum expected number of steps until between a philosopher entering its trying region and some philosopher entering its critical section](/images/graphs/phil.LSS.expected.png)
