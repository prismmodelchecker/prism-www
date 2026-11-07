---
layout: layouts/base.njk
title: "Randomised mutual exclusion (Rabin)"
section: casestudies
permalink: /casestudies/rabin/
---
# Randomised mutual exclusion (Rabin)

(Rabin)

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [Model Checking](#results)

**Acknowledgements**: We are grateful to Martijn Moraal, Jeroen Schutte, Fides Aarts and Johan Uijen (students on [Frits Vaandrager](http://www.cs.ru.nl/~fvaan/)'s [Analysis of Embedded Systems](http://www.cs.ru.nl/F.Vaandrager/PV/) course) for contributions to this case study.

## Introduction { #intro }

This case study is based on Rabin's solution to the well known mutual exclusion problem {% cite "Rab82" %}.

Let *P*<sub>1</sub> ... *P*<sub><i>n</i></sub> be *n* processes that from time to time need to execute a critical section in which exactly one of them is allowed to employ a shared resource. The processes can coordinate their activities by use of a common resource.

## The Model { #model }

The model is represented as an MDP. We let **N** denotes the number of processes. The PRISM source code for the case where **N = 3** is show below:

{% prismCode "casestudies/examples/rabin3.nm", false, true %}

The table below shows statistics for each model we have built. The first section gives the number of **states** in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of **nodes** and the number of **leaves** (terminal nodes).

| N:  | Model:      | MTBDD:  ||
| ^^  | States:     | Nodes:  | Leaves: |
|-----|-------------|---------|---------|
| 3   | 27,766      | 27,966  | 7       |
| 4   | 668,836     | 63,135  | 7       |
| 5   | 27,381,358  | 131,591 | 8       |
| 6   | 624,265,622 | 196,376 | 8       |
| 7   | 1.3e+11     | 271,825 | 8       |
| 8   | 2.8e+12     | 357,938 | 8       |
| 9   | 1.6e+13     | 723,514 | 9       |
| 10  | 3.5e+15     | 894,897 | 9       |

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

| N:  | Construction: | Reachability: ||
| ^^  | Time (s):     | Time (s):     | Iter.s: |
|-----|---------------|---------------|---------|
| 3   | 0.527         | 0.23          | 21      |
| 4   | 1.415         | 0.81          | 24      |
| 5   | 4.776         | 3.85          | 27      |
| 6   | 10.19         | 8.59          | 30      |
| 7   | 20.16         | 17.62         | 33      |
| 8   | 35.63         | 30.51         | 36      |
| 9   | 97.92         | 86.76         | 39      |
| 10  | 188.4         | 169.4         | 42      |

## Model Checking { #results }

When model checking, we have the following requirements:

-   **Scheduler-Liveness:** for each time *t* and any process *P*<sub><i>i</i></sub> not in its *remainder phase* at time *t*, there exists a time *t*' > *t* in which *P*<sub><i>i</i></sub> makes a move.
-   **Fault freeness:** if a process *P*<sub><i>i</i></sub> moves into its *critical section phase* then eventually *P*<sub><i>i</i></sub> moves from this phase to its *exit phase* and from its exit phase to its *remainder phase*.

These correspond to fairness assumptions on the *adversary/scheduler*. However, by following the approach employed by {% cite "DFP04" %} for the [dining philosophers](/casestudies/phil/) case study, in fact we can bypass this restriction by removing the self-loops from the model.

We have verified the following PRISM properties in all states of the model:

{% prismCode "casestudies/examples/rabin_prop1.pctl", false, true %}

One requirement that we have been unable to verify is:

-   ***k*\-Bounded-Waiting:** if *M* processes participate in a trying round, then each process has probability at least *1/kM* of entering the critical section at the end of the trying round."

One problem with this requirement is that it cannot be expressed by a PCTL formula as property corresponds to the probability of a *conjunction* of *path formulae* (expressing the properties a process participates in a round, *M* processes participate in a round and a process enters the critical section) being greater than a certain bound. However, in PCTL we are restricted to comparing only the probability of *single* path formulae with bounds.

On the other hand, this property *could* be expressed in PCTL\*, but we would still need to consider a different formula for each possible value of *M* (*M* ranges from 1 up to the number of processes).

We note that Saias {% cite "Sai92" %} proved that this property does *not* hold. Furthermore, Kushilevitz and Rabin {% cite "KR92" %} have presented a modified version of this algorithm which solves this problem.

Based on ideas from Martijn Moraal and Jeroen Schutte, we instead consider a weaker property. More precisely, we compute:

-   **Prob-Win:** "the minimum probability that a process enters the critical section, given that the process tries in the current round"

As shown in the PRISM description above, to allow for the analysis of this property, we modified the model by dividing the step corresponding to a process making a draw into two. This allowed us to identify states where a process will draw without knowing what value the process will randomly pick. To correctly model the protocol and prevent erroneous behaviour, we kept these two steps atomic (i.e. no other process can move once the first step has been made). For example, if we do not add this restriction, then the adversary can prevent the process from actually drawing in the current round by not scheduling it after it has performed the first step.

The actual property, concerning process 1, verified in PRISM is given below:

{% prismCode "casestudies/examples/rabin_prop2.pctl", false, true %}

The use of the filter in the property expresses the fact that we are only interested in the probability in states for which:

-   the process is going to make a draw (draw1=1);
-   no process is in the critical section (otherwise probability is clearly 0);

and we take the minimum value over this set of states.

Verifying this property returns the value 0 which is due to the fact that the adversary can use the values previously drawn by other processes. This is similar to the proof Saias {% cite "Sai92" %} presents for proving that Rabin's bounded waiting property does not hold. To demonstrate this fact we present the results for the following property which restricts attention to those states where the values drawn by the other processes are below **k**.

{% prismCode "casestudies/examples/rabin_prop3.pctl", false, true %}

The tables below present results for this property as **k** varies (note that the case **k=4+ceil(log<sub>2</sub> N)** corresponds to the **Prob-Win** property above).

-   **k=0:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.237457     |
    | 4   | 0.164           | 11      | 0.180014     |
    | 5   | 0.476           | 14      | 0.144384     |
    | 6   | 4.570           | 17      | 0.119936     |
    | 7   | 10.17           | 20      | 0.102551     |
    | 8   | 21.11           | 23      | 0.089578     |
    | 9   | 88.64           | 26      | 0.079959     |
    | 10  | 199.6           | 29      | 0.071948     |
    
      
    
-   **k=1:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.237457     |
    | 4   | 0.164           | 11      | 0.180014     |
    | 5   | 0.476           | 14      | 0.144384     |
    | 6   | 4.570           | 17      | 0.119936     |
    | 7   | 10.17           | 20      | 0.102551     |
    | 8   | 21.11           | 23      | 0.089578     |
    | 9   | 88.64           | 26      | 0.079959     |
    | 10  | 199.6           | 29      | 0.071948     |
    
      
    
-   **k=2:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.208007     |
    | 4   | 0.164           | 11      | 0.174957     |
    | 5   | 0.476           | 14      | 0.144384     |
    | 6   | 4.570           | 17      | 0.119936     |
    | 7   | 10.17           | 20      | 0.102551     |
    | 8   | 21.11           | 23      | 0.089578     |
    | 9   | 88.64           | 26      | 0.079959     |
    | 10  | 199.6           | 29      | 0.071948     |
    
      
    
-   **k=3:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.114257     |
    | 4   | 0.164           | 11      | 0.104644     |
    | 5   | 0.476           | 14      | 0.096728     |
    | 6   | 4.570           | 17      | 0.089208     |
    | 7   | 10.17           | 20      | 0.082461     |
    | 8   | 21.11           | 23      | 0.076397     |
    | 9   | 88.64           | 26      | 0.071337     |
    | 10  | 199.6           | 29      | 0.066468     |
    
      
    
-   **k=4:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.059570     |
    | 4   | 0.164           | 11      | 0.056793     |
    | 5   | 0.476           | 14      | 0.054858     |
    | 6   | 4.570           | 17      | 0.052572     |
    | 7   | 10.17           | 20      | 0.050404     |
    | 8   | 21.11           | 23      | 0.048347     |
    | 9   | 88.64           | 26      | 0.046794     |
    | 10  | 199.6           | 29      | 0.044992     |
    
      
    
-   **k=5:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.030273     |
    | 4   | 0.164           | 11      | 0.029327     |
    | 5   | 0.476           | 14      | 0.029109     |
    | 6   | 4.570           | 17      | 0.028432     |
    | 7   | 10.17           | 20      | 0.027773     |
    | 8   | 21.11           | 23      | 0.027131     |
    | 9   | 88.64           | 26      | 0.026903     |
    | 10  | 199.6           | 29      | 0.026345     |
    
      
    
-   **k=6:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | 0.053           | 8       | 0.0          |
    | 4   | 0.164           | 11      | 0.0          |
    | 5   | 0.476           | 14      | 0.014903     |
    | 6   | 4.570           | 17      | 0.014671     |
    | 7   | 10.17           | 20      | 0.014441     |
    | 8   | 21.11           | 23      | 0.014216     |
    | 9   | 88.64           | 26      | 0.014392     |
    | 10  | 199.6           | 29      | 0.014225     |
    
      
    
-   **k=7:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | -               | -       | -            |
    | 4   | -               | -       | -            |
    | 5   | 0.476           | 14      | 0.0          |
    | 6   | 4.570           | 17      | 0.0          |
    | 7   | 10.17           | 20      | 0.0          |
    | 8   | 21.11           | 23      | 0.0          |
    | 9   | 88.64           | 26      | 0.007395     |
    | 10  | 199.6           | 29      | 0.007337     |
    
      
    
-   **k=8:**
    
    | N:  | Model Checking: || Probability: |
    | ^^  | Time (s):       | Iter.s: | ^^           |
    |-----|-----------------|---------|--------------|
    | 3   | -               | -       | -            |
    | 4   | -               | -       | -            |
    | 5   | -               | -       | -            |
    | 6   | -               | -       | -            |
    | 7   | -               | -       | -            |
    | 8   | -               | -       | -            |
    | 9   | 88.64           | 26      | 0.0          |
    | 10  | 199.6           | 29      | 0.0          |
