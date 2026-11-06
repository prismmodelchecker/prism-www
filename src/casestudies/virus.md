---
layout: layouts/base.njk
title: "Network Virus Infection"
section: casestudies
permalink: /casestudies/virus/
---
# Network Virus Infection

## Contents

-   [Introduction](#intro)
-   [The PRISM Model](#prismmodel)
-   [Model Checking](#results)

**Related publications**: This example is a simpler version of the one appearing in {% cite "KNPV09" %}.

## Introduction { #intro }

This case study concerns a virus infecting a network. The network is a grid of **N** by **N** nodes with each node connected to four neighbours (the nodes that are above, below, to the left and to the right), except for the nodes on the border for which some of the neighbours are not present.

We model the situation in which the virus spawns/multiplies. That is, once a node is infected, the virus remains at that node and repeatedly tries to infect any of the neighbouring nodes while they remain uninfected. More precisely, once a node becomes infected, the virus can attack any of the neighbouring nodes by first trying to pass through the neighbour's firewall and, if successful, then trying to infect the neighbour. The model is based on the DTMC and CTMC models presented in {% cite "PHW05", "KNLM05" %} although there are a number of differences between these approaches.

We suppose that in the network there are 'low' and 'high' nodes and that these nodes are divided by 'barrier' nodes which scan the traffic between the 'high' nodes from the 'low' nodes and that initially only one corner 'low' node is infected. A graphical representation of the network when **N**\=3 is given below.

![Representation of the network](/images/cs/virus.network.gif)

We suppose that both the events of the virus entering a node and infecting a node are stochastic, in that, for both these steps, there is both a chance of success and of failure. More precisely, there is both a probability that the virus may be detected by a node's firewall and a probability that when a the virus tries to infect a node it is successful (i.e. not quarantined by the node's local software).

On the other hand, we suppose that the choice as to which node the virus attempts to infect next (out of neighbouring nodes that are not infected) is nondeterministic. Note that the actual choice as to which node to infect next could depend on the precise topology of nodes present in the network; for example, the choice may be based on that fact that some of the neighbouring nodes are closer than others, because the virus is following some route, or because the virus tries to attack certain types of nodes first.

## The PRISM Model { #prismmodel }

We suppose that the probability of infection equals 0.5 for all node types and the probability of detection by the firewall of the 'low' and 'high' nodes also equals 0.5. The probability of detection by the 'barrier' nodes will be varied in the analysis, and is therefore left unspecified in the model.

The PRISM model for the three node network is given below.

{% prismCode "casestudies/examples/virus3.nm", true, true %}

## Model Checking { #results }

We analyse the chance and time that it takes for the virus to spread from the single infected node with grid position (**N**,**N**) to the farthest corner of the network, i.e. to the grid position **(1,1)**. More precisely, we consider:

-   the minimum probability that the node at grid position **(1,1)** becomes infected;
-   the minimum and maximum probability that the node at grid position **(1,1)** becomes infected within **k** steps;
-   the minimum and maximum expected number of attacks until the node at grid position **(1,1)** becomes infected.

These property can be computed by PRISM through the following specifications:

{% prismCode "casestudies/examples/virus.pctl", false, true %}

-   **The minimum and maximum probability that the node at grid position **(1,1)** becomes infected.**
    
    Model checking this property demonstrates that, if firewalls of the barrier nodes are completely secure (the probability of detection for the barrier nodes equals 1), then the virus cannot pass from the \`low' nodes to the \`high' nodes, and hence, the minimum probability of the node in grid position **(1,1)** becoming infected is 0. On the other hand, if this detection probability is greater than 0, then with probability 1 the virus will eventually infect all the 'high' nodes.
    
-   **The minimum and maximum probability that the node at grid position **(1,1)** becomes infected within **k** steps.**
    
    The graphs below, presents results for the time bounded property as both the probability of detection and number of steps vary.
    
    -   **N**\=3 (minimum)
        
        ![minimum time bounded results N=3](/images/graphs/virus.bounded3.min.gif)

    -   **N**\=3 (maximum)
        
        ![maximum time bounded results N=3](/images/graphs/virus.bounded3.max.gif)

    -   **N**\=4 (minimum)
        
        ![minimum time bounded results N=4](/images/graphs/virus.bounded4.min.gif)

    -   **N**\=4 (maximum)
        
        ![maximum time bounded results N=4](/images/graphs/virus.bounded4.max.gif)
    
    The difference between the minimum and maximum probabilities of infection is because the virus chooses nondeterministically which node to infect next, and in the maximum case the virus finds the quickest route to infect the node **(1,1)**, while in the minimum case the virus attempts to infect all other nodes before infecting the node **(1,1)**.
    
-   **The minimum and maximum expected number of attacks until the node at grid position **(1,1)** becomes infected.**
    
    The graphs below plot the expected number of attacks until the node in grid position **(1,1)** becomes infected.
    
    -   **N**\=3
        
        ![expected number of attacks N=3](/images/graphs/virus.expected3.png)

        ![expected number of attacks N=3 (zoom)](/images/graphs/virus.expected3.zoom.png)
        
    -   **N**\=4
        
        ![expected number of attacks N=4](/images/graphs/virus.expected4.png)

        ![expected number of attacks N=4 (zoom)](/images/graphs/virus.expected4.zoom.png)
