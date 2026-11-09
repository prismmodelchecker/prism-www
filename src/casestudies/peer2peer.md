---
layout: layouts/base.njk
title: "Simple peer-to-peer protocol"
section: casestudies
permalink: /casestudies/peer2peer/
---
# Simple peer-to-peer protocol

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Model Checking](#mc)

## Introduction { #intro }

This case study describes a simple peer-to-peer protocol based on [BitTorrent](http://en.wikipedia.org/wiki/BitTorrent). The model comprises a set of clients trying to download a file that has been partitioned into **K** blocks. Initially, there is one client that has already obtained all of the blocks and **N** additional clients with no blocks. Each client can download a block from any of the others but they can only attempt four concurrent downloads for each block.

Our model is represented as a CTMC. The PRISM source code for this case study (when **N=4** and **K=5**) is given below.

{% prismCode "casestudies/examples/peer2peer4_5.sm", false, true %}

## Model Statistics { #stats }

The table below gives information about the CTMC representing the model: the number of **states** and the number of **transitions**.

| N:  | K:  | Model:         ||
| ^^  | ^^  | States:        | Transitions:    |
|-----|-----|----------------|-----------------|
| 4   | 4   | 65,536         | 524,288         |
| ^^  | 5   | 1,048,576      | 10,485,760      |
| ^^  | 6   | 16,777,216     | 201,326,592     |
| ^^  | 7   | 268,435,456    | 3,758,096,384   |
| ^^  | 8   | 4,294,967,296  | 68,719,476,736  |

| 5   | 4   | 1,048,576      | 10,485,760      |
| ^^  | 5   | 33,554,432     | 419,430,400     |
| ^^  | 6   | 1,073,741,824  | 16,106,127,360  |
| ^^  | 7   | 34,359,738,368 | 601,295,421,440 |

  
## Model Construction Times { #times }

The table below gives the times taken to construct the models. This process involves first building a CTMC (represented as an MTBDD) from the system description (in our module based language), and then computing the reachable states using a BDD based fixpoint algorithm. The total time required and the number of fixpoint iterations are given below.

| N:  | K:  | Model:    ||
| ^^  | ^^  | Time (s): | Iter.s: |
|-----|-----|-----------|---------|
| 4   | 4   | 17        | 0.00    |
| ^^  | 5   | 21        | 0.01    |
| ^^  | 6   | 25        | 0.01    |
| ^^  | 7   | 29        | 0.02    |
| ^^  | 8   | 33        | 0.02    |

| 5   | 4   | 21        | 0.00    |
| ^^  | 5   | 26        | 0.01    |
| ^^  | 6   | 31        | 0.02    |
| ^^  | 7   | 36        | 0.03    |

  
## Model Checking { #mc }

We have model checked the following property:

-   "the probability that all clients have received all blocks by time T"

The corresponding CSL formula is given by:

{% prismCode "casestudies/examples/peer2peer.csl", false, true %}

In the graphs below we have plotted these probabilities from a range of values of `T`.

::: plots
![plot: graph for N=4 and K=4,5,...,8](/images/graphs/peer2peer4.gif "N=4 (full time range)")
![plot: graph for N=4 and K=4,5,...,8 (zoom)](/images/graphs/peer2peer4_zoom.gif "N=4 (zoom)")
![plot: graph for N=5 and K=4,5,...,7 ](/images/graphs/peer2peer5.gif "N=5 (full time range)")
![plot: graph for N=5 and K=4,5,...,7 (zoom)](/images/graphs/peer2peer5_zoom.gif "N=5 (zoom)")
:::

