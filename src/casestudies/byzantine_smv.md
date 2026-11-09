---
layout: layouts/base.njk
title: "Byzantine agreement (Cadence SMV)"
section: casestudies
permalink: /casestudies/byzantine_smv/
parent: /casestudies/byzantine/
---
# Byzantine agreement (Cadence SMV)

(Cachin, Kursawe & Shoup)

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [Assumptions](#assumptions)
-   [Validity](#validity)
-   [Agreement](#agree)
-   [Fast Convergence](#progress)
-   [Additional Invariants](#invariants)

## Introduction: { #intro }

[Cadence SMV](http://www-cad.eecs.berkeley.edu/~kenmcmil/smv/) is a proof assistant which supports several *compositional methods* methods {% cite "McM98", "McM99", "MQS00" %}. These methods allow the verification of large, complex, systems by reducing the verification problem to small problems that can be solved automatically by model checking. Cadence SMV provides a variety of such techniques including *induction*, *circular compositional reasoning*, *temporal case splitting* and *data type reduction*.

The version of Cadence SMV we have used is 08-20-01p1.

## The Protocol: { #protocol }

The Cadence SMV model of the ABBA protocol closely follows that given in {% cite "CKS00" %}, although some modifications were necessary to the original which we outline below. We use the data type ordset to model the round numbers of the protocol, which are *unbounded*, and to prove the correctness of the protocol for *any* number of parties, or, in other words, for *all* values of **n** and **t** such that **n < 3t**.

-   **Probabilistic choices:** since Cadence SMV cannot model probabilistic behaviour, we have replaced the outcomes of the threshold coin-tossing scheme by nondeterministic choices. Furthermore, the scheme is modelled by requiring that the value of the coin in round **r** is not revealed until at least **n-2t** honest parties have read the main-votes they require in round **r**.
    
    To simplify the protocol (allow us to define the pre-votes for all round to be based on the value of the coin for the previous round), we denote the coin for round **r** by *coin*\[*r+1*\]. and introduce a coin for round **\-1** (*coin*\[*0*\]) which is always equal to 0.
    
-   **Reading of votes:** since we use the ordset data type to model the set of honest parties, the only constants with which we can compare variables of this type are **1** and **n-t**. Thus, counting votes, i.e. expressing conditions of the form \`\`**i** has read the votes of **j<sub>1</sub>,...,j<sub>k</sub>**'' for some **k =< n-t**, becomes infeasible. To overcome this, instead of modelling a party reading individual votes, we store the *total* number of votes for each choice, and base future voting decisions on these totals. The protocol is not affected as the votes remain unchanged once they have been made. Furthermore, we consider the totals of the honest parties and the corrupted parties separately. The main reason for this, although it also allows us to simplify the model, is to deal with the possibility of corrupted parties sending different votes to different parties.
    
    Therefore, we store the total number of main-votes and pre-votes made by honest parties for each value in each round. In the case of corrupted parties we store only boolean variables denoting whether a corrupted party can cast/send a main (pre) vote for each value and round. In fact, since we have proved that (see the properties *corrupted5* and *corrupted6* in the [additional invariants section](#invariants)) \`\`if an honest party has a vote for a value then corrupted parties can also vote for this value'', we need only count up to **n-2t** honest party votes and use corrupted parties for the remaining votes.
    
    A further necessary change concerns when the pre-votes are cast: a party now casts its pre-vote for round **r+1** when it has finished reading the main-votes of the *previous* round and not at the start of round **r+1**. Observe that, since once these votes have been read the pre-vote is determined, and the adversary decides which votes a party reads, the adversary knows what pre-vote will be cast at this earlier time. Therefore, casting pre-votes at this earlier point does not affect the power of the adversary. Note that, since the coin for round **r** might not be revealed when a pre-vote is now cast, we require parties to cast two pre-votes: one supposing the coin equals 0 and the other supposing the coin equals 1. The motivation behind this change is that the proof of **Fast Convergence** relies on knowing, even when the corresponding coin has not yet been revealed, what the pre-votes of the honest parties that have read the main-votes for the previous round will be.
    
-   **Pre-processing step:** as for the pre-votes and main-votes, we store the total number of pre-processing votes made by honest parties. In this case we need only count up to **t+1** honest votes (as each party reads only **2t+1** pre-processing votes). Furthermore, since the pre-processing votes require no justification, it follows that the adversary has the power to make an honest (or corrupted) party have *v* as its initial pre-vote if and only if an honest party has cast *v* as its pre-processing vote. We us this fact, and hence do not store the pre-processing votes of the corrupted parties.
    

The description of the randomized Byzantine agreement protocol of {% cite "CKS00" %} in Cadence SMV, can be found [here](/casestudies/byzantine/template.smv) (also as a pdf file [here](/casestudies/byzantine/template.pdf)).

## Assumptions: { #assumptions }

A number of assumptions were made in order to perform the verification including the correctness of the cryptographic primitives. The remaining assumptions concern fairness statements (which ensure that parties eventually cast votes), and technicalities that, due to the limitations of the ordset data type, we were unable to prove in Cadence SMV. In particular, since variables of different ordset data types cannot be compared, we cannot show that \`\`if at least **k** honest parties cast their votes in a round then there are at least **k** votes'', as distinct data types represent the set of honest parties and number of votes respectively.

First, we have assumptions which correspond to the fact that there cannot be **n-2t** honest votes for two distinct values in any round. These properties follow from the fact if this was not true there would be at least:

<center><b>(n-2t) + (n-2t)=n-t+(n-3t)&gt;n-t</b></center>

honest parties which is a contradiction since there are only **n-t** honest parties.

In the **Agreement** proof the premise is that no party has decided before round **r**, therefore, under fairness, all honest parties eventually cast their votes in round **r**. Therefore, we assume:

-   *All honest parties eventually reach round* **r+1**.

Similarly, since all parties continue for one more round after they decide, we assume that:

-   *If an honest party does not decide in round* **r**, *then it eventually reaches reaches round* **r+2**.

For **Validity**, since under fairness all parties eventually cast their votes in round **0**, we assume:

-   *All honest parties eventually reach round* **1**.

Finally, for **Fast Convergence** the premise is that a party enters round **r**. Now, if this party does not decide in round **r**, then by the **Agreement** property no party decides before round **r** and since all parties continue for one more round after deciding, under fairness all parties enter round **r+1**. If a party decides in round **r**, then by **Agreement** all parties must decide by round **r+1**, and since the party did not decide before round **r+1**, it must decide in round **r+1**. On the other hand, if no party decides before round **r**, then since all parties continue for one more round after they decide, under fairness all parties enter round **r+2**. Therefore we assume that:

-   *If an honest party does not decide in round* **r**, *then either it decides in round* **r+1** *or it reaches round* **r+2**.

Similarly, we assume that:

-   *If an honest party does not decide in round* **r** *or* **r+1**, *then either the party decides in round* **r+2** *or reaches round* **r+3**.

<a name="validity"></a>

**Validity:** *if all parties have the same initial value, then any party that decides must decide on this value.*

The proof of validity can be found [here](/casestudies/byzantine/valid.smv) (also as a pdf file [here](/casestudies/byzantine/valid.pdf)) and the output from Cadence SMV [here](/casestudies/byzantine/valid.log).

<a name="agree"></a>

**Agreement:** *if* **r** *is the first round in which an honest party decides, then all honest parties that eventually decide, must decide on the same value in either round* **r** *or* **r+1**.

The proof of agreement can be found [here](/casestudies/byzantine/agreement.smv) (also as a pdf file [here](/casestudies/byzantine/agreement.pdf)) and the output from Cadence SMV [here](/casestudies/byzantine/agreement.log).

<a name="progress"></a>

**Fast Convergence:** *the probability that an honest party advances more than* **2r+1** *rounds is bounded above by* **2<sup>-r</sup>**.

The proof of this property involves a manual argument based on properties (**P1** - **P6**) that are proved automatically in Cadence SMV. First we proved that, for any party that enters round **r+1** and does not decide in round **r**:

-   **P1** If before the coin in round **r** is tossed there is a concrete pre-vote (i.e. a vote not based on the value of the coin) for *v* in round **r+1** and after the coin in round **r** is tossed it equals *v*, then the party decides in round **r+1**.
-   **P2** If before the coin in round **r** is tossed there are no concrete pre-votes in round **r+1**, then either the party decides in round **r+1**, or if after the coins in round **r** and round **r+1** are tossed they are equal, then the party decides in round **r+2**.

In addition, we proved that the following properties hold.

-   **P3** If the coin in round **r** has not been tossed, then neither has the coin in round **r+1**.
-   **P4** In any round **r** there cannot be concrete pre-votes for 0 and 1.
-   **P5** In any round **r**, if there is a concrete pre-vote for *v*, then in all future states there is a concrete pre-vote for *v*.
-   **P6** Each coin is only tossed once.

The Cadence SMV proofs of **P1**\-**P4** can be found [here](/casestudies/byzantine/progress.smv) (also as a pdf file [here](/casestudies/byzantine/progress.pdf)) and the output from Cadence SMV [here](/casestudies/byzantine/progress.log). The proofs of **P5**\-**P6** can be found in the [additional invariants section](#invariants) (see *lemma9* and *coin2* respectively).

We complete the proof of **Fast Convergence** with a simple manual proof. First we require the following lemma.

**Lemma 1** *For any party that enters round* **r+1**:

-   **(a)** *if the party does not decide in round* **r**, *then the coin for round* **r** *is flipped*;
-   **(b)** *if the party does not decide in round* **r** *and* **r+1**, *then the coin in round* **r+1** *is flipped*.

**Proof.** Now suppose that a party enters round **r+1** and does not decide in round **r**, then by **Agreement** no party decides before round **r**. Now since all parties continue for one more round after deciding, under fairness all parties cast their votes in round **r**, and hence the coin for round **r** is flipped and **(a)** holds. If in addition the party does not decide in round **r+1** then by **Agreement** no party decides before round **r+1**. Then since all parties continue for one more round after deciding, under fairness all parties cast their votes in round **r+1**, and hence the coin for round **r+1** is flipped and **(b)** holds.   <span class="qed" aria-label="end of proof">∎</span>

We next introduce the following classification of protocol states:

-   let *Undec(r)* be the set of states in which the coin in round **r-1** is not tossed and there are no concrete pre-votes in round **r**;
-   let *Pre-vote(r,v)* be the set of states where the coin in round **r-1** is not tossed and there is a concrete pre-vote for *v* in round **r**.

If follows from **P4** that these sets are pairwise disjoint and any state where the coin in round **r-1** is not tossed is a member of one of these sets. The following proposition is crucial to establishing the efficiency of the protocol.

**Proposition 1.** *In an idealised system, where the value of the coins in rounds* **1,2,...,2r-1** are truly random, the probability of a party advancing by more than **2r+1** rounds is bounded above by **2<sup>-r</sup>**.

**Proof.** We prove the proposition by induction on **r**. The case when **r=0** is trivial since the probability bound is 1. Now suppose that the proposition holds for some **r** a suppose a party enters round **2r+1**. If a party decides in round **2r**, then by **Agreement** all parties will decide by round **2r+1**, and hence the probability that a party enters round **2r+3** given a party enters round **2r+1** is bounded above by 0. On the other hand, if no party decides in round **2r**, then by **Lemma 1** the coin for round **2r** is tossed. For any state *s* reached just before the coin is tossed we have two cases to consider:

-   *s* is a member of *Pre-vote(2r+1,v)* for some *v=1,2*: by **P1**, if the coin in round **2r** equals *v*, any party which enters round **2r+1** decides in round **2r+1**, and hence using **P6** it follows that the probability of a party advancing more than **2r+3** rounds given that a party advances more than **2r+1** rounds is bounded above by 1/2.  
      
    
-   *s* is a member of *Undec(2r+1,v)*: using **P5**, there are no concrete pre-votes in round **2r+1** before the coin in round **2r+1** is tossed, and hence by **P2** any party either decides in round **2r+1**, or, if the coins in round **2r** and **2r+1** are equal, it decides in round **2r+2**. Now, since in *s* the coin for round **2r** has not been tossed, by **P3** neither has the coin for round **2r+1**. Therefore, using **Lemma 1** and **P6** it follows that the probability of a party advancing more than **2r+3** rounds given that a party advances more than **2r+1** rounds is bounded above by 1/2.

Putting this together and since **P**(A & B) = **P**(A | B) \* **P**(B), we have the probability of a party advancing more than **2r+3** rounds equals:

<table><tbody><tr><td>&nbsp;&nbsp;&nbsp;</td><td>= <b>P</b>(a party advances &gt; <b>2r+3</b> rounds and a party advances &gt; <b>2r+1</b> rounds)</td></tr><tr><td>&nbsp;&nbsp;&nbsp;</td><td>= <b>P</b>(a party advances &gt; <b>2r+3</b> rounds | a party advances &gt; <b>2r+1</b> rounds) * <b>P</b>(a party advances &gt; <b>2r+1</b> rounds)</td></tr><tr><td>&nbsp;&nbsp;&nbsp;</td><td>≤ 1/2 * 2<sup>-r</sup></td></tr><tr><td>&nbsp;&nbsp;&nbsp;</td><td>= 2<sup>-(r+1)</sup> &nbsp;&nbsp;&nbsp; as required. &nbsp; <span class="qed" aria-label="end of proof">∎</span></td></tr></tbody></table>

It can be argued that in a real system the probability of a party advancing by more than **2r+1** rounds is bounded above by **2<sup>-r</sup>** + *e*, where *e* is negligible. This follows from the unpredictability of the coin tossing scheme and **P6**; for more details see {% cite "CKS00" %}.

## Additional Invariants: { #invariants }

In all the above proofs certain invariants are assumed. The proof of these additional invariants can be found [here](/casestudies/byzantine/lemmas.smv) (also as a pdf file [here](/casestudies/byzantine/lemmas.pdf)) and the output from Cadence SMV [here](/casestudies/byzantine/lemmas.log).
