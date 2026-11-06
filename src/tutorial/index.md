---
layout: layouts/base.njk
title: "Tutorial"
section: doc
permalink: /tutorial/
---
# PRISM Tutorial

This tutorial will introduce you to the PRISM tool using a selection of example models.

The tutorial comprises several parts. If you are new to the tool, we recommend that you start by working through the first part (Knuth's die algorithm) to see the basics. After that, you should be able to look at the remaining parts in any order, depending in which models or applications you are interested in. If anything is unclear, the best place to look for answers is the [PRISM manual](/manual/).

-   **[Knuth's die algorithm](/tutorial/die/)**: This uses a simple **discrete-time Markov chain (DTMC)** example - a randomised algorithm for modelling a 6-sided die with a fair coin due to Don Knuth. It introduces the basics of the PRISM modelling language and the PRISM tool.  
      
    
-   **[Herman's self-stabilisation algorithm](/tutorial/herman/)**: This uses another simple randomised algorithm: a self-stabilisation algorithm due to Herman. This is also modelled as a **DTMC** and introduces some additional features of the **PRISM modelling** and property languages.  
      
    
-   **[Robot navigation](/tutorial/robot/)**: This introduces the use of **Markov decision processes (MDPs)** for generating control policies based on temporal logic specifications, via a simple example of a robot navigating through an uncertain environment.  
      
    
-   **[Autonomous drone](/tutorial/drone/)**: This shows how to use **interval Markov decision processes (IMDPs)** to incorporate **epistemic uncertainty** into probabilistic model checking of MDPs, specifically regarding the precise value of transition probabilities. It uses an example of an autonomous drone.  
      
    
-   **[Dynamic power management](/tutorial/power/)**: This introduces a **multi-component system** modelled as a **continuous-time Markov chain (CTMC)**: a controller for a dynamic power management system.  
      
    
-   **[Circadian clock](/tutorial/circadian/)**: This demonstrates the use of PRISM to study a **biological system**, modelled as a **CTMC**: a circadian clock.  
      
    
-   **[EGL contract signing protocol](/tutorial/egl/)**: This uses a case study from the field of **computer security**, modelled as a **DTMC**: the EGL contract signing protocol.  
      
    
-   **[Dining philosophers problem](/tutorial/phil/)**: This introduces the use of a **MDP** to verify a simple **distributed randomised algorithm**: the dining philosophers problem.

If you have questions, comments, or suggestions regarding this tutorial, please [contact](/contact/) us.
