---
layout: layouts/base.njk
title: "Aloha protocol"
section: casestudies
permalink: /casestudies/aloha/
---
# Aloha protocol

## Contents

-   [Introduction](#intro)
-   [Concurrent Stochastic Game Model](#concurrent)
-   [Zero-Sum Properties](#zerosum)
-   [Nonzero-Sum Properties](#nonzerosum)

**Related publications**: {% cite "KNPS19", "KNPS20" %}

## Introduction { #intro }

This case study concerns three users trying to send packets using the slotted ALOHA protocol. In a time slot, if a single user tries to send a packet, there is a probability (*q*) that the packet is sent; as more users try and send, then the probability of success decreases. If sending a packet fails, the number of slots a user waits before resending is set according to an exponential backoff scheme. More precisely, each user maintains a backoff counter which it increases each time there is a failure (up to *b*<sub>max</sub>) and, if the counter equals *k*, randomly chooses the slots to wait from {0,1,...,2<sup><em>k</em>-1</sup>}.

## Concurrent Stochastic Game Model { #concurrent }

The PRISM code representing a concurrent stochastic game of this scenario is given below. The model has three parameters: `bcmax` the maximum backoff counter, `q` the probability a packet is sent when two users try and send and `D` used for time-bounded properties. There are three players corresponding to the users trying to send packets.

The PRISM model also includes a reward structure corresponding to the time passage. Notice that time only passes when users are waiting before resending.

{% prismCode "casestudies/examples/aloha_backoff3.prism", true, true %}

## Zero-Sum Properties { #zerosum }

We first consider zero-sum properties in which some of the users try to send their packets and the others try to prevent this from happening. We consider the following properties:

-   minimising the expected time for a coalition of users to send their packets;
-   maximising the probability for a coalition of users to send their packets by a deadline.

These properties are formally specified as follows for the case of three users, where the coalition is either just the first user or the second and third users.

{% prismCode "casestudies/examples/aloha_backoff3_zero.props", false, true %}

Considering the minimum expected time that a coalition can guarantee of eventually sending their packets, the following graphs plot the results for the coalition of only user 1 (left) and the coalition of users 2 and 3 (right) as `q` and `bcmax` vary.

![plot: the minimum expected time that player 1 can guantee of eventually sending its packet](/images/graphs/aloha_zero_expected1.png){.w30} ![plot: the minimum expected time that the coalition of players 2 and 3 can guantee of eventually sending their packets](/images/graphs/aloha_zero_expected23.png){.w30}

The results demonstrate that the expected time increases as the probability a packet is correctly sent decreases and the maximum value of the backoff counter increases. We also see that the expected time for the second coalition is larger, which is two be expected as this coalition consists of two users, rather than one, and therefore is the minimum expected time that can be guaranteed for two packets to be sent.

The graphs below plot the results for both the step-bounded property for the different coalitions of user 1 (left) and users 1 and 2 (right) as `q` and `D` vary for `bcmax=1`, 2 and 4.

![plot: maximum probability user 1 can ensure they send the packet within a deadline (bcmax=1)](/images/graphs/aloha_zero_deadline_bcmax1_p1.png){.w30} ![plot: maximum probability users 2 and 3 can ensure they send their packets within a deadline (bcmax=1)](/images/graphs/aloha_zero_deadline_bcmax1_p23.png){.w30}

![plot: maximum probability user 1 can ensure they send the packet within a deadline (bcmax=2)](/images/graphs/aloha_zero_deadline_bcmax2_p1.png){.w30} ![plot: maximum probability users 2 and 3 can ensure they send their packets within a deadline (bcmax=2)](/images/graphs/aloha_zero_deadline_bcmax2_p23.png){.w30}

![plot: maximum probability user 1 can ensure they send the packet within a deadline (bcmax=4)](/images/graphs/aloha_zero_deadline_bcmax4_p1.png){.w30} ![plot: maximum probability users 2 and 3 can ensure they send their packets within a deadline (bcmax=4)](/images/graphs/aloha_zero_deadline_bcmax4_p23.png){.w30}

## Nonzero-Sum Properties { #nonzerosum }

We next consider nonzero-sum properties where two coalitions (the first user in a coalition on its own and the second and third users in a separate coalition) try and reach their individual goals. Again we consider two classes of properties:

-   each coalition minimising the expected time to send their packets;
-   each coalition maximising the probability of sending their packets by a deadline.

{% prismCode "casestudies/examples/aloha_backoff3_nonzero.props", false, true %}

Through strategy synthesis, we find the collaboration is dependent on `q` and, in the case of deadline properties, `D`. In particular, given more time (i.e., larger values of `D`), there is more chance for the users to collaborate sending in different slots. While, if `q` is large, it is unlikely users need to repeatedly try and send their packets, and therefore again can send in different slots. As the coalition has more messages to send, their probabilities are lower. However, even for two users, the probabilities are different, since, although it is advantageous to collaborate and only one user tries first, if transmission fails, then both users try to send as this is the best option for their individual goals.

![plot: the minimum expected time of player 1 eventually sending its packet](/images/graphs/aloha_nonzero_expected1.png){.w30} ![plot: the minimum expected time of the coalition of players 2 and 3 eventually sending their packets](/images/graphs/aloha_nonzero_expected23.png){.w30}

![plot: maximum probability user 1 sends their packet within a deadline (bcmax=1)](/images/graphs/aloha_nonzero_deadline_bcmax1_p1.png){.w30} ![plot: maximum probability users 2 and 3 send their packets within a deadline (bcmax=1)](/images/graphs/aloha_nonzero_deadline_bcmax1_p23.png){.w30}

![plot: maximum probability user 1 sends their packet within a deadline (bcmax=2)](/images/graphs/aloha_nonzero_deadline_bcmax2_p1.png){.w30} ![plot: maximum probability users 2 and 3 send their packets within a deadline (bcmax=2)](/images/graphs/aloha_nonzero_deadline_bcmax2_p23.png){.w30}

![plot: maximum probability user 1 sends their packet within a deadline (bcmax=1)](/images/graphs/aloha_nonzero_deadline_bcmax4_p1.png){.w30} ![plot: maximum probability users 2 and 3 send their packets within a deadline (bcmax=4)](/images/graphs/aloha_nonzero_deadline_bcmax4_p23.png){.w30}
