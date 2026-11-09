---
layout: layouts/base.njk
title: "FGF (fibroblast growth factor) signalling"
section: casestudies
permalink: /casestudies/fgf/
---
# FGF (fibroblast growth factor) signalling

## Contents

-   [Introduction](#intro)
-   [The Pathway](#pathway)
-   [The PRISM Model](#model)
-   [Model Checking](#results)

**Related publications**: {% cite "HKN+06", "HKN+08" %}

## Introduction { #intro }

Fibroblast Growth Factors (FGF) are a family of proteins which play a key role in the process of cell signalling in a variety of contexts, for example wound healing. The mechanisms of the FGF signalling pathway are complex and not yet fully understood. In the case study we analyse a model of the pathway based on literature-derived information regarding the early stages of FGF signal propagation and which incorporates several features that have been reported to negatively regulate this propagation.

## The Pathway { #pathway }

Our model incorporates protein-protein interactions (including competition for partners), phosphorylation and dephosphorylation, protein complex relocation and protein complex degradation (via ubiquitin-mediated proteolysis). The follow figure illustrates the different components in the pathway and their possible bindings.

![image of pathway](/images/cs/fgf.gif){.large}

Below is a list of the reactions included in the model.

-   **1.** An FGF ligand binds to an FGF receptor (FGFR) creating a complex of FGF and FGFR.
-   **2.** The existence of this FGF:FGFR dimer leads to phosphorylation of FGFR on two residues Y653 and Y654 in the activation loop of the receptor.
-   **3.** The dual Y653/654 form of the receptor leads to phosphorylation of other FGFR receptor residues: Y663, Y583, Y585, Y766 (in this model we only consider Y766 further).
-   **4.** and **5.** The dual Y653/654 form of the receptor also leads to phosphorylation of the FGFR substrate FRS2, which binds to both the phosphorylated and dephosphorylated forms of the FGFR.
-   **6.** FRS2 can also be dephosphorylated by a phosphotase, denoted Shp2.
-   **7.** A number of effector proteins interact with the phosphorylated form of FRS2. In this model we include Src, Grb2:Sos and Shp2.
-   **8.** and **9.** In these steps we incorporate two methods of attenuating signal propagation by removal (i.e. relocation) of components. In step **8.** we assume that Src associated with the phosphorylated FRS2 leads to relocation (i.e. endocytosis and/or degradation of FGFR:FRS2). In step **9.** we assume that Plc bound to Y766 of FGFR leads to relocation/degradation of FGFR.
-   **10.** The signal attenuator Spry is a known inhibitor of FGFR signalling and is synthesised in response to FGFR signalling. Here we include a variable to regulate the concentration of Spry protein in a time dependent manner.
-   **11.** We incorporate the association of Spry with Src and concomitant phosphorylation of Spry residue Y55.
-   **12.** The Y55 phosphorylated form of Spry binds Cbl , which leads to ubiquitin modification of FRS2 and a degradation of FRS2 through ubiquitin mediated proteolysis.
-   **13.** Y55P form of Spry is dephosphorylated by Shp2 bound to FRS2 Y247P.
-   **14.** Grb2 binds the Y55P form of Spry. In our model Spry competes with FRS2 for Grb2 as has been suggested from some studies in the literature.

The full details of the reactions can be found [here](/casestudies/fgf.reactions/).

Note that this model is not intended to and cannot be a fully accurate representation of a real-world FGF signalling pathway. Its primary purpose at this stage of development is as a tool to evaluate biological hypotheses that are not easily obtained by intuition or manual methods. To this end, the model is an abstraction as argued in {% cite "RS02" %}.

We explicitly draw attention to the following issues. The reactions selected are based upon their current biological interest rather than complete understanding of the components of FGF signalling. Indeed, at this stage we have ignored many reactions that could prove significant in regulation of FGFR signalling in real cells. However, the design permits the incorporation of further modifications to the core model as biological understanding advances. The model is idealised in that it does not take into account variations in composition, affinities or rate constants that might occur in different cell types or physiological conditions. However, a useful computational modelling approach should accommodate future quantitative or qualitative modifications to the core model, and we explicitly address this issue by evaluation of parameter dependencies below.

The model is based upon literature-defined events. There is always the possibility that the reported biological significance of these processes reflects the experimental context rather than the normal situation. For example, the significance of Plc in the relocation of FGFR signalling complexes has been the subject of some debate, as has the action of Spry. As we demonstrate in this paper, the model as presented provides the ability to ask what if questions which should inform the biological debate.

## The PRISM Model { #model }

We now describe the specification in PRISM of the FGF model from the previous section. Each of the basic elements of the pathway, including all the possible compounds and receptors residues (FGF, FGFR, FRS2, Plc, Src, Spry, Sos, Grb2, Cbl and Shp2) is represented by a separate PRISM module and synchronisation between modules is used to model reactions which involve interactions between multiple elements. However, the different forms which each can take (for example, which other compounds it is bound to) are represented by one or more variables within the module. Our model represents a single instance of the signalling pathway, i.e. there can be at most one of each compound.

The study of a single instance of the pathway is also motivated by the fact that the same signal dynamics were obtained for a model where the concentrations were set to 100. Details of this model are available from [here](http://qav.cs.ox.ac.uk/projects/sysbio/fgf.php) - note that this study uses the stochastic pi-calculus and the simulation tool [BioSpi](http://www.wisdom.weizmann.ac.il/~biospi/index_main.html).

We constructed several models. In the first model, representing the full system, we suppose that initially FGF, unbound and unphosphorylated FGFR, unphosphorylated FRS2, unbound Src, Grb2, Cbl, Plc and Sos are all present in the system (Spry arrives into the system with the half-time of 10 minutes).

Subsequently, we constructed additional four models in order to investigate the roles of the various components of the activated receptor complex in controlling signalling dynamics. This is done by building modified models of the pathway where certain components are omitted (Shp2, Src, Spry or Plc). This is easily achieved in the PRISM model by just changing the initial value of the component under study.

The PRISM model for the pathway is given below.

{% prismCode "casestudies/examples/fgf.sm", true, true %}

The table below shows statistics for the MTBDD which represents each model we have built, in terms of the number of **states**, **transitions**, the total number of **nodes** and the number of **leaves** (terminal nodes).

{: columns="1 4" }

| model          | States | Transitions | Nodes  | Leaves |
|----------------|--------|-------------|--------|--------|
| **full model** | 80,616 | 560,520     | 26,122 | 17     |
| **no Shp2**    | 14,088 | 91,752      | 9,607  | 16     |
| **no Src**     | 1,200  | 7,848       | 4,107  | 14     |
| **no Spry**    | 1,176  | 6,928       | 6,766  | 14     |
| **no Plc**     | 40,440 | 276,544     | 22,784 | 16     |

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

{: columns="1 2" }

| model          | Time (s) | Iter.s |
|----------------|----------|--------|
| **full model** | 0.51     | 32     |
| **no Shp2**    | 0.17     | 25     |
| **no Src**     | 0.15     | 17     |
| **no Spry**    | 0.17     | 18     |
| **no Plc**     | 0.43     | 30     |

## Model Checking { #results }

Our primary goal in this case study is to analyse the various mechanisms previously reported to negatively regulate signalling. Since the binding of Grb2 to FRS2 serves as the primary link between FGFR activation and ERK signalling, we examine the amount of Grb2 bound to FRS2 as the system evolves. In addition we investigate the different causes of degradation which, from the system specification, can be caused by one of the following reactions occurring:

-   when Src:FRS2 is present FRS2 is relocated (reaction **8**);
-   when Plc:FGFR it degrades FGFR (reaction **9**);
-   when phosphoSpry binds Cbl it degrades FRS2 (reaction **12**).

Below, we present a list of the various properties of the model that we have analysed, and the form in which they are specified to the PRISM tool.

-   [the probability that Grb2 is bound to FRS2 at the time instant T](#A)
-   [the expected number of times that Grb2 binds to FRS2 by time T](#B)
-   [the expected time that Grb2 spends bound to FRS2 within the first T time units](#C)
-   [the long-run probability that Grb2 is bound to FRS2](#D)
-   [the expected number of times Grb2 binds to FRS2 before either degradation or relocation occurs](#E)
-   [the expected time Grb2 spends bound to FRS2 before either degradation or relocation occurs](#F)
-   [the probability that each possible cause of degradation/relocation has occurred by time T](#G)
-   [the probability that each possible cause of degradation/relocation occurs first](#H)
-   [the expected time until either degradation or relocation occurs in the pathway](#I)

These property can be expressed by the CSL by the following formulae:

{% prismCode "casestudies/examples/fgf.csl", false, true %}

-   <a name="A"></a>
    
    **The probability that Grb2 is bound to FRS2 at the time instant T.** In the graph below, we have plotted this measure as `T` varies from 0 to 60 minutes.
    
    ![graph plotting the probability that Grb2 is bound to FRS2 at the time instant T](/images/graphs/fgf.A.gif)

    <a name="B"></a>
    
-   **The expected number of times that Grb2 binds to FRS2 by time T.**
    
    In the graph below, we have plotted this measure as `T` varies from 0 to 60 minutes.
    
    ![graph plotting the expected number of times that Grb2 binds to FRS2 by time T](/images/graphs/fgf.B.gif)

    <a name="C"></a>
    
-   **The expected time that Grb2 spends bound to FRS2 within the first T time units.** In the graph below, we have plotted this measure as `T` varies from 0 to 60 minutes.
    
    ![graph plotting the expected time that Grb2 spends bound to FRS2 within the first T time units](/images/graphs/fgf.C.gif)

    <a name="D"></a>
    
-   **The long-run probability that Grb2 is bound to FRS2.** In the table below we present the results obtained for this property.
    
    {: columns="1 1" }

    | model          | probability |
    |----------------|-------------|
    | **full model** | 7.54e-7     |
    | **no Shp2**    | 3.29e-9     |
    | **no Src**     | 0.659460    |
    | **no Spry**    | 4.6e-6      |
    | **no Plc**     | 0.0         |
    
    <a name="E"></a>
    
-   **The expected number of times Grb2 binds to FRS2 before either degradation or relocation occurs.** In the table below we present the model check statistics and results obtained for this property.
    
    {: columns="1 2 1" }

    | model          | Iterations | Time per iter (s) | reward  |
    |----------------|------------|-------------------|---------|
    | **full model** | 5,934      | 0.019873          | 43.1027 |
    | **no Shp2**    | 548        | 0.003365          | 10.0510 |
    | **no Src**     | 26,768     | 0.000169          | 283.233 |
    | **no Spry**    | 8,111      | 0.000235          | 78.3314 |
    | **no Plc**     | 6,828      | 0.008778          | 51.5475 |
    
    <a name="F"></a>
    
-   **The expected time Grb2 spends bound to FRS2 before either degradation or relocation occurs.** In the table below we present the model check statistics and results obtained for this property.
    
    {: columns="1 2 1" }

    | model          | Iterations | Time per iter (s) | reward  |
    |----------------|------------|-------------------|---------|
    | **full model** | 5,937      | 0.025217          | 6.27042 |
    | **no Shp2**    | 549        | 0.003973          | 7.78927 |
    | **no Src**     | 26,768     | 0.000201          | 39.6102 |
    | **no Spry**    | 8,110      | 0.000273          | 10.8791 |
    | **no Plc**     | 6,831      | 0.011287          | 7.56241 |
    
    <a name="G"></a>
    
-   **The probability that each possible cause of degradation/relocation has occurred by time T.** In the graphs below, we have plotted these measures as `T` varies from 0 to 60 minutes.
    
    ![graph plotting the probability that Src:FRS2 causes the relocation of FRS2 by time T](/images/graphs/fgf.G1.gif)

    ![graph plotting the probability that Plc:FGFR degrades FGFR by time T](/images/graphs/fgf.G2.gif)

    ![graph plotting the probability that phosphoSpry binds Cbl and degrades FRS2 by time T](/images/graphs/fgf.G3.gif)

    <a name="H"></a>
    
-   **The probability that each possible cause of degradation/relocation occurs first.** In the tables below we present the model check statistics and results obtained for these properties.
    
    | model          | Src:FRS2 |||
    | ^^             | iters    | Time per iter (s) | result:  |
    |----------------|----------|-------------------|----------|
    | **full model** | 5,965    | 0.017676          | 0.602356 |
    | **no Shp2**    | 583      | 0.002642          | 0.679102 |
    | **no Src**     | -        | -                 | -        |
    | **no Spry**    | 8,110    | 0.000155          | 0.724590 |
    | **no Plc**     | 6,863    | 0.012363          | 0.756113 |
    
      
    
    | model          | Plc:FGFR |||
    | ^^             | iters    | Time per iter (s) | result:  |
    |----------------|----------|-------------------|----------|
    | **full model** | 5,965    | 0.015472          | 0.229107 |
    | **no Shp2**    | 583      | 0.002521          | 0.176693 |
    | **no Src**     |          | -                 | 1.0      |
    | **no Spry**    | 8,110    | 0.000155          | 0.275410 |
    | **no Plc**     | -        | -                 | -        |
    
      
    
    | model          | Spry:Cbl |||
    | ^^             | iters    | Time per iter (s) | result:  |
    |----------------|----------|-------------------|----------|
    | **full model** | 6,228    | 0.014881          | 0.168536 |
    | **no Shp2**    | 610      | 0.002951          | 0.149742 |
    | **no Src**     | -        | -                 | 0.0      |
    | **no Spry**    | -        | -                 | -        |
    | **no Plc**     | 7,124    | 0.011837          | 0.243887 |
    
    <a name="I"></a>
    
-   **The expected time until either degradation or relocation occurs in the pathway.** In the table below we present the model check statistics and results obtained for this property.
    
    {: columns="1 2 1" }

    | model          | Iterations | Time per iter (s) | reward (mins) |
    |----------------|------------|-------------------|---------------|
    | **full model** | 5,964      | 0.020113          | 14.0258       |
    | **no Shp2**    | 583        | 0.003310          | 10.5418       |
    | **no Src**     | 26,767     | 0.000169          | 60.3719       |
    | **no Spry**    | 8,110      | 0.000231          | 16.8096       |
    | **no Plc**     | 6,863      | 0.008808          | 17.5277       |
