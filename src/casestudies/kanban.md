---
layout: layouts/base.njk
title: "Kanban manufacturing system"
section: casestudies
permalink: /casestudies/kanban/
---
# Kanban manufacturing system

(Ciardo & Tilgner)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Model Checking](#results)

## Introduction: { #intro }

This case study is based on the Kanban flexible manufacturing system of {% cite "CT96" %}. The model is represented as a CTMC. We use `t` to denote the number of tokens in the system. The PRISM source code for this case study given below.

{% prismCode "casestudies/examples/kanban.sm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for each model we have built. The first section gives information about the CTMC representing the model: the number of **states** and the number of **non zeros** (transitions). The second part refers to the MTBDD which represents this CTMC: the total number of **nodes**, the number of **leaves** (terminal nodes), and the amount of **memory** needed to store it. The last column gives the amount of memory a sparse matrix would need to represent the same CTMC.

| `t`**:** | Model:     || MTBDD: ||| Sparse:   |
| ^^       | States:    | NNZ:        | Nodes: | Leaves: | Kb:  | Kb:       |
|----------|------------|-------------|--------|---------|------|-----------|
| 1        | 160        | 616         | 499    | 14      | 9.75 | 7.8       |
| 2        | 4,600      | 28120       | 1,685  | 14      | 32.9 | 348       |
| 3        | 58,400     | 446,400     | 2,474  | 14      | 48.3 | 5,459     |
| 4        | 454,475    | 3,979,850   | 4,900  | 14      | 95.7 | 48,414    |
| 5        | 2,546,432  | 24,460,016  | 6,308  | 14      | 123  | 296,588   |
| 6        | 11,261,376 | 115,708,992 | 7,876  | 14      | 154  | 1,399,955 |
| 7        | 41,644,800 | 450,455,040 | 9,521  | 14      | 186  | 5,441,445 |

  
## Model Construction Times { #times }

The table below gives the times taken to construct the models. This process involves first building a CTMC (represented as an MTBDD) from the system description (in our module based language), and then computing the reachable states using a BDD based fixpoint algorithm. The total time required and the number of fixpoint iterations are given below.

| `t`**:** | Construction: ||
| ^^       | Time (s):     | Iter.s: |
|----------|---------------|---------|
| 1        | 0.01          | 15      |
| 2        | 0.07          | 29      |
| 3        | 0.25          | 43      |
| 4        | 1.28          | 57      |
| 5        | 3.88          | 71      |
| 6        | 6.21          | 85      |
| 7        | 10.7          | 99      |

  
## Model Checking { #results }

We now report on the model checking results obtained using PRISM when verifying the following CSL properties.

{% prismCode "casestudies/examples/kanban.csl", false, true %}

All experiments were carried out on a 2.80GHz PC with 1 Gb memory running Linux and in all iterative methods we stop iterating when the *relative error* between subsequent iteration vectors is less than 1e-6, that is:

![relative error equation](/images/cs/err.gif)

The table below gives the times taken to compute the steady state probabilities using both the JOR and Gauss-Seidel methods. The number of iterations required and the time taken using the MTBDD, sparse and hybrid engines is as follows.  

| N:  | Jacobi:     |||| Gauss Seidel: |||
| ^^  | Iterations: | Time per iteration: (s) ||| Iterations:   | Time per iteration: (s) ||
| ^^  | ^^          | MTBDD                   | Sparse   | Hybrid   | ^^            | Sparse                  | Hybrid   |
|-----|-------------|-------------------------|----------|----------|---------------|-------------------------|----------|
| 1   | 101         | 0.008564                | 0.000020 | 0.000020 | 200           | 0.000010                | 0.000010 |
| 2   | 166         | 0.574596                | 0.000199 | 0.000295 | 189           | 0.000291                | 0.000513 |
| 3   | 300         | 14.37466                | 0.003260 | 0.006523 | 206           | 0.004330                | 0.008534 |
| 4   | 466         | -                       | 0.029410 | 0.055227 | 323           | 0.037418                | 0.074399 |
| 5   | 663         | -                       | 0.179967 | 0.374664 | 461           | 0.222703                | 0.446436 |
| 6   | 891         | -                       | 0.898675 | 1.686580 | 622           | 1.075230                | 2.064293 |
| 7   | 1,148       | -                       | -        | 6.379109 | 802           | -                       | 7.844989 |

The graphs below present the results obtained for the different CSL properties.

-   **The expected number of tokens in each cell:**
    
    ![plots the expected number of tokens in each cell](/images/graphs/kanban.ss1.png)

-   **The expected throughput of the system:**
    
    ![plots the expected throughput of the system](/images/graphs/kanban.ss2.png)
