---
layout: layouts/base.njk
title: "Dining cryptographers"
section: casestudies
permalink: /casestudies/dining_crypt/
---
# Dining cryptographers

(Chaum)

## Contents

-   [Introduction](#intro)
-   [The Model](#model)
-   [Model Checking](#mc)

## Introduction { #intro }

Three cryptographers are having dinner at their favourite restaurant. The waiter informs them that arrangements have been made for the bill to be paid anonymously: one of the cryptographers might be paying for the dinner, or it might be their master. The three cryptographers respect each other's privacy, but would like to know if the master is paying for dinner. To answer this question the cryptographers take part in the following protocol {% cite "Cha88" %}:

-   Each cryptographer flips an unbiased coin and only informs the cryptographer on the right of the outcome.
-   Each cryptographer states whether the two coins that it can see (the one it flipped and the one the left-hand neighbour flipped) are the same ("agree") or different ("disagree").
-   However, if a cryptographer actually paid for dinner, then it instead states the the opposite ("disagree" if the coins are the same and "agree" if the coins are different).

An even number of "agrees"s indicates that the master paid while an odd number indicates that a cryptographer paid.

The above protocol can be generalised to any number N of cryptographers, where:

-   if N is odd, then an odd number of "agree"s indicates that the master paid while an even number indicates that a cryptographer paid.
-   if N is even, then an even number of "agree"s indicates that the master paid while an odd number indicates that a cryptographer paid;

## The model { #model }

By way of example, the PRISM source code for the algorithm in the case where N = 3 is given below.

{% prismCode "casestudies/examples/dining_crypt3.nm", false, true %}

## Model Statistics { #stats }

The table below shows statistics for the MDPs we have built for different values of the constant `N`. The tables include:

-   the number of **states** and **transitions** in the MDP representing the model;
-   the **construction time** which equals the time taken for the system description to be parsed and converted to the MTBDD representing it, and the time to perform reachability, identify the non-reachable states and filter the MTBDD accordingly.

| N:  | Model:              || Construction time (s): |
| ^^  | States:             | Transitions:          | ^^                     |
|-----|---------------------|-----------------------|------------------------|
| 3   | 286                 | 585                   | 0.001                  |
| 4   | 1,733               | 4,580                 | 0.01                   |
| 5   | 9,876               | 32,315                | 0.03                   |
| 6   | 54,055              | 211,566               | 0.07                   |
| 7   | 287,666             | 1,312,045             | 0.11                   |
| 8   | 1,499,657           | 7,813,768             | 0.22                   |
| 9   | 7,695,856           | 45,103,311            | 0.34                   |
| 10  | 39,005,611          | 253,985,650           | 0.52                   |
| 15  | 115,553,171,626     | 1,128,594,416,085     | 3.27                   |
| 20  | 304,287,522,253,461 | 3,962,586,180,540,340 | 13.48                  |

  
## Model Checking { #mc }

We have model checked the following properties:

-   **Correctness.** To prove correctness we show that:
    
    -   if N is odd, then an odd number of "agree"s indicates that the master paid while an even number indicates that a cryptographer paid.
    -   if N is even, then an even number of "agree"s indicates that the master paid while an odd number indicates that a cryptographer paid;
    
    i.e. that, if the master paid, the parity of the number of "agree"s matches the parity of N and, if a cryptographer paid, it does not. In PRISM, we have:
    

{% prismCode "casestudies/examples/dining_crypt_correctness.pctl", false, true %}


where the label "`done`" and the formula `parity` are defined in the model (above).

**Model Checking Times:**

| N:  | master pays: || cryptographers pay: ||
| ^^  | time:        | iterations: | time:               | iterations: |
|-----|--------------|-------------|---------------------|-------------|
| 3   | 0.028        | 7           | 0.008               | 7           |
| 4   | 0.061        | 9           | 0.032               | 9           |
| 5   | 0.141        | 11          | 0.085               | 11          |
| 6   | 0.322        | 13          | 0.292               | 13          |
| 7   | 0.778        | 15          | 0.563               | 15          |
| 8   | 1.467        | 17          | 2.25                | 17          |
| 9   | 2.67         | 19          | 4.14                | 19          |
| 10  | 6.30         | 21          | 7.63                | 21          |
| 15  | 56.9         | 31          | 185                 | 31          |
| 20  | 268          | 41          | 954                 | 41          |

  

**Conclusion:** the properties hold in all states

-   **Anonymity.** To verify anonymity, namely that when a cryptographer pays then no cryptographer can tell which one has paid, we check that any possible combination of "agree" and "disagree" has the same likelihood no matter which of the cryptographers pays. Furthermore, we need to check that the probability of each combination is the same for any possible scheduling of the cryptographers during the protocol.
    
    We do this by computing, for each of the 2<sup>N</sup> possible outcomes (only 2<sup>(N-1)</sup> of which should occur when a cryptographer paid), the minimum and maximum probability it occurring. The PRISM property file is:

{% prismCode "casestudies/examples/dining_crypt_anonymity.pctl", false, true %}


where the formula `outcome` (which maps the different possible values of the "agree"s to distinct unique integer values) is defined in the model (shown above).

The table below gives the results for checking that, when N is odd all the cryptographers state disagree (k=0), and when N is even only the Nth cryptographer states disagree (k=1).

**Model Checking Times:**

| N:  | minimum: ||| maximum: |||
| ^^  | time:    | iterations: | probability:   | time:    | iterations: | probability:   |
|-----|----------|-------------|----------------|----------|-------------|----------------|
| 3   | 0.099    | 8           | 0.25           | 0.004    | 8           | 0.25           |
| 4   | 0.041    | 10          | 0.125          | 0.006    | 10          | 0.125          |
| 5   | 0.172    | 12          | 0.0625         | 0.032    | 12          | 0.0625         |
| 6   | 0.231    | 14          | 0.03125        | 0.044    | 14          | 0.03125        |
| 7   | 0.595    | 16          | 0.015625       | 0.301    | 16          | 0.015625       |
| 8   | 1.111    | 18          | 0.0078125      | 0.540    | 18          | 0.0078125      |
| 9   | 2.12     | 20          | 0.00390625     | 1.31     | 20          | 0.00390625     |
| 10  | 3.53     | 22          | 0.001953125    | 2.67     | 22          | 0.001953125    |
| 15  | 45.1     | 32          | 6.103515625E-5 | 36.8     | 32          | 6.103515625E-5 |

  

**Conclusion:** anonymity holds.
