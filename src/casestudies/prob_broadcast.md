---
layout: layouts/base.njk
title: "Probabilistic Broadcast Protocols"
section: casestudies
permalink: /casestudies/prob_broadcast/
---
# Probabilistic Broadcast Protocols

*[Contributed by Ansgar Fehnker and Peng Gao]*{.note}

**Related publications**: {% cite "FG06" %}

## Contents

-   [Introduction](#intro)
-   [Basic Protocol](#basic)
-   [Synchronous without collision](#no_coll_sync)
-   [Synchronous with collision](#coll_sync)
-   [Lossy Channel](#coll_sync_lossy)
-   [Asynchronous execution](#coll_async)
-   [Unreliable Timing](#coll_sync_delay)
-   [Properties](#properties)
-   [Results](#results)

## Introduction { #intro }

This work describes formal probabilistic models of flooding and gossiping protocols, and explores the influence of different modelling choices and assumptions on the results of performance analysis. We use PRISM, for the formal analysis of protocols and small network topologies, and used in addition Monte-Carlo simulation, implemented in Matlab, to establish if the results and effects found during formal analysis extend to larger networks.

Many protocols for wireless sensor networks employ some form of the very simple flooding protocol to acquire or distribute information. Flooding a message means that each node that receives a message, propagates it to all its neighbours by broadcast. This introduces an unnecessary redundancy, because a node may receive a message multiple times. Gossiping protocols introduce a random element to reduce this redundancy. Gossiping means that each node decides with a certain probability to forward a message on or not. This reduces the probability for node to receive a message multiple times, thus the redundancy and cost.

We different modelling choices and its influence on the results, in particular the effect of collisions, unreliable channels versus probabilistic broadcast, and the influence of timing. This analysis can explain why the performance result of gossiping for a perfectly synchronised network without collision, are similar to the result on a network with randomised delay and collision, although the actual behaviour is vastly different.

The following are the models and a brief description of the models used in {% cite "FG06" %}.

## Basic Protocol { #basic }

Gossiping is a simple protocol that uses probabilistic broadcast to send or request information in a wireless network. The gossiping protocol can be informally summarised as follows:

-   The source node broadcasts the message or request to all its neighbours. It then proceeds to sleep.
-   Nodes that receive a message choose
    -   with probability psend to forward the received message, and
    -   with probability 1 - psend to ignore the message.In either case the node proceeds to sleep.

Gossiping is equal to flooding, if psend is equal to 1.

## Synchronous without collision { #no_coll_sync }

The baseline model is a synchronous PRISM model for gossiping without collision. Synchronous means that sending and receiving is organized in rounds. All nodes that receive a message at one point in time, will choose at the same time whether to forward the message, and if the decide to forward it, they all forward it at the same time.

The following models are for a 3 by 3 grid, and only direct neighbours can receive each others messages.

One node, node0 is the gateway and sends regardless of whether it received a message. All other nodes run the plain gossiping model.

{% prismCode "casestudies/examples/broadcast.no_coll_sync.pm", true, true %}

## Synchronous with collision { #coll_sync }

The first model assumes that a node receives a message when at least one of the neighbours sends. However, in wireless networks, if two or more neighbours send, all a node will receive is noise. The guard of the node changes from send0+send2+send4 >= 1 to send0+send2+send4 = 1

{% prismCode "casestudies/examples/broadcast.coll_sync.pm", true, true %}

## Lossy Channel { #coll_sync_lossy }

In the first two models a node either send to all of its neighbours or to none. In a lossy channel model each link between two nodes has its own channel, and messages can get along each of the channel, i.e. reception of a message by different nodes is no longer correlated. To model this we introduce a variable 'buf' for each channel, that contains the value 1, if a message has been sent. The model includes one module for the channel between each pair of neighboring nodes and a scheduler is used to alternate between updates of the nodes and updates of the channels.

{% prismCode "casestudies/examples/broadcast.coll_sync_lossy.pm", true, true %}

## Asynchronous execution { #coll_async }

All models presented thus far have been synchronous in the sense that all nodes (and all channels) update their state synchronously. Nodes that receive a message at the same time, will respond to it at the same time. In a wireless network such synchronicity is typically absent. Nodes operate independently and have each their own clock that might drift or jitter.

The integer variable send1 now records if no message, one message, or more than one message has been received, with send1=2 if a collision occurred. If a node detects a collision, it may return to the initial state. Since this is an internal action, it has no synchronisation label. If a node did receive exactly one message it can broadcast. Node 1 synchronises on label msg1 with the neighbouring nodes to realise a broadcast.

{% prismCode "casestudies/examples/broadcast.coll_async.nm", true, true %}

## Unreliable Timing { #coll_sync_delay }

Assuming any execution order is a very conservative assumption. Although clocks may drift and jitter, they all proceed positive rate in about the same range. In this section we will consider different timing models for gossiping that contain different types of random delay.

To model delay we use a simple memoryless delay. This means that the when a message receives a message it can decide to delay transmission with a certain probability pdelay.

{% prismCode "casestudies/examples/broadcast.coll_sync_delay.pm", true, true %}

## Properties { #properties }

The main property that we checked was with what probability the message arrived at what node, in which case variable active eventually becomes 0.

{% prismCode "casestudies/examples/broadcast.pctl", false, true %}

For the non-deterministic model we computed of course maximal and minimal probabilities.

## Results { #results }

In this paper we compare the various PRISM models, and the PRISM models with the results of a Monte-Carlo Simulation for large networks. It the following we show some of the results for the PRISM model.

The following figure depicts the results for nine nodes. Node 0 initiates the protocol. The figure depicts the reception probability for the different nodes for different psend. Variable psend ranges from 0.1 to 1, in increments of 0.1.

![Graph](/images/graphs/broadcast.no_coll_sync.png)

If we introduce collision the results look drastically different, especially for nodes that are prone to collision, i.e. node 4 and 8. Note for example that for node 8 the probability drops as soon as psend exceeds 0.7.

![Graph](/images/graphs/broadcast.coll_sync.png)

The results for non-deterministic execution order show, that synchronicity is a strong optimistic assumption. Especially if 'psend' has a high value the best-case and worst case execution order yield fairly probabilitie. If psend is 1, the probability ranges from 0 to 1, i.e. from aguaranteed collision to a guaranteed absebse of collisions. The figure below shows upper and lower bound for psend >0.5.

![Graph](/images/graphs/broadcast.coll_async.png)

For unreliable timing we fixed psend to be equal to 0.8, and had pdelay vary from 0.1 to 0.9 in 0.1 increments.

![Graph](/images/graphs/broadcast.coll_drift.png)

The upper and lower bound, are the results that we obtained with the asynchronous model. The dashed line is the result for the synchronous model with collision. The model with probabilistic delay shows that the bigger the delay is, the more the probability converges to the upper bound. An increased delay is thus effective to reduce the probability of collision.

For more results and a comparison to results obtained with Monte-Carlo simulation please refer to the paper itself {% cite "FG06" %}.
