---
layout: layouts/base.njk
title: "What's in PRISM"
section: doc
permalink: /doc/whatsinprism/
---
# What's in PRISM

The algorithms, techniques and data structures that comprise PRISM come from a wide range of sources. Below is a short (and still rather incomplete) guide providing references to further information on each aspect of the tool. See also the [Lectures](/lectures/) section of this website for teaching material on many of these topics.

## Probabilistic models

PRISM supports *discrete-time Markov chains* (DTMCs) and *continuous-time Markov chains* (CTMCs), good texts on which are {% cite "Ste94", "Kul95" %}. It also supports *Markov decision processes* (MDPs); see for example {% cite "Bel57", "Put94" %}. Strictly speaking, since the modelling language allows multiple probability distributions with the same action label, these are actually (simple) *probabilistic automata* {% cite "SL95", "Seg95" %}. Finally, it also supports *probabilistic timed automata* (PTAs) {% cite "Jen96", "KNSS02", "Bea03" %}.

PRISM also allows all types of model to be augmented with rewards (or costs). Such extensions of DTMCs and CTMCs are sometimes referred to as (discrete- or continuous-time) *Markov reward models*. Similarly, PTAs with rewards/costs are sometimes called *priced PTAs*.

## Probabilistic logics

PRISM's property specification language is based on temporal logic. It subsumes:

-   *PCTL*, proposed in {% cite "HJ94" %} for DTMCs, and for MDPs in {% cite "BdA95" %} (where it is called pCTL);
-   *CSL*, for CTMCs, introduced in {% cite "ASSB96" %} and extended in {% cite "BKH99" %};
-   *LTL*,
-   *PCTL\**

It also includes "quantitative" extensions of these logics, such as the use of the operator P=? for querying the value of a probability, rather than comparing it to a bound. Furthermore, PRISM allows such properties to be combined into more complex arithmetic expressions; see {% cite "KNP09a" %} for some examples. Other simple extensions to the above logics include, for example, allowing the CSL steady-state (S) operator of {% cite "BKH99" %} for DTMCs.

The property specification language also supports reward (or cost) based properties for DTMCs, CTMCs and MDPs through the R operator. Syntax and semantics (for the DTMC and CTMC case) can be found in {% cite "KNP07a" %}. Similar (and additional) reward operators can be found in {% cite "BHHK00b" %} for CTMCs, {% cite "AHK03" %} for DTMCs, and {% cite "dA98b", "dA97a" %} for MDPs. Reward-bounded variants of the U operator, such as found in CSRL and CRL {% cite "BHHK00b", "HCH+02" %} and in PRCTL {% cite "AHK03" %} are currently not supported in PRISM.

## Model checking algorithms - DTMCs

The model checking algorithm for PCTL on DTMCs is from {% cite "CY88", "HJ94", "CY95" %}. We use matrix-vector multiplication for the X and U<=k operators and solve linear equation systems for the U operator. The algorithms for U include a step which computes all states for which the probability is exactly 0 or 1; in PRISM these are referred to as the *precomputation* algorithms Prob0 and Prob1.

Model checking the S operator requires the *steady-state* probabilities of the DTMC to be computed. As described in, e.g. {% cite "Kul95" %}, this requires: (1) identification of the bottom strongly connected components (BSCCs) of the DTMC; (2) solution of the steady-state probabilities for each BSCC; and (3) computation of the probabilities of reaching each BSCC from each state. (1) is covered below; (2) requires solution of a linear equation system, also covered below; (3) is the same as for the U operator, above. The *transient* probabilities of a DTMC are computed with a sequence of matrix-vector multiplications.

## Model checking algorithms - MDPs

The basis for the model checking algorithm for PCTL on MDPs is from {% cite "BdA95" %}. The X and U<=k operators are straightforward extensions of the DTMC case, as described in {% cite "Bai98" %}. For the U operator, as with DTMCs, we first apply *precomputation* algorithms. In PRISM, these are called Prob0E and Prob1A (for minimum probabilities) and Prob0A and Prob1E (for maximum probabilities). Prob0E and Prob0A are given in {% cite "BdA95" %}, Prob1E is from {% cite "dAKN+00" %} (which is a simple extension of the version in {% cite "dA97a", "dA99" %}). For computation of other probabilities for the U operator, we use (approximate) iterative methods, rather than the linear optimisation problems proposed in {% cite "BdA95" %} (and in e.g. {% cite "CY90", "CY98" %}). These iterative methods are expressed in terms of least fixed points in {% cite "Bai98" %} and are equivalent to the well-known *value iteration* method for MDPs (see e.g. {% cite "Put94" %}). PRISM also supports a notion of *fairness* when model checking MDPs. This is done using the techniques described in {% cite "BK98", "Bai98" %}).

## Other algorithms

*Linear equations systems* are solved in PRISM using iterative numerical methods which approximate the solution up to a prescribed accuracy (direct methods such as Gaussian elimination do not scale well to large systems). Supported iterative methods include Power, Jacobi, (forwards and backwards) Gauss-Seidel, JOR (Jacobi over relaxation) and SOR (Successive over relaxation). {% cite "Ste94" %} gives good coverage of many of these methods.

## Symbolic data structures and implementations

Two of the most important data structures used in PRISM are binary decision diagrams (BDDs) [<a href="#ref-Bry86">Bry86</a>] and multi-terminal binary decision diagrams (MTBDDs) [<a href="#ref-CFM+97">CFM+97</a>, <a href="#ref-BFG+97">BFG+97</a>] (in the latter, MTBDDs are called ADDs: algebraic decision diagrams). The most complete description of how PRISM uses (MT)BDDs can be found in {% cite "Par02" %}.

## References

-   <a id="ref-Bry86"></a>[Bry86] R. Bryant. Graph-based algorithms for Boolean function manipulation. *IEEE Transactions on Computers*, C-35(8), 1986.
-   <a id="ref-CFM+97"></a>[CFM+97] E. Clarke, M. Fujita, P. McGeer, K. McMillan, J. Yang and X. Zhao. Multi-terminal binary decision diagrams: An efficient data structure for matrix representation. *Formal Methods in System Design*, 10(2/3), 1997.
-   <a id="ref-BFG+97"></a>[BFG+97] I. Bahar, E. Frohm, C. Gaona, G. Hachtel, E. Macii, A. Pardo and F. Somenzi. Algebraic decision diagrams and their applications. *Formal Methods in System Design*, 10(2/3), 1997.
