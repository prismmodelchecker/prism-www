---
layout: layouts/base.njk
title: "Mutual Exclusion"
section: casestudies
permalink: /casestudies/mutual/
---
# Randomised Mutual Exclusion

(Pnueli & Zuck)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Model Checking](#mc)

## Introduction { #intro }

This case study is based on Pnueli and Zuck's {% cite "PZ86" %} probabilistic symmetric solution to the *n*\-process mutual exclusion problem. The model is represented as an MDP. We let **N** denotes the number of processes. By way of example, the PRISM source code for the case where **N = 3** is given below.

{% prismCode "casestudies/examples/mutual3.nm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for each model we have built. The first section gives the number of **states** in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of **nodes** and the number of **leaves** (terminal nodes).

| N:  | Model:              | MTBDD: ||
| ^^  | States:             | Nodes: | Leaves: |
|-----|---------------------|--------|---------|
| 3   | 2,368               | 1,802  | 3       |
| 4   | 27,600              | 4,100  | 3       |
| 5   | 308,800             | 7,149  | 3       |
| 8   | 3.9x10<sup>8</sup>  | 20,736 | 3       |
| 10  | 4.4x10<sup>10</sup> | 33,494 | 3       |

  
## Model Construction Times { #times }

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

| N:  | Construction: | Reachability: ||
| ^^  | Time (s):     | Time (s):     | Iter.s: |
|-----|---------------|---------------|---------|
| 3   | 0.58          | 0.13          | 22      |
| 4   | 0.67          | 0.48          | 28      |
| 5   | 0.72          | 1.23          | 34      |
| 8   | 1.09          | 9.02          | 52      |
| 10  | 1.44          | 19.5          | 64      |

  
## Model Checking { #mc }

When model checking, we have the following requirement:

-   **Scheduler-Liveness:** for each time *t* and any process *P*<sub><i>i</i></sub> not in its *remainder phase* at time *t*, there exists a time *t*' > *t* in which *P*<sub><i>i</i></sub> makes a move.

This corresponds to the conditions on the *adversary/scheduler* which we impose by model checking against only *fair* adversaries.

We have model checked the following properties:

{% prismCode "casestudies/examples/mutual3.pctl", false, true %}

-   **Theorem 1 from {% cite "PZ86" %} (Mutual Exclusion):** the model checking statistics for this property are given below.
    
    {: columns="1 1" }

    | N:  | Time (s): |
    |-----|-----------|
    | 3   | 0.03      |
    | 4   | 0.04      |
    | 5   | 0.05      |
    | 8   | 0.08      |
    | 10  | 0.11      |
    
      
    
    **Conclusion:** the property holds in all states
    
-   **Theorem 2 from {% cite "PZ86" %} (Liveness):** the model checking statistics for this property are given below.
    
    | N:  | Precomputation: || Main Algorithm: ||
    | ^^  | Time (s):       | Iterations: | Time (s):       | Iterations: |
    |-----|-----------------|-------------|-----------------|-------------|
    | 3   | 0.26            | 27          | 0               | 0           |
    | 4   | 1.32            | 36          | 0               | 0           |
    | 5   | 4.63            | 45          | 0               | 0           |
    | 8   | 47.3            | 72          | 0               | 0           |
    | 10  | 127             | 90          | 0               | 0           |
    
      
    
    **Conclusion:** the property holds in all states.
    
-   **Lemma C from {% cite "PZ86" %}:** the model checking statistics for this property are given below.
    
    | N:  | Precomputation: || Main Algorithm: ||
    | ^^  | Time (s):       | Iterations: | Time (s):       | Iterations: |
    |-----|-----------------|-------------|-----------------|-------------|
    | 3   | 0.11            | 10          | 0               | 0           |
    | 4   | 0.52            | 12          | 0               | 0           |
    | 5   | 1.30            | 14          | 0               | 0           |
    | 8   | 3.87            | 20          | 0               | 0           |
    | 10  | 6.08            | 24          | 0               | 0           |
    
      
    
    **Conclusion:** the property holds in all states.
    
-   **Lemma D from {% cite "PZ86" %}:** the model checking statistics for this property are given below.
    
    | N:  | Precomputation: || Main Algorithm: ||
    | ^^  | Time (s):       | Iterations: | Time (s):       | Iterations: |
    |-----|-----------------|-------------|-----------------|-------------|
    | 3   | 0.23            | 22          | 0               | 0           |
    | 4   | 1.13            | 29          | 0               | 0           |
    | 5   | 3.35            | 37          | 0               | 0           |
    | 8   | 28.5            | 61          | 0               | 0           |
    | 10  | 76.3            | 77          | 0               | 0           |
    
      
    
    **Conclusion:** the property holds in all states.
