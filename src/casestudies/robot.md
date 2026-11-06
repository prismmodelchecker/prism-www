---
layout: layouts/base.njk
title: "Grid World Robot"
section: casestudies
permalink: /casestudies/robot/
---
# Grid World Robot

## Contents

-   [Introduction](#intro)
-   [Solution Method](#method)
-   [The PRISM Model](#model)
-   [Model Statistics](#stats)
-   [Experimental Results](#analysis)

## Introduction: { #intro }

This case study considers an **n**×**n** grid world with a robot moving from the bottom left corner to the top right corner, first along the bottom edge and then along the right edge. The time taken by the robot to move from one square to another is exponentially distributed. There is a janitor moving randomly around the grid (initially in the top right hand corner), and the robot cannot move into a square occupied by the janitor. The robot also randomly sends a signal to the base station.

![Grid world](/images/cs/robot.grid.gif)

## Solution Method: { #method }

Numerical analysis based on uniformisation and statistical techniques based on sampling and simulation are two distinct approaches for transient analysis of stochastic systems. In this case study we compare the two solution techniques when applied to the verification of time-bounded until formulae in the temporal stochastic logic CSL.

The verification of time-bounded CSL formulae can be reduced to transient analysis {% cite "BHHK00a" %}. Efficient numerical solution techniques, such as uniformisation {% cite "Jen53", "Gra77" %}, for transient analysis of CTMCs have been existed for decades and are well-understood. Younes and Simmons {% cite "YS02" %} have proposed a statistical approach for verifying time-bounded CSL formulae, based on acceptance sampling and discrete event simulation.

Although the algorithm of Younes and Simmons {% cite "YS02" %} can handle CSL formulae with nested probabilistic operators, the way in which it is done requires in the worst case that the nested formula be verified in each state along a sample path. The numerical approach, on the other hand, can verify the nested formula for all states simultaneously at the same (asymptotic) cost as verifying the formula for a single state. This is a clear advantage when dealing with nested probabilistic operators.

We therefore propose a mixed approach, where statistical sampling is used to verify the outermost probabilistic operator, while numerical techniques are used to verify the nested probabilistic operators. We can mix the numerical and statistical techniques by assuming that the result of the numerical technique holds with certainty. The nested formulae are first verified for all states using numerical methods. When verifying a path formula over a sample path we only need to read the value for each state along the path without any additional verification effort for the nested formulae. The cost for verifying the nested components of a formula is exactly the same for the mixed approach as for the numerical approach, but the use of sampling for the outermost probabilistic operator can provide a solution faster than a numerical computation.

Further details on the comparison between the different methods is available in {% cite "YKNP04", "YKNP06" %}.

## The PRISM Model { #model }

Our PRISM model of the system comprises 2 modules, one for the robot and one for the janitor. Below we give the PRISM language description for the system. Note that to change the size of the grid one need only set the value of the constant `n` appearing at the start of the description.

{% prismCode "casestudies/examples/robot.sm", false, true %}

## Model Statistics { #stats }

The tables below shows statistics and construction times of the models when the size of the grid (`n`) varies. The tables include:

-   the number of **states** and **transitions** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construct time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

Note that this construction is only required when using the numerical method, as when using the statistical approach, all that we need to store during verification is the current state.

| `n`: | Model:  || MTBDD: || Construction: ||
| ^^   | States: | Transitions: | Nodes: | Leaves: | Time (s):     | Iter.s: |
|------|---------|--------------|--------|---------|---------------|---------|
| 2    | 20      | 53           | 68     | 5       | 0.001         | 6       |
| 4    | 216     | 921          | 267    | 5       | 0.01          | 14      |
| 8    | 1904    | 9,377        | 627    | 5       | 0.08          | 30      |
| 16   | 15840   | 82,737       | 1,326  | 5       | 0.37          | 62      |
| 32   | 128960  | 691,793      | 2,749  | 5       | 1.75          | 126     |
| 64   | 1.0e+06 | 5.7e+06      | 5,716  | 5       | 8.37          | 254     |
| 128  | 8.3e+06 | 4.6e+07      | 11,963 | 5       | 39.18         | 510     |

## Experimental Results { #analysis }

The objective is for the robot to reach the goal square at top right corner within 100 time units with probability at least 0.9, while maintaining at least a 0.5 probability of periodically communicating with the base station. The CSL formula:

```prism
P>=0.9 [ (P>=0.5 [ true U<=7 communicate ]) U<=100 goal ]
```

expresses the given objective.

In the numerical method we set the truncation error to 1e-6 (stop iterating when the relative error between the iteration vectors is less than 1e-6). On the other hand, when using the statistical approach, the parameters α, β, and δ can be used to trade accuracy for efficiency (see {% cite "YS02" %} for details on these parameters). In the experiments we set α=β=1e-2 and vary δ.

We now report on the results when using the mixed and the numerical approaches. Note that in both methods the inner bounded until (`P`\>=`0.5` \[ `true` `U`<=`7` `communicate` \]) is verified using the numerical approach. The table and graph below compare the overall model checking times of the two approaches (the iterations and samples correspond to those used to verify the outer bounded until).

<table class="prism-table">
<colgroup></colgroup><colgroup span="2"></colgroup><colgroup span="6"></colgroup>
<thead>
<tr><th rowspan="3"><code>n</code>:</th><th rowspan="2" colspan="2">Numerial</th><th colspan="6">Statistical</th></tr>
<tr><th colspan="2">δ=0.0025</th><th colspan="2">δ=0.005</th><th colspan="2">δ=0.01</th></tr>
<tr><th>time (s):</th><th>iterations:</th><th>average time (s):</th><th>average no.<br>samples:</th><th>average time (s):</th><th>average no.<br>samples:</th><th>average time (s):</th><th>average no.<br>samples:</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>0.001</td><td>147</td><td>0.261</td><td>828</td><td>0.124</td><td>414</td><td>0.058</td><td>207</td></tr>
<tr><td>4</td><td>0.01</td><td>336</td><td>1.262</td><td>828</td><td>0.626</td><td>414</td><td>0.31</td><td>207</td></tr>
<tr><td>8</td><td>0.23</td><td>344</td><td>10.57</td><td>2186</td><td>5.543</td><td>1141.6</td><td>2.865</td><td>582.4</td></tr>
<tr><td>16</td><td>3.97</td><td>346</td><td>5.005</td><td>474.4</td><td>2.938</td><td>246.5</td><td>1.834</td><td>120.5</td></tr>
<tr><td>32</td><td>26.5</td><td>337</td><td>9.353</td><td>270.1</td><td>7.482</td><td>133.4</td><td>6.549</td><td>63.6</td></tr>
<tr><td>64</td><td>202.5</td><td>330</td><td>47.37</td><td>144.9</td><td>45.97</td><td>71.3</td><td>45.30</td><td>34.7</td></tr>
<tr><td>128</td><td>1677</td><td>326</td><td>355.4</td><td>92</td><td>354.5</td><td>46</td><td>354.2</td><td>23</td></tr>
</tbody>
</table>

  
![graph of results](/images/cs/robot.graph.gif)
