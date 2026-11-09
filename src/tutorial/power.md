---
layout: layouts/base.njk
title: "Dynamic power management (PRISM tutorial)"
section: doc
permalink: /tutorial/power/
---
# Dynamic power management

This example concerns *dynamic power management (DPM)* schemes, which are sets of instructions used to switch between different power states of computing devices. This example is actually based on a specific case study from the literature - a Fujitsu disk drive with 3 power states - but in the following, we describe the DPM system in a fairly generic way.

The DPM system comprises three components: the *Service Queue (SQ)* into which requests for a particular service are placed (read/write requests to the disk in this case), the *Service Provider (SP)* which responds to these requests (the disk drive itself here), and the *Power Manager (PM)*. The Service Provider has several different power states, in this case: *sleep*, *idle* and *busy*. The idea is these three states have different power consumptions but also different response times when a service is to be performed. Switches between power states are either performed by the Service Provider itself or initiated by the Power Manager. A good strategy for switching between these states will be one that keeps power consumption as low as possible whilst maintaining an acceptable level of service.

Our initial PRISM model is the following:

{% prismCode "tutorial/examples/power/power.sm", false, true %}

This model is a continuous-time Markov chain (CTMC), as denoted by the keyword at the start of the file. Presently, we just have two modules, representing the Service Queue (SQ) and Service Provider (SP). There are a couple of important things to note.

Firstly, since this is a CTMC, updates in guarded commands are labelled with rates, not probabilities. The first command in the module `SQ`, for example, which describes the arrival of a request into the queue, has the rate `rate_arrive`, which is a constant defined just above in the file.

Secondly, notice that all the commands are labelled with actions (in square brackets at the start of the line).

