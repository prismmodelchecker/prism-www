---
layout: layouts/base.njk
title: "Task-graph scheduling"
section: casestudies
permalink: /casestudies/task_graph/
---
# Task-graph scheduling

(Bouyer, Fahrenberg, Larsen & Markey)

## Contents

-   [Introduction](#intro)
-   [The Basic Model](#model)
-   [Random Task Execution Times](#execution)
-   [Adding a Faulty Processor](#faulty)
-   [TPTG (Turn-based Probabilistic Timed Game) Model](#game)
-   [TPTG with Faulty Processors](#game)

**Related publications**: {% cite "NPS13" %} {% cite "KNP19" %}<a name="intro"></a>

## Introduction

One common use of (non-probabilistic) timed automata is the formalisation and solution of scheduler optimisation problems. In this case study, we consider an extension of the task-graph scheduling problem described in {% cite "BFLM11" %}. We show how probabilistic timed automata (PTAs) can be used to introduce uncertainty with regards to time delays and to consider the possibility of failures. We demonstrate how the digital clocks method can determine optimal schedulers for these problems, in terms of the (expected) time and energy consumption required to complete all tasks. We also use stochastic game variants of the models.

## The Basic Model { #model }

The basic model concerns computing the arithmetic expression **D × (C × (A + B)) + ((A + B) + (C × D))** using two processors (**P1** and **P2**) that have different speed and energy requirements. The specification of the processors is as follows.

{: columns="1 2" }

|          | P1            | P2            |
|----------|---------------|---------------|
| +        | 2 picoseconds | 5 picoseconds |
| ×        | 3 picoseconds | 7 picoseconds |
| *idle*   | 10 Watts      | 20 Watts      |
| *active* | 90 Watts      | 30 Watts      |

The following figure presents a task graph for computing this expression and shows both the tasks that need to be performed (the subterms of the expression) and the dependencies between the tasks (the order the tasks must be evaluated in).

![task graph representation](/images/cs/task_graph.png){.medium}

The system is formed as the parallel composition of three PTAs (PRISM modules), one for the scheduler and one for each processor is presented below.

{% prismCode "casestudies/examples/task_graph.prism", true, true %}

The actions *p1\_add* and *p1\_mult* represent an addition and multiplication task being scheduled on **P1** respectively, while the action *p1\_done* indicates that the current task has been completed on **P1**. There are similar actions for **P2**. The systems includes clocks *x1* and *x2* which is used to keep track of the time that a task has been running on **P1** and **P2** respectively, and are therefore reset when a task starts and the invariants and guards correspond to the time required to complete the tasks of addition and multiplication on the processors.

We consider the following properties of the system.

{% prismCode "casestudies/examples/task_graph.props", false, true %}

Using the digital clocks PTA engine we find the following optimal scheduler for minimising the elapsed time to complete all tasks, which takes 12 picoseconds to complete all tasks.

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="text-align: center" colspan="3">task5</td><td style="text-align: center" colspan="2">task4</td><td style="text-align: center" colspan="2">task6</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="text-align: center" colspan="7">task2</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

In the case of energy consumption, we find an optimal scheduler which requires 1.3200 nanojoules and schedules tasks as shown below.

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="text-align: center" colspan="2">task4</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="text-align: center" colspan="7">task2</td><td style="text-align: center" colspan="7">task5</td><td style="text-align: center" colspan="5">task6</td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

## Random Task Execution Times { #execution }

We now extend the basic model making the time required for each processor to perform a task probabilistic. More precisely, if, in the original problem the time for a processor to perform a task was *k*, we suppose now that the time taken is uniformly distributed between the delays *k-1*, *k* and *k+1*.

The PRISM model for this scenario is presented below. Note that to prevent the scheduler from seeing into the future when making decisions, the probabilistic choice for task completion is made on completion rather than on initialisation.

{% prismCode "casestudies/examples/task_graph_execution.prism", true, true %}

Analysing this model, we find that the optimal expected time and energy consumption to complete all tasks equal 12.226 picoseconds and 1.3201 nanojoules, respectively. This improves on the results obtained using the optimal schedulers for the original model, where the expected time and energy consumption equal 13.1852 picoseconds and 1.3211 nanojoules, respectively.

Synthesising optimal schedulers, we find that they change their decision based upon the delays of previously completed tasks. For example, for elapsed time, the optimal scheduler starts as for the non-probabilistic case, first scheduling task1 followed by task3 on **P1** and task2 on **P2**. However, it is now possible for task2 to complete before task3 (if the execution times for task1, task2 and task3 are 3, 6 and 4 picoseconds respectively), in which case the optimal scheduler now makes a different decision from the non-probabilistic case. Under one possible set of execution times for the remaining tasks, the optimal scheduling is as follows:

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="3">task1</td><td style="text-align: center" colspan="4">task3</td><td style="text-align: center" colspan="3">task5</td><td style="background-color:#ffffff"></td><td style="text-align: center" colspan="2">task6</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="text-align: center" colspan="6">task2</td><td style="text-align: center" colspan="5">task4</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

## Adding a Faulty Processor { #faulty }

As a second extension of the scheduling problem, we add a third processor **P3** which consumes the same energy as **P2** but is faster (addition takes 3 picoseconds and multiplication 5 picoseconds). However, this comes at a cost: there is a chance (probability *p*) that the processor fails and the computation must be rescheduled and performed again.

The PRISM model for this scenario is presented below. Note that to prevent the scheduler from seeing into the future when making decisions, the probabilistic choice for task completion is made on completion rather than on initialisation.

{% prismCode "casestudies/examples/task_graph_failure.prism", true, true %}

Analysing this model, we find that for small values of *p* (the probability of **P3** failing to successfully complete a task), as **P3** has better performance than **P2**, both the optimal expected time and energy consumption can be improved using **P3**. However, as the probability of failure increases, **P3**’s better performance is out-weighed by the chance of its failure and using it no longer yields optimal values. This can be seen in the following graphs which plot the optimal expected time and energy consumption for this extended model as the failure probability *p* varies.

![plot: optimal expected time to complete](/images/graphs/scheduler_failure_time.png){.medium}
  
![plot: optimal expected energy to complete](/images/graphs/scheduler_failure_energy.png){.medium}

For example, we give an optimal scheduler for the expected time when *p=0.25* which takes 11.0625 picoseconds (the optimal expected time is 12 picoseconds when **P3** is not used). The dark boxes are used to denote the cases when **P3** is scheduled to complete a task, but experiences a fault and does not complete the scheduled task correctly.

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="text-align: center" colspan="3">task5</td><td style="text-align: center" colspan="2">task6</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P3</b></td><td style="text-align: center" colspan="5">task2</td><td style="text-align: center" colspan="3">task4</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

  
  

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="text-align: center" colspan="3">task2</td><td style="text-align: center" colspan="3">task5</td><td style="text-align: center" colspan="2">task6</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P3</b></td><td style="text-align: center" bgcolor="#000000" colspan="5"><font color="#ffffff">task2</font></td><td style="text-align: center" colspan="3">task4</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

  
  

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<tbody>
<tr class="prism-th"><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="text-align: center" colspan="3">task2</td><td style="text-align: center" colspan="3">task4</td><td style="text-align: center" colspan="2">task?</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P3</b></td><td style="text-align: center" bgcolor="#000000" colspan="5"><font color="#ffffff">task2</font></td><td style="text-align: center" bgcolor="#000000" colspan="3"><font color="#ffffff">task4</font></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

  
  

<table class="prism-table">
<colgroup></colgroup><colgroup span="20"></colgroup>
<thead>
<tr><th>time</th><th>&nbsp;1&nbsp;</th><th>&nbsp;2&nbsp;</th><th>&nbsp;3&nbsp;</th><th>&nbsp;4&nbsp;</th><th>&nbsp;5&nbsp;</th><th>&nbsp;6&nbsp;</th><th>&nbsp;7&nbsp;</th><th>&nbsp;8&nbsp;</th><th>&nbsp;9&nbsp;</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
</thead>
<tbody>
<tr><td style="text-align: center"><b>P1</b></td><td style="text-align: center" colspan="2">task1</td><td style="text-align: center" colspan="3">task3</td><td style="text-align: center" colspan="3">task5</td><td style="text-align: center" colspan="2">task4</td><td style="text-align: center" colspan="2">task6</td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P2</b></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
<tr><td style="text-align: center"><b>P3</b></td><td style="text-align: center" colspan="5">task2</td><td style="text-align: center" bgcolor="#000000" colspan="3"><font color="#ffffff">task4</font></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td><td style="background-color:#ffffff"></td></tr>
</tbody>
</table>

## TPTG (Turn-based Probabilistic Timed Game) Model { #game }

A limitation of the above models is that the execution time of the processors (or its probability distribution) must be known and remain fixed. We now remove this restriction by moving to a game-based model in which there are two players:

-   the scheduler which decides when to schedule tasks and on which processors;
-   the environment which decides on the execution times tasks scheduled on the processors.

The model is a TPTG (turned-based probabilistic timed game) which is an extension of a PTA to incorporate multiple players by allocating locations to different players. TPTGs are specified in [PRISM-games](/games/) in a similar fashion to (discrete-time) turn-based stochastic games (SMGs), by assigning modules and actions to players. The locations under the control of a specific player correspond to those for which either an action or module with an unlabelled transition which is under the control of that player.

Below we give the TPTG model for the basic model.

{% prismCode "casestudies/examples/task_graph_tptg.prism", true, true %}

In the above model we use the `turn` variable to specify which locations are under the control of which player. When `turn=0` the scheduler has control and when `turn=1` the environment has control. Since the time taken for tasks to run is under the control of the environment, once tasks have been scheduled on time can pass until the scheduler has passed over control to the enronment, i.e. `turn=1`.

Using this model we can then ask which is the minimum execution time or energy consumption that the scheduler can ensure no matter how the environment behaves. In addition, we can find these minimum values when the players collaborate.

{% prismCode "casestudies/examples/task_graph_tptg.props", false, true %}

We find that the minimum values that the scheduler can ensure is the same as for the PTA model above, which demonstrates that in the worst case the environment delays tasks for as long as possible and the scheduler's optimal choices in this scenario is to follow the schedules given above for the PTA model.

As explained in {% cite "BFLM11" %}, an optimal schedule for a game model in which delays can vary does not yield a simple assignment of tasks to processors at specific times as presented above for PTAs, but instead it is an assignment that also has as input when previous tasks were completed and on which processors.

## TPTG Model with Faulty Processors { #faults }

We now extend the basic TPTG model by allowing the processors **P1** and **P2** to have at most **k1** and **k2** faults respectively. We assume that the probability of any fault causing a failure is **p** and faults can happen at any time a processor is active, i.e., the time the faults occur is under the control of the environment. Again, we could not model this extension with a PTA, since the scheduler would then be in control of when the faults occurred, and therefore in the optimal case would decide that no faults would occur.

{% prismCode "casestudies/examples/task_graph_prob_fault_tptg.prism", true, true %}

In the figures below we have plotted both the optimal expected time and energy the scheduler can ensure when there are different number of faults in each processor as the parameter **p** (the probability of a fault causing a failure) varies. As would be expected, both the optimal expected time and energy consumption increases both as the number of faults increases and the probability that a fault causes a failure increases.

![plot: optimal expected time the scheduler can ensure](/images/graphs/task_graph_tptg_time.png){.medium}
  
![plot: optimal expected energy the scheduler can ensure](/images/graphs/task_graph_tptg_energy.png){.medium}

Considering the synthesised optimal schedulers for the expected time case, when **k1**\=**k2**\=1 and **p**\=1, the optimal approach is to just use the faster processor **P1** and the expected time equals 18.0. The optimal strategy for the environment, i.e., the choices that yield the worst-case expected time, against this scheduler is to delay all tasks as long as possible and cause a fault when a multiplication task is just about to complete on **P1** (recall **P2** is never used under the optimal scheduler). A multiplication is chosen as this takes longer (3 picoseconds) than an addition task (2 picoseconds). These choices can be seen through the fact that 18.0 is the time for 4 multiplications and 3 additions to be performed on **P1**, while the problem requires 3 multiplications and 3 additions. As soon as the probability of a fault causing a failure is less than 1, the optimal scheduler does use processor **P2** from the beginning by initially scheduling *task1* on process **P1** and *task2* on processor **P2** (which is also optimal when no faults can occur).

In the case of the expected energy consumption, the optimal scheduler uses both processes unless one has 2 or more faults than the other and there is only a small chance that a fault will cause a failure. For example, if **P1** has 3 faults and **P2** has 1 fault, then **P1** is only used by the optimal scheduler when the probability of a failure causing a fault is approximately 0.25 or less.
