---
layout: layouts/base.njk
title: "Byzantine Agreement"
section: casestudies
permalink: /casestudies/byzantine_prism/
---
# Byzantine Agreement

(Cachin, Kursawe & Shoup)

## Contents

-   [Introduction](#intro)
-   [Model and MTBDD Sizes](#sizes)
-   [Model Construction Times](#times)
-   [Model Checking](#mc)
-   [Correctness of PRISM Model](#abstr)

## Introduction: { #intro }

This case study concerns modelling and verifying the Byzantine agreement protocol of Cachin, Kurwawe and Shoup {% cite "CKS00" %} using [PRISM](/). The property of the Byzantine agreement protocol we wish to verify is

-   **Fast Convergence:** *The probability that an honest party advances more than* **2r+1** *rounds is bounded above by* **2<sup>-r</sup>**.

Since there may be an *unbounded* number of rounds, we cannot model the full protocol in PRISM. However, following the proof of {% cite "CKS00" %} it is sufficient to show that, from the start of any round **r**, with probability at least 1/2 all honest parties have the same pre-vote in round **r+1**. We therefore construct an *abstract* version of this protocol concentrating on an arbitrary round **r**. More precisely, we consider only the choices made by the parties in round **r** and round **r+1**, and abstract the choices made in earlier rounds. Then to prove **Fast Convergence**, it suffices to show that, in the initial state of the abstract protocol, with probability at least 1/2 all honest parties have the same pre-vote in round **r+1**.

More details on the abstraction are given in {% cite "KN02" %} and the verification of the correctness of the abstraction is explained [below](#abstr).

An example of the source code for this model (when **n=4** and **t=1**) is given below.

{% prismCode "casestudies/examples/byzantine4_1.nm", true, true %}

All experiments were run on a 440 MHz SUN Ultra 10 workstation with 512 Mb memory under the Solaris 2.7 operating system.

## Model and MTBDD Sizes: { #sizes }

The table below shows statistics for each model and the MTBDD which represents it. The first column gives the size of the model (i.e. the number of **states**). The second two columns refer to the MTBDD: the total number of **nodes** in the structure and the number of **leaves** (or terminal nodes).

{: columns="2 3" }

| Model: || States:             | Nodes:  | Leaves: |
| n      | t   | ^^                  | ^^      | ^^      |
|--------|-----|---------------------|---------|---------|
| 4      | 1   | 16,468              | 17,856  | 3       |
| 5      | 1   | 99,772              | 32,712  | 3       |
| 6      | 1   | 567,632             | 48,158  | 3       |
| 7      | 2   | 1,303,136           | 70,733  | 3       |
| 8      | 2   | 8,197,138           | 99,003  | 3       |
| 9      | 2   | 50,022,552          | 128,102 | 3       |
| 10     | 3   | 98,209,858          | 161,171 | 3       |
| 11     | 3   | 640,388,556         | 203,846 | 3       |
| 12     | 3   | 4,089,261,632       | 247,187 | 3       |
| 13     | 4   | 7,247,209,720       | 290,597 | 3       |
| 14     | 4   | 48,562,817,530      | 347,457 | 3       |
| 15     | 4   | 319,913,572,942     | 405,793 | 3       |
| 16     | 5   | 527,308,719,290     | 458,923 | 3       |
| 17     | 5   | 3,605,408,189,674   | 531,165 | 3       |
| 18     | 5   | 24,294,110,158,354  | 604,634 | 3       |
| 19     | 6   | 37,922,603,935,954  | 667,739 | 3       |
| 20     | 6   | 263,297,811,600,566 | 755,333 | 3       |

## Model Construction Times: { #times }

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

{: columns="2 1 1" }

| Model: || Construction: ||
| n      | t   | Time (s):     | Iterations: |
|--------|-----|---------------|-------------|
| 4      | 1   | 3.00          | 19          |
| 5      | 1   | 5.41          | 24          |
| 6      | 1   | 8.53          | 29          |
| 7      | 2   | 10.9          | 29          |
| 8      | 2   | 20.0          | 34          |
| 9      | 2   | 27.0          | 39          |
| 10     | 3   | 33.8          | 39          |
| 11     | 3   | 62.4          | 44          |
| 12     | 3   | 75.4          | 49          |
| 13     | 4   | 98.3          | 49          |
| 14     | 4   | 157           | 54          |
| 15     | 4   | 194           | 59          |
| 16     | 5   | 241           | 59          |
| 17     | 5   | 363           | 64          |
| 18     | 5   | 610           | 69          |
| 19     | 6   | 694           | 69          |
| 20     | 6   | 1,079         | 74          |

## Model Checking: { #mc }

The model checking procedure uses a precomputation step **Prob0A** which finds all those states such that the maximum probability of satisfying the formula is 0. The precomputation involves a BDD based fixpoint algorithm.

In the main algorithm we stop iterating when the *relative error* between subsequent iteration vectors is less than 1e-6, that is:

![](/images/cs/err.gif)

## Requirements:

When model checking, we have the following requirement:

**Scheduler-Liveness:** "for each time *t* and any party *i*, there exists a time *t*' > *t* in which *i* is scheduled."

This corresponds to the conditions on the *adversary/scheduler* which we impose by model checking against only *fair* adversaries.

## Properties:

We have verified that: from the start of any round **r**, with probability at least 1/2 all honest parties have the same pre-vote in round **r+1**. This property can be expressed in PCTL as follows (where **n=4** and **t=1**):

```prism
P>=0.5 [ true U s1=9 & s2=9 & s3=9 & ((pre2_0=1 & pre2_1=0) | (pre2_1=1 & pre2_0=0)) ]
```

The table below give the model checking results for the MTBDD, Sparse and Hybrid engines and includes the minimum probability of, from the intial state, reaching a state where all honest parties have the same pre-vote in round **r+1**.

**Model checking times:**

| Model: || Precomputation:    || Main Algorithm:    |||| Result: |
| n      | t   | Time per iter. (s) | Iterations: | Time per iter. (s) ||| Iterations: | ^^      |
| ^^     | ^^  | ^^                 | ^^          | MTBDD              | Sparse | Hybrid | ^^          | ^^      |
|--------|-----|--------------------|-------------|--------------------|--------|--------|-------------|---------|
| 4      | 1   | 0.035              | 18          | 0.051              | 0.017  | 0.038  | 12          | true    |
| 5      | 1   | 0.088              | 23          | 0.170              | 0.172  | 0.228  | 14          | true    |
| 6      | 1   | 0.153              | 28          | 0.171              | 0.937  | 3.56   | 16          | true    |
| 7      | 2   | 0.378              | 28          | 0.298              | 2.31   | 9.15   | 15          | true    |
| 8      | 2   | 0.389              | 33          | 0.407              | -      | 59.6   | 17          | true    |
| 9      | 2   | 0.634              | 38          | 0.569              | -      |        | 18          | true    |
| 10     | 3   | 0.829              | 38          | 0.993              | -      | -      | 17          | true    |
| 11     | 3   | 1.399              | 43          | 1.08               | -      | -      | 20          | true    |
| 12     | 3   | 1.44               | 48          | 1.84               | -      | -      | 22          | true    |
| 13     | 4   | 2.09               | 48          | 3.09               | -      | -      | 20          | true    |
| 14     | 4   | 3.67               | 53          | 3.69               | -      | -      | 22          | true    |
| 15     | 4   | 6.29               | 58          | 3.92               | -      | -      | 25          | true    |
| 16     | 5   | 8.81               | 58          | 5.51               | -      | -      | 22          | true    |
| 17     | 5   | 12.6               | 63          | 6.97               | -      | -      | 25          | true    |
| 18     | 5   | 16.0               | 68          | 7.65               | -      | -      | 27          | true    |
| 19     | 6   | 19.7               | 68          | 17.8               | -      | -      | 25          | true    |
| 20     | 6   | 26.0               | 73          | 29.8               | -      | -      | 27          | true    |

  

**Conclusion:** the property holds in the initial state.

---

## Correctness of the PRISM Model: { #abstr }

To prove the correctness of the abstract model constructed in PRISM, we follow the technique presented in {% cite "KNS03b" %} (for timed probabilistic systems), which reduces verifying the correctness of the abstraction to constructing non-probabilistic variants of the abstract and concrete models to checking trace refinement between these systems. The method is reliant on when constructing the non-probabilistic models encoding the probabilistic information and choices of the adversary in *actions*. Since the Cadence SMV language does not support actions, we use the process algebra CSP {% cite "Ros97" %} and the model checker [FDR](http://www.fsel.com/software.html).

More formally, we translate both the abstract protocol and the Cadence SMV version of the protocol (restricted to two arbitrary rounds and with the probabilistic choices correctly modelled) into CSP, encoding both the probabilistic choices and the possible non-deterministic choices of the adversary into the actions of the CSP processes. Using the tool FDR we were then able to show that the concrete protocol is a trace refinement of the abstract protocol, and hence the correctness of our abstraction. Note that we were only able to do this for finite configurations.

The FDR code for the case when **n=4** and **t=1** can be found here [here](/casestudies/examples/byzantine4_1.fdr2).
