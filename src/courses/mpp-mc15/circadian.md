---
layout: layouts/base.njk
title: "MPP Model Checking Workshop 2015: Probabilistic Model Checking"
section: doc
permalink: /courses/mpp-mc15/circadian/
---
# [MPP](http://molecular-programming.org/) Model Checking Workshop 2015 : Probabilistic Model Checking

## PRISM Lab Session, Part B:Circadian Clock

This example illustrate the use of PRISM for a small biological case study. We model *circadian rhythms* which are used by a wide range of organisms, from bacteria to mammals, to keep a sense of daily time and regulate behaviour accordingly. In particular, we use the abstract circadian clock model of Barkai and Leiber. See the following links for background reading on this example: {% cite "BL00", "VKBL02" %}.

The system comprises seven different species:

-   activator proteins;
-   activator mRNA;
-   activator genes (with and without the activator protein bound to its promoter);
-   repressor proteins;
-   repressor mRNA;
-   repressor genes (with and without the activator protein bound to its promoter);
-   inactivated complexes formed by the binding of the activator and repressor proteins.

The following summarises the reactions that occur in the system:

-   the activator and repressor genes are transcribed into mRNA;
-   subsequently, mRNA are translated into proteins;
-   the activator protein can bind with either of the genes, which increases their transcription rate;
-   the repressor can bind with the activator to form an inactive complex, preventing the activator binding with the genes;
-   both proteins can degrade;
-   in addition, the activator can degrade when part of the inactive complex, leaving the repressor protein.

## The model

A PRISM model of this system is shown below. This is a continuous-time Markov chain (CTMC), which represents a *discrete stochastic* model of the system. For further reading on this topic, see for example section 2 (and in particular section 2.2) of {% cite "KNP+06" %}.

{% prismCode "courses/mpp-mc15/examples/circadian/circadian.sm", false, true %}

The PRISM module comprises 7 modules. Each one represents the current quantity of one of the 7 species of the system, as listed above. For example, module `activator_protein` has a single variable `a`, representing the number of activator proteins. The range of values for this variable is \[`0..N`\]. If you look at the top of the file, you will see that `N`, which is used as the upper bound for most species, has been set to `1000000`. This is because, although there are potentially an unbounded number of these species, PRISM requires models to be finite state. Due to the size of this model we will only use the simulator engine during our analysis.

Look at the module `activator_gene`. It has a 0-1 variable `da`, representing the absence (0) or presence (1) of an activator gene (for now, we assume that only one such gene can be present). This module has an additional variable `da_a`, which we use to denote the fact that the gene is bound to an activator protein (A).

The modules representing genes and mRNA for the repressor are identical in structure to those for the activator and so are created with [module renaming](/manual/ThePRISMLanguage/ModuleRenaming). The initial state of the model is given by the initial state of each variable. For `da` (and thus also `dr`), this is 1. For all other variables, the initial value is taken by default to be the lowest value in its range. Thus, in the initial configuration of our model, there is just a single activator gene and a single repressor gene.

{% task %} Download the model file **circadian.sm** from above and load it into PRISM.

{% task %} Create a new path in the simulator and look at the values of the variables in the initial state. These should correspond to the description above.

{% task %} Look at the "Manual exploration" box at the top to see what transitions are available from the initial state. We will now see how the first of these, labelled `transc_da`, relates to the model description.

When reactions occur in the system, the variables representing the amount of each species will be updated accordingly. We use [synchronisation](/manual/ThePRISMLanguage/Synchronisation) to allow the modules representing different species to update simultaneously. Look at the two commands in the model file above that are labelled with action `transc_da`: one in module `activator_gene` and one in `activator_mRNA` (action labels appear in the pair of square brackets at the start of a command).

For a `transc_da`\-labelled transition to occur, the guards for both of these commands must be satisfied: `da=1` (the activator gene is present) and `ma`<`N` (the amount of activator mRNA has not reached its maximum). When the transition occurs, the right-hand sides of both commands are applied. For the first command, the right-hand side is just `true`, indicating that no change occurs. For the second, the amount of activator mRNA is incremented: (`ma'=ma+1`).

