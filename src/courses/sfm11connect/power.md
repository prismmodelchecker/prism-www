---
layout: layouts/base.njk
title: "SFM-11:CONNECT Summer-School - PRISM session - Part B"
section: doc
permalink: /courses/sfm11connect/power/
---
# [SFM-11:CONNECT](http://www.sti.uniurb.it/events/sfm11connect/) Summer-School

## Lab session: Modelling and Compositional Verification of Probabilistic Component-Based Systems using PRISM

## Part B: Dynamic Power Management

## 1\. Background

This example concerns *dynamic power management (DPM)* schemes, which are sets of instructions used to switch between different power states of computing devices. This example is actually based on a specific case study from the literature - an IBM TravelStar VP disk drive with 5 power states {% cite "BBPM99" %}. However, in the following, we describe the DPM system in a fairly generic way.

The DPM system comprises several components:

-   the *Service Requester (SR)* which makes requests for a particular service (read/write requests to the disk in this case),
-   the *Service Queue (SQ)*, into which requests are placed;
-   the *Service Provider (SP)*, which responds to these requests (the disk drive itself here);
-   and the *Power Manager (PM)*.

The Service Provider (disk drive) has several different power states. The idea is that these states have different power consumptions but also different response times when a service is to be performed. Switches between power states are either performed by the Service Provider itself or initiated by the Power Manager. A good strategy for switching between these states will be one that keeps energy consumption as low as possible whilst maintaining an acceptable level of service.

## 2\. The first two components

Our initial PRISM model is the following:

{% prismCode "courses/sfm11connect/examples/power/power.pm", false, true %}

This model is a a discrete-time Markov chain (DTMC), like in the previous example. Later, we will adapt the model, making it a Markov decision process (MDP). Initially, we focus on just two components of the system: the Service Requester (SR) and the Service Queue (SQ). We will add the other components in due course. We also add a dummy Service Provider (SP) component for convenience.

The Service Requester has 2 states, *idle* and *1req*, represented using a variable `sr`. When in state *1req*, the SR sends one request per time step (1 ms). The probabilities of switching between these two states at each step, as shown in the model, were determined based on time-stamped traces of disk accesses measured on real machines.

The Service Queue comprises a single variable `q`, representing the number of requests waiting to be processed. At each step, a request is added to the queue if supplied by the SR (unless the queue is full, in which case the request is lost). Requests will be removed from the queue and processed by the Service Provider, assuming it is active (denoted by `sp=0`). For now, we assume that this is never the case.

{% task %} Take a look at model and make sure you understand how it works. The `tick` actions, included in square brackets at the start of each command, indicate that the modules move simultaneously, using [synchronisation](/manual/ThePRISMLanguage/Synchronisation). Notice also that modules are allowed to read (but not modify) the variables of other modules.

{% task %} Download the model above, load it into PRISM and execute some paths through the model using the simulator. You will see that there is also a label "`queue_full`" in the model, indicating when the request queue becomes full.

{% task %} Now move to the Properties tab in the PRISM GUI. Create a new integer constant, named `T` and then add the following property:

```prism
P=? [ F<=T "queue_full" ]
```

What does this mean? (See [here](/manual/PropertySpecification/ThePOperator) if you want to see more details about the `P` operator.) Plot the value of this property for values of `T` between 0 and 250 (in steps of 10).

