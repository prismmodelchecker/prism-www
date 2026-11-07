---
layout: layouts/base.njk
title: "Dynamic power management: 3-state Fujitsu disk drive"
section: casestudies
permalink: /casestudies/power_ctmc3/
---
# Dynamic power management: 3-state Fujitsu disk drive

(Qiu, Wu and Pedram)

## Contents

-   [Specification](#intro)
-   [Modelling the System in PRISM](#modelling)
-   [Optimal Stochastic Policies](#policies)
-   [Results](#results)

## Specification: { #intro }

This case study is based on a CTMC model of a 3 state Fujitsu disk drive taken from {% cite "QWP99" %}. As in {% cite "QWP99" %}, we suppose that request inter-arrival distribution has the same (mean) expected value and equals 0.72, and that the maximum size of the service request queue (SRQ) is 20.

In this model the Service Provider (SP) has three states which are shown below.

![3 state service provider](/images/cs/power_ctmc3.sp.gif)

The SP makes a transition from **idle** to **busy** whenever a request arrives for service. Similarly, it makes a transition from **busy** to **idle** whenever it finishes the service of a request. Transitions between **sleep** and **idle** are controlled by the PM. The only condition we impose on the PM is that, when the SRQ is full and the SP is in **sleep**, the PM switches the SP on, i.e. the SP moves to **idle**. The performance of the SP is given in the following tables where the data is taken from {% cite "QWP99" %}:

-   Average power consumption and service times of the SP
    
    {: columns="1 3" }

    |--------------------------|-----------|----------|----------|
    |                          | **sleep** | **idle** | **busy** |
    | **average power**        | 0.13      | 0.95     | 2.15     |
    | **average service time** | 0         | 0        | 0.008    |
    
-   Average energy consumption values for state transitions of the SP
    
    {: columns="1 3" }

    |-----------|-----------|----------|----------|
    |           | **sleep** | **idle** | **busy** |
    | **sleep** | 0         | 7        | -        |
    | **idle**  | 0.067     | 0        | 0        |
    | **busy**  | -         | 0        | 0        |
    
-   Average transition times for state transitions of the SP
    
    {: columns="1 3" }

    |-----------|-----------|----------|----------|
    |           | **sleep** | **idle** | **busy** |
    | **sleep** | 0         | 1.6      | -        |
    | **idle**  | 0.67      | 0        | 0        |
    | **busy**  | -         | 0        | 0        |
    

## Modelling the System in PRISM: { #modelling }

The module representing the SP is given below. Note that the actions corresponding to local changes of the SP synchronise with the PM, whereas the transitions corresponding to the service and arrival of requests synchronise with the SRQ.

{% prismCode "casestudies/examples/power_ctmc3_sp.sm", false, true %}

Since there is only one queue, the SRQ and the SR can be combined into the following module:

{% prismCode "casestudies/examples/power_ctmc3_sr.sm", false, true %}

## Optimal Stochastic Policies: { #policies }

Given a performance constraint (average number of requests awaiting service), we construct the optimal policy which minimises the average power consumption while satisfying the performance constraint. We obtained these policies by constructing the generator matrix of the system in PRISM and then, from this, constructing a linear optimization problem which we solve with Maple using its Simplex package.

Below, we list the policies obtained under a selection of different different performance constraints where, if no behaviour is specified, the choice of the policy is to do nothing (stay in the same state).

{: columns="1 1" }

| Constraint                                                    | Policy                                                                                                                                                                                                    |
|---------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **average number of requests<br>awaiting service &lt;=20**    | when the SRQ is empty and the SP is in **idle** go to **sleep**                                                                                                                                           |
| **average number of requests<br>awaiting service &lt;= 10**   | when the SRQ is full and the SP is in **sleep** go to **idle**when the SRQ is empty and the SP is in **idle**:    go to **sleep** with probability 0.869135    stay in **idle** with probability 0.130865 |
| **average number of requests<br>awaiting service &lt;= 5**    | when the SRQ is full and the SP is in **sleep** go to **idle**when the SRQ is empty and the SP is in **idle**:    go to **sleep** with probability 0.075140    stay in **idle** with probability 0.924860 |
| **average number of requests<br>awaiting service &lt;= 1**    | when the SRQ is full and the SP is in **sleep** go to **idle**when the SRQ is empty and the SP is in **idle**:    go to **sleep** with probability 0.008963    stay in **idle** with probability 0.991037 |
| **average number of requests<br>awaiting service &lt;= 0.25** | when the SRQ is full and the SP is in **sleep** go to **idle**when the SRQ is empty and the SP is in **idle**:    go to **sleep** with probability 0.002014    stay in **idle** with probability 0.997986 |
| **average number of requests<br>awaiting service &lt;= 0.1**  | when the SRQ is full and the SP is in **sleep** go to **idle**when the SRQ is empty and the SP is in **idle**:    go to **sleep** with probability 7.39e-04    stay in **idle** with probability 0.999261 |

It is then straightforward to define each policy in PRISM as a module. To illustrate this we give the module for the policy with performance constraint 1.

{% prismCode "casestudies/examples/power_ctmc3_pm1.sm", false, true %}

## Results: { #results }

Using the results presented in {% cite "KNP02d" %}, we have computed, for the optimal policies under different performance constraints and for a of selection distributions, with the same mean (0.72), modelling the inter-arrival time of requests:

-   The average power consumption (see [here](#av.power) for the results).
-   The average number of requests awaiting service (see [here](#av.queue) for the results).
-   The average number of lost requests (see [here](#av.lost) for the results).

Furthermore, restricting the inter-arrival time to be exponentially distributed, we have computed the following performance measures for the optimal policies under different constraints:

-   The expected power consumption by time **T** (see [here](#T.power) for the results).
-   The expected number of requests awaiting service at time **T** (see [here](#T.queue) for the results).
-   The expected number of lost requests by time **T** (see [here](#T.lost) for the results).
-   The probability, from the state where the SP is in **sleep** and there are no requests awaiting service, that at least **N** requests are awaiting service by time **T** (see [here](#queue10) for the the case when **N=10**, [here](#queue15) for **N=15** and [here](#queue20) when **N=20**).
-   From the state where the SRQ is empty and the SP is in **sleep**, the probability that a request gets lost by time **T** (see [here](#prob.lost) for the results).

<a name="av.power"></a>

![](/images/graphs/power_ctmc3.av.power.gif)

<a name="av.queue"></a>

![](/images/graphs/power_ctmc3.av.queue.gif)

<a name="av.lost"></a>

![](/images/graphs/power_ctmc3.av.lost.gif)

<a name="T.power"></a>

![](/images/graphs/power_ctmc3.T.power.gif)

<a name="T.queue"></a>

![](/images/graphs/power_ctmc3.T.queue.gif)

<a name="T.lost"></a>

![](/images/graphs/power_ctmc3.T.lost.gif)

<a name="queue10"></a>

![](/images/graphs/power_ctmc3.queue10.gif)

<a name="queue15"></a>

![](/images/graphs/power_ctmc3.queue15.gif)

<a name="queue20"></a>

![](/images/graphs/power_ctmc3.queue20.gif)

<a name="prob.lost"></a>

![](/images/graphs/power_ctmc3.prob.lost.gif)
