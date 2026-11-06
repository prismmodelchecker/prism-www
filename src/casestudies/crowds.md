---
layout: layouts/base.njk
title: "Crowds"
section: casestudies
permalink: /casestudies/crowds/
---
# Crowds Protocol

(Reiter & Rubin)

*[contributed by Vitaly Shmatikov]*{.note}

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [The Model](#model)
-   [Analysis Results](#results)

**Related publications**: {% cite "Shm02", "Shm04" %}

## Introduction { #intro }

The *Crowds* protocol was developed by Reiter and Rubin {% cite "RR98" %} to provide users with a mechanism for anonymous Web browsing. The main idea behind Crowds and similar approaches to anonymity is to hide each user's communications by routing them randomly within a group of similar users. Even if a local eavesdropper or a corrupt group member observes a message being sent by a particular user, it can never be sure whether the user is the actual sender, or is simply routing another user's message.

**Adversary model:** It is assumed that corrupt routers are only capable of observing their local networks. The adversary's observations are thus limited to the apparent source of the message. As the message travels down a (randomly constructed) routing path from its real sender to the destination, the adversary observes it only if at least one of the corrupt members was selected among the routers. The only information available to the adversary is the identity of the crowd member immediately preceding the first corrupt member on the path. It is also assumed that communication between any two crowd members is encrypted by a pairwise symmetric key.

**Single-path anonymity:** Crowds is designed to provide anonymity for message *senders*. Under a specific condition on system parameters, Crowds provably guarantees the following property for each routing path:

-   *Probable innocence:* The real sender appears no more likely to be the originator of the message than to not be the originator.

**Multiple-path anonymity:** In this case study, we explore anonymity protection provided by Crowds if there exist multiple routing paths through the crowd originating from the same sender, *assuming that the collaborating corrupt members are capable of determining whether two paths originate from the same source*.

To maintain an anonymous connection when crowd membership changes, each sender must rebuild its routing path to the destination through the new crowd. If both the new and the old paths include corrupt routers, the adversary may able to determine that the two paths originate from the same (unknown) crowd member using clues such as browsing patterns, persistent session data (cookies), timing observations, etc. The only protection against the same-origin paths correlation provided by the Crowds system *per se* is to caution users from browsing related content after path reformulation, and reduce the frequency of reformulations by batching new member joins together. Since neither completely eliminates the corrupt routers' ability to relate multiple paths over the long term, we assume in our analysis that attacks based on multiple-path observations are feasible.

## The Protocol { #protocol }

Routing paths in Crowds are set up using the following protocol:

-   The sender selects a crowd member at random (possibly itself), and forwards the message to it, encrypted by the corresponding pairwise key.
-   The selected router flips a biased coin. With probability *1-p*<sub><i>f</i></sub>, where *p*<sub><i>f</i></sub> (*forwarding probability*) is a parameter of the system, it delivers the message directly to the destination. With probability *p*<sub><i>f</i></sub>, it selects a crowd member at random (possibly itself) as the next router in the path, and forwards the message to it, re-encrypted with the appropriate pairwise key. The next router then repeats this step.

The path from a particular source to a particular destination is set up only once, when the first message is sent. The routers maintain a persistent id for each constructed path, and all subsequent messages follow the established path.

If the crowd contains *n* members, of which *c* are corrupt, and the forwarding probability is *p*<sub><i>f</i></sub>, then Crowds guarantees *probable innocence* of the real sender on any single path (i.e., the probability that the real sender appears on the path immediately before a corrupt member is less than 0.5) if the following condition holds:

![](/images/cs/crowds.probinn.gif)

## The Model { #model }

PRISM code for the DTMC model of the Crowds path setup protocol is given below.

{% prismCode "casestudies/examples/crowds.pm", false, true %}

There is no bound on the maximum size of the routing path. For simplicity, instead of modeling each corrupt crowd member separately, we model a single adversary who is selected as a router with a fixed probability equal to the sum of selection probabilities of all corrupt members. The model is parameterised so that different finite configurations of the Crowds system can be analyzed. In particular, **PF** is the forwarding probability *p*<sub><i>f</i></sub>, **CrowdSize** is the number of honest crowd members, **badC** is the proportion of the corrupt members in the crowd. The total number of crowd members *N* = **CrowdSize**/(1-**badC**). **TotalRuns** is the number of different paths to be analyzed.

The following table shows the size of the state space for various configurations of the Crowds model:

| Honest members: | Path reformulations: ||||
| ^^              | 3                    | 4       | 5         | 6          |
|----------------:|---------------------:|--------:|----------:|-----------:|
| 5               | 1,198                | 3,515   | 8,653     | 18,817     |
| 10              | 6,563                | 30,070  | 111,294   | 352,535    |
| 15              | 19,228               | 119,780 | 592,060   | 2,464,167  |
| 20              | 42,318               | 333,455 | 2,061,951 | 10,633,591 |

Let **observe**<sub><i>i</i></sub> be the system variable representing how many times the adversary observed crowd member *i* as the apparent sender, *i.e.*, crowd member *i* immediately preceded one of the corrupt members on the routing path. Let crowd member *0* be the real sender. To analyze anonymity protection provided by Crowds in the multiple-paths case, we use PRISM to automatically compute probabilities of the Crowds system reaching states where the following events have occurred:

-   **observe**<sub>0</sub>\>1. The adversary observed the real sender more than once.
-   **observe**<sub><i>i</i></sub>\>1 for some *i>0*. The adversary observed someone other than the real sender more than once.
-   **observe**<sub><i>i</i></sub>≤1 for all *i>0* *assuming* **observe**<sub>0</sub>\>1. The adversary observed the real sender and *only* the real sender more than once.

## Analysis Results: { #results }

For the following analyses, we assumed that the forwarding probability *p*<sub><i>f</i></sub> = 0.8. The following table shows probabilities of various observations by the adversary as computed by PRISM:

| Crowd:               | Path reformulations: |||||
| ^^                   |                      | 3     | 4     | 5     | 6     |
|---------------------:|---------------------:|------:|------:|------:|------:|
| 5 honest, 1 corrupt  | Positive             | 0.138 | 0.235 | 0.333 | 0.427 |
| ^^                   | False positive       | 0.051 | 0.091 | 0.129 | 0.158 |
| ^^                   | "Confidence"         | 1.000 | 0.974 | 0.931 | 0.869 |
| 10 honest, 2 corrupt | Positive             | 0.104 | 0.181 | 0.263 | 0.346 |
| ^^                   | False positive       | 0.029 | 0.055 | 0.082 | 0.108 |
| ^^                   | "Confidence"         | 1.000 | 0.989 | 0.962 | 0.925 |
| 15 honest, 3 corrupt | Positive             | 0.094 | 0.165 | 0.241 | 0.318 |
| ^^                   | False positive       | 0.020 | 0.039 | 0.059 | 0.079 |
| ^^                   | "Confidence"         | 1.000 | 0.989 | 0.975 | 0.950 |
| 20 honest, 4 corrupt | Positive             | 0.089 | 0.156 | 0.230 | 0.305 |
| ^^                   | False positive       | 0.016 | 0.030 | 0.046 | 0.063 |
| ^^                   | "Confidence"         | 1.000 | 0.994 | 0.978 | 0.961 |

| 10 honest, 1 corrupt | Positive             | 0.037 | 0.068 | 0.105 | 0.145 |
| ^^                   | False positive       | 0.016 | 0.030 | 0.048 | 0.168 |
| ^^                   | "Confidence"         | 1.000 | 0.996 | 0.981 | 0.966 |
| 20 honest, 2 corrupt | Positive             | 0.030 | 0.055 | 0.086 | 0.120 |
| ^^                   | False positive       | 0.008 | 0.016 | 0.026 | 0.038 |
| ^^                   | "Confidence"         | 1.000 | 0.996 | 0.988 | 0.983 |

**Increasing path reformulations:** As can be seen from the table above, the probability of successful observation of the real sender by the adversary (**Positive** event) grows for any given crowd as the number of paths increases. Note that the probabilities were computed *without* assuming that a corrupt member appears on every path from the sender. Our only assumption is that corrupt members can determine that two or more paths originate from the same sender *if* at least one corrupt sender was selected for each of the paths.

This result implies that anonymity guarantees provided by Crowds will inevitably degrade with time for any sender. As crowd membership changes, and the sender is forced to construct new random paths to the destination, corrupt members of the crowd will accumulate more and more observations, enabling them to eventually observe the real sender with increasing probability.

**Increasing crowd size:** Increasing crowd size influences anonymity guarantees provided by Crowds in two ways. First, as expected, for any given number of path reformulations. the probability of successful observation by the adversary (**Positive** event) decreases with increased crowd size.

The second impact of increasing crowd size is the *increased* confidence the adversary has in its observations. The bigger the crowd, the more confident the corrupt members are that, once they observed some crowd member more than once, the observed member is, in fact, the real sender. Note that the *probable innocence* property guaranteed by Crowds is akin to *deniability* rather than true anonymity, *i.e.*, Crowds does not so much hide the real sender's identity as enables it to plausibly deny that s/he is the sender. Instead of obtaining better protection with the increased crowd size, the real sender instead faces decreased deniability due to higher confidence of the adversary. This presents a potential problem for users of the Crowds system.
