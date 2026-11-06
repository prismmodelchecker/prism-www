---
layout: layouts/base.njk
title: "Robot Coordination"
section: casestudies
permalink: /casestudies/robot_coordination/
---
# Robot Coordination

## Contents

-   [Introduction](#intro)
-   [Concurrent Stochastic Game Model](#concurrent)
-   [Zero-Sum Properties](#zerosum)
-   [Non-zero-Sum Properties](#nonzerosum)

**Related publications**: {% cite "KNPS19" %}

## Introduction: { #intro }

In this case study, we consider a scenario in which two robots move concurrently over a grid of size *l*×*l* for some *l*\>0. The robots start in diagonally opposite corners and try to reach the opposite corner from which they start. A robot can move either diagonally, horizontally or vertically towards its goal and when it moves there is a probability (*q*) that it instead moves in an adjacent direction, due to the presence of an obstacle. For example, if a robot tries to move north west, then with probability *q/2* it will move north or west.

## Concurrent Stochastic Game Model { #concurrent }

The PRISM code representing a concurrent stochastic game (CSG) model of this scenario is given below. The model has two parameters: `l` the size of the grid and `q` the probability of a movement failure. There are two players corresponding to the two robots and one module for each player.

The PRISM model also includes a reward structure for each player corresponding to elapsed time. These assume that it takes one time step to move between grid squares, except that after a crash (i.e., when the two robots end up in the same square) it take 10 time units to move squares.

{% prismCode "casestudies/examples/robot_coordination2.prism", true, true %}

## Zero-Sum Properties { #zerosum }

We first consider zero-sum properties in which the first player (robot) tries to achieve some goal and the second tries to prevent the first player from achieving this goal. We consider the following properties:

-   maximising the probability of player 1 eventually reaching its goal (i.e. the opposite corner from which it starts) without crashing;
-   maximising the probability of player 1 eventually reaching its goal without crashing and within a certain number of steps;
-   minimising the expected time for player 1 to reach its goal.

These properties are formally specified as follows.

{% prismCode "casestudies/examples/robot_coordination_zero2.props", false, true %}

The following graph plots, for varying `q` and `l`, the maximum probability that player 1 can guarantee for eventually reaching its goal without crashing,

![plot: maximum probability robot 1 can ensure they reach their goal](/images/graphs/robot_coordination_zero.png){.w40}

The results demonstrate that the probability increases as the size of the grid increases, which follows from the fact for larger grids it is easier to avoid the other robot, and hence not crash. On the other hand, as the probability of a movement failure increases, the probability of reaching the goal without crashing decreases since it is difficult to avoid crashing with more limited control of movement. As the size of the grid increases and this probability increases, after the initial decrease, the probability then increases as given a large area and the second robot having less control of movement, the first can avoid crashing even with its limited control of movement.

The graph below plots the results for the step-bounded variant of the same property as `q` and `k` vary for `l=3`, 5 and 7.

![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=3)](/images/graphs/robot_coordination_zero_deadline3.png){.w30} ![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=5)](/images/graphs/robot_coordination_zero_deadline5.png){.w30} ![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=7)](/images/graphs/robot_coordination_zero_deadline7.png){.w30}

The graph below plots the results for expected reachability as `l` and `q` vary.

![plot: minimum expected time robot 1 can ensure they reach their goal](/images/graphs/robot_coordination_zero_expected.png){.w40}

Again we see that increasing the size of the grid decreases the chance of crashing, and therefore increases the probability of reaching the goal within a deadline. The expected time increases as increasing the size of the grid means that more steps are required to reach the goal.

## Non-zero-Sum Properties { #nonzerosum }

We next consider non-zero-sum properties where both players (robots) try and reach their individual goals. For this, we synthesise strategies that are social-welfare Nash equilibria (SWNE) {% cite "KNPS19" %}. Again we consider three classes of properties:

-   each player maximises the probability of eventually reaching its goal without crashing;
-   each player maximises the probability of reaching its goal without crashing within a certain number of steps;
-   each player minimises the expected time to reach its goal.

{% prismCode "casestudies/examples/robot_coordination_nonzero2.props", false, true %}

In the unbounded probabilistic reachability case, the optimal strategies allow each robot to reach its goal with a very high probability since, as time is not an issue, they can collaborate to avoid crashing and this also increases as the grid size increases as there is more room to avoid each other even with movement errors. The probability for odd sized grids is lower than for even sized grids, as for even sized grids the robots are more likely to jump over each other rather than landing in the same grid square. The graphs below plot the values of player 1 (left) and player 2 (right) as `l` and `q` vary.

![plot: maximum probability robot 1 can ensure they reach their goal](/images/graphs/robot_coordination_nonzero_player1.png){.w30} ![plot: maximum probability robot 2 can ensure they reach their goal](/images/graphs/robot_coordination_nonzero_player2.png){.w30}

For the step-bounded property, the graphs below show the probabilities for the individual players (player 1 left and player 2 right) as `k` and `q` vary, for `l=3`, 5 and 7.

![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=3)](/images/graphs/robot_coordination_nonzero_player1_deadline3.png){.w30} ![plot: maximum probability robot 2 can ensure they reach their goal within a deadline (l=3)](/images/graphs/robot_coordination_nonzero_player2_deadline3.png){.w30}

![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=5)](/images/graphs/robot_coordination_nonzero_player1_deadline5.png){.w30} ![plot: maximum probability robot 2 can ensure they reach their goal within a deadline (l=5)](/images/graphs/robot_coordination_nonzero_player2_deadline5.png){.w30}

![plot: maximum probability robot 1 can ensure they reach their goal within a deadline (l=7)](/images/graphs/robot_coordination_nonzero_player1_deadline7.png){.w30} ![plot: maximum probability robot 2 can ensure they reach their goal within a deadline (l=7)](/images/graphs/robot_coordination_nonzero_player2_deadline7.png){.w30}

When there is only one route to each goal within the bound (along the diagonal), i.e. when `k = l`−1, the optimal strategies of both robots take this route as this is the only way of reaching the target within the deadline. In even grids, both players follow the diagonal route since, as discussed for the unbounded case, they will not crash but instead jump over each other. On the other hand, for odd grids, there is a high chance of crashing when they both follow the diagonal route, but there is also a chance one will deviate and the other reaches their goal. Initially, as the bound `k` increases, for odd grids the optimal values for the players are not equal. Here, it is better overall for one to follow the diagonal and the other to take a longer route, as if both took the diagonal route, the chance of crashing increases, decreasing the chance of reaching their goals.

The graph below plots the values of the individual players (player 1 left and player 2 right) for expected reachability as `l` and `q` vary.

![plot: minimum expected time robot 1 can reach their goal](/images/graphs/robot_coordination_nonzero_player1_expected.png){.w30} ![plot: minimum expected time robot 2 can reach their goal](/images/graphs/robot_coordination_nonzero_player2_expected.png){.w30}

As for the deadline properties, we see that for odd grid sizes the values of the players are different for odd size grids. This is again due to the fact that if both players follow the (direct) diagonal route they will only crash for odd sized grids. The results again demonstrate that the players can gain by collaborating.
