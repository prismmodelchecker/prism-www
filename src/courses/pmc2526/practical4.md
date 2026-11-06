---
layout: layouts/base.njk
title: "Probabilistic Model Checking - Practicals - Practical 4"
section: doc
permalink: /courses/pmc2526/practical4/
---
# [Probabilistic Model Checking Practicals](/courses/pmc2526/)

## Practical 4

This practical concerns using PRISM for analysis and planning in Markov decision processes.

Items that should be included in your practical report are marked with a **\[\*\]** below (and also summarised at the end of this page).

We consider a robot moving through a 3 x 2 grid. This example was also considered in the lecture on MDPs. Here is a graphical illustration of the robot and its possible behaviours in the environment:

![3x2 Robot MDP](/courses/pmc2526/images/robot.png){.px400}

The PRISM code to model the robot is shown below.

{% prismCode "courses/pmc2526/examples/robot/robot.prism", false, true %}

The first line indicates that this model is a **Markov decision process** (MDP). The remaining lines describe a single PRISM module, which we use to model the behaviour of the robot. We use one variable to represent the state of the system: `s`, denoting the current position of the robot in the 3 x 2 grid.

  

## Exploring the model in PRISM

{% task %} Download the model file **robot.prism** for this example from the link above. Launch the [PRISM GUI](/manual/RunningPRISM/StartingPRISM) (click the shortcut on Windows or run `bin/xprism` elsewhere) and load this file using the "Model | Open model" menu option. You should see a green tick in the top left corner indicating that the model was loaded and parsed successfully.

{% task %} Click on the "**Simulator**" tab at the bottom of the GUI. You can now use the [simulator](/manual/RunningPRISM/DebuggingModelsWithTheSimulator) to explore the model, as you have already done in earlier practicals. Now, the simulation also involves action choices.  
  
Create a new path by double-clicking on the main part of the window (or right-clicking and selecting "New path"). Then, use the "Simulate" button repeatedly to generate a sample execution of the algorithm. Look at the trace displayed in the main part of the window. What is the final value of `s`? Why is that?

{% task %} Right-click and select "Reset path". Then, step through a trace of the algorithm manually by double-clicking the available transitions from the "Manual exploration" box. Try to reach the **goal1**\-labelled state without passing through the **hazard**\-labelled state (the value of each label in the current state is shown in the top right of the window).

## Model checking and optimal policy extraction

We will now use PRISM to analyse the model and extract optimal policies that yield the highest probability of satisfying a user-defined goal. (Note that in PRISM policies are referred to as "strategies")

{% task %} Download the properties file **robot.props** below and then load it into PRISM using the "Properties | Open properties list" menu option.

{% prismCode "courses/pmc2526/examples/robot/robot.props", false, true %}

The property is of the form `Pmax`\=? \[ `F` `phi` \] which, intuitively, means "what is the maximum probability under any policy, from the initial state of the MDP, of reaching a state where `phi` is true?"

{% task %} From your knowledge about MDPs, what answer do you expect for the property above?

{% task %} Right click on the property in the GUI and select "**Verify**". Is the answer as you expected? Click on the "Log" tab to see some additional information that PRISM has displayed regarding the calculations performed.

We now want to obtain the corresponding optimal policy for the robot, yielding this maximum probability of reaching **goal1**. For that, we tick the box "Generate Strategy" under the "Strategies" menu:

![3x2 Robot MDP](/courses/pmc2526/images/strategy.png){.px200}

{% task %} Now, after verifying the property again, we can extract the optimal policy by selecting "View Strategy" -> "Action List" under the "Strategies" tab. What is the optimal policy? You can also generate some paths in the simulator, and the policy will be enforced/displayed at each step.

## Time-dependent optimal policies

In the example above, the optimal policy is "memoryless", i.e., it only depends on the current state and not in any way on the history of previously visited states.

We now consider a second property:

{% prismCode "courses/pmc2526/examples/robot/robot_timed.props", false, false %}

{% task %} From your knowledge about MDPs and PCTL, what does the property mean?

{% task %} Without using PRISM, what are the maximum probabilities and optimal policies for the property with values `k` = 1,2,3? **\[\*\]**

{% task %} Now check your answers for the previous part with PRISM. You can create a constant by right-clicking in the "Constants" panel below the properties and changing the default name provided. Similarly, to create a new property, right click in the properties panel. What does the output for the optimal policies look like and how do you interpret it? It may help to explore the policies in the simulator again.

{% task %} Does the optimal policy change for different values of `k`? Explain. **\[\*\]**

## Control of an autonomous drone

We now want to analyse MDPs with more involved objectives, such as cost optimisation and non-Markovian tasks, e.g., objectives that consist of multiple sub-goals. For that, we consider an example of an autonomous drone.

The environment in which the drone is maneuvering is discretised into a 5 x 6 grid. The drone starts at coordinates (1,1) and is tasked with reaching the goal at (1,6) **safely**, i.e., without crashing into the obstacles depicted in red. We ignore the yellow parcel for now.

