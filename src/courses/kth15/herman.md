---
layout: layouts/base.njk
title: "KTH'15 - PRISM Lab Session - Part A"
section: doc
permalink: /courses/kth15/herman/
---
# [KTH'15](/courses/kth15/): Probabilistic model checking with PRISM

## PRISM Lab Session, Part B: Herman's self-stabilisation algorithm

We now consider a second example: a self-stabilisation algorithm due to Herman. A self-stabilisation algorithm for a network of processes is a protocol which, when started from some possibly "illegal" start state, returns to a "legal" state without any outside intervention and within some finite number of steps. We call a "legal" state a **stable** state.

Here is a PRISM model of Herman's algorithm for 7 processes:

{% prismCode "courses/kth15/examples/herman/herman7.pm", false, true %}

The processes are arranged in a ring and are identical. Notice how we use PRISM's [module renaming](/manual/ThePRISMLanguage/ModuleRenaming) facility to avoid duplicating the module definition for each process.

{% task %} Have a look at the code and work out what a process does at each step of the protocol. Notice the `step` action in the square brackets at the start of every command. This is used to force all 7 processes to synchronise (move simultaneously at each step). You can read more about synchronisation in the [manual](/manual/ThePRISMLanguage/Synchronisation).

{% task %} Download the model file **herman7.pm** from above and load it into PRISM.

The state of each process is given by a single 0/1-valued variable. Initially, this value is 1 for all processes (note how this is done in the variable definition in the model file).

{% task %} What is the maximum possible number of states that this model can be in? Are all of these states reachable from the initial configuration (1,1,1,1,1,1,1) of the model? Select the "Model | Build model" menu option and look at the information displayed in the bottom left of the GUI to find out. Take a look at the log to see additional information displayed about the model building process.

## 8\. Reaching a stable state

{% task %} Download the property file below and load it into PRISM:

{% prismCode "courses/kth15/examples/herman/herman7.pctl", false, true %}

For this self-stabilisation algorithm, a stable state is defined as one in which only a single process has a token. A process is said to possess a token if its variable is the same as the process to its left.

{% task %} Look at the label "`stable`" which is defined in the file above and the formula `num_tokens` from the model file which it uses. Check that you understand how it relates to the definition of a stable state. Look at the [expressions](/manual/ThePRISMLanguage/Expressions) section of the manual if not.

{% task %} Use the PRISM simulator to generate some random paths through the model. Click on the "`stable`" label in the top-right part of the simulator to help you identify which states of these paths are stable. Note that in this model of the algorithm, we do not actually terminate when a stable state has been reached.

{% task %} We would like to know whether, from the initial state, a stable state is eventually reached with probability 1. Check this by verifying the property included in the **herman7.pctl** file that you loaded into PRISM (do not forget to deselect the "Use Simulation" option if it is still selected).

{% task %} If you used a non-probabilistic model checker to verify whether "from the initial state, a stable state is **always** eventually reached", what would the result be?

{% task %} Modify the existing property (double-click or right-click and "Edit") to see if "the probability of a stable state being reached within 10 steps is (greater than or equal to) 1". Is it greater than 0.5? What is the actual probability? (If you need help, read about the P Operator in the PRISM manual [here](/manual/PropertySpecification/ThePOperator) and [here](/manual/PropertySpecification/QuantitativeProperties).)

{% task %} Notice that, like in the die example, we have assigned a reward of 1 to each state of the model. Create and verify a new property to answer the question "what is the expected number of steps required for the self-stabilisation algorithm to reach a stable state?".

## 9\. Initial configurations

So far, all our analysis has been for a fixed initial state of the model. We will now carry out a more exhaustive examination of the protocol by considering different classes of initial configuration. PRISM allows a model to have more than one initial state.

{% task %} Modify the model by removing the "`init` `1`" part of the definition for variable `x1` (and thus also for `x2`, `x3`, ... ,`x7` since they are defined by renaming). Add the following code to the end of the model:

```prism
init
	true
endinit
```

{% task %} Check that the model still builds without errors ("Model | Build model").

Any possible configuration of the process is now considered as an initial state of the model.

{% task %} Download the following modified properties file and load it into PRISM:

{% prismCode "courses/kth15/examples/herman/herman7new.pctl", false, true %}

This property allows us to compute "the maximum expected time to reach a stable state, starting from any initial configuration in which there are k tokens".

{% task %} Verify this property for `k=7`. Do you get the same value as earlier? (You should.)

There is an [unproven conjecture](/bibitem/MM05a/) that, for any number `N` of processes, the worst-case expected time to reach a stable state always occurs when there are initially 3 tokens. We can't prove this with PRISM, but we can investigate whether it is true for some values of `N` (in this case, we have `N=7` processes).

{% task %} Create an experiment to compute and plot a graph of the values of the property for all **odd** values of `k` between 1 and 7. (Again, make sure "Use Simulation" is **not** still selected.)  
  
\[Note: the way that this algorithm works, even numbers of tokens cannot occur.\]

{% task %} Look in the log. You can see exactly which of the various possible configurations result in these worst-case answers.  
  
\[Note: in cases where there are more than 10 such configurations, PRISM just prints the first 10.\]

{% task %} For which value of `k` is the expected time lowest? Why? For which value is it highest?

{% task %} Create another PRISM property which computes the **minimum** expected time to reach a stable state, starting from any initial configurations in which there are `k` tokens. Plot this value for `k=1`,3,5,7 on a single graph.

{% task %} This protocol has some other curious properties that can be investigated with PRISM. In particular, try modifying the algorithm so that the random choice of each process occurs with probability `p`, where `p` is an undefined constant, rather than 0.5. Investigate what happens as you vary `p`. See [here](/casestudies/self-stabilisation/) for more details.

**Next:** [Part C](/courses/kth15/power/)
