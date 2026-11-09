---
layout: layouts/base.njk
title: "Dynamic power management: 4-state Fujitsu disk drive"
section: casestudies
permalink: /casestudies/power_ctmc4/
parent: /casestudies/power/
---
# Dynamic power management: 4-state Fujitsu disk drive

(Qiu, Wu and Pedram)

## Contents

-   [Specification](#intro)
-   [Modelling the System in PRISM](#modelling)
-   [Optimal Stochastic Policies](#policies)
-   [Results](#results)

## Specification: { #intro }

This case study is based on a CTMC model of a 4 state Fujitsu disk drive taken from {% cite "QWP99" %}. As in {% cite "QWP99" %}, we suppose that request inter-arrival distribution has the same (mean) expected value and equals 0.72, and that the maximum size of the service request queue (SRQ) is 20.

In this model the Service Provider (SP) has four states which are shown below.

![4 state service provider](/images/cs/power_ctmc4.sp.svg)

The SP makes a transition from **idle** to **busy** whenever a request arrives for service. Similarly, it makes a transition from **busy** to **idle** whenever it finishes the service of a request. Transitions between **sleep**, **standby** and **idle** are controlled by the PM. The only condition we impose on the PM is that, when the SRQ is full and the SP is in **sleep** or **standby**, the PM switches the SP on, i.e. the SP moves to **idle**. The performance of the SP is given in the following tables where the data is taken from {% cite "QWP99" %}:

-   Average power consumption and service times of the SP
    
    |--------------------------|-----------|-------------|----------|----------|
    |                          | **sleep** | **standby** | **idle** | **busy** |
    | **average power**        | 0.13      | 0.35        | 0.95     | 2.15     |
    | **average service time** | 0         | 0           | 0        | 0.008    |
    
-   Average energy consumption values for state transitions of the SP
    
    |-------------|-----------|-------------|----------|----------|
    |             | **sleep** | **standby** | **idle** | **busy** |
    | **sleep**   | 0         | 5.1         | 7        | -        |
    | **standby** | 0.006     | 0           | 2        | -        |
    | **idle**    | 0.067     | 0.001       | 0        | 0        |
    | **busy**    | -         | -           | 0        | 0        |
    
-   Average transition times for state transitions of the SP
    
    |-------------|-----------|-------------|----------|----------|
    |             | **sleep** | **standby** | **idle** | **busy** |
    | **sleep**   | 0         | 0.6         | 1.6      | -        |
    | **standby** | 0.3       | 0           | 1.2      | -        |
    | **idle**    | 0.67      | 0.4         | 0        | 0        |
    | **busy**    | -         | -           | 0        | 0        |
    

## Modelling the System in PRISM: { #modelling }

The module representing the SP is given below. Note that the actions corresponding to local changes of the SP synchronise with the PM, whereas the transitions corresponding to the service and arrival of requests synchronise with the SRQ.

{% prismCode "casestudies/examples/power_ctmc4_sp.sm", false, true %}

Since there is only one queue, the SRQ and the SR can be combined into the following module:

{% prismCode "casestudies/examples/power_ctmc4_sr.sm", false, true %}

## Optimal Stochastic Policies: { #policies }

Given a performance constraint (average number of requests awaiting service), we construct the optimal policy which minimises the average power consumption while satisfying the performance constraint. We obtained these policies by constructing the generator matrix of the system in PRISM and then, from this, constructing a linear optimization problem which we solve with Maple using its Simplex package.

Below, we list the policies obtained under a selection of different different performance constraints where, if no behaviour is specified, the choice of the policy is to do nothing (stay in the same state).

{: columns="1 1" }

| Constraint                                                    | Policy                                                                                                                                                                                                                                                                  |
|---------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **average number of requests<br>awaiting service &lt;=20**    | go from **idle** to **standby** when the SRQ is empty<br>go from **standby** to **idle** when the SRQ is full                                                                                                                                                           |
| **average number of requests<br>awaiting service &lt;= 10**   | go from **idle** to **standby** when the SRQ is empty<br>go from **standby** to **idle** when the SRQ is full<br>when the SRQ is of size N-1 and in **standby**:<br>    move to **idle** with probability 0.120879<br>    stay in **standby** with probability 0.879121 |
| **average number of requests<br>awaiting service &lt;= 5**    | go from **idle** to **standby** when the SRQ is empty<br>go from **standby** to **idle** when the SRQ &gt;=10<br>when the SRQ is of size 9 and in **standby**:<br>    move to **idle** with probability 0.607453<br>    stay in **standby** with probability 0.392547   |
| **average number of requests<br>awaiting service &lt;= 1**    | go from **standby** to **idle** when the SRQ &gt;=8<br>when the SRQ is empty:<br>    move to **standby** with probability 0.043289<br>    stay in **idle** with probability 0.956711                                                                                    |
| **average number of requests<br>awaiting service &lt;= 0.25** | go from **standby** to **idle** when the SRQ &gt;=8<br>when the SRQ is empty:<br>    move to **standby** with probability 0.008837<br>    stay in **idle** with probability 0.991163                                                                                    |
| **average number of requests<br>awaiting service &lt;= 0.1**  | go from **standby** to **idle** when the SRQ &gt;=8<br>when the SRQ is empty:<br>    move to **standby** with probability 0.003187<br>    stay in **idle** with probability 0.996813                                                                                    |

  

It is then straightforward to define each policy in PRISM as a module. To illustrate this we give the module for the policy with performance constraint 1.

{% prismCode "casestudies/examples/power_ctmc4_pm1.sm", false, true %}

## Results: { #results }

We have computed, for the optimal policies under different performance constraints and for a selection of distributions (deterministic, exponential, Erlang, uniform and Pareto), a number of different long-run and transient performance measures including the average power consumption, average number of lost customers, expected queue size at time **T** (when requests arrive with an exponential distribution) and the probability of a request being lost by the time the **N**th request arrives.

Below, we give a number of illustrative examples. Full details of these results are available from [here](/casestudies/power_ctmc4_graphs/).

![](/images/graphs/power_ctmc4.av.power.gif)

![](/images/graphs/power_ctmc4.av.lost.gif)

![](/images/graphs/power_ctmc4.queue.gif)

![](/images/graphs/power_ctmc4.prob.lost5.gif)

![](/images/graphs/power_ctmc4.prob.lost2.gif)

![](/images/graphs/power_ctmc4.prob.lost1.gif)

![](/images/graphs/power_ctmc4.prob.lost01.gif)

![](/images/graphs/power_ctmc4.prob.lost005.gif)