![5x6 drone environment](/courses/pmc2526/images/uav-env-parcel.png){.px350}

The drone is autonomous, i.e., it operates according to a fixed policy that, for every state (position), may choose to fly straight, left, or right. A complicating factor is that the drone is susceptible to **wind**, which, with some probability, may push it into an undesired direction or make it not move at all.

![3x2 Robot MDP](/courses/pmc2526/images/uav.png){.px150}

The basis for a PRISM model of the drone can be found below.

{% prismCode "courses/pmc2526/examples/drone/uav-parcel.prism", false, true %}

{% task %} Familiarise yourself with the given model. How is the environment implemented? What happens when the drone encounters an obstacle? Where does uncertainty come into play, and which effects does it model?

We first want to design policies that maximise the probability of the drone reaching the goal safely and satisfying its task. Before we let PRISM do that automatically, let's take on the role of a UAV engineer and build some policies ourselves. For that, we use a second module (called `policy`), which interacts with the main module (`env`) via [synchronisation](/manual/ThePRISMLanguage/Synchronisation). The `policy` module uses the same set of **actions** and only allows the UAV to execute actions when the given conditions are satisfied.

Below is the specification of a (maybe not entirely sensible) policy that controls the drone to fly straight up while the x-coordinate us less than 3, and to fly left in all other cases. Notice that the conditions ("guards") are mutually exclusive and cover the whole state space. Notice also that actions not used by the policy are also present, but with guard `false`, which disallows the other module from executing those actions independently.

{% prismCode "courses/pmc2526/examples/drone/policy.prism", false, false %}

{% task %} Paste this policy module into the PRISM model above and simulate some paths through the model to convince yourself that the policy is executed as expected.

{% task %} What is the probability of fulfilliung the task under the policy above? For that, design a sensible specification that captures the drone reaching the goal without crashing. (Hint: You probably want to make use of the until "`U`" temporal operator.)

{% task %} Design a better policy of your own. What do you observe? Is it better for the drone to fly directly to the goal or to detour around the obstacle? By how much? Why?

{% task %} What is the best policy that you can handcraft, and what performance does it achieve? Feel free to compare your policies with others in the room. **\[\*\]**

## Planning with costs

We now want to take cost constraints into consideration. The model contains a cost structure `costs`. Although technically defined as rewards in PRISM (i.e., always non-negative), we interpret them here as costs. This structure captures both the cost of moving the drone (representing energy consumption and/or time) and the penalty incurred if the drone crashes (such as the value of the drone itself).

{% task %} Design a suitable reward specification that captures the incurred cost up to the point where the manoeuvre is completed, that is, until the drone either reaches the goal or crashes, as indicated by the `done` flag in the environment module.

{% task %} What is the optimal policy that minimises the expected cost until the manoeuvre is completed? What is the corresponding optimal expected cost?

{% task %} For which values of the crash cost does the optimal policy choose the riskier but shorter route straight upwards, close to the obstacle, and for which values does it instead take the safer but longer detour around the obstacle?  
  
Design a PRISM experiment to investigate this trade-off, and produce a plot that visualises the break point where the optimal strategy switches between the two behaviours. **\[\*\]**

## Planning for non-Markovian tasks

Finally, we move beyond simple reach-avoid specifications and consider more complex tasks.

In particular, we are interested in specifications that require achieving multiple subgoals in a prescribed order before the overall objective is satisfied. For the drone example, this could mean that the drone must first pick up a parcel before it continues flying towards the target zone. The overall objective can then be expressed as:

{% prismCode "courses/pmc2526/examples/drone/uav-parcel.props", false, true %}

{% task %} Conceptually and algorithmically, what distinguishes this property from the ones we considered earlier? What changes for policies and their synthesis? **\[\*\]**

{% task %} Compute and inspect the optimal policy for this specification. How does it differ from the policies we have seen before? Can you identify similarities to, for example, the timed specifications with the `U`<=`k` operator from Task 1? Why is that?

{% task %} What is the automaton corresponding to this property? **\[\*\]**

{% task %} In this case, we expressed the requirement of first picking up the parcel and then reaching the goal while avoiding crashes as a complex formula with nested temporal operators, which demands more sophisticated planning algorithms. What alternatives are there? Can you adapt the model and instead use a simple formula with a single `U` operator? What is the connection?

## Practical Report

To get this practical signed off, you should provide the demonstrator with a brief practical report comprising the starred items from the text above, i.e.:

1.  from part 1: the maximum probabilities and optimal policies for the time-bounded until with values `k=1`,2,3;
2.  from part 1: an explanation on why the optimal policy changes for different values of `k`;
3.  from part 2: your best handcrafted drone policy and its value;
4.  from part 2: a plot that visualises the cost trade-off for different values of `crash_cost` and the break point where the optimal policy changes;
5.  from part 2: a brief description of how the non-Markovian planning differs conceptually and algorithmically;
6.  from part 2: the automaton corresponding to the property.

\[ [Back to index](/courses/pmc2526/) \]
