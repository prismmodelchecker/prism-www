---
layout: layouts/base.njk
title: "Real-Time Dynamic Voltage Scaling"
section: casestudies
permalink: /casestudies/voltage/
---
# Real-Time Dynamic Voltage Scaling

(Pillai and Shin)

## Contents

-   [Introduction](#intro)
-   [Schedulers](#schedulers)
-   [PRISM Models](#model)
-   [Results](#results)

**Related publications**: {% cite "KNP05c" %}

## Introduction: { #intro }

This case study concerns the performance of real-time embedded systems under dynamic voltage scaling schedulers. Dynamic voltage scaling is a technique used to address the trade-off between the battery life and the performance of battery powered processors.

In the classic model of real-time embedded systems we have a set of tasks **T1**,...**Tn** that need to be executed periodically. Each task **Ti** has an associated period (**Pi**) and worst case execution time (**Ci**). The task **Ti** is released every **Pi** time units and is required to complete its execution before some deadline which is typically defined as the end of its period, i.e. it must finish before its next release. A real time *scheduler* must guarantee that tasks will meet their deadline given that both the task set is schedulable and no task exceeds its worst case computation time.

## Schedulers: { #schedulers }

The real-time DVS schedulers we consider are taken from {% cite "PS01" %}, which are based on two of the standard real-time schedulers, namely *Rate Monotonic* (RM) and *Earliest-Deadline First* (EDF) schedulers.

-   **RM schedulers** are static and assign the task priority according to the period of the tasks - they always select the task with the shortest period that is ready to run.
-   **EDF schedulers** are dynamic and order tasks by their deadlines, giving highest priority to the released task with the most immediate deadline.

As in {% cite "PS01" %}, we assume that the task deadline equals the period, scheduling and preemption overheads are negligible and the tasks are independent.

### Static voltage scaling schedulers

The first schedulers that {% cite "PS01" %} consider simply extend RM and EDF by selecting the lowest possible operating frequency that will allow the scheduler to meet all the deadlines of the task set. The frequency is set statically and is only changed when the task set is changed.

When selecting the operating frequency, one must take into account that, if the frequency is scaled by a factor of α(∈(0,1\]), then the worst case execution time is scaled by a factor of 1/α, while the period and deadline remain unchanged. Extending the standard schedulability tests for RM and EDF schedulers in {% cite "PS01" %}, the following static voltage scaling algorithms were reached:

```
Static_RM:

rm_test(α):
    if (∀ Ti ∈ { T1, … ,Tn | P1≤ … ≤Pn }. ceil(Pi/P1) × C1 + … + ceil(Pi/Pi) × Ci ≤ α) return true
    else return false

select_frequency
    use lowest frequency fi such that RM_test(fi/f1) is true
```

  

```
Static_EDF:

edf_test(α):
    if (C1/P1+ … +Cn/Pn ≤ α) return true
    else return false

select_frequency
    use lowest frequency fi such that EDF_test(fi/f1) is true
```

  

### Cycle conserving schedulers

In general tasks are completed far sooner than their worst case execution time and the following algorithms of {% cite "PS01" %} aim to take advantage of this. In particular, when a task uses less than its worst case execution time, the scheduler can use this fact to reduce the operating frequency. Note that, when a task is released for execution we do not know how much computation time it will require, and therefore at this point the algorithms make the conservative assumption that the task will require its worst case execution time. However, when a task completes, one can calculate the number of cycles that were not required by the task, and hence at this time the algorithms recalculate the frequency taking into account these unused cycles (hence the term "cycle conserving").

Below, we give the cycle conserving extensions of the RM and EDF schedulers introduced in {% cite "PS01" %}.

```
Cycle_Conserving_RM:

assume fj is the frequency set by the static scaling algorithm

select_frequency:
    set sm to the maximum cycles until the next deadline
    use lowest frequency fi such that
    (d1+ … +dn) / sm ≤ fi/fm

upon task_release(Ti):
    set c_lefti to Ci
    set cm to the maximum cycles until the next deadline
    set sj to sm × fi/fm
    allocate_cycles(sm)
    select_frequency

upon task_completion(Ti):
    set c_lefti to 0
    set di to 0
    select_frequency

during_task_execution(Ti):
    decrement c_lefti and di

allocate_cycles(k):
    for i=1 to n, Ti ∈ { T1, … Tn | P1 ≤ … ≤ Pn }   // tasks sorted by period
        if c_lefti < k
            set di equal to c_lefti
            set k equal to k-c_lefti
        else
            set di equal to k
            set k equal to 0
```

  
  

```
Cycle_Conserving_EDF:

select_frequency:
    use lowest frequency fi such that
    (U1+ … +Un ≤ fi/f1)

upon task_release(Ti):
    set Ui to Ci/Pi
    select_frequency

upon task_completion(Ti):
    set Ui to ci/Pi where ci equals the actual cycles used in the invocation
    select_frequency
```

  
## PRISM Models: { #model }

For this case study, we consider a processor with three operating frequencies, 1, 0.75 and 0.5, with corresponding voltages 5,4 and 3. The task set is of size three with the following parameters:

{: columns="1 2" }

| task:  | **Pi** (period) | **Ci** (WCET) |
|--------|-----------------|---------------|
| **T1** | 8               | 3             |
| **T2** | 10              | 3             |
| **T3** | 14              | 1             |

To model the system in PRISM, we discretise time and, to simplify the modelling process, the division of one time unit is such that, for each of the possible frequencies, the number of discrete time steps required by a task to finish on its WCET is an integer. For example, if a task is run at the frequency 0.75 and the task takes WCET time units, it will require WCET\*4/3 time units to complete. Furthermore, we suppose that the completion time distribution of a task is uniformly distributed between 1 and its WCET.

By way of example, the PRISM models for the EDF schedulers are given below.

**Static EDF model**

{% prismCode "casestudies/examples/static_edf.nm", false, true %}

**Cycyle Conserving EDF model**

{% prismCode "casestudies/examples/cc_edf.nm", false, true %}

### Model Statistics

The table below shows statistics for each model we have built. The first section gives the number of **states** in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of **nodes** and the number of **leaves** (terminal nodes).

{: columns="1 3" }

| Scheduler:           | States: | Nodes:  | Leaves: |
|----------------------|---------|---------|---------|
| Static RM            | 2,761   | 10,984  | 17      |
| Static EDF           | 12,692  | 63,845  | 23      |
| Cycle Conserving RM  | 6,621   | 158,612 | 75      |
| Cycle Conserving EDF | 202,607 | 381,868 | 87      |

  

### Model Construction Times

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module-based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

| Scheduler:           | Construction: | Reachability: ||
| ^^                   | Time (s):     | Iter.s:       | Time per iter. (s): |
|----------------------|---------------|---------------|---------------------|
| Static RM            | 5.73          | 840           | 0.006               |
| Static EDF           | 27.2          | 840           | 0.027               |
| Cycle Conserving RM  | 794           | 1,000         | 0.67                |
| Cycle Conserving EDF | 327           | 840           | 0.25                |

## Results: { #results }

We analyse the different schedulers by comparing the (maximum) expected cost by time **T** as **T** varies. The cost function we consider is given by the square of the current voltage since this value is proportional to the energy consumption (see PRISM modules given above).

The graphs below plot the expected costs for the different schedulers as **T** varies. The results show a similar pattern to those reached through simulation in {% cite "PS01" %}: the EDF based approach can lead to greater power savings compared to the RM based algorithms.

![graph of expected cost (small time bound)](/images/graphs/voltage.small.gif)

![graph of expected cost (small large bound)](/images/graphs/voltage.large.gif)
