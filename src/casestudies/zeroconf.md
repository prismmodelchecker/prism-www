---
layout: layouts/base.njk
title: "IPv4 Zeroconf Protocol"
section: casestudies
permalink: /casestudies/zeroconf/
---
# IPv4 Zeroconf Protocol

(Cheshire, Adoba and Guttman)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [The Model](#model)
-   [Model Checking](#results)

-   [Probabilistic reachability](#prob)
-   [Time-bounded probabilistic reachability](#time)
-   [Expected reachability](#expected)

**Related publications**: {% cite "KNPS06" %}

## Introduction { #intro }

The widespread use of the Internet and its technologies has lead to the adoption of the Internet Protocol (IP) suite not only in a global context, but also for *local*, *ad-hoc* networks, such as domestic networks which can connect devices ranging from microwave ovens, televisions, DVD players and hand-held devices. In such a local context, it is desirable that the user is not required to manage the initialisation of the network, which would involve configuring static IP addresses for each device or setting up a DHCP server for the dynamic assignment of IP addresses. This desirable property requires that each device must be able to configure its own unique, local IP address (that is, it must be *self-configuring*), and that the network must be able to maintain the unique assignment of IP addresses to each device even in the situation in which appliances can be connected to or disconnected from the network.

These concerns have lead to the development of a dynamic configuration protocol for IPv4 addresses {% cite "CAG02" %}, which offers a distributed "plug-and-play" solution in which address configuration is managed by individual devices when they are connected to the network. Upon being connected to the network, a device is first required to choose randomly an IP address from a pool of 65024 available addresses (the Internet Assigned Number Authority has allocated the addresses from 169.254.1.0 to 169.254.254.255 for the purpose of such link-local networks). Then the device sends messages to the other devices connected to the network, asking whether any of those devices are currently using the chosen IP address. If no reply is received even after the devices resend such messages three more times, then the device starts using the IP address, initially sending two more messages asserting that the device is claiming the address. The draft standard also specifies the manner in which the device should respond to incoming messages from other devices; the messages will either require the device to reconfigure a new IP address, or, in certain circumstances, the device can defend its ownership of the IP address. We note that the reason for the repeated transmission of messages is primarily to ameliorate the effect of message loss. The protocol is both *probabilistic* and *timed*: probability is used most prominently in the randomised selection process of an IP address by a device, but also features in the probability of message loss, whereas timing issues primarily arise in the definition of the time periods that elapse between repeated retransmissions of the same message.

## The Protocol { #protocol }

A device, henceforth called a *host*, that wishes to configure an IP address first selects randomly an address out of a given set of 65024 possible addresses. The host then sends four ARP (address resolution protocol) packets, called *probes*, to all of the other hosts of the network. Probes contain the IP address selected by the host, operate as requests to use the address, and are sent at two second intervals. A host which is already using the address will respond with an ARP reply packet, asserting its claim to the address, and the original host will restart the protocol by reconfiguring its chosen address and sending new probes. If the host sends four probes without receiving an ARP reply packet, then it commences to use the chosen IP address. It sends confirmations of this fact to the other hosts of the network in the form of more messages called *gratuitous ARPs*. Two gratuitous ARPs are sent in total, also at two second intervals, after the IP address has started to be used. The protocol has an inherent degree of redundancy, for example with regard to the number of repeated ARP packets sent, in order to cope with message loss. Indeed, message loss makes possible the undesirable situation in which two or more hosts use the same IP address simultaneously.

A host which has commenced to use an IP address must reply to ARP packets containing the same IP addresses that it receives from other hosts. In the case that a host using an IP address received a probe with the same address, then it sends an ARP reply packet, and continues using the address. Instead, if the host receives a gratuitous ARP containing the IP address that it is using currently, then it will either *defend* its IP address, or *defer* to the host which sent the conflicting ARP packet. The host may only defend its address if it has not received a previous conflicting ARP packet within the previous ten seconds; otherwise it is forced to defer. A defending host replies by the sending a gratuitous ARP, thereby indicating that it is using the IP address. A deferring host does not send a reply; instead, it ceases using its current IP address, reconfigures another IP address and restarts the protocol.

As indicated by the draft standard {% cite "CAG02" %}, the protocol can operate in the context of any IEEE 802 network technology, or similar technology in which the transfer rate is at least 1Mb/s, which has a round-trip latency of at most one second, and which supports ARP, such as Ethernet.

## The Model { #model }

As in {% cite "ZV03" %}, we assume a "broadcast"-based communication medium with no routers (for example, a single wire), in which messages arrive in the order in which they are sent. In contrast to the analysis of the protocol included in Bohnenkamp et al. {% cite "BSHV03" %}, we model the possibility that a device could surrender an IP address that it is using to another host; and in contrast to timed-automata-based analysis of Zhang and Vaandrager {% cite "ZV03" %}, we model some important probabilistic characteristics of the protocol, and consider parameters more faithful to the standard (such as the maximum number of times a device can witness an ARP packet with the same IP address as that which is wishes to use before "backing off" and remaining idle for at least 1 minute).

When modelling the dynamic configuration protocol, we use a probabilistic timed automaton model which refers to *integer variables* and *urgent events*. Integer variables with bounded ranges, which can be tested within enabling conditions and reset by edge distributions, can be represented syntactically within the probabilistic timed automaton framework above by encoding the values of such variables within locations {% cite "Tri98" %}; instead, urgent events require minor adjustments to the semantics of probabilistic timed automata (see {% cite "KNS02a" %}).

Using the digital clocks approach presented in {% cite "KNPS06" %}, we obtain a PRISM model (a finite-state Markov decision process) which preserves both probabilistic and expected reachability properties of the dense time semantic model of the PTA.

### Modelling Assumptions

**The hosts:** we consider two scenarios: in the first the number, **N**, of (abstract) hosts which have chosen their IP addresses equals **1000**, and in the second **N** equals **20**. In each case we suppose that these abstract hosts always defend their addresses (do not reconfigure) and one concrete host trying to configure an IP address. Therefore, when the concrete host picks a new address, the probability of this address being fresh (not in use by another host) is **(8128-N)/8128**. We also assume that the concrete host never picks the same IP address twice as this happens with a very small probability. Also, the (continuous) uniform choice over \[0,2\] (made before the concrete host sends its first probe) is abstracted to a discrete uniform choice over {0,1,2}.

**IP addresses:** following from the above assumptions we require only three abstract IP addresses (0,1 and 2) which correspond to the following sets of IP addresses:

-   0 - the IP addresses of the abstract hosts which the concrete host previously tried to configure;
-   1 - an IP address of an abstract host which the concrete host is currently trying to configure;
-   2 - a fresh IP address which the concrete host is currently trying to configure.

**Message:** following the standard we suppose that it takes between 0 and 1 second to send a message between any hosts (where the choice is nondeterministic). Since the abstract hosts have already picked there IP address and always defend them, we can suppose that the concrete host will never receive probes. It then follows that we do not need to record they type of message being sent only the IP address in the message and whether it is from the concrete host to the abstract hosts or vice versa.

We suppose that the hosts have buffers to store the messages that they want to send. The concrete host can send a message to all the abstract hosts at the same time, while one message can be sent either to or from the concrete host at a time. We have chosen the size of the buffers such that the probability of any other the buffers becoming full is negligible.

In the standard {% cite "CAG02" %} there is no mention of what the host should do with the messages, which corresponding to choosing its current IP address (i.e. the probes and two gratuitous ARP packets specified in the standard) which are in its out buffer (i.e. those that have yet to be sent), when it decides to choose a new IP address. However, when the host does reconfigure, unless it picks the same IP address which happens with a very small probability, these messages are not relevant and, in fact, can be harmful by both slow down the network and making hosts reconfigure when they do not need to. We therefore considered two different versions of the network: one where the host does not do anything about these messages (**No\_Reset**) and the another where the host deletes these messages when it it about to choose a new IP address (**Reset**).

### Probabilistic Timed Automata Representing the Concrete Host

The model for the concrete host is shown below.

![timed automaton representing the host](/images/cs/zeroconf.host.gif)

The host commences in the location **RECONF** (the double border indicates that the initial location). The location **RECONF** is a committed location, and therefore must be left immediately. In **RECONF**, the host chooses a new IP address by moving to the location **CHOOSE** if it has experienced less than ten address collisions, and to **CHOOSEWAIT** otherwise. These transitions are labelled with the event *reset* to inform the environment that the host's buffer is to be reset (all messages in its buffer are to be removed).

In both **CHOOSE** and **CHOOSEWAIT**, the address selection is represented by the assignment *iph* := **RAND**(1,2), which corresponds to the host randomly selecting an IP address. That is, with probability **N**/**65024** the host sets *iph* equal to **1** (selects an IP address already in use) and, with probability (**65024**\-**N**)/**65024**, sets *iph* equal to **2** (selects a fresh IP address). Note that, in **CHOOSEWAIT**, since the host has already experienced at least ten address collisions, it waits **60** seconds before choosing a new address. The assignment to the clock *x* (a uniform choice between **0**,**1**,**2**), which labels the transitions from **CHOOSE** and **CHOOSEWAIT** to **WAITSP**, approximates the random delay of between **0** and **2** made by the host before sending the first probe.

In the location **WAITSP**, the host sends **K** probes at **2** second intervals (denoted by the self-loop labelled with *send*). The host may also receive packets by means of the event *rec*. If it receives a packet which has a different IP address (*ip* ≠ *iph*), then the host ignores the packet (and remains in **WAITSP**); however, if the packet has the same address, the host immediately reconfigures (moves to **RECONF**).

After sending the **K**th probe, the host remains in location **WAITSP** for **2** seconds before moving to **WAITSG**. The host then sends two ARPs separated by a delay of **2** seconds. Note that the variable *probes* is used to count these ARPs. After these ARPs have been sent, the host moves to **USE**. However, if while in **WAITSG** the host receives a packet with the same IP address, it moves to **RESPOND**. In this location, the host can decide to reconfigure (return to **RECONF**), or defend its IP address (by sending an ARP packet) if it has either not yet defended the address (*defend*\=**0**) or if **10** seconds have passed since it previously defended the address (*y* ≥ **10**). This defence takes the form of the sending of a defending packet, as denoted by the *send* labelled transition from **RESPOND** to **WAITSG**.

### Probabilistic Timed Automata Representing the Environment

The model for the environment is shown below.

![timed automaton representing the environment](/images/cs/zeroconf.env.gif)

The dotted box labelled with three transitions which surrounds the model denotes that these transitions are available in all of the locations of the model. More precisely, in all locations, the environment may: receive a *send* event from the concrete host and, if the host's buffer is not full (*n* < **8**), add the corresponding packet to the buffer (otherwise it is lost); receive a *reset* event and clear the buffer of the concrete host (*n*:=**0**) and, since we assume that the concrete host will never choose the same IP address twice, set the IP address in any packet being sent or to be sent to type 0 (i.e. *ip*:=**0**, *m<sub>1</sub>*:=**0** and *m<sub>0</sub>*:=**min**(*m<sub>0</sub>*{+}*m<sub>1</sub>*,**20**)).

The behaviour of the environment commences in the location **IDLE**. The transition which probabilistically moves to either **IDLE** or **CONC\_SEND** corresponds to the sending of a packet from the concrete host's buffer. The **urgent** labelling denotes that the transition should be taken as soon as it is enabled, i.e. it should be taken as soon as there is a packet to send. Similarly, the transitions which move probabilistically to either **IDLE** or **ENV\_SEND** correspond to an abstract host sending a packet, and are again urgent. There are two such transitions, since the address in the packet can either be of type 0 (*m<sub>0</sub>*\>**0**) or 1 (*m<sub>1</sub>*\>**0**). For each of these transitions, the loop (remaining in **IDLE**) corresponds to the packet being lost by the medium, while the other edge corresponds to the packet being sent correctly (therefore the required buffers are updated when one of these transitions is taken). Note that, since each of these transitions corresponds to a message from a different host, when more than one of these transitions is enabled, there is a nondeterministic choice as to which one is taken. We vary the probability of message loss depending on the verification instance. Once in either **CONC\_SEND** or **ENV\_SEND**, after a delay of between **0** and **1** seconds, the model returns to **IDLE**; this corresponds to the message taking between **0** and **1** seconds to send.

### PRISM Models

The PRISM model for is given below (this also includes details on how to construct the **No\_Reset** model).

{% prismCode "casestudies/examples/zeroconf.nm", false, true %}

Note that, to change between the **Reset** and **No\_Reset** models, change the number of probes sent (**K**), size of the buffers, the number of abstract hosts or the timing delays of the protocol one need only change the constants given at start of the files.

The table below shows statistics for the MTBDD which represents each model we have built, in terms of the number of states, the total number of **nodes** and the number of **leaves** (terminal nodes), for both the models as the number of probes varies. Note that, the probability of message loss and the number of abstract hosts (assuming each is greater than 0) does not influence these statistics.

| K   | No_Reset ||| Reset  |||
| ^^  | States   | Nodes   | Leaves | States | Nodes | Leaves |
|-----|----------|---------|--------|--------|-------|--------|
| 1   | 31,954   | 73,318  | 6      | 451    | 679   | 6      |
| 2   | 89,586   | 207,825 | 6      | 670    | 997   | 6      |
| 3   | 179,774  | 416,688 | 6      | 879    | 1,305 | 6      |
| 4   | 307,768  | 712,132 | 6      | 1088   | 1,613 | 6      |

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

| K   | No_Reset || Reset    ||
| ^^  | Time (s) | Iter.s | Time (s) | Iter.s |
|-----|----------|--------|----------|--------|
| 1   | 6.703    | 530    | 1.133    | 138    |
| 2   | 10.42    | 317    | 1.171    | 142    |
| 3   | 14.52    | 288    | 1.226    | 146    |
| 4   | 35.09    | 334    | 1.205    | 150    |

## Model Checking { #results }

We now report on the model checking results obtained using PRISM when considering a number of different parameters. We consider three different performance measures:

-   [the probability of the concrete host using an IP address which is being used by another host](#prob)
-   [the probability of the concrete host using a fresh IP address within time **T**](#time)
-   [the expected cost of using an IP address](#expected)

In each case, we calculate upper and lower bounds on these measures which since the PRISM model is an abstraction will give upper and lower bounds on an actual implementation. In the case of the expected cost, as in {% cite "BSHV03" %}, this is the expected time to start using an IP address with an additional cost (**E**) associated with using an IP address which is already in use (we consider two different values for **E**, namely 1e+6 and 1e+12).

## Probability of the host using an IP address already in use { #prob }

To calculate the minimum and maximum probability of the host using an IP address already in use by checking the following properties:

`Pmin`\=?\[ `true` `U` (`l=4` & `ip=1`) \] and `Pmax`\=?\[ `true` `U` (`l=4` & `ip=1`) \]

## Probability of not choosing a fresh address by time **T** { #time }

To calculate the minimum and maximum probability of not choosing a fresh address by time **T** we add the following module to our PRISM source code (where `B≥T`):

{% prismCode "casestudies/examples/zeroconf_timer.nm", false, true %}

and then check the following properties:

`Pmin`\=?\[ !(`l=4` & `ip=2`) `U` `t`\>`T` \] and `Pmax`\=?\[ !(`l=4` & `ip=2`) `U` `t`\>`T` \]

In the graphs below, we haver plotted the minimum and maximum probability of not choosing a fresh IP address by time **T**, as **T** varies from 0 to 50 seconds for the model **Reset** when **N**\=1,000.

-   **Probability of message loss equals 0.1**  
      
    ![graph for minimum probabilities (100 hosts)](/images/graphs/zeroconf.time1000.min.0.1.png)

    ![graph for maximum probabilities (100 hosts)](/images/graphs/zeroconf.time1000.max.0.1.png)
    
-   **Probability of message loss equals 0.001**  
      
    ![graph for minimum probabilities (1000 hosts and messages lost with probability 0.001)](/images/graphs/zeroconf.time1000.min.0.001.png)

    ![graph for maximum probabilities (1000 hosts and messages lost with probability 0.001)](/images/graphs/zeroconf.time1000.max.0.001.png)
    

## Expected cost of choosing an IP address { #expected }

To calculate the expected costs we check the following properties:

`Rmin`\=?\[ `F` `l=4` \] and `Rmax`\=?\[ `F` `l=4` \]

In the graphs below, when the probability of message loss equals 0.1 and 0.001, we give the minimum and maximum cost of choosing an IP address for the model **Reset**.

-   **Probability of message loss equals 0.1 and E=1e+6**  
      
    ![Expected Costs (Probability of message loss equals 0.1 and  E=10^6)](/images/graphs/zeroconf.cost6.0.1.png)
    
-   **Probability of message loss equals 0.1 and E=1e+12**  
      
    ![Expected Costs (Probability of message loss equals 0.1 and  E=10^12)](/images/graphs/zeroconf.cost12.0.1.png)
    
-   **Probability of message loss equals 0.001 and E=1e+6**  
      
    ![Expected Costs (Probability of message loss equals 0.001 and  E=10^6)](/images/graphs/zeroconf.cost6.0.001.png)
    
-   **Probability of message loss equals 0.001 and E=1e+12**  
      
    ![Expected Costs (Probability of message loss equals 0.001 and  E=10^12)](/images/graphs/zeroconf.cost12.0.001.png)
