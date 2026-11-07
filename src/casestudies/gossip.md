---
layout: layouts/base.njk
title: "Gossip protocol"
section: casestudies
permalink: /casestudies/gossip/
---
# Gossip protocol

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [The PRISM Model](#prismmodel)
-   [Model Checking](#results)

**Related publications**: {% cite "KNP08d" %}

## Introduction { #intro }

Gossip protocols are a class of communication protocols which, inspired by the way that gossiping propagates messages in social networks, disseminate content through a network based on periodic exchanges of data with random members of the network. These techniques are designed to function robustly and efficiently on networks that are large, heterogeneous and dynamic in nature. They are hence becoming increasingly important due to the prevalence of, for example, mobile ad-hoc networks, wireless sensor networks and peer-to-peer technologies.

Gossip-based protocols require each node of the system to periodically exchange information with a number of its peers. The choice of which peers nodes communicate with is crucial to how information gets disseminated through the network. Theoretically, a node could randomly select a subset of all the available nodes in the network. In practice, however, this is not feasible since it would require each node to store a complete network membership table which is expensive to store and maintain. In this case study we consider the *peer sampling* framework of {% cite "JGKS07" %} where each node instead maintains a relatively small local membership table providing a partial view of the network which is periodically updated using a gossiping procedure.

## The Model { #model }

We assume a network of *N* nodes, each with an address that is required for sending a message to it (as in, for example, a wireless network). Each node maintains a *partial view* of the network: a list of up to *c* (*<N*) *node descriptors*, each of which comprises a node's network address and an *age* that represents the freshness of the descriptor.

Periodically each node will execute a gossiping algorithm which exchanges the information contained in their views. This allows information about the topology of the network (and changes to it) to be propagated between nodes. The fundamental idea behind gossip-based protocols is that each node passes information to a small, random subset of the other nodes. This prevents overloading of the network with large numbers of superfluous messages.

The framework of {% cite "JGKS07" %} includes a number of design choices regarding the gossip protocol. For example *peer selection*, which is the choice of a node to exchange views with, can be done at random or by selecting the node in the view with the oldest age. We will assume a random choice. Several strategies also exist for *view propagation*, which defines how two nodes exchange their views, e.g. *push* or *pushpull*: one- or two-way exchange of views between the sending and receiving node. We assume that the sending node pushes the whole of its view to the receiving node. Finally, the receiving node requires a strategy for *view selection*, which combines the incoming and the existing view information. In our model, we in fact use *hop-counts* as a coarse (bounded) measure of the age of each node descriptor. A receiving node increments the the hop-count of all the incoming descriptors, merges these with the descriptors in its own view (keeping the entry with the youngest count in cases of duplication) and then keeps the *c* newest entries from the combined set.

With regards to the timing of the protocol, we assume that the exchange of data between nodes occurs periodically (with some fixed period) and that each node sends its data exactly once in each round of execution. Such a scheme can be achieved in practice through synchronisation of local clocks. Due to the distributed nature of the system, however, the order in which the nodes participate in each round is unknown (and may be different each time).

The gossip protocol therefore exhibits both probabilistic behaviour (random peer selection) and nondeterministic behaviour (scheduling of nodes within a round) and is naturally modelled as a Markov decision process (MDP).

## The PRISM Model { #prismmodel }

We opt to build a small, but detailed, model of the system. The model comprises several components: one for for each node in the network and one representing a scheduler who chooses (nondeterministically) the order in which nodes execute the protocol. The state of each node in the network includes its current view, information about which part of the protocol it is currently executing and a buffer to store incoming data from other nodes. The scheduler simply keeps track of which nodes have sent data in the current round. For simplicity, we assume that the sending and updating of views is an atomic step, i.e. throughout the process of one node sending its view to another, no other communication occurs in the network.

Because of the detailed nature of the model and the corresponding state space size, we consider only very small sizes of network (*N*\=3,4) and fix a local view size of *c*\=2. It is possible, though, that anomalies observed in these small models will also be exhibited by networks of a more realistic size. As regards the initial configuration of the model (i.e. the initial local views of each node), we assume that one node is \`public' and that all other nodes know the address of this node (but it is not aware of the others). This configuration is suitably realistic and ensures that a connected network is possible.

The PRISM model for the four node network is given below.

{% prismCode "casestudies/examples/gossip4.nm", true, true %}

## Model Checking { #results }

We analyse the performance of the gossip protocol concentrating on how the topology of the network induced by the local views of the nodes varies over time. More precisely, we investigate:

-   the maximum path length (longest route between nodes)
-   the time for the network to become connected.

For the former, we demonstrate an analysis of the best- and worst-case behaviour of the model, and how this relates to the average case. For the latter, we show how obtaining best and worst-case adversaries (schedulers) of the MDP can help to identify the scenarios in which the best and worst cases occur.

These property can be computed by PRISM through the following formulae:

{% prismCode "casestudies/examples/gossip4.pctl", false, true %}

-   **The maximum path length (longest route between nodes).**
    
    In the graph below, show the full set of these results for *N*\=3 and *N=4* nodes, respectively. The thicker solid lines show the minimum and maximum expected longest path length after *T* time-steps, for a range of values of *T*. In between these, the thinner solid line shows the average (i.e. expected) value for the same time points. The dashed lines indicate the standard deviation. The average values can be calculated by replacing the nondeterminism in the scheduler component of the PRISM model with uniform probabilistic choices, yielding a DTMC instead of an MDP. While the standard deviation is computed through the reward structure max\_path\_len\_sq and the equivalence
    
    <center>σ(X)<sup>2</sup> = <b>E</b>(X<sup>2</sup>) - <b>E</b>(X)<sup>2</sup>.</center>
    
    See the properties file above for further details.
    
    -   N=3
        
        ![graph plotting maximum path length (N=3)](/images/graphs/gossip.path_len3.gif)

    -   N=4
        
        ![graph plotting maximum path length (N=4)](/images/graphs/gossip.path_len4.gif)

    -   N=4 (zoom)
        
        ![graph plotting maximum path length (N=4) zoom](/images/graphs/gossip.path_len4_zoom.gif)
    
    For the purposes of comparison, below we have included the average results over 5, 50, 500 and 5,000 simulation runs for the network of 4 nodes obtained with PRISM's discrete-event simulation engine.
    
    ![graph plotting maximum path length (N=4) simulation](/images/graphs/gossip.path_len4_sim.gif)
    
    -   **The time for the network to become connected.**
        
        We compute the (minimum and maximum) expected number of complete gossiping rounds required before the combined views of the nodes generate a connected network. This is a desirable configuration for the network to reach since, when the local views do not form a connected topology, the nodes have insufficient information to ensure that a message gets propagated to all other nodes in the network.
        
        As well as computing these measures, we use a prototype extension of PRISM to generate actual adversaries that result in the minimum and maximum values. Since the only nondeterminism in the model is due to scheduling of the nodes (i.e. the order in which they forward their views to their neighbours), we can extract from an adversary the corresponding scheduling.
        
        -   **N=3.**
            
            In the case of three nodes, the minimum and maximum number of complete rounds required for the local views to generate a connected network is 0 and 1 respectively. For comparison, in the DTMC model, where nondeterminism has been replaced by uniform random choice, the expected number of rounds is 0.667. The figure below illustrates the sequences of node schedulings that result in these minimum and maximum values.
            
            -   minimum
                
                ![scheduning for 3 node network that acheives the minimum expected rounds](/images/graphs/gossip.min_sched3.gif)
            -   maximum
                
                ![scheduning for 3 node network that acheives the maximum expected rounds](/images/graphs/gossip.max_sched3.gif)
            
            Initially, all nodes can see node *n2*, but no others. The best-case behaviour (minimum expected number of complete rounds) can be obtained by first scheduling node *n1* and then node *n3*, after which *n2* has added both *n1* and *n3* to its view and the network is connected. Since *n2* has yet to be scheduled, the minimum expected number of complete rounds is 0. For worst-case behaviour (maximum value), we can schedule *n2* before either *n1* or *n3* is scheduled. This adds no new information to the local views and means that a complete gossiping round is required before the network becomes connected.
            
        -   **N=4.**
            
            For the network consisting of four nodes, we find that the minimum and maximum expected number of complete rounds before connectivity are 1.5 and 4.5 respectively. For comparison, the expected number of rounds for the DTMC model is 2.788 which, unlike in the case of the three node network, is closer to the minimum than the maximum.
            
            This case is more complex than the three node network. Since more than one round may be required before the network becomes connected and the number of possible neighbours exceeds the size of the view, descriptors can be dropped from the views as more recent information becomes available. Furthermore, we must consider a node's choice of who to send data to. The figure below shows part of the scheduling (the first gossiping round) that can result in the minimum and maximum expected number of complete rounds. In both cases notice that, when node *n4* is scheduled the view of *n2* is updated, causing the removal of *n1* (the oldest descriptor). Not also that, when node *n2* is scheduled it makes a (random) selection between communicating with *n1* or *n3* since both are in its view at the time.
            
            -   minimum
                
                ![scheduning for 4 node network that acheives the minimum expected rounds](/images/graphs/gossip.min_sched4.gif)
            -   maximum
                
                ![scheduning for 4 node network that acheives the maximum expected rounds](/images/graphs/gossip.max_sched4.gif)
            
            For the minimum case we see that, if *n2* chooses to gossip with *n3* (i.e. the right-hand branch), then the network is complete by the end of the first round. If it chooses *n1* (i.e. the left branch) this is not the case (there are no paths to *n1*) and further rounds of the protocol are required. This leads to a (minimum) expected number of rounds of 1.5. For the maximum case, the network is not connected under either choice and several further rounds are required.
