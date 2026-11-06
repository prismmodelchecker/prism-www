---
layout: layouts/base.njk
title: "Jamming Multi-Channel Radio Systems"
section: casestudies
permalink: /casestudies/jamming/
---
# Jamming Multi-Channel Radio Systems

(Q. Zhu, H. Li, Z. Han and T. Başar)

## Contents

-   [Introduction](#intro)
-   [CSG Model](#simple)
-   [Analysis](#analysis)

**Related publications**: {% cite "KNPS18" %}

## Introduction: { #intro }

A concurrent stochastic game (CSG) model for jamming multi-channel cognitive radio systems is presented in {% cite "ZLHB10" %}. The system consists of a number of channels which can be in either an occupied or idle state. The state of each channel remains fixed within a time slot and between slots is Markovian (i.e. the state changes randomly based only on the state of the channel in the previous slot). A secondary user has a subset of available channels and at each time-slot must decide which to use. There is a single attacker which again has a subset of available channels and at each time slot decides to send a jamming signal over one of them.

To model such systems, concurrency is required for the model to be meaningful, otherwise it is easy for the player whose turn follows the other player’s to 'win'. For example, if the jammer knows what channel is being deployed, then it can simply choose to jam that channel.

## CSG Model { #simple }

We assume there are four channels in total with the user being able to use the first three and the jammer being able to send a jamming signal over the last three.

We model each channel as a separate module. Since the behaviour of each channel is Markovian and not under the control of any player, the commands of the channel modules are unlabelled and not assigned to any player. Furthermore, since the behaviour of the channels is identical, we use module renaming of the first channel to define the second, third and fourth channels.

As well as the channel modules, there are two additional modules not under the control of any player. One keeps track of the current slot (there is an unspecified constant giving the maximum number of slots) and the other tracks the total number of sent messages. In this second module the behaviour is dependent on the choices of the user and the jammer as the state of the channel the user decides to send on. We therefore label the commands in this module by action lists for the user and the jammer and the update is dependent on the primed value of the state of the channel which the user decides to send on. Note we need only consider those action lists for which a message can be sent, e.g. we do not ned to consider any list for which channel the user sends on maches the channel that the jammer decides to send a jamming signal on.

The modules for the user and the jammer decide on what channel to send and jam respectively. The CSG also includes a reward structure which computes the number of messages sent.

{% prismCode "casestudies/examples/jamming.prism", true, true %}

## Analysis { #analysis }

We consider both the maximum probability the user can ensure that at least half their messages are sent and the maximum expected number of messages the user can ensure are sent.

{% prismCode "casestudies/examples/jamming.props", false, true %}

The following graphs plot the results for these properties as the number of slots varies.

![plot: maximum probability the user can ensure that at least half their messages are sent](/images/graphs/jamming_probability.png){.w50}
  
![plot: the maximum expected number of messages the user can ensure are sent](/images/graphs/jamming_expected.png){.w50}

Performing strategy synthesis, we see that, if there are two slots, the optimal behaviour of the user is to initially send on channel 1 (as there is a high chance it will be free in the next slot and the jammer cannot jam this channel). In the next slot it again sends on channel 1, unless channel 1 was in use in the previous slot and both channels 2 and 3 were free and in this case it chooses between channels 2 and 3 uniformly at random. The reason is that in this case there is only a small chance channel 1 will be free when the message is sent and a high chance both that channel 2 and channel 3 will be free and the jammer cannot block both these channels while in all other cases there is either:

-   a high chance that channel 1 will be free and this channel cannot be jammed;
-   a high chance only channel 2 or channel 3 will be free, and since the jammer know this it will jam this channel so it is better to send on channel 1 even though there is only a low chance it will be free.
