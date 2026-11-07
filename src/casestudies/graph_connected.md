---
layout: layouts/base.njk
title: "Random graphs"
section: casestudies
permalink: /casestudies/graph_connected/
---
# Random graphs

## Contents

-   [Introduction](#intro)
-   [The PRISM Model](#model)
-   [Model Checking](#results)

## Introduction { #intro }

In this case study we investigate the likelihood that a pair of nodes are connected in a random graph. More precisely, we consider the set of random graphs **G**(**n**,**p**), i.e. the set of random graphs with **n** nodes where the probability of there being an edge between any two nodes equals **p**. We examine whether a graph **G** is ''1-2 connected'', i.e. whether there exists a path from node 1 to node 2.

## The PRISM Model { #model }

To model this problem in PRISM we split the modelling into two stages. In the first stage, we (randomly) construct a graph from **G**(**n**,**p**). In the second stage, we find all nodes that can reach node 2, and hence find whether node 1 can reach node 2. More precisely, in the second stage, we find nodes that have a path to node 2 by searching for nodes for which one can reach (in one step) a node for which we have already found the existence of a path to node 2. Note that, because the above may hold for a set of nodes we make a non-deterministic choice as to which node we choose to consider first. Hence, the model is an MDP.

Below we give the PRISM code for in the case when **n** equals 4.

{% prismCode "casestudies/examples/graph4.nm", false, true %}

The table below shows statistics for models we have built for random graphs with different numbers of nodes (different values of **n**). Note that these statistics are identical for all values of **p**, expect for the special cases when **p** equals 0, 0.5 or 1. The tables include:

-   the number of **states** in the MDP representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

| n:  | Model:             | MTBDD: || Construction: ||
| ^^  | States:            | Nodes: | Leaves: | Time (s):     | Iter.s: |
|-----|--------------------|--------|---------|---------------|---------|
| 2   | 3                  | 18     | 4       | 0.063         | 2       |
| 3   | 15                 | 86     | 4       | 0.071         | 4       |
| 4   | 127                | 291    | 4       | 0.098         | 7       |
| 5   | 2,047              | 732    | 4       | 0.120         | 11      |
| 6   | 65,535             | 1,629  | 4       | 0.149         | 16      |
| 7   | 194,303            | 3,664  | 4       | 0.284         | 22      |
| 8   | 536,870,911        | 8,234  | 4       | 0.455         | 29      |
| 9   | 137,438,953,471    | 19,079 | 4       | 0.915         | 37      |
| 10  | 70,368,744,177,663 | 32,119 | 4       | 2.52          | 46      |

## Model Checking { #results }

To find the probability that the nodes 1 and 2 are connected we verify the property: `Pmax=?[true` `U` `x12`\].

The following graph plots, for the cases when **n**\=2,3,...,10, this probability as the value of **p** varies.

![plot: probability that the graph is 1-2 connected](/images/graphs/graph_connected.prob.png)

In addition, we have calculated the expected shortest path between 1 and 2. To treat the cases when the nodes 1 and 2 are not connected, we set the path length to be **c** when no path between 1 and 2 exists.

Each of the following graphs plot, for the cases when **n**\=2,3,...,10, the expected shortest path between 1 and 2 as the value of **p** varies. The difference between the graphs is the value we assign **c**, that is the cost associated with a graph when the nodes 1 and 2 are not connected.

![plot: minimum expected path between 1 and 2 (c=10)](/images/graphs/graph_connected.expected10.png)

![plot: minimum expected path between 1 and 2 (c=100)](/images/graphs/graph_connected.expected100.png)

![plot: minimum expected path between 1 and 2 (c=1000)](/images/graphs/graph_connected.expected1000.png)
