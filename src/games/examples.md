---
layout: layouts/base.njk
title: "games - Modelling Language"
section: games
permalink: /games/examples/
---
# PRISM-games: Examples

Here, we provide a few in-depth examples illustrating the use of PRISM-games. For now, we focus on two of the key new features added in version 3.0: **concurrent stochastic games** and **equilibria**. Other examples will be added in due course. For all supported models, we provide guidance on [modelling](/games/modelling/) and [specifying properties](/games/properties/). There are also many illustrative examples available in the [case studies](/games/casestudies/) section.

## Getting started

To try these examples, you first need to [download](/games/download/) and [install](/games/installation/) PRISM-games.

## Rock-paper-scissors

We consider a concurrent stochastic game (CSG) model corresponding to two players repeatedly playing the [rock-paper-scissors](https://en.wikipedia.org/wiki/Rock_paper_scissors) game.

{% prismCode "games/examples/rps2.prism", false, true %}

The above model has two players:

-   `player1` which controls module `m1`;
-   `player2` which controls module `m2`.

In the CSG, the players just repeatedly choose between the actions of "rock", "paper" and "scissors", and therefore the modules for the players do not contain any variables and the guards and updates of the commands corresponding to choosing these actions are the predicate `true`. Since the two players have the same behaviour, we specify the second player by renaming the first player's module. Since a requirement for specifying CSGs in the PRISM language is that the players' actions are distinct, we use the index of the player in the action labels, e.g. we use `r1` and `r2` to denote players 1 and 2 choosing the action "rock" respectively.

To record which player wins each round of the game there is an additional module `recorder` which is not under the control of any player. The commands of this module are labelled by lists of actions corresponding to the choices of the two players. The ordering of the action lists is not important as the actions of the different players are distinct (the only requirements on the action lists are when they appear in a module under the control of a player and in this case the first action must be the action of the that player). As the module is not under the control of any player, it is required to be deterministic which holds as for each possible choice of actions by there players there is only one command labelled with a corresponding list.

Possible (zero-sum) properties include: (i) the maximum probability that a player can ensure it wins or wins first; and (ii) the maximum expected utility it can ensure over a given number rounds. These properties are expressed in PRISM-games as follows:

{% prismCode "games/examples/rps2.props", false, true %}

We can now use PRISM-games to analyse these properties and to synthesise the corresponding strategies for players. As an example, we use the last (4th) property in the list above, which asks for the optimal strategy for player 2 that maximises the probability of winning before player 1 wins:

```shell
prism-games rps2.prism rps2.props -prop 4 -exportstrat rps2_strat4.dot
```

Here, `prism-games` is the command-line version of PRISM-games, i.e, the script `bin/prism` within the PRISM-games distribution (at the top-level for binary releases, or within subdirectory `prism` for source code versions). The files `rps2.prism` and `rps2.props` can be downloaded from above, and also found in the directory `prism-examples/csgs/simple` within PRISM-games.

The command above synthesises the optimal strategy for player 2 and generates a [dot](http://www.graphviz.org) file which allows easy graphical visualisation of it. This is displayed below (the output has been edited, replacing floating point numbers with rationals to simplify the presentation).

![plot: optimal strategy for player 2 when maximising the probability of winning before player 1](/images/graphs/rps2_strat4.png){.w75}

In the graph, the vertices correspond to the states of the game (each one shows the index of the state and the values of the single variable `win`), and edges from each state represent the optimal choices of player 2 and all available choices for player 1 from that state. The choices for the two players (probability of choosing available actions) are separated by `--`. By including all possible choices for player 1, the graph includes all states reachable when player 2 follows its optimal strategy, and therefore all choices for this strategy when it is followed. As can be seen, in any state in which a player has not yet won, the optimal strategy for player 2 is to choose rock, paper and scissors each with probability 1/3.

We can extend the model by adding an integer constant and module to count the number of rounds. Here, since the commands are independent of the choices of the players, the commands are unlabelled (empty action lists). These commands are performed no matter what actions the two players choose. The module is deterministic since the guards of the two commands are disjoint.

In addition, we can add two reward structures corresponding to the utility of each player for each round of rock-paper-scissors (1 for winning, 0 for drawing and -1 for losing). For this, action lists are again used, corresponding to the different choices of the players.

{% prismCode "games/examples/rps2_rounds.prism", false, true %}

We can then extend the properties that can be analysed to include the probability of winning at least one of `k` rounds and the expected cumulative utility over `k` rounds.

{% prismCode "games/examples/rps2_rounds.props", false, true %}

Here is another example of running strategy synthesis:

```shell
prism-games rps2_rounds.prism rps2_rounds.props -const k=1 -prop 3 -exportstrat rps2_strat3.dot
```

which generates the optimal strategy to maximise the expected utility of a player 1 over 1 round (i.e., the optimal strategy for the matrix game corresponding to the utility function). This is displayed below (again, the output has been edited replacing floating point numbers with rationals to simplify the presentation).

![plot: optimal strategy for player 1 for the rps matrix game](/images/graphs/rps2_strat3.png){.w75}

Again, the vertices of the graph correspond to the states of the game, so now show the values of the two variables `rounds` and `win`. Edges from each state represent the optimal choices (probabilities) of player 1 and all available choices for player 2 from that state. As can be seen, the optimal strategy is for player 1 to choose rock, paper and scissors each with probability 1/3.

## Medium access control

As a second example, we present a CSG model of medium access control system which is based on a deterministic concurrent game model presented in {% cite "Bre13" %}. The original model consists of two users with limited energy sharing a wireless channel. Thery repeatedly choose to transmit (`t`) or wait (`w`) and, if both transmit, the transmissions fail due to interference. We extend this to a CSG by assuming that transmission failure due to collisions is probabilistic, in particular, if a single user transmits, then with probability `q1` the transmission succeeds and if both transmit, then with probability `q2` there is no collision and transmissions succeed.

We also assume that each user has a limited amount of energy, and therefore can only try and transmit their packet a limited number of times.

The PRISM-games model is presented below.

{% prismCode "games/examples/medium_access2.prism", false, true %}

The model has undefined constants for the limited energy that each user starts with and for the probabilities of a transmission failure both when a single user sends and both send at the same time.

In this CSG there are two players, corresponding to the two users, which control one module each and, since the behaviour of the two players is the same, module renaming is used to specify the module of the second player. In these modules, the action lists appearing in commands contain a single action, and therefore, since this is the first action in the list, these are the actions of the player controlling the module. To ensure the actions of the different players are distinct we use the index of the player when naming actions. The modules have variables to denote if the users packet has been send and the energy available to the user. A user can only choose to transmit if it has not yet successfully transmitted and it has used up its limited energy supply. Trying to transmit a packet uses up one unit of energy.

Since the outcome of transmitting follows a joint probability distribution, we include an additional module not under the control of any player which has a boolean variable which represents the successful transmission and is therefore updated probabilistically based on the action choices of the players. In the commands of the player's own modules which correspond to transmitting we then have updates including the *primed* value of this boolean variable which also uses the if then else construct.

Possible non-zero sum properties for this model include both players trying to maximise the number of messages they can send in k steps and both players trying to maximize the probability of sending a message. These properties are listed below.

{% prismCode "games/examples/medium_access2.props", false, true %}

We can extend this CSG by counting the number of successful transmissions of each user. To do this we add an additional undefined integer constant (the maximum count), a variable to the modules representing the users and increment the new variables when a successful transition occurs. Again renaming can be used when specifying the module for the second player. The changes to the model file are shown below (or the full version of the modified model is here: [medium\_access\_count2.prism](/games/examples/medium_access_count2.prism)).

{% prismCode "games/examples/medium_access_changes2.prism", false, true %}

For this extended CSG we can consider additional properties representing both players trying to maximise the probability of sending a certain number of messages with and without a time bound, and when one player has a time bound and the other does not.

{% prismCode "games/examples/medium_access_count2.props", false, true %}

We can synthesise Nash equilibria strategies (actually social-welfare Nash equilibria; see {% cite "KNPS19" %}) for the players when they try and maximise the probability of eventually successfully transmitting twice, when each user has two units of energy available and the probabilities of a successful transmission are 0.9 and 0.75 when a single user and both users try to transmit, respectively. This is acheived by running the following command:

```shell
prism-games medium_access_count2.prism medium_access_count2.props -prop 2 -const smax=2,emax=2,q1=0.9,q2=0.75 -exportstrat medium_access_strat.dot
```

As for the earlier example, `prism-games` is the command-line version of PRISM-games, i.e, the script `bin/prism` within the PRISM-games distribution (at the top-level for binary releases, or within subdirectory `prism` for source code versions). The files `medium_access_count2.prism` and `medium_access_count2.props` can be downloaded from above, and also found in the directory `prism-examples/csgs/simple` within PRISM-games.

As for zero-sum properties, the synthesised strategies are given in the [dot](http://www.graphviz.org) format. For nonzero-sum properties we are generating a SWNE strategy profile, and therefore this includes optimal choices for both players. When neither player has reached its goal, edges are labelled `CSG` followed by the choices for the two players (the probabilities of choosing available actions) with the choices for the different players separated by `--`. On the other hand, once the goal of one of the players has been reached, since the players then form a coalition and try and reach the goal of the other player, the edges in the graph are labelled `MDP` followed by the a single choice (the probability of choosing actions for both players). The synthesised profile is given below.

![plot: SWNE strategy profile for the players maximising the probability of eventually successfully transmitting twice](/images/graphs/medium_access_strat.png){.w75}

The graph demonstrates that in the synthesised strategy profile, the players cooperate to achieve their individual goals. More precisely, player 1 waits while first player 2 tries to transmit until either its goal has been reached, i.e. two successful transmissions, or it does not have sufficient energy to meet its objective, i.e. either the first transmission fails and it has only the energy to try and transmit one more time or the first succeeds and then second transmission fails after which it has run out of energy. After this player 2 no longer tries to transmit and player 1 tries to transmit until again either its goal has been reached or does not have sufficient energy to meet its objective. This can also be seen in the SWNE values of (0.81,0.81), as 0.81 corresponds to a player trying to transmit twice and being successful each time and the other player not transmitting at these times (recall the probabilities of a successful transmission are 0.9 and 0.75 when a single user and both users try to transmit, respectively).
