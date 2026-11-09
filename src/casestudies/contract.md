---
layout: layouts/base.njk
title: "Probabilistic contract signing (Ben-Or, Goldreich, Micali & Rivest)"
section: casestudies
permalink: /casestudies/contract/
---
# Probabilistic contract signing (Ben-Or, Goldreich, Micali & Rivest)

(Ben-Or, Goldreich, Micali & Rivest)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [The Model](#model)
-   [Analysis Results](#results)

**Related publications**: {% cite "NS02", "NS06" %}

## Introduction { #intro }

Consider several parties on a computer network who wish to exchange some items of value but do not trust each other to behave honestly. *Fair exchange* is the problem of exchanging data in a way that guarantees that either all participants obtain what they want, or none do. *Contract signing* is a particular form of fair exchange, in which the parties exchange commitments to a *contract* (typically, a text string spelling out the terms of the deal). Commitment is often identified with the party's digital signature on the contract. In commercial transactions conducted in a distributed environment such as the Internet, it is sometimes difficult to assess a counter-party's trustworthiness. Contract signing protocols are, therefore, an essential piece of the e-commerce infrastructure.

The main property a contract signing protocol should guarantee is *fairness*. Informally, a protocol between *A* and *B* is fair for *A* if, in any situation where *B* has obtained *A*'s commitment, *A* can obtain *B*'s commitment regardless of *B*'s actions. Ideally, fairness would be guaranteed by the simultaneous execution of commitments by the parties. In a distributed environment, however, simultaneity cannot be assured unless a trusted third party is involved in every communication. Protocols for contract signing are inherently asymmetric, requiring one of the parties to make the first move and thus put itself at a potential disadvantage in cases where the other party misbehaves.

Another important property of contract signing protocols is *timeliness*, or timely termination {% cite "ASW00" %}. Timeliness ensures, roughly, that the protocol does not leave any participant "hanging" in an indeterminate state, not knowing whether the exchange of commitments has been successful. In a timely protocol, each participant can terminate the protocol timely and unilaterally, for example, by contacting a trusted third party and receiving a response that determines the status of the exchange.

In this case study, we focus on *probabilistic* contract signing, exemplified by the probabilistic contract signing protocol of Ben-Or, Goldreich, Micali, and Rivest {% cite "BGMR90" %} (the BGMR protocol). The BGMR protocol consists of two phases: the "negotiation" phase of pre-agreed duration, in which participants exchange their partial commitments to the contract, and the "resolution" phase, in which the judge issues decisions in case one or both of the participants contacted him during the negotiation phase. The BGMR protocol does not guarantee timeliness. On the one hand, the negotiation phase should be sufficiently long to enable two honest participants to complete the exchange of commitments without involving the judge. On the other hand, if something goes wrong (for example, a dishonest party stops responding), the honest party may contact the judge, but then has to wait until the entire period allotted for the negotiation phase is over before he receives the judge's verdict and learns whether the contract is binding on him or not.

We also study a variant of the BGMR protocol that attempts to combine fairness with timeliness by having the judge respond immediately to participants' messages, in the manner similar to state-of-the-art non-probabilistic contract signing protocols. Our analysis uncovers that, for this variant of the BGMR protocol, fairness is guaranteed only if the judge can establish a communication channel with *A*, the initiator of the protocol, and deliver his messages faster than *A* and *B* are communicating with each other. If the channel from the judge to *A* provides no timing guarantees, or the misbehaving *B* controls the network and (passively) delays the judge's messages, or it simply takes a while for the judge to locate *A* (the judge knows *A*'s identity, but they may have never communicated before), then *B* can exploit the fact that the judge does not remember his previous verdicts and bring the protocol to an unfair state with arbitrarily high probability.

Further details are available in {% cite "NS02" %}.

## The Protocol { #protocol }

The objective of the BGMR protocol is to enable two parties, *A* and *B*, to exchange their commitments to a pre-defined contract *C*. It is assumed that there exists a third party, called the *judge*, who is trusted by both *A* and *B*. The protocol is *optimistic*, that is, an honest participant following the protocol specification only has to invoke the judge if something goes wrong, for example, if the other party stops before the exchange of commitments is complete (a similar property is called *viability* in {% cite "BGMR90" %}).

### Privilege and fairness

In the BGMR protocol, it can never be the case that the contract is binding on one party, but not the other. Whenever the judge declares a contract binding, the verdict always applies to both parties. For brevity, we will refer to the judge's ruling on the contract as resolving the contract.

Privilege is a fundamental notion in the BGMR protocol. A party is privileged if it has the power to cause the judge to rule that the contract is binding. The protocol is unfair if it reaches a state where one party is privileged (that is, it can cause the judge to declare the contract binding), and the other is not.

**Definition.** *A contract signing protocol is (**v**,**e**)-fair for A if, for any contract C, if A follows the protocol, then at any step of the protocol in which the probability that B is privileged is greater than **v**, the conditional probability that A is not privileged given that B is privileged is at most **e**.*

Probabilistic fairness implies that at any step of the protocol where one of the parties has acquired the evidence that will cause the judge to declare the contract binding with probability ***p***, the other party should possess the evidence that will cause the judge to issue the same ruling with probability of no less than ***p-e***.

### The Main Protocol

Prior to initiating the protocol, *A* chooses a probability ***v*** which is sufficiently small so that *A* is willing to accept a chance of ***v*** that *B* is privileged while *A* is not. *A* also chooses a value ***a***\>1 which quantifies the "fairness gap" as follows: at each step of the protocol the conditional probability that *A* is privileged given that *B* is privileged should be at least ***1/a***, unless the probability that *B* is privileged is under ***v***. *B* also chooses a value ***b*** such that at any step where *A* is privileged, the conditional probability that *B* is privileged should be at least ***1/b***. Both parties maintain counters, **l(a)** and **l(b)**, initialized to 0.

*A*'s commitment to *C* has the form

|---------------------------------------------------------------------|
| "sig(A)(With probability ***1***, the contract *C* shall be valid)" |

and *B*'s commitment is symmetric. It is assumed that the protocol employs an unforgeable digital signature scheme. All messages sent by *A* in the main protocol have the form

|---------------------------------------------------------------------|
| "sig(A)(With probability ***p***, the contract *C* shall be valid)" |

Messages sent by *B* have the same form and are signed by *B*. If both *A* and *B* behave correctly, at the end of the main protocol *A* obtains *B*'s commitment to *C*, and vice versa. At the abstract level, the main flow of the BGMR protocol is as follows, where in the first message *A* sets ***p(a,1)=v***.

|----------------------|---------------------------------------------------------------------------------------|
| A -&gt; B            | sig(A)(With probability ***p(a,1)***, the contract *C* shall be valid) = ***m(a,1)*** |
| A &lt;- B            | sig(B)(With probability ***p(b,1)***, the contract *C* shall be valid) = ***m(b,1)*** |
| <center>...</center> ||
| A -&gt; B            | sig(A)(With probability ***p(a,i)***, the contract *C* shall be valid) = ***m(a,i)*** |
| <center>...</center> ||
| A -&gt; B            | sig(A)(With probability ***1***, the contract *C* shall be valid) = ***m(a,n)***      |
| A &lt;- B            | sig(B)(With probability ***1***, the contract *C* shall be valid) = ***m(b,n)***      |

Consider the *i*th round of the protocol. After receiving message ***m(a,i)*** from *A*, honest *B* checks whether ***p(a,i)***\>=**l(b)**. If not, *B* considers *A* to have stopped early, and contacts the judge for resolution of the contract. If the condition holds, *B* computes **l(b)** = min(1, ***p(a,i)b***) sets ***p(b,i)***\=**l(b)** and sends message ***m(b,i)*** to *A*.

The specification for *A* is similar. Upon receiving *B*'s message with probability ***p(b,i)*** in it, *A* checks whether ***p(b,i)***\>=**l(a)**. If not, *A* contacts the judge, otherwise he updates **l(a)** = max(***v***,min(1,***p(b,i)a***)), sets ***p(a,i+1)***\=**l(a)** and sends message ***m(a,i+1)***, initiating a new round of the protocol.

The main protocol is optimistic: if followed by both participants, it terminates with both parties committed to the contract.

### The Judge

Specification of the BGMR protocol assumes that the contract *C* defines a cutoff date D. When the judge is invoked, he does nothing until D has passed, then examines the message of the form sig(X)(With prob. ***p***, the contract *C* shall be valid) supplied by the party that invoked it and checks the validity of the signature.

If the judge has not resolved contract *C* before, he flips a coin, that is, chooses a random value ***r(C)*** from a uniform distribution over the interval \[0,1\]. If the contract has been resolved already, the judge retrieves the previously computed value of ***r(C)***. In either case, the judge declares the contract binding if ***p*** >=***r(C)*** and cancelled if ***p*** < ***r(C)***, and sends his verdict to the participants.

Observe that even though the judge produces the same value of ***r(C)*** each time *C* is submitted, the judge's verdict depends also on the value of ***p*** in the message submitted by the invoking party and, therefore, may be different each time. If the judge is optimized using a pseudo-random function with a secret input to work in constant memory as described above, it is impossible to guarantee that he will produce the same verdict each time. To do so, the judge needs to remember the first verdict for each contract ever submitted to him, and, unlike ***r(C)***, the value of this verdict cannot be reconstructed from subsequent messages related to the same contract.

### Timely BGMR

Asokan et al. {% cite "ASW00" %} define *timeliness* as "one player cannot force the other to wait for any length of time - a fair and timely termination can be forced by contacting the third party." The BGMR protocol as specified above does not guarantee timeliness in this sense. To accommodate delays and communication failures on a public network such as the Internet, the duration of the negotiation phase D should be long. Otherwise, many exchanges between honest parties will not terminate in time and will require involvement of the judge, making the judge a communication bottleneck and providing no improvement over a protocol that simply channels all communication through a trusted central server.

If D is long, then an honest participant in the BGMR protocol can be left "hanging" for a long time. Suppose the other party in the protocol stops communicating. The honest participant may contact the judge, of course, but since the judge in the original BGMR protocol does not flip his coin until D has passed, this means that the honest party must wait the *entire* period allotted for negotiation before he learns whether the contract will be binding on him or not. This lack of timeliness is inconvenient and potentially problematic if the contract requires resource commitment from the participants or relies on time-sensitive data.

We therefore also investigate a variant of BGMR that we call TBGMR (for "Timely BGMR"). The only difference between BGMR and TBGMR is that, in TBGMR, the judge makes his decision *immediately* when invoked by one of the protocol participants. Once the verdict is announced and reaches an honest participant, the latter stops communicating. The rest of the protocol is as specified as above. TBGMR protocol is timely. Any party can terminate it unilaterally and obtain a binding verdict at any point in the protocol without having to wait for a long time.

## The Model { #model }

We formalize both the BGMR and TBGMR protocols as Markov decision processes. We then use PRISM on a discretised model to determine if TBGMR is fair.

First, we model the normal behaviour of protocol participants and the judge according to the BGMR protocol specification, except that the judge makes his coin flip and responds with a verdict immediately. A dishonest participant might be willing to deviate from the protocol in an attempt to cheat the honest participant. We assume that *B* is the dishonest participant and *A* the honest one. We equip *B* with an additional set of dishonest actions, any of which he can take nondeterministically at any point in the protocol. To obtain a finite probabilistic model, we fix the parameters chosen by the participants, and discretise the probability space of the judge's coin flips.

### Modelling the dishonest participant

Conventional formal analysis of security protocols is mainly concerned with security against the so called *Dolev-Yao attacker*, following {% cite "DY83" %}. A Dolev-Yao attacker is a nondeterministic process that has complete control over the communication network and can perform any combination of a given set of attacker operations, such as intercepting any message, splitting messages into parts, decrypting if he knows the correct decryption key, assembling fragments of messages into new messages and replaying them out of context, etc.

We assume that the digital signature scheme employed by the protocol to authenticate messages between participants is secure. Therefore, it is impossible for the misbehaving participant to forge messages from the honest participant or modify their content. We will also assume that the channels between the participants and the judge are *resilient*, that is, it is possible for the attacker to delay messages and schedule them out of order, but he must eventually deliver every message to its intended recipient.

Dishonest actions available to a misbehaving participant are thus limited to i) invoking the judge even though the honest party has not stopped communicating in the main flow of the protocol, and ii) delaying and re-ordering messages between the judge and the honest party. The misbehaving participant can nondeterministically attempt any of these actions at any point in the protocol. When combined with the probabilistic behaviour of the judge, the nondeterminism of the dishonest participant gives rise to a Markov decision process.

### Modelling fairness

To model fairness, we compute the maximum probability of reaching a state where the dishonest participant is privileged and the honest one is not. Note that this probability is not conditional on the judge's coin not having been flipped yet, because the dishonest participant may choose to contact the judge even after the coin has been flipped, ***r(C)*** computed and verdict rendered. In contrast, the proof of fairness in {% cite "BGMR90" %} calculates this probability under the assumption that the coin has not been flipped yet.

### Analysis technique

We now describe our method for modelling the protocol in PRISM's input description language. Since PRISM is currently only applicable to finite configurations and the input language allows only integer valued variables, to model the protocol there are two simplifications we need to make.

First, we must discretise the judge's coin by fixing some **N** and supposing that when the judge flips the coin, it takes the value **i/N** for **i=1,...,N** with probability **1/N**. Second, we must fix the parameters of the parties, namely ***v***, ***a*** and ***b***.

Once the parameters ***v***, ***a*** and ***b*** are fixed, the possible messages that can be sent between the parties and the ordering of the messages are predetermined. More precisely, as shown in the figure below, the probability values included in the messages between the parties are known.

![graphic representation of messages being sent](/images/cs/contract.bgmr_messages.gif)

Note that, for ***v***,***a***,***b*** > 0, these values converge to 1 and there are only finitely many distinct values. Therefore, with a simple script, we can calculate all the probability values included in the messages of the two parties. Now, to model the parties in PRISM, we encode the state of each party as the probability value included in the last message the party sent to the other party, that is, the states of *A* and *B* are identified by the current values of **l(a)** and **l(b)** respectively. Formally, the states of each party range from 0 up to k, for some k such that ***p(a,i)***\=**l(a)**, ***p(b,i)***\=**l(a)**\=1 for all i >= k, where *A* is in state 0 when *A* has sent no messages to *B*, and in state i =1,...,k when the last message *A* sent to *B* included the probability value min(1, ***v a(i-1)b(i-1)***). Similarly, *B* is in state 0 when *B* has not sent any messages to *A*, and in state i =1,...,k when the last message *B* sent to *A* included the probability value min(1,***v a(i-1)b(i)***).

Following this construction process, in the case when N=100, the specification of the BGMR protocol used as input into PRISM is given by:

{% prismCode "casestudies/examples/contract_bmgr.nm", false, true %}

Note that there is a nondeterministic choice as to when the judge's coin is flipped, that is, when a party first sends a message to the judge asking for a verdict. Furthermore, once the coin is flipped, the parties cannot send any messages to each other, that is, this model corresponds to the original protocol.

In the timely variant of the protocol (TBGMR), if the misbehaving participant is capable of delaying messages from the judge, then the parties may continue sending messages to each other even after the coin has been flipped. To model this, the two lines corresponding to the parties sending messages are replaced with:

{% prismCode "casestudies/examples/contract_bmgr_timely.nm", false, true %}

## Analysis Results { #results }

Recall, if the coin has been flipped and the last messages sent by parties *A* and *B* include the probability values ***p(a)*** and ***p(b)*** respectively, then in the current state of the protocol *B* is privileged and *A* is not if and only if the value of the coin is in the interval (***p(b)***,***p(a)***\]. Therefore, in the PRISM model we can specify the set of states where *B* is privileged and *A* is not. Let's call this set of states **unfair**. We then use PRISM to calculate the *maximum probability*, from the initial state (where no messages have been sent and the coin has not been flipped), of reaching a state in **unfair**.

We now report on the model checking results obtained using PRISM when considering a number of different parameters for both the BGMR and TBGMR versions of the protocol.

{: columns="4 3" }

| *v*:  | *a*:  | *b*:   | N:    | number of states: | max. probability of reaching an unfair state ||
| ^^    | ^^    | ^^     | ^^    | ^^                | BGMR:                                        | TBGMR: |
|-------|-------|--------|-------|-------------------|----------------------------------------------|--------|
| 0.1   | 1.1   | 1.05   | 10    | 408               | 0.1000                                       | 0.8000 |
| ^^    | ^^    | ^^     | 100   | 3,738             | 0.1000                                       | 0.7000 |
| ^^    | ^^    | ^^     | 1,000 | 37,038            | 0.1000                                       | 0.7080 |
| 0.1   | 1.1   | 1.01   | 10    | 518               | 0.1000                                       | 0.9000 |
| ^^    | ^^    | ^^     | 100   | 4,748             | 0.1000                                       | 0.9000 |
| ^^    | ^^    | ^^     | 1,000 | 47,048            | 0.1000                                       | 0.9180 |
| 0.01  | 1.01  | 1.005  | 10    | 6,832             | 0.1000                                       | 0.6000 |
| ^^    | ^^    | ^^     | 100   | 62,722            | 0.0100                                       | 0.6600 |
| ^^    | ^^    | ^^     | 1,000 | 621,622           | 0.0100                                       | 0.6580 |
| 0.01  | 1.01  | 1.001  | 10    | 9,296             | 0.1000                                       | 1.0000 |
| ^^    | ^^    | ^^     | 100   | 85,346            | 0.0100                                       | 0.9400 |
| ^^    | ^^    | ^^     | 1,000 | 845,846           | 0.0100                                       | 0.9070 |
| 0.001 | 1.001 | 1.0005 | 10    | 101,410           | 0.1000                                       | 0.6000 |
| ^^    | ^^    | ^^     | 100   | 931,120           | 0.0100                                       | 0.7200 |
| ^^    | ^^    | ^^     | 1,000 | 9,228,220         | 0.0010                                       | 0.6840 |
| 0.001 | 1.001 | 1.0001 | 10    | 138,260           | 0.1000                                       | 0.9000 |
| ^^    | ^^    | ^^     | 100   | 1,269,470         | 0.0100                                       | 0.8700 |
| ^^    | ^^    | ^^     | 1,000 | 12,581,570        | 0.0010                                       | 0.9010 |

The probability of reaching a state in **unfair** is maximized, over all nondeterministic choices that can be made by a misbehaving *B*, by the following strategy. As soon as *B* receives the first message from *A*, he invokes the judge, pretending that *A* has stopped communicating and presenting *A*'s message to the judge. In TBGMR, this will cause the judge to flip the coin and announce a verdict immediately. *B* delays the judge's announcement message to *A*, and keeps exchanging messages with *A* in the main flow of the protocol. After each message from *A*, *B* invokes the judge and presents *A*'s latest message, until one of them results in a positive verdict. Depending on his choice of $\beta$, *B* can steer the protocol to a state unfair to *A* with arbitrarily high probability.

The results obtained with PRISM are for a simplified model, where the coin is discretised. Nevertheless, due to the simplicity of this strategy, we were able to write a simple [Matlab](http://www.mathworks.com/) script which calculated the probability of reaching a state which is unfair to *A* under this strategy for a general coin, that is, a coin whose flips take a value uniformly chosen from the \[0,1\] interval.

The graph below shows the probability, for various choices of parameters, of reaching a state in which *B* is privileged and *A* is not. Note that *B* can bring this probability arbitrarily close to 1 by choosing a small ***b***. We assume that the value of ***b*** is constant and chosen by *B* beforehand. In practice, *B* can decrease his ***b*** adaptively. *A* may respond in kind, of course, but then the protocol will crawl to a halt even if *B* is not cheating.

![probability of reaching a state where B is privileged and A is not](/images/graphs/contract.prob.gif)

This attack on TBGMR is feasible because the judge remembers only the value of his coin flip and *not* his previous verdicts. Therefore, *B* induces the coin flip as soon as possible, and then gets the judge to produce verdict after verdict until the probability value contained in *A*'s message is high enough to result in a positive verdict.

### Attacker's tradeoff

Although a Dolev-Yao attacker is assumed to be capable of delaying messages on public communication channels, in practice this might be difficult, especially if long delays are needed to achieve the attacker's goal. Therefore, it is important to quantify the relationship between *B*'s probability of winning (bringing the protocol into a state that's unfair to *A*), and how long *B* needs to delay the judge's messages to *A*. As a rough measure of time, we take the expected number of message exchanges between *A* and *B*. The greater the number of messages *A* has to send before *B* reaches a privileged state, the longer the delay.

We wrote a Matlab script to calculate the expected number of messages sent before a party becomes privileged. The results are shown in the garph below for various values of ***v*** and ***a*** as ***b*** varies. As expected, the lower ***b***, the greater the number of messages that the parties have to exchange before *B* becomes privileged. Recall, however, that lower values of ***b*** result in higher probability that *B* eventually wins.

![expected time until a party is privileged](/images/graphs/contract.time.gif)

The misbehaving participant thus faces a tradeoff. The higher the probability of winning, the longer the judge's messages to the honest participant must be delayed. This tradeoff is quantified by the graph below. As the graph demonstrates, there is a linear tradeoff for a misbehaving *B* between the expected time to win and the probability of winning. If *B* is not confident in his ability to delay the judge's messages to *A* and/or exchange messages with *A* fast enough (before the judge's verdict reaches *A*), *B* can choose a large value of ***b*** and settle for a shorter delay and thus lower probability of steering the protocol into an unfair state.

![expected time againt probability](/images/graphs/contract.timeprob.gif)
