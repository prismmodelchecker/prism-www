---
layout: layouts/base.njk
title: "Air traffic control systems"
section: casestudies
permalink: /casestudies/airtraffic/
---
# Air traffic control systems

*[Contributed by Yang Zhao &amp; Kristin Yvonne Rozier]*{.note}

## Contents

-   [Introduction](#intro)
-   [Modelling Overview](#model)
-   [DTMC model: LoS detection by AutoResolver and TSAFE](#dtmc)
-   [CTMC model: the complete AAC system](#ctmc)
-   [Model Checking](#mc)

**Related publications:** {% cite "ZR14" %}

## Introduction { #intro }

Ensuring aircraft stay safely separated is the primary consideration in air traffic control. To achieve the required level of assurance for this safety-critical application, the Automated Airspace Concept (AAC) proposes a network of components providing multiple levels of separation assurance, including conflict detection and resolution. In this case study, probabilistic model checking is used to study the AAC system.

One of the most pressing problem facing system designers of the AAC architecture is that of functional allocation, or how to arrange the components in the best way. For example, we can make different hardware choices with different reliability characteristics, we can place either AutoResolver or TSAFE either on the ground or in the air and connect them in different ways, and there can be varying levels of redundancy in the system. Finding any cases where one configuration is safer than another is vital for designing the safest system. Finding that two or more configurations are equivalent is also important. Safety is the first priority so establishing a set of logically equally safe configurations allows system designers to optimize for other pressing concerns, such as cost, fuel efficiency, minimizing flight delays, minimizing environmental impact factors, usability, etc.

In order to gather data to help evaluate the functional allocation question, NASA commissioned a study to determine the failure probabilities of both potential hardware and software components for the AAC. We utilize this data to build a probabilistic model of the AAC system. The model consists of a real-time algorithm, a logic protocol, and human factors and integrates hardware and software, including probabilities of failure for potential hardware choices of components to enable the system designers to decide the best functional allocation for their air traffic control system so they can design for resilience and robustness. The separation assurance algorithms, which are defined over specific time ranges, are modeled using a Discrete Time Markov Chain (DTMC). The emergence of conflicts in an airspace sector and the reaction times of pilots are modeled as a Continuous Time Markov Chain (CTMC). Utilising these two models, we calculate the probability of an unresolved conflict as a measure of safety and compare multiple design options.

The complete files for this case study (including python scripts) are available from [here](http://research.kristinrozier.com/ICCAD14.html).

## Modelling Overview { #model }

There are two stages of Loss of Separation (LoS) resolution:

-   the process of conflict detection and then resolution generation
-   the process of resolution transmission and execution.

To successfully resolve a potential LoS, either TSAFE (Tactical Separation Assurance Flight Environment) or AutoResolver should first detect it and calculate resolution maneuvers. TSAFE and AutoResolver are designed to independently address conflicts that occur in different time ranges. We use a DTMC model to analyze the separation assurance processes of AutoResolver and TSAFE, and the time to conflict is modeled as a state variable. The above problem is then reduced to a probabilistic reachability problem in the DTMC.

The second stage involves the coordination of TSAFE and AutoResolver defined in the operational concept in the AAC. When both AutoResolver and TSAFE attempt to resolve a LoS, a protocol would be followed based on predicted time to the LoS. We also need to consider the human behaviors including pilots' and controllers' behaviors. We build a CTMC model to address this factor. Based on the calculated probabilities from the DTMC model, we have rates for AutoResolver and TSAFE alerting and giving resolutions to the controller or pilots.

We are interested in the probability of LoS. There are two factors that contribute to this measure:

-   the first is that both AutoResolver and TSAFE fail to detect and resolve the LoS;
-   the second is that either or both AutoResolver and TSAFE successfully generate the resolutions, but the resolutions are not executed on time.

We introduce the term resolution scenario. The resolution scenario (RS) is defined as a pair (*t<sub>1</sub>,t<sub>2</sub>*), where *t<sub>1</sub>* is the time that AutoResolver generates resolution before a projected LoS, and *t<sub>2</sub>* is the time for TSAFE. Based on system behavior, only a finite set of resolution scenarios are possible and there is a probability distribution on this set of possible resolution scenarios. The probability of an RS (*t<sub>1</sub>,t<sub>2</sub>*) is denoted by **P<sub>res</sub>**((*t<sub>1</sub>,t<sub>2</sub>*)). For RS (*t<sub>1</sub>,t<sub>2</sub>*), we denote the probability that neither resolution (if generated) is executed on time by **P<sub>noexe</sub>**((*t<sub>1</sub>,t<sub>2</sub>*)).

To summarize, the probability **P<sub>LoS</sub>** that LoS occurs can be calculated by summing:

-   the probability of no resolution;
-   the sum of **P<sub>res</sub>**((*t<sub>1</sub>,t<sub>2</sub>*)) · **P<sub>noexe</sub>**((*t<sub>1</sub>,t<sub>2</sub>*)) over all possible resolution scenarios (*t<sub>1</sub>,t<sub>2</sub>*).

The DTMC model is devoted to generating all resolution scenarios and their probabilities and the CTMC model computes the probability **P<sub>noexe</sub>** for each RS.

Since AutoResolver and TSAFE are two different algorithms, and they try to resolve the conflict based on different sets of information and different levels, it is possible that a resolution generated by AutoResolver may result in a TSAFE conflict. We consider two different design options.

**Checking Scheme.** We can make TSAFE detection an integral part of the AutoResolver conflict detection cycle, so that TSAFE checks whether any AutoResolver-generated resolutions will result in a TSAFE conflict. If so, AutoResolver will discard this resolution and try to detect and resolve again in the next round. If not, AutoResolver will send the resolution as usual.

**No-checking scheme.** AutoResolver directly sends its resolution without checking with TSAFE. There is probability *p<sub>in</sub>* a TSAFE conflict will occur after this resolution is executed.

## DTMC model: LoS detection by AutoResolver and TSAFE { #dtmc }

By modeling the separation assurance processes of AutoResolver and TSAFE, a distribution of time to conflict when AutoResolver and/or TSAFE generate resolutions can be obtained. We build a DTMC to calculate the probability distribution among RSs. In other words, we need to answer the question: what is the probability that AutoResolver generates resolution at *t<sub>1</sub>* (ahead of the LoS) and TSAFE does that at *t<sub>2</sub>* for a potential LoS?

We first introduce the process of AutoResolver and TSAFE LoS detection and resolution. Both of these two components rely on radars to obtain the current trajectories for all aircraft, and radars scan air section periodically with a fixed frequency.

In each air sector, AutoResolver and TSAFE execute in parallel to tackle LoSs in different time ranges. AutoResolver is designed for LoSs between *T<sub>AU</sub>* (upper-bound time for AutoResolver) and *T<sub>AL</sub>* (lower-bound time for AutoResolver) ahead of projected time of LoS, and TSAFE for those between *T<sub>TU</sub>* (upper-bound time for TSAFE) and *T<sub>TL</sub>* (lower-bound time for TSAFE) ahead of projected time of LoS. Both AutoResolver and TSAFE follow a loop procedure, and each loop corresponds to a radar period. The diagram below shows the procedures of detecting and resolving a LoS for AutoResolver and TSAFE. The shaded area in the diagram corresponds to when the **checking scheme** is included.

![Flow diagram for the interaction of AutoResolver and TSAFE](/images/cs/airtraffic_flow1.png)

The timeline for AutoResolver is given in the diagram below.

![AutoResolver timeline for LoS detection and resolution](/images/cs/airtraffic_flow2.png){.w75}

The basic separation assurance process can be described as follows.

-   AutoResolver checks for LoS every radar cycle Δ<sub>Ad</sub>, called the AutoResolver detection interval. If no conflict is detected during a check, AutoResolver will retry after Δ<sub>Ad</sub>.
-   The probability that AutoResolver and TSAFE detect that the conflict could occur in time t is given by a formula *p(t*).
-   If AutoResolver detects and successfully resolves a LoS in future, AutoResolver generates a resolution, and the resolution time is current time t. If the conflict is not resolved by the next Δ<sub>Ad</sub>, i.e. the trajectories of the involved aircraft are still projected to lead to LoS, then it will retry resolution in next detection process.

The TSAFE separation assurance process follows a similar detection and then resolution routine with a different radar cycle Δ<sub>Td</sub>.

We use two Boolean resolution variables: *AR\_res* indicates whether AutoResolver has generated a resolution and *TSAFE\_res* indicates whether TSAFE has generated a resolution. Another two variables, *AR\_res\_time* and *TSAFE\_res\_time*, record the times these resolutions were generated, which is particularly important if corresponding resolutions are generated for the same conflict.

The PRISM code for the **checking** scheme is given below. The **no-checking** can be obtained by removing the last command of the module for the AutoResolver (this corresponding to the shaded area in the diagram showing the procedures of detecting and resolving a LoS for AutoResolver and TSAFE).

{% prismCode "casestudies/examples/airtraffic_dtmc.prism", false, true %}

We use PRISM to find the probabilities of reaching all bottom strongly-connected components (BSCCs). Then use a python script to check the value of *AR\_res*, *TSAFE\_res*, *AR\_res\_time*, and *AR\_res\_time* in each component. This allows us to find all possible resolution scenarios and corresponding probabilities which will serve as input to our CTMC model below.

## CTMC model: the complete AAC system { #ctmc }

We use a CTMC model to analyze the process that generated resolutions are transmitted to involved aircraft. The system behaviors are modeled as a CTMC. For simplicity, we assume the response time for pilots follows the exponential distribution. The structure of our CTMC model is shown below. The distribution of RS obtained from the DTMC model is the input.

![Structure of the CTMC model](/images/cs/airtraffic_ctmc.png)

In the CTMC model, we use the variables *AR\_res* and *TSAFE\_res* to indicate whether there are AutoResolver or TSAFE resolutions respectively. Moreover, *TSAFE\_res = BT* means the TSAFE resolution is before the TSAFE threshold, and *TSAFE\_res = AT* means that it is after the TSAFE threshold. We model two aircraft in the CTMC model. Each aircraft maintains two Boolean variables, *AR\_cmd* and *TSAFE\_cmd*, that indicate whether the aircraft has received a resolution from AutoResolver or TSAFE, respectively. According to the resolution priority protocol defined in the AAC operational concept, if both TSAFE and AutoResolver resolutions are received, the pilot will always execute the TSAFE resolution.

The CTMC model enjoys a “memoryless” property that the system behaviors starting from a certain time only depend on the state at that time. Thus, it is safe to divide the system execution path into several segments and analyze them independently. Our approach is to calculate the probability of each segment with different initial states separately.

There are four initial settings we need to consider:

1.  there is an AutoResolver resolution and no TSAFE resolution, and the time is before the TSAFE threshold;
2.  there are both AutoResolver and TSAFE resolutions, and the time is before the TSAFE threshold;
3.  there is only a TSAFE resolution, and the time is before the TSAFE threshold;
4.  there is only a TSAFE resolution, and the time is after the TSAFE threshold.

We use a Boolean variable *conflict* to denote whether there is an unresolved LoS in the future. The PRISM code for the CTMC model is presented below.

{% prismCode "casestudies/examples/airtraffic_ctmc.prism", false, true %}

## Modelling Checking { #mc }

We first consider the probability **P<sub>nores</sub>** that neither AutoResolver nor TSAFE successfully resolves the potential LoS. To accomplish this, we check the following PCTL property against our DTMC model:

```prism
P=?[F AR res=0 & TSAFE res=0]
```

We find that the probability is 2.22e−16 for both the **checking** and **no-checking** schemes.

The resulting probability of LoS is a primary consideration for designers to make a decision between these two schemes. There is a trade-off between the delay that AutoResolver generates the resolution and the save from eliminating the potential TSAFE conflict caused by AutoResolver. The probability that AutoResolver resolution causes a TSAFE conflict, denoted by **P<sub>c</sub>**, plays an important role in this decision making. This parameter is an input to our model and should be obtained from analyzing the AutoResolver and TSAFE algorithms and also statistical results from the practical data. Intuitively, when **P<sub>c</sub>** is “very small,” the no-checking scheme seems to be a better choice, while the checking scheme tends to outperform the no-checking scheme when **P<sub>c</sub>** is large. We need to obtain an quantitative understanding about the impact of **P<sub>c</sub>** to the decision we make between these two schemes.

The probabilities of LoS for the **checking** and **no-checking** schemes under different values of **P<sub>c</sub>** is given below (the x-axis represents **P<sub>c</sub>** and the y-axis represents the probability of LoS). We can clearly see that the results of the **checking** scheme are not sensitive to **P<sub>c</sub>** while those of the **no-checking** scheme are much more. There is a cross of these two curves when **P<sub>c</sub>** is approximately 0.015. When **P<sub>c</sub>** is smaller the no-checking scheme results in a smaller probability of LoS, and the checking scheme is better when **P<sub>c</sub>** is larger. Based on this result, system designers have a clearer understanding of how to choose between these two schemes under different parameters **P<sub>c</sub>**.

![Probability of LoS graph](/images/cs/airtraffic_graph.png)
