---
layout: layouts/base.njk
title: "Randomised consensus protocol"
section: casestudies
permalink: /casestudies/consensus/
---
# Randomised consensus protocol

(Aspnes & Herlihy)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [Proof Structure](#proof)
-   [Contact](#contact)

## Introduction { #intro }

Consensus problems arise in many distributed applications, for example, when it is necessary to agree whether to commit or abort a transaction in a distributed database. A *distributed consensus protocol* is an algorithm for ensuring that a collection of distributed processes, which start with some initial value (1 or 2) supplied by their environment, eventually terminate agreeing on the same value. Typical requirements for such a protocol are:

-   **Validity:** *If a process decides on a value, then this value is the initial value of some process.*
-   **Agreement:** *Any two processes that decide must decide on the same value.*
-   **Termination:** *All processes eventually decide.*

A number of solutions to the consensus problem exist. If the processes can exhibit *stopping failures* then the **Termination** requirement is too strong and must be replaced by:

-   **Wait-free termination:** *All initialised and non-failed processes eventually decide.*

Unfortunately, the fundamental impossibility result of {% cite "FLP85" %} demonstrates that there is *no deterministic* algorithm for achieving wait-free agreement in the asynchronous distributed model with communication via shared read/write variables even in the presence of at most one stopping failure. One solution is to use randomisation, which necessitates a weaker termination guarantee:

-   **Probabilistic wait-free termination:** *With probability 1, all initialised and non-failed processes eventually decide.*

The algorithm we consider in this paper is due to Aspnes & Herlihy {% cite "AH90" %}. It is a complex algorithm which uses a sophisticated shared coin-flipping protocol. In addition to **Validity** and **Agreement**, it guarantees **Probabilistic wait-free termination** within polynomial expected time for the asynchronous distributed model with communication via shared read/write variables in the presence of stopping failures.

## The Protocol { #protocol }

The *randomised consensus* protocol of Aspnes and Herlihy {% cite "AH90" %} consists of *N* asynchronous processes that communicate via read/write shared registers. The processes proceed through possibly *unboundedly many* rounds; at each round, they read the status of all other processes and attempt to agree. The agreement attempt involves a *distributed random walk* (a Markov decision process, i.e. a combination of nondeterministic and probabilistic choices): when the processes disagree, they use a shared coin-flipping protocol to decide their next preferred value. Achieving polynomial expected time depends in an essential way on ensuring that the *probability* that all non-failed processes draw the same value is above an appropriate bound.

## The Proof Structure { #proof }

One possible approach to analyse the Aspnes and Herlihy algorithm is to model and verify it using a probabilistic model checker such as PRISM. However, there are a number of problems with this approach:

-   It gives rise to an infinite model.
-   Even restricting to a finite model by fixing the maximum number of processes and rounds, the resulting models are very large, leading to 9x10<sup>6</sup> states even for the simpler (exponential expected time) protocol with 3 processes and 4 rounds.
-   Many of the correctness requirements are non-probabilistic, and can be discharged with a conventional model checker.

Therefore, we adopt a different approach, introduced by Pogosyants, Segala and Lynch {% cite "PSL00" %}: we separate the algorithm into two communicating components, one non-probabilistic (asynchronous parallel composition of processes which periodically request the outcome of a coin protocol) and the other probabilistic (a coin-flipping protocol shared by the processes). For the non-probabilistic part we use the proof assistant [Cadence SMV](http://www-cad.eecs.berkeley.edu/~kenmcmil/smv/), which enables us to verify the non-probabilistic requirements *for all N* and *for all rounds* by applying the reasoning introduced in {% cite "MQS00" %}. The shared coin-flipping protocol is modelled and verified using the probabilistic model checker PRISM. For a finite number of processes (up to 10) we are able to mechanically calculate the exact (minimum) probability of the processes drawing the same value, as opposed to a lower bound established analytically in {% cite "AH90" %} using random walk theory. The correctness of the full protocol (for the finite configurations mentioned above) follows from the separately proved properties.

Recall that in order to verify the above protocol correct we need to establish three properties: **Validity**, **Agreement** and **Probabilistic wait-free termination**. The first two are independent of the actual values of probabilities. Therefore, we can verify these properties by *conventional model checking methods*, having replaced the probabilistic choices with nondeterministic ones.

We are left to consider **Probabilistic wait-free termination**. This property depends on the probabilistic properties of the coin-flipping protocol. However, there are several **probabilistic progress** properties which do *not* depend on any probabilistic assumptions. Similarly to the approach of {% cite "PSL00" %} we analyse such properties in the non-probabilistic variant of the model, except we use Cadence SMV, thus *confining the probabilistic arguments* to a limited section of the analysis.

**Non-probabilistic Verification:** the verification of **Validity** and **Agreement** and the non-probabilistic arguments for proving **Probabilistic wait-free termination** using Cadence SMV can be found [here](/casestudies/consensus_smv/).

**Probabilistic Verification:** the verification of the probabilistic arguments for proving **Probabilistic wait-free termination** using PRISM can be found [here](/casestudies/consensus_prism/).

## Contact { #contact }

Please feel free to [email](mailto:gethin.norman@glasgow.ac.uk) us with any queries/comments/etc...
