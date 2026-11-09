---
layout: layouts/base.njk
title: "DNA walkers"
section: casestudies
permalink: /casestudies/dna_walkers/
---
# DNA walkers

## Contents

-   [Introduction](#intro)
-   [PRISM Models of DNA Walker Circuits](#models)
    -   [Modelling the stepping mechanism](#stepping)
    -   [DNA walker circuits](#circuits)
    -   [XOR circuit](#xor)
-   [Petri Net Models of DNA Walker Circuits](#ptnet)

**Related publications**: {% cite "DKTT13", "DKTT14", "DHK13", "BK15" %}

## Introduction { #intro }

Deoxyribonucleic acid (DNA) is most commonly known as the material that makes up the genetic code. Nowadays, DNA can be bought cheaply in a made-to-order fashion. The purified DNA strands are delivered within days after the order is made. Two complementary strands of DNA form, when mixed in solution, the well-known helix shape.

This case study considers a so-called *DNA walker*, which is a man-made molecular motor. The walker moves over a track of anchorages, which are strands of DNA tethered to a surface. Different types of stepping mechanisms and walkers have been published. For an overview, see the publications on molecular motors below and the references therein. An artificial molecular motor mimics the functionality of naturally occurring proteins such as kinesin or dynein. Within a cell, such proteins transport cargo over microtubials, which span across the cell.

We focus on the ability of DNA walker systems to perform computation by evaluating deterministic Boolean functions, which we call *DNA walker circuits*. We develop a PRISM model of DNA walker circuits based on experimental data. Probabilistic model checking is then used to analyse the reliability and performance of a number of circuits. For full details, see {% cite "DKTT13", "DKTT14" %}. The case study also makes use of the implementation of fast adaptive uniformisation {% cite "MWDH10" %} described in {% cite "DHK13" %}, in addition to standard uniformisation {% cite "Jen53" %} and simulation-based model checking {% cite "HLMP04" %}.

Following on from this work, we also develop a Stochastic Petri Net model of the same DNA walker circuit. We use statistical model checking implemented in [Cosmos](http://www.lsv.ens-cachan.fr/Software/cosmos/) {% cite "BBDHP15" %} to analyse a number of properties. For further details see {% cite "BK15" %}.

## PRISM Models of DNA Walker Circuits { #models }

The walker under consideration here was demonstrated to work in the following papers:

1.  A DNA-based molecular motor that can navigate a network of tracks. SF Wickham, J Bath, Y Katsuda, M Endo, K Hidaka, H Sugiyama, AJ Turberfield, Nat Nanotechnol 7 (2012) 169-173
2.  Direct observation of stepwise movement of a synthetic molecular transporter. SF Wickham, M Endo, Y Katsuda, K Hidaka, J Bath, H Sugiyama, AJ Turberfield, Nat Nanotechnol 6 (2011) 166-169

### Modelling the stepping mechanism { #stepping }

In the PRISM model, each transition corresponds to a single step taken by the walker. In reality, the single step has multiple phases. The stepping mechanism works as follows:

1.  The walker strand carries a load (Q) that will quench fluorophores (F) when nearby. The walker is attached to the initial anchorage and all other anchorages are blocked. By adding unblocking strands, the selected track becomes unblocked. In this case the signal that opens up the path labelled by ¬X is added.
2.  The nicking enzyme (E) attaches to the walker-anchorage complex, and cuts the anchorage. The anchorage top melts away from the walker, exposing 6 nucleotides as a toehold.
3.  The exposed toehold becomes attached to the next anchorage.
4.  In a displacement reaction, the walker becomes completely attached to the new anchorage. The stepping is energetically favourable, because it re-forms the base pairs that were lost after the previous anchorage was cut.
5.  Repeating this process, the walker arrives at a junction. The walker continues down the unblocked track, eventually reaching the final anchorage and quenching the fluorophore.

![Stepping mechanics](/images/cs/walkers.stepping.png){.large}

In the model, two sources of error affect the walker. Firstly, the walker can jump to anchorages that are not directly adjacent. This can cause the walker to change direction, and eventually the walker could end up without any intact anchoraches in reach. In this case the walker is deadlocked, as it can no longer move. Deadlock is unfavourable from a computational point of view, as we cannot distinguish between an ongoing DNA walker computation and one that is deadlocked. A second mode of error occurs in the blockade mechanism. Before the walker steps, we assume each blocked anchorage has a fixed and uniform probability to fail. When a blocked anchorage fails, it becomes unblocked, and the walker may step onto it. This can delay the walker, divert it to an unintended anchorage, or cause it to deadlock.

![Deadlocks](/images/cs/walkers.deadlocks.png)

### DNA walker circuits { #circuits }

We provide PRISM models for four DNA walker circuits, which can be found [here](/files/dna19/dna_walkers_benchmark.zip). Three of the circuits are based on designs used in experiments, the fourth circuit is an XOR circuit that is developed separately.

The stepping behaviour of the walker is modelled using rate constants (b) that were estimated by Wickham et al. based on measurements on a straight track, which we call the control circuit (d). The predictions from the PRISM model match the measurements from the control circuit well, and we use these rate constants without further fitting. We do, however, fit a failure rate for blockades using single-junction tracks. The second circuit is the single-junction circuit, which we use to fit the failure rate for the blocked anchorages. The third circuit is the double-junction circuit, which is used to assess the quality of the model. For more details on the modelling we refer to {% cite "DKTT13", "DKTT14" %}.

![Circuits](/images/cs/walkers.circuits.png)

The control circuit (d) consists of 8 anchorages in a straight line, with the walker starting at one end and an absorbing anchorage placed at the end. There are three variations to the basic circuit. In the first, anchorage 4 is omitted. In the second, anchorages 4 and 5 are omitted. In the third, anchorage 7 is omitted.

The second circuit (a) is a single-junction circuit, which consists of 12 anchorages and comes in three variants. In the R-variant, there is a single anchorage blocked on the left branch. The R-squared variant has two anchorages blocked on the left branch, while the L/R variant has a single blockade on both branches of the junction.

The third circuit (c) is a double-junction circuit, which consists of 28 anchorages, where, on each branch of the junction, two blocked anchorages occur. For this circuit, there are 4 variants, each corresponding to the possible inputs: RR, RL, LR and LL. For the input RR, the blockades corresponding to R and R' unblock, causing the walker to move right at the first and second junction, and so on for the other inputs.

For all circuits we compute the expected number of steps and the probability for the walker to deadlock. All properties are evaluated at T=200 min. For the control circuit, we also compute the probability for the walker to be on the second anchorage and the probability for it to be on the final absorbing anchorage.

{% prismCode "casestudies/examples/walkers_circuits1.csl", false, true %}

For the single-junction and double-junction circuits, we compute the probability for the walker to make it to any absorbing anchorage and the probability for the walker to make it to the intended anchorage. For the double-junction circuit this property can be expressed as:

{% prismCode "casestudies/examples/walkers_circuits2.csl", false, true %}

This case study uses three solution methods implemented in PRISM, see [PRISM manual](/manual/). For the control circuit, we use standard uniformisation with the default hybrid engine settings. For the single-junction circuit, we use the fast adaptive uniformisation method with the parameters faudelta=1E-10 and fauepsilon=1E-8. For the double-junction circuit, we use simulation-based model checking, which estimates the value of the probability by generating 10^5 paths with depth of at most 50.

The solution method is chosen based on the sizes of the state spaces for each circuit. For the control circuit, the state space does not exceed 200 states and standard uniformisation is efficient and accurate. The single-junction circuit also has a small state space, no greater than 6,000 states, but the high initial rate used to model blockade failure makes the fast adaptive uniformisation method the preferred option here. The states with high exit rates are eventually discarded from the significant state space by the fast adaptive uniformisation method. As a result, fewer iterations are required compared to the standard uniformisation method. Note that the control track uses no blockades, and does not have high initial rates. The number of states that the fast adaptive uniformisation method keeps in memory for the single-junction is about half the reachable state space, and the method attains a good level of accuracy.

For the double-junction circuit, the size of the state space is larger, and the hybrid engine fails to build the model even after increasing the default memory allocation by an order of magnitude. For this circuit, simulation-based verification yields a good approximation after checking 10^5 paths against each property, which takes 27 seconds. For simulation-based model checking, we may construct a [confidence interval](/manual/RunningPRISM/ApproximateModelChecking) to inspect the quality of the result. For the probability of the walker making it to any absorbing anchorage, PRISM reports the 95% interval to be 0.90224 +/- 0.00184, and we are confident that the true value of the property is indeed close to 0.90224. On a technical level, we note that this interval is not guaranteed to contain the true value of the property. At the chosen confidence level, we expect that, with a rate of one in twenty, the constructed intervals do not contain the true value of the property. We now try the fast adaptive uniformisation method on the double-junction circuit. Using faudelta=1E-8, the method explores 312,124 states within 40 seconds, but loses almost 2% of the probability space. Using faudelta=1E-9, the method explores 616,805 states in 94 seconds, and loses just over 0.4% in probability mass. When we set -faudelta=1E-10, the method explores 1,271,840 states and loses 0.11% probability mass.

The results are summarised below.

{: columns="1 7" }

| Model                    | Filename        | Time (s) | States | F2      | F8      | Deadlock | Steps   |
|--------------------------|-----------------|----------|--------|---------|---------|----------|---------|
| **Control - full track** | control         | 1.6      | 172    | 0.00262 | 0.96183 | 0.00322  | 6.87551 |
| **Control - no S4**      | controlMissing1 | 1.6      | 50     | 0.00677 | 0.85281 | 0.00023  | 5.51422 |
| **Control - no S4,5**    | controlMissing2 | 1.6      | 13     | 0.01941 | 0.59170 | 0.01941  | 3.85504 |
| **Control - no S7**      | controlMissing7 | 1.6      | 82     | 0.00541 | 0.17510 | 0.03059  | 5.14486 |

*Results: control circuit*{.caption}

{: columns="1 8" }

| Model                   | Filename         | Time (s) | States | Finish  | Finish-correct | Deadlock | Steps   | Lost    |
|-------------------------|------------------|----------|--------|---------|----------------|----------|---------|---------|
| **Single-junction R**   | track12Block1    | 2.0      | 2714   | 0.97090 | 0.75933        | 0.00084  | 7.05668 | 8.81E-7 |
| **Single-junction R^2** | track12Block2    | 3.2      | 2659   | 0.95913 | 0.81370        | 0.00158  | 7.05668 | 9.27E-7 |
| **Single-junction L**   | track12BlockBoth | 3.1      | 2608   | 0.92037 | 0.46019        | 0.00063  | 6.56451 | 9.61E-7 |

*Results: single-junction circuit*{.caption}

{: columns="1 7" }

| Model                  | Filename        | Time (s) | States | Finished | Finished-correct | Deadlock | Steps  |
|------------------------|-----------------|----------|--------|----------|------------------|----------|--------|
| **Double-junction RR** | track28LLDouble | 25.3     | -      | 0.90224  | 0.69529          | 0.01105  | 11.739 |
| **Double-junction RL** | track28LRDouble | 24.7     | -      | 0.88959  | 0.65805          | 0.01645  | 11.775 |
| **Double-junction LR** | track28RLDouble | 24.8     | -      | 0.89150  | 0.65730          | 0.01675  | 11.776 |
| **Double-junction LL** | track28RRDouble | 24.9     | -      | 0.90161  | 0.69661          | 0.01013  | 11.742 |

*Results: double-junction circuit*{.caption}

### XOR circuit { #xor }

The XOR circuit evaluates the exclusive OR of inputs X,Y. Two end nodes represent the TRUE and FALSE evaluation. By adding the input X, ¬Y, the path labelled correspondingly is opened up, and the walker reaches the value TRUE. Two variations on the circuit are included in the case study: a larger version of the circuit and a version that uses single blockades instead of double blockades.

![XOR circuit](/images/cs/walkers.xor.png){.large}

The PRISM model for the xor(X,Y) circuit can be found below. It was automatically generated by pre-processing software that translates a circuit description into a PRISM model. The anchorages are represented by the variables "stator", and the location of the walker is stored in variable "w1". The rates depend mainly on the distance between the walker and the anchorage. For details see {% cite "DKTT13" %}.

{% prismCode "casestudies/examples/walkers_ringLL.sm", true, true %}

Files for additional models from {% cite "DKTT13" %} (including all of those used in {% cite "DHK13" %}) can be found [here](/files/dna19/dna_walkers_benchmark.zip). The model above has 2.8 x 10<sup>7</sup> states; it can be constructed, but not analysed, with PRISM's standard engines. The largest circuit is estimated to have to up to 10<sup>9</sup> states. To analyse the DNA walker models, we use the *fast adaptive uniformisation* method {% cite "MWDH10" %}, which has now been implemented in PRISM {% cite "DHK13" %}.

The PRISM properties used to analyse the models are as follows:

{% prismCode "casestudies/examples/walkers_ringLL.csl", false, true %}

The table below shows results for the walker models, obtained using the fast adaptive uniformisation method. We fixed a time point of 200 minutes (i.e. T=200\*60) to allow a comparison with experimental observations. "Model" describes the type of XOR circuit and which instructions are used as input. "Filename" is the name of the model file in the [zip file](/files/dna19/dna_walkers_benchmark.zip). "Time (s)" is the amount of time the model checker took to generate the answers. "States" is the maximum number of states that were loaded in the memory at any point during the computation. "Lost" represents the amount of probability that was unaccounted for by the end of the analysis. "Signal" is the probability that the walker makes it to the correct end node. "Steps" is the expected number of steps that the walker takes. "Blocked" is the amount of time the walker spends on anchorages that were intended to be blocked. "Steps" and "Blocked" are both calculated using reward properties. The fast adaptive uniformisation method was used with parameters delta=10<sup>-8</sup> and epsilon=10<sup>-6</sup>.

{: columns="1 7" }

| Model                 | Filename | Time (s) | States  | Lost       | Signal | Steps  | Blocked (s) |
|-----------------------|----------|----------|---------|------------|--------|--------|-------------|
| **xor(X,Y)**          | ringLL   | 31       | 228,803 | 1.9736E-02 | 0.6455 | 7.7696 | 606.2731    |
| **xor(¬X,Y)**         | ringRL   | 31       | 228,803 | 1.9736E-02 | 0.6455 | 7.7696 | 606.2731    |
| **xor(X,¬Y)**         | ringLR   | 32       | 239,680 | 2.2587E-02 | 0.5979 | 7.5610 | 659.3715    |
| **xor(¬X,¬Y)**        | ringRR   | 33       | 239,680 | 2.2587E-02 | 0.5979 | 7.5610 | 659.3715    |
| **xor-S-(X,Y)**       | ringSLL  | 21       | 215,544 | 1.6719E-02 | 0.5374 | 8.8363 | 133.1672    |
| **xor-S-(¬X,Y)**      | ringSRL  | 21       | 215,544 | 1.6719E-02 | 0.5374 | 8.8363 | 133.1672    |
| **xor-S-(X,¬Y)**      | ringSLR  | 22       | 233,063 | 1.8775E-02 | 0.5473 | 8.4049 | 146.7377    |
| **xor-S-(¬X,¬Y)**     | ringSRR  | 23       | 233,063 | 1.8775E-02 | 0.5473 | 8.4049 | 146.7377    |
| **xor-large-(X,Y)**   | ringLLL  | 65       | 443,584 | 5.1855E-02 | 0.5661 | 9.5020 | 577.2680    |
| **xor-large-(¬X,Y)**  | ringLRL  | 68       | 443,584 | 5.1855E-02 | 0.5661 | 9.5020 | 577.2680    |
| **xor-large-(X,¬Y)**  | ringLLR  | 66       | 455,685 | 5.2995E-02 | 0.5674 | 9.4983 | 567.3420    |
| **xor-large-(¬X,¬Y)** | ringLRR  | 70       | 455,685 | 5.2995E-02 | 0.5674 | 9.4983 | 567.3420    |

*Results: XOR circuit*{.caption}

Even though the reachable state space is large, the number of states that are in memory concurrently is tractable. The amount of probability unaccounted for ("Lost") is very high. The expected number of steps increases when fewer blockades are in place (modification S), and equally so for the larger circuit. When fewer blockades are used, the amount of time spend on blocked positions ("Blocked") decreases accordingly. The walker can only step onto blocked positions after a blockade fails. The failure rate used here is 30%.

## Petri Net Models of DNA Walker Circuits { #ptnet }

Since DNA walker circuits are planar, Generalized Stochastic Petri Nets (GSPN) are well suited to their modelling, with the layout of the GSPNs closely corresponding to the layout of the original circuit: the state of each anchorage is modelled using an independent place, while the steps of the walker are modelled with transitions that are exponentially distributed. This approach is presented in {% cite "BK15" %}.

More precisely, each DNA walker circuit comprises several tracks (sequences of anchorages) and transitions correspond to walker taking a step from one anchorage to another nearby. The states of each anchorage are modelled as follows:

-   Each anchorage is modelled with a single place, to preserve the layout of the original circuit placement. The relative placement of each place corresponds to that of the corresponding anchorage on the origami.
-   Intact anchorages are modelled with places containing one token.
-   Anchorages where the top has melted away are modelled by empty places.
-   The anchorage to which the walker is attached is modelled by a place with two tokens.
-   Blocked anchorages are modelled like anchorages where the top has melted away, with empty places.

The figure below illustrates a transition encoding a displacement reaction between two anchorages `a` and `b`. Place `a` encodes the anchorage to which the walker is currently bound. Place `b` encodes an intact, unblocked anchorage. The transition consumes two tokens in the place corresponding to `a` and one token in the place corresponding to `b`, and produces two tokens in the place corresponding to `b`. Indeed, after the transition is fired the place corresponding to `a` is left empty, which models the anchorage where the top has melted away.

The walker may move between two anchorages that are sufficiently close. Each such movement is modelled with independent transitions. The rate of each transition depends on the distance between the two anchorages as specified in [Modelling the stepping mechanism](#stepping)

![SimpleTransitions](/images/cs/walkers.ptmodelling.SimpleTransition.png)

Blocked anchorages do not initially contain tokens. In order to model the possibility of failure of the blocking mechanism, a place with initially one token and two immediate concurrent transitions are added to each blocked anchorage. This is illustrated below. With failure probability f=30%, a token is added to the place for anchorage `a`. In this case the anchorage is no longer blocked.

![BlockadeFailure](/images/cs/walkers.ptmodelling.BlockadeFailure.png)

We consider four circuit layouts depicted below. Files for each layout can be found [here (zip file)](/files/PetriNet15/ptmodel.zip) in [PNML file format](http://www.pnml.org), [GrML file format](http://cosyverif.org), and [ANDL file format(Marcie)](http://www-dssz.informatik.tu-cottbus.de/DSSZ/Software/Marcie). A PDF representation is also provided.

![modelPT](/images/cs/walkers.ptmodelling.modelTwoLevel.png){.large}

The probability of presence of the walker in each leaf node of the double junction circuits over time as computed by Cosmos is plotted next.

![ResultPT](/images/cs/walkers.ptmodelling.ResultTwoLevel.png){.large}

Experiments comparing three PRISM verification methods (statistical model checking, standard uniformisation and fast adaptive uniformisation) with the statistical model checker [Cosmos](http://www.lsv.ens-cachan.fr/Software/cosmos/) are reported in table below.

{: columns="1 7" }

| Model             | Cosmos 8 Threads | Cosmos 1 Threads | Prism Sim | Prism   || Prism Fau ||
| ^^                | Time(s)          | Time(s)          | Time(s)   | Time(s) | Memory(KB) | Time(s)   | Memory(MB) |
|-------------------|------------------|------------------|-----------|---------|------------|-----------|------------|
| ex                | 0.2              | 0.6              | 2.4       | 0       | 0.5        | 0.06      | 77.58      |
| control           | 2.4              | 11.1             | 29.4      | 0.04    | 40.2       | 1         | 127.18     |
| controlMissing1   | 1.5              | 6.8              | 18.9      | 0.01    | 7.8        | 0.9       | 98.82      |
| controlMissing2   | 0.8              | 3.6              | 11.2      | 0       | 7.3        | 0.09      | 81.58      |
| controlMissing7   | 1.9              | 8.6              | 22.6      | 0.02    | 26         | 0.92      | 113.76     |
| track12Block1     | 4.7              | 22.4             | 68        | &gt;20H | 388.3      | 3.95      | 245.11     |
| track12Block2     | 4.7              | 22.2             | 76.4      | -       | 530.8      | 4.84      | 296.03     |
| track12BlockBoth  | 4.4              | 20.8             | 71.9      | -       | 509.4      | 4.76      | 279.55     |
| track28LL         | 10.6             | 51.5             | 395.5     |         | &gt;8GB    | 879.35    | 1,042.62   |
| track28LR         | 11.1             | 53.3             | 393.8     |         | -          | 927.59    | 1,061.37   |
| track28RL         | 11.2             | 54.4             | 382       |         | -          | 929.39    | 1,076.57   |
| track28RR         | 10.6             | 52.2             | 393.3     |         | -          | 870.48    | 1,047.32   |
| ringLL            | 10.9             | 53.7             | 360       | &gt;20H | 717,312    | 748.83    | 1,139.35   |
| ringRL            | 11.1             | 55               | 339.1     | -       | 717,312    | 755.69    | 1,131.96   |
| ringLR            | 11               | 54.9             | 348.3     | -       | 717,312    | 754.01    | 1,164.21   |
| ringRR            | 10.9             | 53.4             | 346.3     | -       | 717,312    | 757.72    | 1,154.43   |
| ringLLLarge       | 12.7             | 62.7             | 423.7     | -       |            | 1,864.83  | 2,206.84   |
| ringRLLarge       | 12.9             | 63.7             | 471.7     | -       |            | 1,802.69  | 2,201.96   |
| ringLRLarge       | 13               | 64.1             | 442       | -       |            | 1,994.9   | 2,206.27   |
| ringRRLarge       | 12.7             | 62.2             | 555.2     | -       |            | 2,056.98  | 2,211.3    |
| redundantChoice10 | 27.1             | 131.8            | 1,258.2   |         | &gt;8GB    |           | &gt;8GB    |
| redundantChoice01 | 26.6             | 128.9            | 1,239.8   |         | -          |           | -          |
| lozenge           | 480.6            | 1,656.6          | 22,302.6  |         | -          |           |            |
| lozengeBlock      | 241.7            | 827.8            | 32,293.2  |         | -          |           |            |

*Results: Comparison of PRISM with stochastic Petri net model checker Cosmos*{.caption}
