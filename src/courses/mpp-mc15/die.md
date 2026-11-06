---
layout: layouts/base.njk
title: "MPP Model Checking Workshop 2015: Probabilistic Model Checking"
section: doc
permalink: /courses/mpp-mc15/die/
---
# [MPP](http://molecular-programming.org/) Model Checking Workshop 2015 : Probabilistic Model Checking

## PRISM Lab Session, Part A: An introduction to PRISM

## 1\. The die example

Our first example is a PRISM model of a simple probabilistic algorithm due to Knuth and Yao {% cite "KY76" %} for emulating a 6-sided die with a fair coin. Here is a graphical illustration of the algorithm:

![Die algorithm](/courses/mpp-mc15/images/dice.pic.gif)

The idea of the algorithm is as follows. Starting from step 0 (i.e. the circle labelled 0), at every step a coin is tossed and there is 50% chance of taking each of the two possible choices. The algorithm terminates when you reach one of the values for the die on the right-hand side.

The PRISM code to model this algorithm is shown below.

{% prismCode "courses/mpp-mc15/examples/die/die.pm", false, true %}

The first line indicates that this model is a discrete-time Markov chain (DTMC). The remaining lines describe a single PRISM module, which we use to model the behaviour of the algorithm. We use two variables to represent the state of the system: `s`, denoting which step of the algorithm is currently being executed (i.e. which circle in the diagram above), and `d`, denoting the value of the die (0 means no value has been chosen yet).

The code above should be self-explanatory but, if anything is unclear, you can read the sections on [modules/variables](/manual/ThePRISMLanguage/ModulesAndVariables) and [commands](/manual/ThePRISMLanguage/Commands) in the manual.

## 2\. Exploring the model in PRISM

{% task %} Download the model file **die.pm** for this example from the link above. Launch the [PRISM GUI](/manual/RunningPRISM/StartingPRISM) (click the shortcut on Windows or run `bin/xprism` elsewhere) and load this file using the "Model | Open model" menu option. You should see a green tick in the top left corner indicating that the model was loaded successfully.

{% task %} Click on the "Simulator" tab in the GUI. You can now use the [simulator](/manual/RunningPRISM/DebuggingModelsWithTheSimulator) to explore the model. Create a new path by double-clicking on the main part of the window (or right-clicking and selecting "New path"). Then, use the "Simulate" button repeatedly to generate a sample execution of the algorithm. Look at the trace displayed in the main part of the window. What is the final value of `s`? It should be 7. What is the value of the die?

{% task %} Right-click and select "Reset path". Then, step through a trace of the algorithm manually by double-clicking the available transitions from the "Manual exploration" box. Try to reach a state where the value of the die is 6.

{% task %} Now change the value of the "Steps" option under the "Simulate" button from 1 to 20 and, using the "Reset path" option and "Simulate" buttons, generate several different random traces. What is the minimum path length you observe? What is the maximum?

## 3\. Model checking with PRISM

We will now use PRISM to perform some analysis of the model.

{% task %} Download the properties file **die.pctl** below and then load it into PRISM using the "Properties | Open properties list" menu option.

{% prismCode "courses/mpp-mc15/examples/die/die.pctl", false, true %}

The file comprises a constant `x`, whose value we leave undefined, and one property. The property is of the form `P`\=? \[ `F` `phi` \] which, intuitively, means "what is the probability, from the initial state of the model, of reaching a state where `phi` is true?"

{% task %} What does `phi` mean in this case? What does the property mean?

{% task %} Right click on the property in the GUI and select "Verify". Pick a value of `x` between 1 and 6. Is the answer as you expected? Click on the "Log" tab to see some additional information that PRISM has displayed regarding the calculations performed.

{% task %} Read the section in the PRISM manual describing [experiments](/manual/RunningPRISM/Experiments). Use PRISM to plot a graph of the value of the property `P`\=? \[ `F` `phi` \] for values of `x` between 0 and 7.

## 4\. Statistical model checking with PRISM

PRISM also has a discrete-event simulation engine which can be used to generate [approximate](/manual/RunningPRISM/StatisticalModelChecking) verification results (this is often called *statistical model checking*). This engine is also what underlies the simulator that you used earlier to explore the model manually.

{% task %} Re-run your experiment using the simulator by ticking the "Use Simulation" option in the experiment dialog. On the "New Graph Series" dialog, choose to display the results on your existing graph. In the next dialog, which shows parameters for the simulation process, you will see that the default number of samples is set to 1000. Change the number of samples to 10 (if the field is not editable, select a different option from the "Automatically Calculate" drop-down menu). How are good are these approximate results?

{% task %} Keep re-running the experiment, plotting the results on the same graph each time, and changing the number of samples to 100, 1000, etc. How many samples do you need to get results close to those generated through verification? You can drag a box on the graph to zoom in and compare the plots more easily.

If you want to change the legend or other properties of the graph, right-click and select "Graph options". You can also export or print the graph from this menu.

## 5\. Expected termination time

We will now use PRISM to compute the expected number of steps that the algorithm being modelled requires to generate a value for the die.

{% task %} Before you do this, can you compute the result by hand?

{% task %} You need to add some *costs* to the model. In PRISM, we use the terminology "reward", rather than "cost". The two are synonomous. Go to the "Model" tab of the PRISM GUI and add the following code to the end of the model.

```prism
rewards "steps"
	true : 1;
endrewards
```

This associates a reward of 1 with every state in the model.

{% task %} Go back to the simulator and generate a random path through the model. You will see that the reward for each state is now displayed in the table. Right-click on the path, choose "Configure view" and, from the "Reward visibility" tab, add the item labelled "cumulative" to the list of visible items by selecting it from the right-hand panel an clicking the left arrow. Create another path in the simulator and you will see that the accumulation of rewards along a path are now also displayed.

We will now use PRISM to compute the expected number of steps. This can be done with a property of the form:

```prism
R=? [ F phi ]
```

which means "what is the expected value of the rewards cumulated, from the initial state of the model, until we reach a state satisfying `phi`?''.

{% task %} What should `phi` be in order to compute the expected number of steps that the algorithm requries to compute a value for the die?

{% task %} Go to the "Properties" tab, add this new property to the list of properties, and then verify it. What is the result? The precise answer is 11/3. If you get a result of infinity, you have not got the right expression for `phi` (take a look at [this question](/manual/FrequentlyAskedQuestions/PRISMProperties#inf_rewards) to see why the reward might be infinite).

## 6\. Extensions

{% task %} Can you modify the algorithm above so that it emulates a 5-sided die, rather than a 6-sided die?

{% task %} Run an experiment to show the correctness of your algorithm.

{% task %} Is this version more or less efficient than the previous one?

  

**Next:** [Part B](/courses/mpp-mc15/circadian/)
