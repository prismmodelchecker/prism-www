---
layout: layouts/base.njk
title: "AIMS CDT - Verified Sequential Decision Making under Uncertainty"
section: doc
permalink: /courses/aims2627/
pageStyle: "code{background-color:#dddddd;}"
---
# Verified Sequential Decision Making under Uncertainty

## (part of the AIMS CDT "Systems Verification" course)

## Overview

This page collates resources from the "Verified Sequential Decision Making under Uncertainty" part of the "Systems Verification" AIMS CDT course, taught by [Dave Parker](https://www.cs.ox.ac.uk/people/david.parker/home.html).

It also provides a hands-on **lab session** using the [PRISM](/) model checker, led by [Angel He](https://7angel4.github.io/).

You may find the following useful:

-   Slides from the lecture "[Verified Sequential Decision Making under Uncertainty](/talks/dave-aims26-sysver.pdf)"
-   This tutorial on robust MDPs: "[Robust Markov Decision Processes: A Place Where AI and Formal Methods Meet](/bibitem/SBB+24/)"
-   This tutorial paper on model checking Markov chains and MDPs: "[Automated Verification Techniques for Probabilistic Systems](/bibitem/FKNP11/)"
-   The survey paper "[Probabilistic Model Checking and Autonomy](/bibitem/KNP22/)"

Below, you can find a lab exercise that you should work through.

## Getting started

You will first need to download and install [PRISM](/).

A very abbreviated **install** guide for Mac/Linux binaries is as follows:

1.  Download the latest version (v4.11): [macOS x86](/dl/prism-4.11-mac64-x86.tar.gz) - [macOS Arm](/dl/prism-4.11-mac64-arm.tar.gz) - [Linux x86](/dl/prism-4.11-linux64-x86.tar.gz) - [Linux Arm](/dl/prism-4.11-linux64-arm.tar.gz) - [Windows](/dl/prism-4.11-win64-x86-installer.exe)
2.  Make sure you have Java installed (type `java -version` to check). If not, install e.g. via `brew install openjdk` (macOS) or `sudo apt install default-jdk -y` on Debian/Ubuntu Linux.
3.  Unpack and install, e.g.: `tar xfz prism-4.11-mac64-arm.tar.gz; cd prism-4.11-mac64-arm; ./install.sh`
    -   On macOS, also do: `xattr -d com.apple.quarantine lib/*lib`
4.  Run PRISM: `bin/xprism`

For **Windows**, download and run the [installer](/dl/prism-4.11-win64-x86-installer.exe).

For anything else (e.g., to compile from source), go to the [download page](/download/) and then check the [full install instructions](/manual/InstallingPRISM/Instructions).

## A first example

Our first example is a PRISM model of a simple robot moving through a 3 x 2 grid, that you know from the lecture. Here is a graphical illustration of the robot and its possible behaviours in the environment:

![3x2 Robot MDP](/courses/aims2627/images/robot.png){.px400}

The PRISM code to model the robot is shown below.

{% prismCode "courses/aims2627/examples/robot.prism", false, true %}

The first line indicates that this model is a **Markov decision process** (MDP). The remaining lines describe a single PRISM module, which we use to model the behaviour of the robot. We use one variable to represent the state of the system: `s`, denoting the current position of the robot in the 3 x 2 grid.

{% task %} Read the sections on [modules/variables](/manual/ThePRISMLanguage/ModulesAndVariables) and [commands](/manual/ThePRISMLanguage/Commands) in the manual and try to understand how this description represents the algorithm.

  

## Exploring the model in PRISM

{% task %} Download the model file **robot.prism** for this example from the link above. Launch the [PRISM GUI](/manual/RunningPRISM/StartingPRISM) (click the shortcut on Windows or run `bin/xprism` elsewhere) and load this file using the "Model | Open model" menu option. You should see a green tick in the top left corner indicating that the model was loaded and parsed successfully.

{% task %} Click on the "**Simulator**" tab at the bottom of the GUI. You can now use the [simulator](/manual/RunningPRISM/DebuggingModelsWithTheSimulator) to explore the model. Create a new path by double-clicking on the main part of the window (or right-clicking and selecting "New path"). Then, use the "Simulate" button repeatedly to generate a sample execution of the algorithm. Look at the trace displayed in the main part of the window. What is the final value of `s`? Why is that?

{% task %} Right-click and select "Reset path". Then, step through a trace of the algorithm manually by double-clicking the available transitions from the "Manual exploration" box. Try to reach the **goal1**\-labelled state without passing through the **hazard**\-labelled state (the value of each label in the current state is shown in the top right of the window).

{% task %} Now change the value of the "Steps" option under the "Simulate" button from 1 to 10 and, using the "Reset path" option and "Simulate" buttons, generate several different random traces. What is the minimum path length you observe? What is the maximum?

## Model checking and optimal policy extraction

We will now use PRISM to analyse the model and extract optimal policies that yield the highest probability of satisfying a user-defined goal. (Note that in PRISM policies are referred to as "strategies")

{% task %} Download the properties file **robot.props** below and then load it into PRISM using the "Properties | Open properties list" menu option.

{% prismCode "courses/aims2627/examples/robot.props", false, true %}

The property is of the form `Pmax`\=? \[ `F` `phi` \] which, intuitively, means "what is the maximum probability under any policy, from the initial state of the MDP, of reaching a state where `phi` is true?"

{% task %} From your knowledge about MDPs, what answer do you expect for the property above?

{% task %} Right click on the property in the GUI and select "**Verify**". Is the answer as you expected? Click on the "Log" tab to see some additional information that PRISM has displayed regarding the calculations performed.

PRISM uses iterative numerical solution techniques which converge towards the correct result. The numerical computation process is terminated when it is detected that the answers have converged sufficiently. Have a look at the [manual](/manual/ConfiguringPRISM/IterativeNumericalMethods) for more information.

{% task %} Open the PRISM options panel from the menu. Find the "Termination epsilon" parameter and change it from 1.0e-6 to 1.0e-10. Re-verify the property and see how the answer changes. Check the log again and see many more iterations were required.

{% task %} Reset the "Termination epsilon" parameter to 1.0e-6.

We now want to obtain the corresponding optimal policy for the robot, yielding this maximum probability of reaching **goal1**. For that, we tick the box "Generate Strategy" under the "Strategies" menu:

![3x2 Robot MDP](/courses/aims2627/images/strategy.png){.px200}

{% task %} Now, after verifying the property again, we can extract the optimal policy by selecting "View Strategy" -> "Action List" under the "Strategies" tab. What is the optimal policy? You can also generate some paths in the simulator, and the policy will be enforced/displayed at each step.

## Time-dependent optimal policies

In the example above, the optimal policy is "memoryless", i.e., it only depends on the current state and not in any way on the history of previously visited states.

We now consider a second property:

{% prismCode "courses/aims2627/examples/robot_timed.props", false, false %}

{% task %} From your knowledge about MDPs and PCTL, what does the property mean?

{% task %} Without using PRISM, what are the maximum probabilities and optimal policies for the property with values `k` = 1,2,3?

{% task %} Now check your answers for the previous part with PRISM. You can create a constant by right-clicking in the "Constants" panel below the properties and changing the default name provided. Similarly, to create a new property, right click in the properties panel. What does the output for the optimal policies look like and how do you interpret it? It may help to explore the policies in the simulator again.

{% task %} Does the optimal policy change for different values of `k`? Explain.

## Modelling epistemic uncertainty in PRISM

![3x2 Robot MDP](/courses/aims2627/images/uncertain.png){.px400}

As you saw in the lecture, full knowledge of the model and all its probabilities might not be available in a realistic setting. This **epistemic uncertainty** on the transition probabilities can be modelled using *uncertain* models. Specifically, PRISM offers support for the analysis of *interval MDPs* (IMDPs), where transition probabilities are only known to lie within certain intervals. This models, e.g., the situation where transition probabilities were experimentally estimated by confidence intervals.

The figure above shows an IMDP for our robot, with epistemic uncertainty on some transitions.

{% task %} Assume that the parameter `e` has value **0.2**. What are the transition probability intervals associated with the uncertain transitions?

{% task %} From an examination of the IMDP without using PRISM, how does the parameter `e` affect the optimal (maximum) probability of reaching a **goal1** state?

PRISM offers direct support for uncertain transitions defined as intervals (see [here](/manual/ThePRISMLanguage/UncertainModels) for more information):

```prism
 [a] x=0 -> [0.8,0.9]:(x'=0) + [0.1,0.2]:(x'=1);
```

The intervals can also include parameters ("constants" in PRISM), which you can define at the top of the model file as:

```prism
const double e;
```

{% task %} Model the IMDP above in PRISM, where the transition probability intervals depend on the width parameter `e`.

## Analysing uncertain models in PRISM

We will now use PRISM to analyse the IMDP defined above and extract optimal behavior that is *robust* with respect to all possibilities induced by the epistemic uncertainty.

Specifications for IMDPs either reason about the worst- or the best-case behavior admissible by the transition intervals, see [here](/manual/PropertySpecification/UncertainModels).

{% task %} Design appropriate specifications for the worst- and the best-case maximum probabilities of reaching a **goal1** state, and verify them in PRISM for different values of `e`. What are the probabilities and corresponding optimal policies? What do you observe?

{% task %} In general, which of the two policies obtained for the worst- and the best-case would you ship to the real world?

Performing the same operations for multiple constant values, like `e` above, can be done automatically in PRISM, using the **experiments** functionality.

{% task %} Right-click on the property you want to verify and click "New Experiment". You should see the following dialogue, allowing you to specify the parameters for the experiment. Choose a range and a step-size, and make sure that the "Create Graph" option is ticked.

![3x2 Robot MDP](/courses/aims2627/images/experiments.png){.px350}

If you specified everything correctly for the worst-case probability, you should see a plot similar to:

![3x2 Robot MDP](/courses/aims2627/images/plot.jpeg){.px350}

{% task %} Can you explain the sharp-bend in the plot?

## Robust control of an autonomous drone

We now want to analyse how different amounts of epistemic uncertainty can affect optimal robust behaviour. To do so, we consider a more complex example, modelling an **autonomous drone**.

The environment in which the drone is maneuvering is discretised into a 5 x 6 grid. The drone starts at coordinates (1,1) and is tasked with reaching the goal at (1,6) **safely**, i.e., without crashing into the obstacles depicted in red.

![5x6 drone environment](/courses/aims2627/images/env.png){.px350}

The drone is autonomous, i.e., it operates according to a fixed policy that, for every state (position), may choose to fly straight, left, or right. A complicating factor is that the drone is susceptible to **wind**, which, with some probability, may push it into an undesired direction or make it not move at all.

![3x2 Robot MDP](/courses/aims2627/images/uav.png){.px150}

The basis for a PRISM model of the drone can be found below.

{% prismCode "courses/aims2627/examples/uav.prism", false, true %}

{% task %} Familiarise yourself with the given model. How is the environment implemented? What happens when the drone encounters an obstacle? Where does (epistemic) uncertainty come into play, and which effects does it model?

We want to design policies that maximise the probability of the drone reaching the goal safely and satisfying its task. Before we let PRISM do that automatically, let's take on the role of a UAV engineer and build some policies ourselves. For that, we use a second module (called `policy`), which interacts with the main module (`env`) via [synchronisation](/manual/ThePRISMLanguage/Synchronisation). The `policy` module uses the same set of **actions** and only allows the UAV to execute actions when the given conditions are satisfied.

Below is the specification of a (maybe not entirely sensible) policy that controls the drone to fly straight up while the x-coordinate us less than 3, and to fly left in all other cases. Notice that the conditions ("guards") are mutually exclusive and cover the whole state space. Notice also that actions not used by the policy are also present, but with guard `false`, which disallows the other module from executing those actions independently.

{% prismCode "courses/aims2627/examples/policy.prism", false, false %}

{% task %} Paste this policy module into the PRISM model above and simulate some paths through the model to convince yourself that the policy is executed as expected.

{% task %} For now, let's assume only aleatoric, not epistemic, uncertainty, i.e., that the probability for the drone to be affected by wind is precisely known in every state. We can do this in the IMDP by setting `e=0`. What is the probability of fulfilliung the task under the policy above? (Hint: you will need a slightly different property to before, replacing `F` "`goal`" by !"`crashed`" `U` "`goal`")

{% task %} Design a better policy of your own, again under the assumption of no epistemic uncertainty. What do you observe? Is it better for the drone to fly directly to the goal or to detour around the obstacle? By how much? Why?

{% task %} What is the best policy that you can handcraft, and what performance does it achieve? Feel free to compare your policies with others in the room.

We now want to take epistemic uncertainty into consideration. Observe that the epistemic uncertainty on the influence of the wind grows with the drone's x-coordinate:

{% prismCode "courses/aims2627/examples/uav_params.prism", false, false %}

This can be interpreted as having less knowledge about the actual strength/influence of wind the closer that the drone gets to the right border of the environment.

{% task %} What influence do the different values of epistemic uncertainty have on the performance of your handcrafted policies?

{% task %} For which values of `e` is it better to choose your policy that flies around the obstacle, despite less knowledge of the actual behaviour? And for which values would you choose your policy that flies straight through the obstacle?

{% task %} Can you explain and give an interpretation of what you observe?

{% task %} Now, use PRISM to extract the optimal robust policies for different values of epistemic uncertainty. (You'll need to remove your policy module)

{% task %} Are the results similar to what you obtained for your own policies? What is the inflection point of epistemic uncertainty for which you obtain a higher performance when flying straight through the obstacle? Can you explain? Plot your results and explain them.
