---
layout: layouts/base.njk
title: "Byzantine agreement"
section: casestudies
permalink: /casestudies/byzantine/
---
# Byzantine agreement

(Cachin, Kursawe & Shoup)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [Proof Structure](#proof)
-   [Contact](#contact)

## Introduction { #intro }

One of the fundamental problems in fault tolerant distributed computing is the Byzantine agreement problem. Byzantine agreement requires a set of parties in a distributed environment to agree on a value even if some of the parties are corrupted.

A number of solutions to the Byzantine agreement protocol exist. Unfortunately, the fundamental impossibility result of {% cite "FLP85" %} demonstrates that there is *no deterministic* algorithm for achieving agreement in the asynchronous setting even against benign failures. One solution which overcomes this problem, first introduced by Rabin {% cite "Rab83" %} and Ben-Or {% cite "Ben83" %}, is to use randomisation.

A *randomised* protocol uses random assignment, for example electronic coin tossing, and its termination is therefore probabilistic. The requirements for a randomised agreement protocol are:

-   **Validity:** *if all parties have the same initial value, then any party that decides must decide on this value.*
-   **Agreement:** *any two parties that decide must decide on the same value.*
-   **Probabilistic Termination:** *with probability 1, all initialised and non-corrupted parties eventually decide.*

## The Protocol { #protocol }

We consider the randomised Byzantine agreement protocol ABBA (Asynchronous Binary Byzantine Agreement) of Cachin, Kursawe and Shoup {% cite "CKS00" %} which is set in a completely asynchronous environment, allows the maximum number of corrupted parties and makes use of cryptography and randomisation. There are **n** parties, an adversary which is allowed to corrupt at most **t** of them (where **t < n/3**), and a trusted dealer. The parties proceed through possibly unboundedly many rounds: in each round, they attempt to agree by casting votes based on the votes of other parties.

In addition to **Validity** and **Agreement**, the protocol guarantees **Probabilistic termination** in constant expected time which is validated through the following property:

-   **Fast Convergence:** *The probability that an honest party advances more than* **2r+1** *rounds is bounded above by* **2<sup>-r</sup>**.

The cryptographic primitives the protocol uses are *threshold random-access coin-tossing schemes* and *non-interactive threshold signature schemes* which for this case study we presume are secure. In particular, we assume that the threshold random-access coin-tossing schemes are **Robust** and **Unpredictable**, and the threshold signature schemes are **Robust** and **Non-forgeable** (see {% cite "CKS00" %} for further details).

## The Proof Structure { #proof }

The aim is to automate the analysis of the ABBA protocol using the methodology introduced in our earlier paper {% cite "KNS01a" %} based on {% cite "MQS00" %}. In {% cite "KNS01a" %} we used [Cadence SMV](http://www-cad.eecs.berkeley.edu/~kenmcmil/smv/) and the probabilistic model checker PRISM to verify the simpler randomised agreement protocol of Aspnes and Herlihy {% cite "AH90" %} that tolerates only benign stopping failures. We achieved this through a combination of mechanical inductive proofs (for all **n** for non-probabilistic properties) and checks (for finite configurations in case of probabilistic properties) plus one high-level manual proof. The ABBA protocol, however, presented us with a number of difficulties not encountered earlier:

-   To verify the protocol for any number of parties **n**, we have to model parties with the abstract data type **ordset** {% cite "MQS00" %}. Unfortunately, the limitations of this type (restriction to comparison with constants only) make it impossible to identify an *arbitrary* static subset of **t** parties (**t < n/3**) that are corrupt. Likewise, *counting* a proportion of elements of such type is not feasible.
-   The efficiency of the protocol depends on a probabilistic property which states that the higher the round number (which is unbounded) that an honest party has advanced to, the lower the probability of this occurring. Thus, the model is infinite, and currently very little is known about methods for the abstraction and verification of infinite state probabilistic systems.
-   The ABBA protocol is based on the random oracle model, an idealisation of the collision-free hash functions used in real cryptographic settings. The random oracle model is necessary in order to prove security of the scheme, by placing certain statistical assumptions that prevent any adversary with realistic computing power \`guessing' the secret.

We overcome the above challenges as follows. We model the full protocol in Cadence SMV, having replaced the random outcomes with nondeterministic choices. The mentioned technical difficulties with the **ordset** data type were resolved largely by searching for a variant of the model which preserves the key property that the correctness argument relies on. The proof of the probabilistic property then reduces to a straightforward, high-level inductive argument based on a number of lemmas and cryptographic assumptions. We assume the cryptographic properties and automate the proof of each lemma. Together with the proofs of Validity and Agreement, which are more straightforward and fully automated, we obtain a partially mechanised argument for the correctness of the ABBA protocol *for all* **n** and *for all* rounds.

Further details on the Cadence SMV code and proofs of **Validity**, **Agreement** and **Fast Convergence** can be found [here](/casestudies/byzantine_smv/).

It should be emphasised that we cannot automate the final inductive argument as it is probabilistic: Cadence SMV cannot handle probabilities, whereas PRISM can only handle finite configurations and does not support data reduction. Instead we additionally validate the probabilistic analysis as follows. By observing that, for a fixed **n**, the problem can be reduced to model checking a finite state abstraction of the protocol, we manually construct an abstraction and model check it using PRISM, validating the probabilities for up to **n = 20** parties. Additionally, we verify (for a finite configuration) the correctness of the abstraction using the process algebra CSP {% cite "Ros97" %} and the [FDR](http://www.formal.demon.co.uk/FDR2.html) tool based on the method in {% cite "KNS01a" %}; this depends on the ability to code probabilities in the action names, and therefore precludes the use of Cadence SMV.

The verification of **Fast Convergence** using PRISM can be found [here](/casestudies/byzantine_prism/).

## Contact { #contact }

Please feel free to [email](mailto:gethin.norman@glasgow.ac.uk) us with any queries/comments/etc...