{% task %} You will notice that the model also includes a reward structure that can be used to measure time. Use PRISM to compute the expected time until the queue becomes full. (You will need to use a property of the form `R{"time`"}=? \[ ... \] rather than `R`\=? \[ ... \] since the model has more than one reward structure.

{% task %} Lastly, try plotting the "expected queue size at time `T`" for values of `T` between 0 and 250 using the property:

```prism
R{"queue"}=? [ I=T ]
```

## 3\. The disk-drive component

Next, we add the Service Provider (SP) component, representing the disk drive. This has 5 different power modes. These, and the possible transitions between them, are shown in the figure below.

![SP states](/courses/sfm11connect/images/power_dtmc.sp.gif)

The SP will move between power states when it is instructed to do so by the power manager. Transitions between power states are not immediate, however, so our model includes additional "transient states" which, like in the Service Requester above, model a random delay.

The PRISM code below shows the module added to model the the SP component. The comments show the possible value of its `sp` variable: the main power states are represented by values 0, 1, 3, 6 and 9; the other values are for transient states. The transitions between power states of the SP will be controller by the Power Manager (PM) (more precisely, its variable `pm`). These transitions can be seen in the second part of the SP module. For now, we add a dummy PM module, which fixes `pm=0`.

{% prismCode "courses/sfm11connect/examples/power/sp-component.pm", false, true %}

{% task %} Remove the dummy SP module from your current model and paste in the code from above. Now, re-plot the property from above ("expected queue size at time `T`") on the same graph that you produced earlier. What effect does the new component have and why? Use the simulator to generate some random traces if that helps.

## 4\. The Power Manager component

Finally, we add the Power Manager (PM) component to the model. We will start with a very simple PM and then adapt it. In order to allow the PM to issue instructions to the SP, we will change the model so that it alternately makes two kinds of transitions: the first is a choice by the PM (action `choose`), the second is the `tick` action, used in the model so far. To enforce alternation of these types of actions, we add a special scheduler module (`sched`).

{% task %} Remove the dummy PM module from your model and paste in the code below. This simple Power Manager waits until the queue is full before switching on the Service Provider. *On a new graph*, plot the expected queue size over time (a direct comparison with the models/graphs from above is not appropriate because we have doubled the number of steps in the model by adding `choose`).

{% prismCode "courses/sfm11connect/examples/power/pm-component.pm", false, true %}

Now let's consider a few additional properties. In particular, we would like to examine the trade-off between the level of service provided by the system and the energy usage required to achieve it.

{% task %} The expected queue size is just one indicator of the level of service provided. Adapt the reward structure used earlier to count clock ticks so that it instead tracks the number of requests that get lost due to the queue being full. Give it the name "`lost`" and then use following property to compute the expected number of request lost as time passes. (See [here](/manual/ThePRISMLanguage/CostsAndRewards) for more details about reward structures.)

```prism
R{"lost"}=? [ C<=T ]
```

{% task %} Using a similar property, then compute the expected energy usage over the same period. Based on the real power usage figures for the disk drive in this case study, the following reward structure can be used to compute energy usage.

```prism
rewards "energy"
	[tick] sp=0  : 2.5;
	[tick] sp=1  : 1.5;
	[tick] sp=2  : 2.5;
	[tick] sp=3  : 0.8;
	[tick] sp=4  : 2.5;
	[tick] sp=5  : 2.5;
	[tick] sp=6  : 0.3;
	[tick] sp=7  : 2.5;
	[tick] sp=8  : 2.5;
	[tick] sp=9  : 0.1;
	[tick] sp=10 : 2.5;
endrewards
```

{% task %} Now, modify the PM component. Consider a randomised power management scheme which, when the queue is anywhere between empty and full, randomly chooses whether to move to *active* or *idle*. Add a [constant](/manual/ThePRISMLanguage/Constants) `p` to the model which represents the probability of choosing *active*. Then, investigate how the value of `p` affects both performance and energy usage.

{% task %} Can you design a better PM component that offers an improved compromise between performance and energy usage?

## 5\. Best- and worst-case Power Manager components

Finally, we will also use PRISM's functionality for model checking Markov decision processes (MDPs). This will allow us to explore the best and worst possible PM components that can be devised.

{% task %} First, change the model type at the top of the PRISM file from `dtmc` to `mdp`. Then, replace the `choose`\-labelled commands in the PM module with a *nondeterministic* choice between several different commands:

```prism
	[choose] true -> (pm'=0);
	[choose] q<QMAX -> (pm'=1);
	[choose] q<QMAX -> (pm'=2);
	[choose] q<QMAX -> (pm'=3);
	[choose] q<QMAX -> (pm'=4);
```

{% task %} We can now re-investiate some of the properties from above, but on the MDP model. For example, re-plot the best/worst possible expected queue size on the same graphs as before. You will need to use properties like the ones below. You will also need to switch PRISM's model checking engine from "Hybrid" to "Sparse" using the setting in the "Options" dialog (menu "Options | Options").

```prism
R{"queue"}min=? [ I=T ]
R{"queue"}max=? [ I=T ]
```

The behaviour of all of the Power Manager components considered above will fall between the "min" and "max" plots generated in this way. We can also extract, from results generated by PRISM, designs for Power Manager components that exhibit this best-/worst-case behaviour. (Although in this, case these components are not very helpful!)

Although the version of PRISM that you are using does not support it, you can also use more complex *multi-objective* queries to obtain more interesting results: for example, you can synthesise a controller component that minimises energy usage, subject to a bound imposed on the the performance.

You can read more about this in section 10.2 of the accompanying [tutorial chapter](/bibitem/FKNP11/), as well as details of the underlying techniques used.

  

There is more detailed information about the disk-drive case study you have been looking at [here](/casestudies/power_dtmc/).

You can also find many more interesting examples in the [tutorial](/tutorial/) and [case studies](/casestudies/) sections of the website.
