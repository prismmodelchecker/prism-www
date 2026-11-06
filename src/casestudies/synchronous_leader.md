---
layout: layouts/base.njk
title: "Synchronous Leader Election"
section: casestudies
permalink: /casestudies/synchronous_leader/
---
# Synchronous Leader Election Protocol

(Itai & Rodeh)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Checking](#mc)

## Introduction: { #intro }

This case study is based on the synchronous leader election protocol of Itai & Rodeh {% cite "IR90" %}. This protocol solves the following problem.

> *Given a synchronous ring of **N** processors design a protocol such that they will be able to elect a leader (a uniquely designated processor) by sending messages around the ring.*

The protocol proceeds in rounds and is parametrised by a constant **K**. Each round begins by all processors (independently) choosing a random number (uniformly) from {1,...,**K**} as an **id**. The processors then pass their **id**s around the ring. If there is a unique **id**, then the processor with the *maximum unique* **id** is elected the leader, and otherwise the processors begin a new round.

We assume that the ring is *synchronous*: there is a global clock and at every time slot a processor reads the message that was sent at the previous time slot (if it exists), makes at most one state transition and then may send at most one message.

By way of example, the PRISM source code for the case where **N=4** and **K=8** is given below.

{% prismCode "casestudies/examples/leader4_8.pm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for the DTMCs we have built for different values of the constants `N` and `K`. The tables include:

-   the number of **states** and **transitions** in the DTMC representing the model;
-   both the number of **nodes** and **leaves** of the MTBDD which represents the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly;
-   the number of **iterations** required to find the reachable states (which is performed via a BDD based fixpoint algorithm).

  

| N:  | K:  | Model:  || MTBDD:    || Construction: ||
| ^^  | ^^  | States: | Transitions: | Nodes:    | Leaves: | Time (s):     | Iter.s: |
|-----|-----|---------|--------------|-----------|---------|---------------|---------|
| 3   | 2   | 22      | 29           | 367       | 3       | 0.059         | 5       |
| ^^  | 4   | 135     | 198          | 1,781     | 3       | 0.196         | 5       |
| ^^  | 6   | 439     | 654          | 5,632     | 3       | 0.37          | 5       |
| ^^  | 8   | 1,031   | 1,542        | 10,595    | 3       | 0.658         | 5       |
| ^^  | 10  | 2,007   | 3,006        | 23,382    | 3       | 1.501         | 5       |
| ^^  | 12  | 3,466   | 5,193        | 29,617    | 3       | 1.556         | 5       |
| ^^  | 14  | 5,495   | 8,238        | 51,000    | 3       | 1.624         | 5       |
| ^^  | 16  | 8,199   | 12,294       | 69,553    | 3       | 4.719         | 5       |
| 4   | 2   | 55      | 70           | 908       | 3       | 0.079         | 6       |
| ^^  | 4   | 782     | 1,037        | 10,801    | 3       | 0.242         | 6       |
| ^^  | 6   | 3,902   | 5,197        | 58,324    | 3       | 1.427         | 6       |
| ^^  | 8   | 12,302  | 16,397       | 165,625   | 3       | 10.90         | 6       |
| ^^  | 10  | 30,014  | 40,013       | 473,188   | 3       | 38.38         | 6       |
| ^^  | 12  | 62,222  | 82,957       | 929,667   | 3       | 163.6         | 6       |
| 5   | 2   | 136     | 167          | 1,731     | 3       | 0.067         | 7       |
| ^^  | 4   | 4,124   | 5,147        | 41,528    | 3       | 0.623         | 7       |
| ^^  | 6   | 31,133  | 38,908       | 337,108   | 3       | 15.28         | 7       |
| ^^  | 8   | 131,101 | 163,868      | 1,274,313 | 3       | 231.5         | 7       |
| 6   | 2   | 329     | 392          | 3,163     | 3       | 0.086         | 8       |
| ^^  | 4   | 20,524  | 24,619       | 140,735   | 3       | 2.619         | 8       |
| ^^  | 6   | 233,340 | 279,995      | 1,732,096 | 3       | 561.7         | 8       |
| 8   | 2   | 1803    | 2,058        | 7857      | 3       | 0.147         | 10      |
| ^^  | 4   | 458,847 | 524,382      | 1,131,806 | 3       | 300.0         | 10      |
| 10  | 2   | 9,229   | 10,252       | 16,128    | 3       | 0.276         | 12      |

  
## Model Checking: { #mc }

We have model checked the following properties:

<a name="prop1"></a>

-   **With probability 1, eventually a leader is elected.**
    
    This property, in the case when **N**\=4, can be expressed in PCTL as follows:
    
    ```prism
    P>=1 [ true U (s1=3 & s2=3 & s3=3 & s4=3) ]
    ```
    
    **Model checking times:**
    
    | N:  | K:  | Prob1 precomputation: ||
    | ^^  | ^^  | Time (s):             | Iterations: |
    |-----|-----|-----------------------|-------------|
    | 3   | 2   | 0.00                  | 18          |
    | ^^  | 4   | 0.01                  | 18          |
    | ^^  | 6   | 0.05                  | 18          |
    | ^^  | 8   | 0.09                  | 18          |
    | ^^  | 10  | 0.21                  | 18          |
    | ^^  | 12  | 0.35                  | 18          |
    | ^^  | 14  | 0.52                  | 18          |
    | ^^  | 16  | 0.74                  | 18          |
    | 4   | 2   | 0.01                  | 22          |
    | ^^  | 4   | 0.12                  | 22          |
    | ^^  | 6   | 0.68                  | 22          |
    | ^^  | 8   | 2.08                  | 22          |
    | ^^  | 10  | 6.83                  | 22          |
    | ^^  | 12  | 13.9                  | 22          |
    | 5   | 2   | 0.02                  | 26          |
    | ^^  | 4   | 0.67                  | 26          |
    | ^^  | 6   | 8.33                  | 26          |
    | ^^  | 8   | 116                   | 26          |
    | 6   | 2   | 0.05                  | 30          |
    | ^^  | 4   | 3.42                  | 30          |
    | ^^  | 6   | 148                   | 30          |
    | 8   | 2   | 0.17                  | 38          |
    | ^^  | 4   | 72.5                  | 38          |
    | 10  | 2   | 0.43                  | 46          |
    
      
    
    **Conclusion:** the property holds in all states
    
    <a name="bounded"></a>
    
-   The probability of electing a leader within **L** rounds.
    
    This property, in the case when **N**\=4, can be expressed in PCTL as follows:
    
    ```prism
    P=? [ true U<=L*(N+1) (s1=3 & s2=3 & s3=3 & s4=3) ]
    ```
    
    In the graphs below we have plotted these expected values as **L** varies for a range of values of **N** and **K**.
    
    -   **N=3**
        
        ![probability leader elected within L rounds (N=3)](/images/graphs/leader.sync3.bounded.png)

    -   **N=4**
        
        ![probability leader elected within L rounds (N=4)](/images/graphs/leader.sync4.bounded.png)

    -   **N=5**
        
        ![probability leader elected within L rounds (N=5)](/images/graphs/leader.sync5.bounded.png)

    -   **K=2**
        
        ![probability leader elected within L rounds (K=2)](/images/graphs/leader.syncK2.bounded.png)

    -   **K=4**
        
        ![probability leader elected within L rounds (K=4)](/images/graphs/leader.syncK4.bounded.png)
    
    <a name="expected time"></a>
    
-   The expected number of rounds to elect a leader.
    
    This property, in the case when **N**\=4, can be expressed in PCTL as follows:
    
    ```prism
    R=? [ F (s1=3 & s2=3 & s3=3 & s4=3) ]
    ```
    
    In the graphs below we have plotted these expected values for a range of values of **N** and **K**.
    
    ![expected time to elect a leader](/images/graphs/leader.sync.expected.png)

    ![expected time to elect a leader (small scale)](/images/graphs/leader.sync.expected.log.png)