The *rate* of this synchronous transition is determined by multiplying the rates of each command that contributes to it. Rates are assigned to commands in the same way that probablities are. For example, the 3rd and 4th commands of module `activator_mRNA` have rate `ma`. In commands where the rate is omitted, it is assumed to be 1. For the `transc_da`\-labelled transition we have just described, both commands have rate 1. So where does the rate of 50.0 (that you can see in the simulator) come from? If you look at the end of the model, you will see a module called `rates` containing a number of "dummy" commands whose only purpose is to contribute to the definition of the rate of synchronous transitions. Hence, `transc_da` transitions have rate equal to 50.

{% task %} Use the PRISM simulator to step through some random paths through the model. For each step, try to understand its corresponding definition in the PRISM model, and also what it relates to in the high-level description of the circadian clock, given at the top of this page.

{% task %} Generate a path in the simulator where the number of mRNA of A reaches 5. What happens to the rate of translation of A (action `transl_a`) as the number of mRNA increases?

## Analysing the model

We will now use PRISM to analyse the behaviour of the circadian clock. The crucial feature of circadian clocks is that the clock runs accurately, triggering the appropriate genes at the correct times of the day. This feature is ensured through the clock's ability to maintain a constant period over a wide range of external and internal fluctuations.

More specifically, we will first study the quantity of the activator proteins as time evolves. To do this we add the following reward structure to the PRISM description.

```prism
// amount of activator protein
rewards "activated_protein"
	true : a;
endrewards
```

{% task %} Read the section on [costs and rewards](/manual/ThePRISMLanguage/CostsAndRewards) in the manual. Then, add this reward structure to your PRISM description of the circadian clock.

{% task %} Go to the "Properties" tab of the GUI, and add a new constant called `T` in the "Constants" panel. `T` should be of type double and have no defined value. Then add the following property (the expected value of the reward structure "`activated_protein`" at time instant `T`):

```prism
R{"activated_protein"}=? [ I=T ]
```

{% task %} Now, create an [experiment](/manual/RunningPRISM/Experiments) for the property, for `T` from 0 up to 200, i.e. for the first 200 hours of the system. **Important:** Do this using the simulation engine (i.e. tick the **"Use simulation"** box in the "Define constants" window), set the number of samples to be generated by the simulator to **1**, and increase the "Maximum path length" setting to **1000000**.

{% task %} Look at the resulting graph that is generated (you may may have to wait for a few seconds for simulation to complete). You should observe oscillations in the amount of activator proteins, occurring at regular time intervals.

Next, we will study the influence of the rates for transcription on the oscillation of the activator protein.

{% task %} Add a [constant](/manual/ThePRISMLanguage/Constants) called `k` of type double to the model and change the rates of transcription such that the rates are multiplied by a factor of `k`. Check your modifications are correct by generating a number of random paths in the simulation engine.

{% task %} Run an experiment, similar to the one above, to see what happens to the oscillations of the activator protein as `k` varies between `0.5` and `1.5`. Make sure that you choose `T` as the variable to be plotted on the x-axis in the resulting graph. When prompted, say that you want to use the same initial state for the experiments). The results should demonstrate that changing the rate of transcription influences the peaks of the oscillations but not the period. Note that the peaks will not be at the same points due to the stochastic nature of the model and the fact the plots are for different simulation runs.

We will now look at the number of transcriptions that occur over a given period of time.

{% task %} Add a [reward structure](/manual/ThePRISMLanguage/CostsAndRewards) to the model called "`repressor_transcriptions`", which assigns 1 to transitions which corresponds to a transcription of the repressor gene.

{% task %} Now create a new property to check the expected *cumulated* reward up until time `T`. Don't forget to specify which reward structure you want in the property. (You might want to look at [this section](/manual/PropertySpecification/Reward-basedProperties) of the manual.) How does this measure vary for different values of `k`?

Finally, we will look at a more general model where initially there is more than one activator gene and more than one repressor gene.

{% task %} Add an integer constant `M` to the model and rewrite the `activator_gene` module to model the case where there are initially `M` activator genes. Note that since the repressor gene is constructed by renaming the activator gene you are in fact changing the model so that the initial number of repressor genes is also `M`. To ensure that you have modified the model correctly, use the simulation engine to generate some random paths and check that the behaviour is as you expect.

{% task %} What effect does increasing the initial numbers of genes to `2`, `3` and `4` have on the oscillations of the activator protein? You can fix `k` at 1 for this experiment. The results should again show that the clock runs accurately under fluctuations: changing the initial numbers of genes does influence the values of the peaks, but does not change the period of the oscillations.

**Next:** [Part C](/courses/mpp-mc15/power/)
