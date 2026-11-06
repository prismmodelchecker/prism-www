---
layout: layouts/base.njk
title: "Intrusion Detection Policies"
section: casestudies
permalink: /casestudies/ids/
---
# Intrusion Detection Policies

(Q. Zhu and T. Başar)

## Contents

-   [Introduction](#intro)
-   [A Simple CSG Model](#simple)
-   [Scenario 1 and Scenario 2](#scenarios)
-   [Analysis](#analysis)

**Related publications**: {% cite "KNPS18" %}

## Introduction: { #intro }

In {% cite "ZB09" %}, CSGs are used to model the interaction between an intrusion detection policy and attacker. The policy has a number of libraries that it can use to detect attacks and the attacker has several different attacks which can incur different levels of damage if not detected. Furthermore, each library can only detect certain attacks. In the model, in each round, the policy chooses a library to deploy and the attacker chooses an attack. A reward structure is specified representing the level of damage when an attack is not detected. The goal is to find optimal intrusion detection policies which correspond to finding a strategy for the policy that minimises damage.

For such systems, concurrency is required for the model to be meaningful, otherwise it is easy for the player whose turn follows the other player’s to 'win'. For example, if the attacker knows what library is being deployed, then it can simply choose an attack the library cannot detect.

We first present a simple model and then extend this model to the two scenarios presented in {% cite "ZB09" %} which we then analyse.

## A Simple CSG Model { #simple }

We first consider a simple CSG where the attacker can choose two different attacks and the defender can choose between defences for the two different attacks. The system can be in one of two states: *healthy* or *compromised*. The system starts in the healthy state and, if the correct defence for an attack is chosen, then the system remains or returns to this state; if the wrong defence is chosen for am attack, the system remains or moves to the compromised state.

Each time the wrong defence is chosen, a cost is incurred for the system. This cost is larger if the system was already in the compromised state when the wrong defence was chosen.

The CSG model is given below. There are two players: the attacker and the intrusion detection policy, and each has a single module which allows the player to choose the attack or defence for the current round. There are two additional modules not under the control of any player. The first counts the number of rounds. The round counter increases no matter what actions the players choose and therefore the commands of this model are unlabelled. The second module is used to keep track of the state of the system. Since the state of the system depends on whether the correct defence was chosen, in this module the commands are labelled by the choices of the two players.

The CSG also includes two reward structures. The first gives the cost incurred by the system in each round, while the second gives the cost in a specific round. If the correct defence is chosen, then there is no cost to the system. On the other hand, if the defence does not match the cost there is a cost. We assume that the second defence has limited success defending the first attack, while the first has no influence on the second, and therefore the cost is larger when choosing the first defence against the second attack.

{% prismCode "casestudies/examples/ids_simple.prism", true, true %}

## Scenario 1 and Scenario 2 { #scenarios }

We now extend the above model to the two scenarios given in {% cite "ZB09" %}. The system now has 3 possible states: *healthy*, *compromised* and *failure*. The system starts in the healthy state and transitions between states depending on whether the correct or wrong defence is chosen. In addition, the reward structures are extended so that the cost of a successful attack is greater when in the failure state than in the compromised state.

In the healthy state:

-   if the correct defence is chosen, then the system remains in the healthy state;
-   if the wrong defence is chosen, then the system moves to the compromised state with probability *attack* and otherwise remains in the healthy state.

In the compromised state:

-   if the correct defence is chosen, then the system moves to the healthy state with probability *recover* and otherwise remains in the compromised state;
-   if the wrong defence is chosen, then the system moves to the failure state with probability *fail* and otherwise remains in the compromised state.

In the failure state:

-   if the correct defence is chosen, then the system moves to the compromised state with probability *repair* and otherwise remains in the failure state;
-   if the wrong defence is chosen, then the system remains in the failure state.

The PRISM code for this CSG is below.

{% prismCode "casestudies/examples/ids_scenarios.prism", true, true %}

We consider two scenarios, where in scenario 1:

-   small chance an attack is successful (*attack*\=0.2);
-   high chance of recovering if attack is prevented (*recover*\=0.8);
-   small chance of failure from compromised state when attack continues (*fail*\=0.2);
-   high chance of repairing from failure to compromised when attack stops (*repair*\=0.8);

and in scenario 2:

-   high chance an attack is successful (*attack*\=0.8);
-   small chance of recovering if attack is prevented (*recover*\=0.2);
-   high chance of failure from compromised state when attack continues (*fail*\=0.8);
-   low chance of repairing from failure to compromised when attack stops (*repair*\=0.2).

## Analysis { #analysis }

For the two scenarios given above we consider both the cumulated cost over a number of rounds and the cost of a specific round.

{% prismCode "casestudies/examples/ids.props", false, true %}

The two graphs below plot the minimum expected cumulative cost over a number of rounds and the minimum expected cost in a specific round that the policy player can ensure.

![plot: minimum expected cumulative cost over a number of rounds the idp policy player can ensure](/images/graphs/ids_graph1.png){.w50}
  
![plot: minimum expected  cost in a specific round the idp policy player can ensure](/images/graphs/ids_graph2.png){.w50}

We also synthesise the optimal strategy for the defender over 1, 2 and 4 rounds. For example, for the first scenario and when the number of rounds is 2, this is achieved through the following command:

```shell
prism-games ids_scenarios.prism ids.props -prop 1 -const scenario=1,rounds=2,K=1 -exportstrat ids_strat2_scenario1.dot
```

Below we have included the generated optimal strategies for the defender. In the graph, the vertices correspond to the states of the game, i.e. the values of the variables `rounds` and `s`, and edges from any state represent the optimal choices of player 1 and all available choices for player 2 from that state. The choices for the two players (probability of choosing available actions) are separated by `--`. By including all possible choices for player 2, the graph includes all states reachable when player 1 follows its optimal strategy, and therefore all choices for this strategy when it is followed.

As the graphs below demonstrate, the optimal strategy for the defender is in each case randomised. In addition, it favours the second defence which can be attributed to the fact that the second defence has at least partial success against both attacks while this is not true of the first.

### Optimal Strategies for Scenario 1

![plot: optimal strategy for the defender (scenario 1 and 1 round)](/images/graphs/ids_strat1_scenario1.png){.w75}
  
![plot: optimal strategy for the defender (scenario 1 and 2 round)](/images/graphs/ids_strat2_scenario1.png){.w75}
  
![plot: optimal strategy for the defender (scenario 1 and 4 round)](/images/graphs/ids_strat4_scenario1.png){.w75}

### Optimal Strategies for Scenario 2

![plot: optimal strategy for the defender (scenario 2 and 1 round)](/images/graphs/ids_strat1_scenario2.png){.w75}
  
![plot: optimal strategy for the defender (scenario 2 and 2 round)](/images/graphs/ids_strat2_scenario2.png){.w75}
  
![plot: optimal strategy for the defender (scenario 2 and 4 round)](/images/graphs/ids_strat4_scenario2.png){.w75}
