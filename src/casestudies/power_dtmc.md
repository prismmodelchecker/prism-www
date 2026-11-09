---
layout: layouts/base.njk
title: "Dynamic power management: IBM disk drive"
section: casestudies
permalink: /casestudies/power_dtmc/
parent: /casestudies/power/
---
# Dynamic power management: IBM disk drive

(Benini, Bogliolo, Paleologo and De Micheli)

## Contents

-   [Specification](#intro)
-   [Modelling the System in PRISM](#modelling)
-   [Optimal Stochastic Policies](#policies)
-   [Results](#results)

## Specification: { #intro }

This case study is based on a DTMC model of a IBM disk drive taken from {% cite "BBPM99" %}. As in {% cite "BBPM99" %} we suppose that the maximum size of the service request queue (SRQ) is 2.

The service provider (SP) has five different states which are shown below.

![power states of the service provider](/images/cs/power_dtmc.sp.svg)

It is only in state **active** that the SP can perform data reads and writes. In state **idle** the disk is spinning while some of the electronic components of the disk drive have been switched off. The state **idlelp** (idle low power) is similar except that it has a lower power dissipation. The states **stby** and **sleep** correspond to the disk being spun down. The specification of the SP is given in the following tables.

-   Power Dissipation for states of the SP (W)
    
    |------------|-----|
    | **active** | 2.5 |
    | **idle**   | 1.5 |
    | **idlelp** | 0.8 |
    | **stby**   | 0.3 |
    | **sleep**  | 0.1 |
    
-   Expected transition times for state transitions of the SP
    
    |------------|------------|----------|------------|----------|-----------|
    |            | **active** | **idle** | **idlelp** | **stby** | **sleep** |
    | **active** | -          | 1ms      | 5ms        | 2.2sec   | 6sec      |
    | **idle**   | 1ms        | -        | 5ms        | 2.2sec   | 6sec      |
    | **idlelp** | 5ms        | -        | -          | 2.2sec   | 6sec      |
    | **stby**   | 2.2sec     | -        | -          | -        | 6sec      |
    | **sleep**  | 6sec       | -        | -          | -        | -         |
    

## Modelling the System in PRISM: { #modelling }

To model the system, we have chosen a time resolution of 1ms based on the fastest possible transition performed by the SP.

To model the PM issuing instructions to the SP, we split each time step of the system into two parts: in the first, the PM (instantaneously) decides what the SP should do next (based on the current state); and in the second, the system makes a transition (with the SP's move based on the choice made by the PM). To achieve this we include the following module:

{% prismCode "casestudies/examples/power_dtmc_clock.pm", false, true %}

and construct the PM to synchronise with the CLOCK on `tick1` and the remaining components of the system to synchronise with the clock on `tick2`.

**Modelling the PM:** As mentioned above the PM synchronises with the clock on `tick1` and bases its choices on the current state of the system. Therefore the PM has the following form:

{% prismCode "casestudies/examples/power_dtmc_pm.pm", false, true %}

For example, if a state of the system satisfies `cond1`, then the PM decides that with probability `p01` the SP moves to **active**, with probability `p11` the SP moves to **idle**, with `p21` to **idlelp**, `p31` to **stby**, and `p41` to **sleep**.

**Modelling the SP:** Recall that the SP synchronises with the clock on `tick2` and the behaviour of the SP depends on the PM. Furthermore, since a time resolution of 1ms has been chosen, to correctly model transitions with delays longer than this time resolution, *transient* states are introduced. For example, the transient state **active\_idlelp** is used to model the non-unitary time transition from **active** to **idlelp**. Note that, we suppose that the power dissipation in these transient states is high (2.5W). The module representing the SP has the following form:

{% prismCode "casestudies/examples/power_dtmc_sp.pm", false, true %}

**Modelling the SR and SRQ:** As mentioned above, both the SRQ and the SR will synchronise with the clock on `tick2`. The SR has two states: **idle**, where no requests are generated; and **1req**, where one request is generated per time step (1ms). The transitions between these states are based on time-stamped traces of disk access measured on real machines. The module of the SR is given by:

{% prismCode "casestudies/examples/power_dtmc_sr.pm", false, true %}

In the case of the SRQ, to model the arrival and service of requests the transitions of the SRQ are dependent on the state of both the SR and the SP. Since, either the SR is in state **idle** and no requests arrive or in state **1req** and one request arrives, and the SP can only serve requests when it is in state **active**, the module of the SRQ is as given below:

{% prismCode "casestudies/examples/power_dtmc_srq.pm", false, true %}

**Reward Structures:** We include the following reward structures for the power consumption, queue size and number of lost requests.

{% prismCode "casestudies/examples/power_dtmc_rewards.pm", false, true %}

## Optimal Stochastic Policies: { #policies }

The policies we have calculated are the optimum policies for minimizing power consumption under different performance constraints, where these constraints concern the average number of requests awaiting service. In addition, we suppose that there is a time horizon of one million time steps. To model this horizon we include an additional module representing a battery which has an expected life span of 1 million time steps.

{% prismCode "casestudies/examples/power_dtmc_battery.pm", false, true %}

Note that, once the battery reaches state 0 it cannot perform the action `tick2` which prevents the rest of the system performing the action `tick2`, and hence prevents the rest of the system from moving (i.e. the states where `bat=0` act as sink states).

We obtained these policies by constructing the generator matrix of the system in PRISM and then, from this, constructing a linear optimization problem which we solve with Maple using its Simplex package.

## Results: { #results }

We have computed the following performance measures for the optimal policies under different constraints:

-   The average power consumption, average number of requests awaiting service and average number of lost requests (see [here](#power.vs.queue) and [here](#power.vs.lost) for graphs comparing power against performance).
-   The expected power consumption by time **T** (see [here](#T.power) for the results).
-   The expected number of requests awaiting service at time **T** (see [here](#T.queue) for the results).
-   The expected number of lost requests by time **T** (see [here](#T.lost) for the results).
-   The probability, starting from the initial state, that more than **N** requests are awaiting service by time **T** (see [here](#queue1) for the the case when **N=1** and [here](#queue2) for **N=2**).

The above properties can be represented in the PRISM specification language as follows.

{% prismCode "casestudies/examples/power_dtmc.pctl", false, true %}

The remaining properties below, reduce to calculating reachability probabilities after augmenting the model with a variable to record the property of interest.

-   The probability that a request is served by time **T**, given that it arrived into a certain position in the queue (see [here](#served1) for the case when the request arrives into the first position in the queue, and [here](#served2) for the request arrving into the second position in the queue).
-   From the initial state, the probability that **N** requests get lost by time **T** (see [here](#prob.lost500) for the results when **N=500** and [here](#prob.lost1000) in the case that **N=1,000**).

<a name="power.vs.queue"></a>

![](/images/graphs/power_dtmc.power.vs.queue.gif)

<a name="power.vs.lost"></a>

![](/images/graphs/power_dtmc.power.vs.lost.gif)

<a name="T.power"></a>

![](/images/graphs/power_dtmc.T.power.gif)

<a name="T.queue"></a>

![](/images/graphs/power_dtmc.T.queue.gif)

<a name="T.lost"></a>

![](/images/graphs/power_dtmc.T.lost.gif)

<a name="queue1"></a>

![](/images/graphs/power_dtmc.queue1.gif)

<a name="queue2"></a>

![](/images/graphs/power_dtmc.queue2.gif)

<a name="served1"></a>

![](/images/graphs/power_dtmc.served1.gif)

<a name="served2"></a>

![](/images/graphs/power_dtmc.served2.gif)

<a name="prob.lost500"></a>

![](/images/graphs/power_dtmc.prob.lost500.gif)

<a name="prob.lost1000"></a>

![](/images/graphs/power_dtmc.prob.lost1000.gif)