{% task %} Read the section on [synchronisation](/manual/ThePRISMLanguage/CompositionAndSynchronisation/#synchronisation) in the manual. Then, have a look at the definition of the `SQ` and `SP` modules, and try to understand what they describe.

{% task %} Download the model file **power.sm** from above and load it into PRISM.

{% task %} Use the PRISM simulator to generate some random paths through the model. Notice how, for a CTMC model like this, the elapsed time as the path progresses is displayed in the table. You will probably find that the size of the queue (`q`) never gets above 1. Why is this? Generate a path by hand where the queue reaches its maximum size (currently `q_max=20`). What happens when more requests arrive while the queue is full?

{% task %} What is the size of the state space of this model? (i.e from the initial state, how many possible different states can be reached?) Go back to the "Model" tab of the GUI, select menu option "Model | Build model" and then look at the statistics displayed in the bottom left corner to check your answer.

## Adding the power management control

We now extend our PRISM model by adding a Power Manager (PM) component. The PM functions by observing the state of the system (i.e. the SQ and the SP) and, based on this, instructs the SP when to change between the *sleep* power state and the *idle* and *busy* states. In PRISM, we will model this via synchronisation between the existing `SP` module and a new module called `PM`. We will use the actions `idle2sleep` and `sleep2idle` which tell the SP to move between its *sleep* and *idle* power states. Here is the PRISM code for the model extended with the `PM` module.

{% prismCode "tutorial/examples/power/power_policy1.sm", false, true %}

The PM needs a *policy* in order to operate: a set of rules which dictate what power management instructions to send and when. This simple policy is to switch out of *sleep* mode when the request queue exceeds a certain size (denoted by the constant `q_trigger`) and to switch back to *sleep* mode when the queue is empty.

{% task %} Look at the code we have added to the `SP` module and at the new `PM` module. Make sure you understand how they work.

{% task %} Now use the simulator to generate a trace through this new model. When you create a new path, you have to specify a value for the constant `q_trigger`, because it is left undefined in the model. Try a value of 5 for now. Does this new model behave as you expect?

## Analysing the model

We will now use PRISM to analyse the behaviour of the power management system. More specifically, we will first study the probability that the service queue is full at a particular time instant.

{% task %} Go to the "Properties" tab of the GUI, create a new constant called `T`, of type double and with no defined value. Then add the following property:

```prism
P=? [ F[T,T] q=q_max ]
```

{% task %} Now, create an [experiment](/manual/RunningPRISM/Experiments/) based on this property, plotting a graph of its result for `q_trigger` equal to 5 and `T` from 0 up to 20, i.e. for the first 20 seconds of the system.

{% task %} It seems that the transient probability of the queue being full stabilises after a short while. Using another experiment, plot values for the same property on the same graph, this time for `T` from 20 up to 40, and see if the probability remains the same. To confirm this, now create a property to check the long-run probability of the queue being full, using the [S operator](/manual/PropertySpecification/TheSOperator/). Right click the new property and select "Verify". You will need to give a value for `T` but this is not used so you can enter anything. It turns out that the default iterative method in PRISM (Jacobi) for solving this kind of property does not converge in this case. Switch to the Gauss-Seidel method from the "Options" dialog and try again. Check that your result matches the graph.

Next, we will study the expected size of the queue over time, using PRISM's support for costs and rewards.

{% task %} Read the section on [costs and rewards](/manual/ThePRISMLanguage/CostsAndRewards/) in the manual. Then, look at the rewards that have already been defined in this model.

{% task %} Add these two properties which can be used to compute the transient and long-run expected queue size, respectively:

```prism
R{"queue_size"}=? [ I=T ]
R{"queue_size"}=? [ S ]
```

{% task %} Plot the expected queue size at time `T`, for the first 20 seconds of the model. As above, also compute the long-run value and check that it matches the results on the graph.

{% task %} Now create some experiments to analyse the transient and/or long-run expected queue size for a range of different values of the constant `q_trigger`. How does the performance of the system vary as this changes? What is the "best" value of `q_trigger`?

Another possible measure of the performance of the system is how many requests get lost, i.e. how many times a request arrives when the queue is currently full.

{% task %} Add a second [reward structure](/manual/ThePRISMLanguage/CostsAndRewards/) to the model called "lost", which assigns 1 to every transition of the model labelled with action `request` from a state where the queue is full.

{% task %} Now create a new property to check the expected *cumulated* reward up until time `T`. Don't forget to specify which reward structure you want in the property. (You might want to look at [this section](/manual/PropertySpecification/Reward-basedProperties/) of the manual.) How does this measure vary for different values of `q_trigger`?

Of course, the performance of the system is actually a trade-off between several factors. In particular, we are interested not just in how promptly requests are dealt with (one measure of which is the expected queue size), but also the power consumption of the system. The power consumption of the system is defined as follows. Energy is used at rate 0.13, 0.95 or 2.15 for SP power states "sleep","idle" and "busy", respectively. In addition, transitions between power states have a fixed energy cost: going from "sleep" to "idle" uses 7.0 units and from "idle" to "sleep" uses 0.067 units.

{% task %} Add a third reward structure to the model representing the power consumption. Use a cumulative reward property to investigate the energy consumption over time of the system.

## Extensions

Another approach to implementing the power manager is to use *stochastic* policies, which can also make random choices.

{% task %} Replace the `PM` module in the existing model with the following:

```prism
// Probability of ordering the SP to sleep when queue empty
const double p_sleep;

module PM
	
	// i2s: true when idle2sleep command should be issued
	i2s : bool init false;
	
	// Updates to i2s variable triggered by request arrivals/services
	[serve_last] true -> p_sleep : (i2s'=true) + 1-p_sleep : (i2s'=false);
	[request] true -> (i2s'=false);
	
	// Send idle2sleep command to SP (when queue empty, with probability p_sleep)
	[idle2sleep] i2s -> (i2s'=false);
	
	// Send sleep2idle command to SP (when queue is full)
	[sleep2idle] q=q_max -> true;
	
endmodule
```

{% task %} How well does this power management system perform? What effect does the value of the probability `p_sleep` have?

{% task %} Can you think of any ways of improving these power management strategies? Implement them in the PRISM model and see how well they perform.
