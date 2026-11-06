---
layout: layouts/base.njk
title: "Human-in-the-Loop UAV Mission Planning"
section: casestudies
permalink: /casestudies/human-uav/
---
# Human-in-the-Loop UAV Mission Planning

*[work with Lu Feng, Laura Humphrey and Ufuk Topcu]*{.note}

## Contents

-   [Introduction](#intro)
-   [MDP Models](#mdp)
-   [Stochastic Game Models](#game)

**Related publications**: {% cite "FWHT15" %}

## Introduction { #intro }

This case study is based on {% cite "FWHT15" %} and considers the control of an unmanned aerial vehicle (UAV) that is interacting with a human operator. The models capture a simple scenario involving road network surveillance by a UAV. Depending on the type (i.e., probabilistic and/or nondeterministic) of knowledge about the uncertainties and imperfections in the human-automation interactions, we use abstractions based on Markov decision processes and augment these models to stochastic two-player games. We synthesize optimal UAV control protocols using both PRISM (for MDP models) and [PRISM-games](/games/) (for game models).

The following figure shows a map of the road network considered in this case study, which has six surveillance waypoints labeled w1, w2, ..., w6. Approaching a waypoint from certain angles may be better than others, e.g., in order to obtain desired look angles on a waypoint target using an ellipsoidal loiter pattern. Angles of approach are thus discretized into eight angle points around each waypoint. Roads connecting waypoints are discretized into road points r1, r2, ..., r9. Red polygons represent “restricted operating zones” (ROZs), areas in which flying the UAV may be dangerous or lead to a higher chance of being detected by an adversary.

![A road network for UAV missions](/images/cs/human-uav-map.png){.px421}

We assume the UAV has a certain degree of autonomy that is used to fulfill most of the piloting functions, e.g., maintaining loiter patterns around waypoints, selecting most of the points that comprise the route, and flying the route. The human operator primarily performs sensor tasks, e.g., steering the onboard sensor to capture imagery of targets at waypoints. However, the operator retains the ability to affect some of the piloting functions of the UAV. The operator decides how many loiters to perform at each waypoint, since more loiters may be needed if the operator is not satisfied with the sensor imagery obtained on previous loiters.

The optimal UAV piloting plan depends on mission objectives (e.g., safety, reachability, coverage) and operator characteristics (e.g., workload, proficiency, and fatigue). The concrete UAV mission objectives we consider in this case study include surveillance of the whole road network with minimum fuel consumption, or flying to certain waypoints while trying to avoid ROZs. We investigate the effects of operator characteristics on UAV mission performance, and the trade-offs between multiple mission objectives.

## MDP Models { #mdp }

We model the operator-UAV interaction as a Markov decision process (MDP). The operator's accuracy of performing sensor image analysis varies at different workload levels, represented by **accu\_load1** (for the low workload) and **accu\_load2** (for the high workload). Moreover, due to operator fatigue, the accuracy would be discounted by a factor of **fd**, after the operator analyzes certain number of images (**COUNTER**). The operator may also choose which road to go at certain checkpoint (e.g., w2 and w6) following a certain probability distribution. The UAV model encodes all the possible routes shown in the road network map. We assume that the UAV may fly in or out of a waypoint via any angle (with a uniform distribution).

The MDP model for the operator-UAV interaction is shown below.

{% prismCode "casestudies/examples/uav-mdp.nm", true, true %}

To compute the expected time of completing the mission (e.g., covering waypoints w1, w2 and w6), we use the PRISM property:

{% prismCode "casestudies/examples/uav-mdp-time.pctl", false, false %}

We can also study the Pareto curve of two mission objectives (e.g., minimising the expected mission completion time vs. minimising ROZ visits) to analyze their trade-offs, using the multi-objective query:

{% prismCode "casestudies/examples/uav-mdp-multi.pctl", false, false %}

An example of the results from the latter query is shown below, where L and H refer to the probabilities of capturing good quality imagery when operating at low and high workload levels, respectively. See {% cite "FWHT15" %} for more details.

![Pareto curve: minimising the expected mission completion time vs. minimising ROZ visits](/images/cs/human-uav-pareto1.png)

## Stochastic Game Models { #game }

In the MDP models, we assume that the operator picks a road at each checkpoint for the UAV with some predefined probability distribution. In reality, however, it may be difficult to obtain and enforce such a distribution. We augment the MDP models as two-play stochastic games, in which we do not assume any distribution and allow the operator to choose any road/angle points nondeterministically. At each checkpoint, with certain delegation probability **del**, the operator delegates the UAV automation the task of picking the next road; otherwise, the route would be decided by the operator.

The stochastic game model for the operator-UAV interaction is shown below.

{% prismCode "casestudies/examples/uav-game.prism", true, true %}

The properties explained above, for MDPs, are then expressed as follows:

{% prismCode "casestudies/examples/uav-game.props", false, false %}
