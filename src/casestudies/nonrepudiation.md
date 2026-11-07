---
layout: layouts/base.njk
title: "Non-repudiation protocol"
section: casestudies
permalink: /casestudies/nonrepudiation/
---
# Non-repudiation protocol

(Markowitch & Roggeman)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [PTA (Probabilistic Timed Automaton) Models](#ptas)
-   [TPTG (Turn-based Probabilistic Timed Game) Models](#games)

**Related publications**: {% cite "NPS13" %} {% cite "KNP19" %}<a name="intro"></a>

## Introduction

This case study analyses Markowitch & Roggeman’s non-repudiation protocol for information transfer {% cite "MR99" %}. Our models extend those presented previously in {% cite "LMST04" %}. One party, the originator *O*, sends information to a second party, the recipient *R*. Repudiation is defined as the denial of either party of having participated in all or part of the information transfer. For example, in electronic commerce, if the information represents the transfer of a service, then non-repudiation ensures the client (the recipient) cannot deny receiving the service as a reason for non-payment.

## The Protocol { #protocol }

The protocol of Markowitch and Roggeman is probabilistic and does not require a trusted third party. It achieves the following non-repudiation properties:

-   **ε-fair**:at each step of the protocol run, either both parties receive their expected items, or the probability that a cheating party gains any valuable information about its expected items and the other party gains nothing is at most ε;
-   **time-bounded**: if at least one party behaves correctly, then the protocol will complete within a finite amount of time (with probability 1);
-   **viable**: if both parties behave correctly and finish the protocol, then they both receive their expected items at the end of the protocol (with probability 1).

The steps of the protocol are outlined below. First, to prevent replay attacks, the recipient *R* selects a date *D* which it sends, along with a request, to the originator *O*. Next, *O* randomly selects an integer *n* representing the number of steps of the protocol (which is never revealed to *R* during the execution) and computes functions *f<sub>i</sub>* such that their composition satisfies the following:

<center><em>f<sub>n</sub></em>(message)○(<em>f<sub>n-1</sub></em>(message)○(···○(<em>f<sub>2</sub></em>(message)○ <em>f<sub>1</sub></em>(message))···)) = message</center>

The composition operator ○ needs to be non-commutative to ensure that the recipient cannot start to compute the message until the final message *f<sub>1</sub>*(message) has been received.

To prevent the recipient from gaining an advantage, if the originator does not receive an acknowledgement within a certain time bound (denoted *AD*), the protocol is stopped and and the originator states that the recipient is trying to cheat. The time bound is chosen such that it is greater than the time it takes for a recipient to send a reply, but is not sufficient for the recipient to be able to compute the composition *f<sub>n</sub>*(message)○(···○ *f<sub>i</sub>*(message)···) for any *i<n*, i.e., the recipient does not have time to check if it has received the complete message before sending an acknowledgement.

<table class="prism-table">
<tbody>
<tr><td>&nbsp;&nbsp; The recipient chooses the date <em>D</em><br>&nbsp;&nbsp; 1. <em>R</em> → <em>O</em>: <b>Sign<sub>R</sub></b>(request,<em>R</em>,<em>O</em>,<em>D</em>)<br>The originator checks <em>D</em>, chooses <em>n</em> and computes functions <em>f<sub>1</sub></em>,...,<em>f<sub>n</sub></em><br>&nbsp;&nbsp; 2. <em>O</em> → <em>R</em>: <b>Sign<sub>R</sub></b>(<em>f<sub>n</sub></em>(message),<em>O</em>,<em>R</em>,<em>D</em>)<br>&nbsp;&nbsp; 3. <em>R</em> → <em>O</em>: <b>Sign<sub>R</sub></b>(ack<sub>1</sub>)<br>&nbsp;&nbsp; 4. <em>O</em> → <em>R</em>: <b>Sign<sub>R</sub></b>(<em>f<sub>n-1</sub></em>(message),<em>O</em>,<em>R</em>,<em>D</em>)<br>&nbsp;&nbsp; 5. <em>R</em> → <em>O</em>: <b>Sign<sub>R</sub></b>(ack<sub>2</sub>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⋮<br>&nbsp;&nbsp; 2n. <em>O</em> → <em>R</em>: <b>Sign<sub>R</sub></b>(<em>f<sub>n</sub></em>(message),<em>O</em>,<em>R</em>,<em>D</em>)<br>&nbsp;&nbsp; 2n+1. <em>R</em> → <em>O</em>: <b>Sign<sub>R</sub></b>(ack<sub>1</sub>)<br></td></tr>
</tbody>
</table>

## PTA (Probabilistic Timed Automaton) Models { #ptas }

We first model the protocol as a probabilistic timed automaton (PTA).

We assume that the choice of *n* is made by the recipient according to a geometric distribution with parameter *p* and the minimum time for the recipient to send an acknowledgement is *ad*.

We first consider when both parties act honestly and specify the protocol as the parallel composition of two PTAs, one representing the originator and one the recipient. These synchronise on the actions rec, send and ack, corresponding to the recipient initiating the transaction, the originator sending messages to the recipient and the recipient sending acknowledgements back.

The PRISM model of the honest version is presented below.

{% prismCode "casestudies/examples/repudiation_honest_pta.prism", true, true %}

The probabilistic choice in the originator correctly models selection of n according to a geometric distribution with parameter *p*, since the probability of each message being the last one to be sent is p. Notice that, in the PTA for the honest recipient, an acknowledgement is sent after between ad and AD time units.

We verify the following properties corresponding to successful termination.

{% prismCode "casestudies/examples/repudiation_honest_pta.props", false, true %}

We find that the protocol does terminate with probability 1 and the following plots both the minimum and maximum probability of terminating by time *T* for *p*\=0.01 and *p*\=0.1. We see that increasing the parameter p improves the performance of the protocol when the parties behave honestly. However, as we shall see below, when the recipient behaves maliciously, increasing this parameter comes at a cost since it also increases the likelihood that the recipient gains an advantage.

![plot: probability that the protocol terminates successfully by time T (p=0.01)](/images/graphs/repudiation_honest001.png){.w40}

*Min/max probability of terminating by time *T* for *p*=0.01*{.caption}

  
  
![plot: probability that the protocol terminates successfully by time T (p=0.1)](/images/graphs/repudiation_honest01.png){.w40}

*Min/max probability of terminating by time *T* for *p*=0.1*{.caption}

We next consider two versions of the protocol where the recipient can act maliciously In the first, the recipient can act maliciously (i.e., stop early by not returning an acknowledgement and trying to decode the message). We assume the time to decode the message is *DECODE1*. This corresponds to the PTA described in {% cite "LMST04" %}, where the only malicious behaviour corresponds to stopping early.

The PRISM model is obtained by adding a constant, changing the recipient module and adding a label as shown below.

{% prismCode "casestudies/examples/repudiation_malicious1_pta.prism", false, true %}

In the second, we introduce a more powerful malicious recipient, which has access to a method that takes time *DECODE2* (which is less than *AD*) and with probability 0.25 correctly computes the composition while with probability 0.75 fails to compute the composition.

For this version the PRISM model is obtained by adding constants, changing the recipient module and adding a label as shown below.

{% prismCode "casestudies/examples/repudiation_malicious2_pta.prism", false, true %}

For these models we analyse the maximum probability that the recipient can gain knowledge both eventually and within a time bound as specified by the following properties.

{% prismCode "casestudies/examples/repudiation_malicious_pta.props", false, true %}

The following graph plots the maximum probability the recipient eventually gains knowledge as the parameter *p* varies. The plot demonstrates that the protocol is **ε-fair** with ε equal to *p*. Essentially, all this recipient can do to gain knowledge is to correctly guess which message is the last (which, when a message arrives, is true with probability *p*).

![plot: maximum probability the recipient eventually gains knowledge](/images/graphs/repudiation_malicious.png){.w50}

The following two graphs plot the maximum probability the recipient gains knowledge by a time bound as the parameter *p* varies for the two versions of the malicious recipient.

![plot: probability that the recipient gains knowledge by time T f(version 2)](/images/graphs/repudiation_malicious1.png){.w50}
  
![plot: probability that the recipient gains knowledge by time T (version 2)](/images/graphs/repudiation_malicious2.png){.w50}

In the first graph, the probability of gaining an advantage over time remains constant after the arrival of the first message: since each message has an equal chance of being the last, there is nothing to be gained by waiting for a later one to try and decode. The figures also show that the malicious recipient in the second variant of the model (which has a chance of correctly decoding the message before the deadline) has a greater chance of gaining knowledge, thanks to its additional power.

## TPTG (Turn-based Probabilistic Timed Game) Models { #games }

We now extend the above and model the protocol as a two-player game. This allows both the originator and recipient to make choices which can depend on the history, i.e., the previous behaviour of the parties. The game is naturally turn-based since, in each round, first the originator sends a message after a delay of their choosing and, after receiving this message, the recipient can respond with an acknowledgement after a delay of their choosing. We therefore use turn-based probabilistic timed games (TPTGs) and [PRISM-games](/games/).

TPTGs are an extension of PTAs to incorporate multiple players by allocating locations to different players. TPTGs are specified in PRISM-games in a similar fashion to (discrete-time) turn-based stochastic games (SMGs), by assigning modules and actions to players. The locations under the control of a specific player correspond to those for which the available actions or unlabelled transitions are under the control of that player.

We first extend the 'honest' version of the protocol where both *O* and *R* can choose delays for their messages but do follow the protocol (i.e., send messages and acknowledgements before timeouts occur). We assume the delay of messages is under the control of who send the message, and therefore assigning control of locations to either *O* or *R*, based on which party next sends a message. There is a complication in the location where *O* is waiting and *R* is sending an acknowledgement, as the delay before sending the acknowledgement controlled by *R*, while if the timeout is reached *O* should end the protocol. However, since *O*'s behaviour is deterministic in this location, we assign this location to be under the control of *R*, but add the constraints that an acknowledgement can only be sent before the timeout is reached.

{% prismCode "casestudies/examples/repudiation_honest_tptg.prism", true, true %}

The following properties specify the maximum probability the protocol terminates (both with and without a deadline) and the minimum expected time to termination different coalitions can ensure.

{% prismCode "casestudies/examples/repudiation_honest_tptg.props", false, true %}

Below plots the results for these different coalitions for both the deadline property when *p*\=0.01 and p=0.1 and expected time property for successful termination as the parameter *p* varies. As can be seen, both parties have some control over the time it takes for the protocol to complete and *O* has greater power as it can delay messages longer than *R* (if *R* delays too long then *O* will terminate the protocol stating *R* is cheating).

<center><img style="border:1px solid #333333" src="/images/graphs/repudiation_honest_tptg_deadline001.png" alt="plot:" width="40%" height="40%"> &nbsp;&nbsp; <img style="border:1px solid #333333" src="/images/graphs/repudiation_honest_tptg_deadline01.png" alt="" width="40%" height="40%"><br><br><img style="border:1px solid #333333" src="/images/graphs/repudiation_honest_tptg_expected1.png" alt="" width="40%" height="40%"> &nbsp;&nbsp; <img style="border:1px solid #333333" src="/images/graphs/repudiation_honest_tptg_expected2.png" alt="" width="40%" height="40%"><p>We also extend the two 'malicious' versions of the protocol. The TPTG models follow the same structure as that for the 'honest' version, requiring that, in the locations where <em>O</em> is waiting for an acknowledgement, once the timeout has been reached the only possible behaviour is for the protocol to terminate and <em>O</em> states <em>R</em> is trying to cheat.</p>

{% prismCode "casestudies/examples/repudiation_malicious1_tptg.prism", true, true %}

{% prismCode "casestudies/examples/repudiation_malicious2_tptg.prism", true, true %}

<p>The following properties express the the maximum probability the recipient gains information both with and without a deadline that different coalitions can ensure.</p>

{% prismCode "casestudies/examples/repudiation_malicious_tptg.props", false, true %}

<p>The figures below plot the maximum probability the recipient gains information by time <em>T</em> for versions 1 and 2 respectively. We have included the cases where <em>O</em> works against <em>R</em> (⟨⟨<em>R</em>⟩⟩) and where they collaborate (⟨⟨<em>O,R</em>⟩⟩). As we can see, although <em>O</em> cannot reduce the probability of <em>R</em> obtaining information, it can to some extent increase the time it takes <em>R</em> to obtain this information.</p><center><img style="border:1px solid #333333" src="/images/graphs/repudiation_malicious1_01.png" alt="plot:" width="40%" height="40%"> &nbsp;&nbsp; <img style="border:1px solid #333333" src="/images/graphs/repudiation_malicious1_001.png" alt="" width="40%" height="40%"><br><br><img style="border:1px solid #333333" src="/images/graphs/repudiation_malicious2_01.png" alt="" width="40%" height="40%"> &nbsp;&nbsp; <img style="border:1px solid #333333" src="/images/graphs/repudiation_malicious2_001.png" alt="" width="40%" height="40%"></center></center>
