---
layout: layouts/base.njk
title: "Randomised consensus protocol (Cadence SMV)"
section: casestudies
permalink: /casestudies/consensus_smv/
---
# Randomised consensus protocol (Cadence SMV)

(Aspnes & Herlihy)

## Contents

-   [Introduction](#intro)
-   [Validity](#validity)
-   [Agreement](#agree)
-   [Probabilistic wait-free termination](#progress)
-   [Additional Invariants](#invariants)

## Introduction { #intro }

[Cadence SMV](http://www-cad.eecs.berkeley.edu/~kenmcmil/smv/) is a proof assistant which supports several *compositional methods* methods {% cite "McM98", "McM99", "MQS00" %}. These methods allow the verification of large, complex, systems by reducing the verification problem to small problems that can be solved automatically by model checking. Cadence SMV provides a variety of such techniques including *induction*, *circular compositional reasoning*, *temporal case splitting* and *data type reduction*.

There are two main challenges posed by the *randomised consensus* protocol of Aspnes and Herlihy {% cite "AH90" %}: firstly, the round numbers are *unbounded*, leading to an *infinite* data type *NUM*, and, secondly, we wish to prove the correctness of the protocol for *any* number of processes, or, in other words, for *all* values of *N*. We achieve this by suitably combining data type reduction (**ordset**) with induction, circular compositional reasoning and temporal case splitting.

Recall that we can verify the properties: **Validity** and **Agreement** and the non-probabilistic arguments of **Probabilistic wait-free termination** using conventional model checking methods, by replaced the probabilistic choices with nondeterministic ones.

The Cadence SMV description of the randomised consensus protocol of {% cite "AH90" %}, with the probabilistic choices with nondeterministic choices, can be found [here](/casestudies/consensus/template.smv) (also as a pdf file [here](/casestudies/consensus/template.pdf)).

We are grateful to Ken McMillan for supplying a recent version of Cadence SMV and suggesting appropriate proof methods. Note that the version of Cadence SMV we have used is not fully compatible with the release of 08.08.00.

## Validity { #validity }

-   *If a process decides on a value, then this value is the initial value of some process.*

The proof of validity can be found [here](/casestudies/consensus/valid.smv) (also as a pdf file [here](/casestudies/consensus/valid.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/valid.log).

## Agreement { #agree }

-   *Any two processes that decide must decide on the same value.*

Agreement is the most difficult of the requirements to prove. The main step of proving agreement is proving Invariant 6.3 of {% cite "PSL00" %}. To simplify the proof and to keep the model checking feasible we had split the proof up into separate parts: assuming the properties proved in one while proving the others. The complete proof of Invariant 6.3 can be found [here](/casestudies/consensus/inv63.smv) (also as a pdf file [here](/casestudies/consensus/inv63.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/inv63.log).

The proof agreement (which assumes Invariant 6.3) can be found [here](/casestudies/consensus/agree.smv) (also as a pdf file [here](/casestudies/consensus/agree.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/inv61.log).

To prove agreement we additionally needed to prove that Lemma 6.12 of {% cite "PSL00" %} holds, the proof of which can be found here [here](/casestudies/consensus/lemma6.12.smv) (also as a pdf file [here](/casestudies/consensus/lemma6.12.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/lemma6.12.log).

## Probabilistic wait-free termination { #progress }

-   *With probability 1, all initialised and non-failed processes eventually decide.*

The proof of the non-probabilistic aguments in the proof of probabilistic wait-free termination can be found [here](/casestudies/consensus/progress.smv) (also as a pdf file [here](/casestudies/consensus/progress.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/progress.log).

## Additional Invariants { #invariants }

In all the above proofs certain invariants are assumed. The proof of these additional invariants can be found [here](/casestudies/consensus/invariants.smv) (also as a pdf file [here](/casestudies/consensus/invariants.pdf)) and the output from Cadence SMV [here](/casestudies/consensus/invariants.log).
