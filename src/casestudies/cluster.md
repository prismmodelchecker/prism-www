---
layout: layouts/base.njk
title: "Workstation cluster"
section: casestudies
permalink: /casestudies/cluster/
---
# Workstation cluster

(Haverkort, Hermanns & Katoen)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Steady State Probability Computation](#steadystate)
-   [Model Checking](#mc)

## Introduction { #intro }

This case study is based on a cluster of workstations, taken from {% cite "HHK00" %}. The system comprises two sub-clusters with **N** workstations in each, connected in a star topology. The switches connecting each sub-cluster are joined by a central backbone. All components can break down and there is a single repair unit to service all components.

![Workstation cluster](/images/cs/cluster.png)

We define two levels of Quality of Service (QoS):

-   **minimum QoS:** at least 3N/4 workstations are operational and connected via switches and backbone;
-   **premium QoS:** at least N workstations are operational and connected via switches and backbone.

The model is represented as a CTMC. The PRISM source code is given below.

{% prismCode "casestudies/examples/cluster.sm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for each model we have built. The first section gives information about the CTMC representing the model: the number of **states** and the number of **non zeros** (transitions). The second part refers to the MTBDD which represents this CTMC: the total number of **nodes**, the number of **leaves** (terminal nodes), and the amount of **memory** needed to store it. The last column gives the amount of memory a sparse matrix would need to represent the same CTMC.

| N:  | Model:    || MTBDD: ||| Sparse: |
| ^^  | States:   | NNZ:      | Nodes: | Leaves: | Kb:   | Kb:     |
|-----|-----------|-----------|--------|---------|-------|---------|
| 2   | 276       | 1,120     | 331    | 9       | 6.46  | 16.4    |
| 4   | 820       | 3,616     | 535    | 11      | 10.5  | 51.9    |
| 8   | 2,772     | 12,832    | 968    | 15      | 18.9  | 183     |
| 16  | 10,132    | 48,160    | 1,899  | 23      | 37.1  | 683     |
| 32  | 38,676    | 186,400   | 3,906  | 39      | 76.3  | 2,637   |
| 64  | 151,060   | 733,216   | 8,225  | 71      | 160   | 10,362  |
| 128 | 597,012   | 2,908,192 | 17,481 | 134     | 341   | 41,076  |
| 256 | 2,373,652 | 1.15e+7   | 37,272 | 262     | 728   | 162,581 |
| 512 | 9,465,876 | 4.6e+7    | 79,399 | 518     | 1,550 | 649,990 |

## Model Construction Times { #times }

The table below gives the times taken to construct the models. This process involves first building a CTMC (represented as an MTBDD) from the system description (in our module based language), and then computing the reachable states using a BDD based fixpoint algorithm. The total time required and the number of fixpoint iterations are given below.

| N:  | Construction: ||
| ^^  | Time (s):     | Iter.s: |
|-----|---------------|---------|
| 2   | 0.14          | 9       |
| 4   | 0.15          | 13      |
| 8   | 0.20          | 21      |
| 16  | 0.05          | 37      |
| 32  | 0.12          | 69      |
| 64  | 1.65          | 133     |
| 128 | 6.20          | 261     |
| 256 | 23.43         | 517     |
| 512 | 100.96        | 1,029   |

## Steady-State Probability Computation { #steadystate }

The table below gives the times taken to compute the steady-state probabilities using the JOR method. The number of iterations required and the time taken using the MTBDD, sparse and hybrid engines is as follows.  

{: columns="1 4" }

| N:  | Time per iteration: (s) ||| Iterations: |
| ^^  | MTBDD                   | Sparse  | Hybrid  | ^^          |
|-----|-------------------------|---------|---------|-------------|
| 2   | 0.028                   | 0.00026 | 0.00027 | 39          |
| 4   | 0.052                   | 0.00031 | 0.00063 | 64          |
| 8   | 0.21                    | 0.00085 | 0.0022  | 82          |
| 16  | 0.78                    | 0.0035  | 0.0072  | 141         |
| 32  | 2.81                    | 0.014   | 0.025   | 260         |
| 64  | 9.38                    | 0.14    | 0.16    | 540         |
| 128 | 32.6                    | 0.39    | 0.49    | 1,276       |
| 256 | -                       | -       | 2.16    | 3,634       |
| 512 | -                       | -       | 8.99    | 30,476      |

The steady-state probabilities allows use to compute properties such as:

-   `S`\=? \[ `"premium"` \]: the long-run probability that premium QoS will be delivered.
-   `S`\=? \[ !`"minimum"` \]: the long-run probability that QoS is below minimum.

## Model Checking { #mc }

We have model checked the following properties:

-   "The system will always be able to offer premium QoS at some point in the future." The corresponding CSL formula is given by:
    
    ```prism
    P>=1 [ true U "premium" ]
    ```
    
    **Model checking times:**
    
    | N:  | Prob1 precomputation: ||
    | ^^  | Time (s):             | Iterations: |
    |-----|-----------------------|-------------|
    | 2   | 0.063                 | 18          |
    | 4   | 0.075                 | 26          |
    | 8   | 0.073                 | 42          |
    | 16  | 0.192                 | 74          |
    | 32  | 0.360                 | 138         |
    | 64  | 1.27                  | 266         |
    | 128 | 3.30                  | 522         |
    | 256 | 12.1                  | 1034        |
    | 512 | 44.3                  | 2058        |
    
      
    
    **Conclusion:** the property holds in all states
    
-   "The chance that the QoS drops below minimum quality within T time units." The corresponding CSL formula is given by
    
    ```prism
    P=? [ true U<=T !"minimum" ]
    ```
    
    In the graph below we have plotted these probabilities from a range of values of `T` and `N`.
    
    ![plot: the chance that the QoS drops below minimum quality within T time units](/images/graphs/cluster1.png)
    
-   "When facing insufficient QoS, the (maximum) probability of facing the same problem after T time units." The corresponding CSL formula is given by
    
    ```prism
    P=? [ true U[T,T] !"minimum" {!"minimum"}{max} ]
    ```
    
    In the graph below we have plotted these probabilities from a range of values of `T` and `N`.
    
    ![plot: when facing insufficient QoS, the (maximum) probability of facing the same problem after T time units](/images/graphs/cluster2.png)
    
-   "The probability of going from minimum QoS to premium QoS within T time units." The corresponding CSL formula is given by
    
    ```prism
    P=? [ true U<=T "premium" {"minimum"}{min} ]
    ```
    
    In the graph below we have plotted these probabilities from a range of values of `T` and `N`.
    
    ![plot: the probability of going from minimum QoS to premium QoS within T time units](/images/graphs/cluster3.png)
    
-   "The probability of going from minimum QoS to premium QoS within T time units without violating the minimum QoS constraint along the way." The corresponding CSL formula is given by
    
    ```prism
    P=? [ "minimum" U<=T "premium" {"minimum"}{min}]
    ```
    
    In the graph below we have plotted these probabilities from a range of values of `T` and `N`.
    
    ![plot: the probability of going from minimum QoS to premium QoS within T time units without violating the minimum QoS constraint along the way](/images/graphs/cluster4.png)
    
-   "The probability that it takes more than T time units to recover from insufficient QoS." The corresponding CSL formula is given by
    
    ```prism
    P=? [ !"minimum" U>=T "minimum" {!"minimum"}{max} ]
    ```
    
    In the graph below we have plotted these probabilities from a range of values of `T` and `N`.
    
    ![plot: the probability that it takes more than T time units to recover from insufficient QoS](/images/graphs/cluster5.png)
    
-   "The minimum percentage of operational workstations at time T when starting from below minimum QoS." The corresponding CSL formula is given by
    
    ```prism
    R{"percent_op"}=?[ I=T {!"minimum"}{min} ]
    ```
    
    In the graph below we have plotted these results from a range of values of `T` and `N`.
    
    ![plot: the minimum percentage of operational workstations at time T when starting from below minimum QoS](/images/graphs/cluster6.png)
    
-   "The expected time that the system is below minimum QoS until time T." The corresponding CSL formula is given by
    
    ```prism
    R{"time_not_min"}=?[ C<=T ]
    ```
    
    In the graph below we have plotted these results from a range of values of `T` and `N`.
    
    ![plot: the expected time that the system is below minimum QoS until time T (small time scale)](/images/graphs/cluster7_1.png)

    ![plot: the expected time that the system is below minimum QoS until time T (large time scale)](/images/graphs/cluster7_2.png)
    
-   "The expected number of repairs by time T." The corresponding CSL formula is given by
    
    ```prism
    R{"num_repairs"}=?[ C<=T ]
    ```
    
    In the graph below we have plotted these results from a range of values of `T` and `N`.
    
    ![plot: the expected number of repairs by time T](/images/graphs/cluster8.png)
