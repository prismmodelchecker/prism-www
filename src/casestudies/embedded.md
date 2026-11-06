---
layout: layouts/base.njk
title: "Embedded Control System"
section: casestudies
permalink: /casestudies/embedded/
---
# Embedded Control System

(Muppala, Ciardo & Trivedi)

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [Experimental Results](#analysis)

**Related publications:** {% cite "KNP04c", "KNP07b" %}

## Introduction { #intro }

This case study illustrates the applicability of probabilistic model checking and the PRISM tool to the process of dependability analysis. We model an embedded control system, closely based on the one presented in {% cite "MCT94" %}, the structure of which is shown below.

![Embedded control system](/images/cs/embedded.system.gif)

The system comprises an input processor (**I**) which reads and processes data from three sensors (**S1**, **S2**, **S3**). It is then polled by a main processor (**M**) which, in turn, passes instructions to an output processor (**O**). This process occurs cyclically, with the length of the cycle controlled by a timer in the main processor. The output processor takes the instructions it receives and uses them to control two actuators (**A1**, **A2**). Finally, a bus connects the three processors together. A concrete example of such a system might be a gas boiler, where the sensors are thermostats and the actuators are valves.

Any of the three sensors can fail, but they are used in *triple modular redundancy*: the input processor can determine sufficient information to proceed provided two of the three are functional. If more than one becomes unavailable, the processor reports this fact to the main processor and the system is shut down. In similar fashion, it is sufficient for only one of the two actuators to be working, but if this is not the case, the output processor tells the main processor to shut the system down. The **I**/**O** processors themselves can also fail. This can be either a permanent fault or a transient fault. In the latter case, the situation can be rectified automatically by the processor rebooting itself. In either case, if the **I** or **O** processor is unavailable and this leads to **M** being unable either to read data from **I** or send instructions to **O**, then **M** is forced to skip the current cycle. If **M** detects that the number of consecutive cycles skipped exceeds a limit, **MAX\_COUNT**, then it assumes that either **I** or **O** has failed and shuts the system down. Unless specified otherwise, we assume a value of 2 for **MAX\_COUNT**. Lastly, the main processor can also fail, in which case the system is automatically shut down.

The mean times to failure for a sensor, actuator and processor are 1 month, 2 months and 1 year, respectively. A transient fault occurs in a processor once a day on average. The mean times for a timer cycle to expire and for a processor reboot to complete are 1 minute and 30 seconds, respectively. We assume that all these delays are distributed exponentially; hence the system can be modelled as a continuous-time Markov chain (CTMC).

## The Model { #model }

Our PRISM model of the system comprises 6 modules, one for the sensors, one for the actuators, one for each processor and one for the connecting bus. Below we give the PRISM language description.

{% prismCode "casestudies/examples/embedded.sm", false, true %}

The module for the sensors, includes an integer variable `s` representing the number of sensors currently working. The module's behaviour is described by one guarded command which represents the failure of a single sensor. Its guard "`s>0`" states this can occur at any time, except when all sensors have already failed. The action `s'=s-1` simply decrements the counter of functioning sensors. The rate of this action is `s*r`, where `r` is the rate for a single sensor and `s` is the PRISM variable referred to previously which denotes the number of active sensors.

The module for the input has a single variable `i` with range \[0..2\] which indicates which of the three possible states the processor is in, i.e. whether it is working, is recovering from a transient fault, or has failed. The three guarded commands in the module correspond, respectively, to the processor failing, suffering a transient fault, and rebooting. The commands themselves are fairly self explanatory. Two points of note are as follows. Firstly, the guards of these commands can refer to variables from other modules, as evidenced by the use of `s`\>=`2`. This is because the input processor ceases to function once it has detected that less than two sensors are operational. Secondly, the last command contains an additional label `input_reboot`, placed between the square brackets at the start of the command. This is used for synchronising actions between modules, i.e. allowing two or more modules to make transitions simultaneously. Here, this is used to notify the main processor of the reboot as soon as it occurs.

**Model Statistics**

The tables below shows statistics and construction times of the models when the value of `MAX_COUNT` varies. The tables include:

-   the number of **states** in the CTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construct time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

{: columns="1 5" }

| MAX_COUNT | States | Nodes | Leaves | Construction ||
| ^^        | ^^     | ^^    | ^^     | Time (s)     | Iter.s |
|-----------|--------|-------|--------|--------------|--------|
| 2         | 2633   | 1194  | 9      | 0.065        | 14     |
| 3         | 3478   | 1144  | 9      | 0.066        | 15     |
| 4         | 4323   | 1558  | 9      | 0.082        | 16     |
| 5         | 5168   | 1448  | 9      | 0.073        | 17     |
| 6         | 6013   | 1586  | 9      | 0.083        | 18     |
| 7         | 6858   | 1405  | 9      | 0.076        | 19     |
| 8         | 7703   | 1950  | 9      | 0.082        | 20     |

## Experimental Results { #analysis }

We have used PRISM to analyse a number of dependability properties using probabilistic model checking. The full list of properties is available [here](#properties). First, we consider the probability of the system shutting itself down. Note that there are four distinct types of failure which can cause a shutdown: faults in

1.  the sensors
2.  the actuators
3.  the input/output processors
4.  the main processor.

We can analyse how likely each of these is to be the cause of the shutdown, as time passes. We use the CSL property:

-   `P`\=? \[ !`"down"` `U`<=`T` `"fail_j"` \]

where **j**\=1...4, refers to one of the four failures above and `"down"` denotes that any of the failures has occurred, i.e. `"down"="fail_1" | "fail_2" | "fail_3" | "fail_4"`. The atomic propositions which make up the property would in practice be predicates over the variables from the PRISM language description. More precisely:

1.  `"fail_1"`, the failure of more than one sensor, is written "`s`<`2` & `i=2`", meaning that the number of working sensors has dropped below 2 and the input processor is functioning (and so can report the failure).
2.  `"fail_2"`, the failure of more than one actuator, is written "`a`<`1` & `o=2`", meaning that the number of working actuators has dropped below 1 and the output processor is functioning (and so can report the failure).
3.  `"fail_3"`, the failure of the input out processors, is written "`COUNT=MAX_COUNT+1`", meaning that the number of consecutive cycles skipped exceeds a limit `MAX_COUNT`.
4.  `"fail_4"`, the failure of the main processor, is written "`m=0`", meaning that the main processor has failed.

The above property denotes the probability that failure **j** is the first to occur. Note that, for example, if an actuator fails, the sensors, unaware of this, will continue to operate and may subsequently fail. Hence, we need to determine the likelihood of each failure occurring, before any of the others do. In the figures below, we plot the results of this computation over two ranges of values for `T`: the first 24 hours and the first month of operation. We can see, for example, that while initially the I/O processors are more likely to cause a system shutdown, in the long run it is the sensors which are most unreliable.

![plots failure by time T (hours)](/images/graphs/embedded.T.hours.png)

![plots failure by time T (days)](/images/graphs/embedded.T.days.png)

By omitting the bound <=`T` from the above CSL formula:

-   `P`\=? \[ !`"down"` `U` `"fail_j"` \]

we can ask the model checker to compute the long-run failure probability of each failure type. The results are:

{: columns="1 1" }

| Failure type   | Probability |
|----------------|-------------|
| Sensors        | 0.6214      |
| Actuators      | 0.0877      |
| I/O processors | 0.2425      |
| Main processor | 0.0484      |

Note that the above probabilities sum to one, i.e. the system will eventually shut down with probability 1.

Second, we consider a number of cost-based properties. We classify the states of our model into three types: "up", where everything is functioning, "down", where the system has shut down, and "danger", where a (possibly transient) failure has occurred but has yet to cause a shutdown (e.g. if the **I** or **O** processor has failed but the **M** processor has yet to detect this). We can reason about the time spent in each class by assigning a cost of 1 to those states, 0 to all others (as shown in the reward structures "`down`", "`danger`" and "`up`" defined in the prism description above), and then computing the total cumulated reward. We use the properties:

-   `R{"reward_structure`"}=? \[ `C`<=`T` \]
-   `R{"reward_structure`"}=? \[ `F` `"down"` \]

These give us the expected time spent in each class, up until time `T` and before the system shuts down, respectively.

We plot the results for the first value in the figures below, again for two ranges of `T`: the first day and the first month of operation.

![plots expected times until time T (hours)](/images/graphs/embedded.expected.hours.png)

![plots expected times until time T (days)](/images/graphs/embedded.expected.days.png)

In the table below, we give the results of the second property, as we vary `MAX_COUNT`, the number of skipped cycles which the main processor waits before deciding that the input/output processors have failed. We see that increasing the value of `MAX_COUNT` increases the expected time until failure, but also has an adverse effect on the expected time spent in "danger" states.

| MAX_COUNT: | Expected time: ||
| ^^         | danger (hrs):  | up (days): |
|------------|----------------|------------|
| 1          | 0.236          | 14.323     |
| 2          | 0.293          | 17.660     |
| 3          | 0.318          | 19.100     |
| 4          | 0.327          | 19.628     |
| 5          | 0.330          | 19.809     |
| 6          | 0.331          | 19.871     |
| 7          | 0.332          | 19.891     |

Finally, to illustrate a different type of cost structure, we compute the expected number of processor reboots which occur over time. This is done by assigning a cost of 1 to all transitions which constitute a reboot and 0 to all others. The results are plotted below.

![plots reboots by time T (hours)](/images/graphs/embedded.reboots.hours.png)

![plots reboots by time T (days)](/images/graphs/embedded.reboots.days.png)

<a name="properties"></a>

{% prismCode "casestudies/examples/embedded.csl", false, true %}
