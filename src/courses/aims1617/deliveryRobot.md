---
layout: layouts/base.njk
title: "AIMS-QuantVer'17 - PRISM Lab Session - Part B"
section: doc
permalink: /courses/aims1617/deliveryRobot/
---
# [AIMS-QuantVer'17](/courses/aims1617/): Quantitative verification, part of the Systems Verification course of the AIMS CDT

## PRISM Lab Session, Part B: Mail Delivery Robot

## 1\. Background

This example concerns a mail delivery robot. It is a simple example to show how PRISM can be used to verify the design of a robot system.

A workplace is equipped with a robot for internal mail delivery. From each office, workers can call the robot whenever they have mail to send. When the robot arrives, it collects the mail and the number of the office to which it should be delivered. The robot has its own "office" where it can recharge its battery. If its battery is empty, the robot stops working.

In the first part, the robot uses a completely random pattern similar to those of vacuum cleaning robots, so the model is a Discrete-Time Markov Chain (DTMC). In the second part, the movement of the robot is left unspecified, and thus the model is a Markov Decision Process (MDP). We will use PRISM to synthesise optimal strategies for this robot.

The robot contains several components:

-   The battery records the current available power.
-   The controller decides which move to perform next.
-   The task manager selects the next task to perform.

The different components are synchronised with each other to build the full model.

A map of the workplace is depicted below. Offices are labelled from 1 to 8. Office 0 is where the robot recharges its battery. Lines represent the corridors the robot can use to navigate between offices.

![Map of the workplace](/courses/aims1617/images/deliveryRobotGraph.png){.px400}

## 2\. Part 1: Modelling as a Markov Chain

The initial PRISM model is the following:

{% prismCode "courses/aims1617/examples/deliveryRobot/DeliveryRobot.pm", false, true %}

This model is a DTMC like in the previous example. As the model includes several components, *action labels* (in square brackets) are used to implement synchronisations.

The controller module contains one variable representing the position (`p`) of the robot. It also reads the current status of the battery charge (`c`), but cannot update it as it belongs to another module. After a move, if its battery is not empty, the robot determines its next move by choosing uniformly a state among the available ones. If its battery is empty, then the robot is stuck. Assuming independence and when the battery is not empty, the controller module can be represented by the following DTMC.

<img class="prism-image" width="400px" src="/courses/aims1617/images/deliveryRobotControlerDTMC.png" alt="DTMC of the
controller">

The battery module records the charge of the battery in the variable `c`. It synchronises with the controller and updates the current charge of the battery according to the movement of the robot. When the robot position is 0, the battery recharges itself.

{% task %} Read the section on [synchronisation](/manual/ThePRISMLanguage/Synchronisation) in the manual.

{% task %} Download the model file [DeliveryRobot.pm](/courses/aims1617/examples/deliveryRobot/DeliveryRobot.pm) and load it into PRISM. Execute some paths through the model using the simulator. You will see that there is also a label "outOfPower" in the model, indicating that the battery is empty. For the moment you can ignore the `task` module.

{% task %} Compute the probability to reach a state where the robot runs out of power. Can you compute it by hand?

{% task %} Write down a CTL formula checking whether there exists a path that never reaches a state where the robot is out of power.

{% task %} Compute the average number of moves that the robot can perform before running out of power. To do so, add a reward structure that synchronizes with transitions of the model as follows:

```prism
rewards "nbmove"
  [move] true : 1;
endrewards
```

Such a reward was not necessary in the example of the die because, in the latter, we were counting the number of states in a trajectory, whereas here we are counting a specific kind of transitions.

{% task %} You can specify which reward structure to use in the property as follows:

```prism
  R{"nbmove"}=? [F "outOfPower"]
```

The task module handles the next goal of the robot. The variable `fd` takes three values:

-   0 indicates that the robot has currently no objective.
-   1 indicates that the robot must fetch mail from goal `g`.
-   2 indicates that the robot must deliver mail to goal `g`.

Initially, the robot has no goal (`fd=0`). Whenever this is the case, after each move of the robot, a new goal may arrive with probability `f`. When a new goal arrives, one office is selected uniformly at random among {1,2,...,8} and `fd` is set to 1. When the robot reaches its goal (`fd=1` & `p=g`), a new goal is selected uniformly among the offices except the current one and `fd` is set to 2. Finally, when the robot reaches its goal, it delivers the mail and `fd` is set to 0.

{% task %} Compute the average number of complete deliveries that the robot can perform before running out of power. To do that, add a reward structure synchronizing on \[`delivery`\].

{% task %} Write down a CTL formula checking whether there exists a path where the robot delivers an infinite number of mails.

{% task %} Leave the value of the variable of `batteryCharge` unspecified and make an experiment showing the influence of the maximal battery charge on the average number of moves/deliveries.

{% task %} Set the value of `batteryCharge` back to 20. Modify the probabilistic choice of the controller to increase the mean number of moves and mean number of deliveries before running out of power. Can you make these numbers arbitrarily high? Infinite?

## 3\. Part 2: Modelling as an MDP

A more systematic approach to build an efficient controller for the robot is to model the system as a Markov decision process (MDP). In an MDP, some choices of transitions are left unspecified. In the code below, all the probabilities of transitions of the controller are left unspecified.

{% prismCode "courses/aims1617/examples/deliveryRobot/robotMDP.nm", false, true %}

{% task %}Download the file [robotMDP](/courses/aims1617/examples/deliveryRobot/robotMDP.nm) and load it into PRISM. Identify differences with the previous model.

The two things that changed compared to the previous model are the `mdp` keyword and the kind of model used for the controller module. Probabilities have been removed in the transitions and guards of transitions overlap.

{% task %} Compute the probability to reach a state where the robot is out of power using a controller that minimizes this probability, which can be done with the following property:

```prism
Pmin=? [F "outOfPower"]
```

You should get zero probability, meaning that there exists a controller such that the robot never runs out of power. Can you describe this controller? You can check that the number of moves and the number of deliveries before running out of power is infinite.

You can find out more about exporting optimal controllers by reading the [adversaries](/manual/RunningPRISM/Adversaries) section of the manual. Unfortunately, it is not yet possible to import the strategy into the simulator of PRISM using the graphical interface, but the [PRISM-games](/games/) extension supports this functionality.

{% task %} Add a constant `T` denoting time without specifying its initial value in the model and perform experiments measuring the number of expected deliveries depending on `T`. You can use the following property:

```prism
R{"nbdelivery"}max=? [C<=T] / T
```

![Expected deliveries as a function of time](/courses/aims1617/images/Edelivery_T.png)

You should observe that, after a short transient period, the expected number of deliveries increases linearly with the time.

In the following, we set `T` to be equal to 200.

{% task %} Perform experiments measuring the number of expected deliveries, depending of the value of the variable `batteryCharge`.

![Expected deliveries as a function of time](/courses/aims1617/images/Edelivery_autonomy.png)

**Next:** [Part C](/courses/aims1617/power/)
