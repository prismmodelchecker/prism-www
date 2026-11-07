---
layout: layouts/base.njk
title: "MAPK cascade"
section: casestudies
permalink: /casestudies/mapk_cascade/
---
# MAPK cascade

(Huang and Ferrell)

## Contents

-   [Introduction](#intro)
-   [The Pathway](#pathway)
-   [The PRISM Model](#model)
-   [Model Checking](#results)

**Related publications**: {% cite "KNP08a" %}

## Introduction { #intro }

The MAP (Mitogen-Activated Protien) Kinases are involved in a pathway through which information is sent to the nucleus. It is one of the most important signalling pathways since it plays a pivotal role in the molecular-signalling that governs the growth, proliferation and survival of many cell types. The MAPK cascade consists of a MAPK Kinase Kinase (MAPKKK), MAPK Kinase (MAPKK) and a MAPK. The cascade is initialised through the phosphorylation of MAPKKK, which then activates MAPKK through the phosphorylation at two serine residues and this then activates MAPK through the phosphorylation at theronine and tyrosine residues. The initialisation can be caused by a diverse set of stimuli including growth factors, neurotransmitters and cytokines.

## The Pathway { #pathway }

The model of the pathway we consider is taken from {% cite "HF96" %}. Its structure is given below.

![image of pathway](/images/cs/mapk.gif)

Following {% cite "HF96" %}, we assume that the phosphorylation of both MAPK and MAPKK occur in two distributed steps. For example, when MAPK collides with its activator (MAPKK-PP) the first phosphorylation (MAPK-P) occurs and the activator is released. The phosphorylated MAPK must then collide again with its activator for the second phosphorylation (MAPK-PP) to occur. The deactivation of phosphorylated MAPK and MAPKK is caused by the corresponding phosphatase, while the activation and deactivation of MAPKKK is through the enzymes E1 and E2 respectively. To simplify the presentation we denote MAPK, MAPKK and MAPKKK by K, KK and KKK respectively.

<table class="prism-table">
<tbody>
<tr class="prism-thl"><th>1. MAPKKK is activated through enzyme E1</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK + E1 → KKK:E1 (<b>a1</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK + E1 ← KKK:E1 (<b>d1</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK:E1 → KKK* + E1 (<b>k1</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>2. MAPKKK is deactivated through enzyme E2</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK* + E2 → KKK:E2 (<b>a2</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK* + E2 ← KKK:E2 (<b>d2</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KKK*:E2 → KKK + E2 (<b>k2</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>3. MAPKK is activated by MAPKKK*</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK + KKK* → KK:KKK* (<b>a3</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK + KKK* ← KK:KKK* (<b>d3</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK:KKK* → KK-P + KKK* (<b>k3</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>4. MAPKK-P is deactivated by MAPKK phosphatase</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P + KK-Ptase → KK-P:KK-Ptase (<b>a4</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P + KK-Ptase ← KK-P:KK-Ptase (<b>d4</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P:KK-Ptase → KK + KK-Ptase (<b>k4</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>5. MAPKK-P is activated by MAPKKK*</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P + KKK* → KK-P:KKK* (<b>a5</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P + KKK* ← KK-P:KKK* (<b>d5</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-P:KKK* → KK-PP + KKK* (<b>k5</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>6. MAPKK-PP is deactivated by MAPKK phosphatase</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-PP + KK-Ptase → KK-PP:KK-Ptase (<b>a6</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-PP + KK-Ptase ← KK-PP:KK-Ptase (<b>d6</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KK-PP:KK-Ptase → KK-P + KK-Ptase (<b>k6</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>7. MAPK is activated by MAPKK-PP</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K + KK-PP → K:KK-PP (<b>a7</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K + KK-PP ← K:KK-PP (<b>d7</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K:KK-PP → K-P + KK-PP (<b>k7</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>8. MAPK-P is deactivated by MAPK phosphatase</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P + K-Ptase → K-P:K-Ptase (<b>a8</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P + K-Ptase ← K-P:K-Ptase (<b>d8</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P:K-Ptase → K + K-Ptase (<b>k8</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>9. MAPK-P is activated by MAPKK-PP</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P + KK-PP → K-P:KK-PP (<b>a9</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P + KK-PP ← K-P:KK-PP (<b>d9</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-P:KK-PP → K-PP + KK-PP (<b>k9</b> = 150 s<sup>-1</sup>)</td></tr>
<tr class="prism-thl"><th>10. MAPK-PP is deactivated by MAPK phosphatase</th></tr>
<tr><td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-PP + K-Ptase → K-PP:K-Ptase (<b>a10</b> = 1 nM<sup>-1</sup>s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-PP + K-Ptase ← K-PP:K-Ptase (<b>d10</b> = 150 s<sup>-1</sup>)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; K-PP:K-Ptase → K-P + K-Ptase (<b>k10</b> = 150 s<sup>-1</sup>)</td></tr>
</tbody>
</table>

The kinetic rates are based on the data presented in {% cite "HF96" %} where it is assumed the **K<sub>m</sub>** values (**K<sub>m</sub>** = (**d<sub>m</sub>** + **k<sub>m</sub>**) / **a<sub>m</sub>**) for the phosphorylation and dephosphorylation of MAPK, MAPKK and MAPKK all equal 300 nM.

## The PRISM Model { #model }

When building a PRISM model of a biological pathway, it is possible to construct an *individual-based* model which provides a detailed model of the evolution of individual molecular components. However, taking this approach comes at a cost: it will inevitably suffer from the well known state-space explosion problem where, as the complexity of the system increases, the state space of the underlying model grows exponentially.

An alternative is to employ a *population-based* approach where the number of each type of molecule or species is modelled, rather than the state of each individual component. Such an approach leads to a much smaller state-space (see for example {% cite "HKN+08" %}) while still including sufficient detail to express the properties of interest. For these reasons, it is this approach that we use here.

We now describe the specification in PRISM of the MAPK cascade from the previous section. Each of the basic elements of the pathway (MAPKKK, MAPKK, MAPK, MAPKK Phosphatase, MAPK Phosphatase, E1 and E2), is represented by a separate PRISM module and synchronisation between modules is used to model reactions which involve interactions between multiple elements. However, the different forms which each can take (for example, which other compounds it is bound to) are represented by one or more variables within the module.

The PRISM model for the pathway is given below.

{% prismCode "casestudies/examples/mapk_cascade.sm", true, true %}

We have included five reward structures in the description. The first reward structure (''activated'') assigns a state reward equal to the amount of MAPK that is activated while the second reward structure (''activated\_squared'') assigns a state reward equal to the square of the amount MAPK that is activated. Since, the standard deviation of a random variable *X* equals the square root of its variance which equals:

<center><b>E</b>(<em>X</em><sup>2</sup>) - <b>E</b>(<em>X</em>)<sup>2</sup>,</center>

together these rewards can be used to compute the standard deviation (and variance) of random variable for the amount of activated MAPK at a time instant. The third (''activated'') assigns a state reward equal to the percentage of MAPK that is activated. The forth reward structure (''reactions'') assigns a reward of 1 to all transitions which correspond to a reaction between MAPK and MAPKK and the last (''time'') simply assigns a state reward of 1 to all states in the model.

The table below shows statistics for the MTBDD which represents each model we have built, in terms of the number of **states**, **transitions**, the total number of **nodes** and the number of **leaves** (terminal nodes).

{: columns="1 4" }

| N     | States     | Transitions | Nodes   | Leaves |
|-------|------------|-------------|---------|--------|
| **1** | 118        | 468         | 1,976   | 3      |
| **2** | 2,172      | 13,608      | 18,095  | 6      |
| **3** | 18,292     | 144,630     | 41,728  | 10     |
| **4** | 99,535     | 910,872     | 111,563 | 14     |
| **5** | 408,366    | 4,138,848   | 185,928 | 20     |
| **6** | 1,373,026  | 15,015,264  | 285,106 | 25     |
| **7** | 3,979,348  | 46,167,582  | 414,835 | 33     |
| **8** | 10,276,461 | 125,012,862 | 740,276 | 39     |

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

{: columns="1 2" }

| N     | Time (s) | Iter.s |
|-------|----------|--------|
| **1** | 0.093    | 19     |
| **2** | 0.392    | 25     |
| **3** | 1.297    | 34     |
| **4** | 7.775    | 44     |
| **5** | 19.29    | 54     |
| **6** | 41.64    | 64     |
| **7** | 89.54    | 74     |
| **8** | 217.3    | 84     |

## Model Checking { #results }

We analyse this pathway through the following properties:

-   the amount of activated MAPK at time t and the standard deviation of this random variable;
-   the expected percentage of activated MAPK at time t;
-   the expected number of reactions between MAPK and MAKK by time t;
-   the expected time until all MAPK are activated at the same time instant.

These property can be computed by the CSL through the following formulae:

{% prismCode "casestudies/examples/mapk_cascade.csl", false, true %}

-   **The amount of activated MAPK at time t and the standard deviation of this random variable.**
    
    In the graph below, we have plotted this measure as `t` varies for `N=4` and `N=8`. The graphs also include the standard deviation of the random variable for the amount of activated MAPK at time `t`, drawn as a pair of dotted lines
    
    -   N=4
        
        ![graph plotting the expected amount of activated MAPK at time t (N=4)](/images/graphs/mapk_cascade.expected4.gif)

    -   N=8
        
        ![graph plotting the expected amount of activated MAPK at time t (N=8)](/images/graphs/mapk_cascade.expected8.gif)
    
    For the purposes of comparison, we also show results for the expected amount of activated MAPK computed using PRISM's discrete-event simulation engine. These are generated using very small numbers of simulation runs (10 and 100). Smoother approximations for the plots above can be obtained with higher numbers of runs.
    
    -   N=4
        
        ![graph plotting simulation results for the amount of activated MAPK at time t (N=4)](/images/graphs/mapk_cascade.simulation4.gif)

    -   N=8
        
        ![graph plotting simulation results for the amount of activated MAPK at time t (N=8)](/images/graphs/mapk_cascade.simulation8.gif)
    
    In the graph below we have ploted how the standard deviation of the random variable for the amount of activated MAPK at time `t` changes as both `t` and `N` vary
    
    ![graph plotting the standard deviation of the rv for the amount activated MAPK at time t](/images/graphs/mapk_cascade.sd.gif)
    
-   **The expected percentage of activated MAPK at time t.**
    
    In the graph below, we have plotted this measure as both `t` and `N` vary.
    
    ![graph plotting the expected percentage of activated MAPK at time t](/images/graphs/mapk_cascade.active.gif)
    
-   **The expected number of reactions between MAPK and MAKK by time t.**
    
    In the graph below, we have plotted this measure as both `t` and `N` vary.
    
    ![graph plotting the expected number of reactions between MAPK and MAKK by time t](/images/graphs/mapk_cascade.reactions.gif)
    
-   **the expected time until all MAPK are activated at the same time instant.**
    
    In the graph below we present the results obtained for this property as both `N` and `L` vary.
    
    ![graph plotting the expected time until all MAPK are activated at the same time instant](/images/graphs/mapk_cascade.time.gif)
