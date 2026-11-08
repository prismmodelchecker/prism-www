---
layout: layouts/base.njk
title: "Exercise"
permalink: /courses/biss07/
---
# Exercise

The exercise involves building and analysing a model in the [PRISM](/) tool. You will first need to [download](/download/) and [install](/manual/InstallingPRISM/Instructions) PRISM. If there are problems or questions, please use the [discussion group](http://groups.google.com/group/prismmodelchecker).

It is recommended that you start by looking at the PRISM [tutorial](/tutorial/). You can find information about all aspects of the tool in the [manual](/manual/). If you have further questions or problems, please use the [discussion group](http://groups.google.com/group/prismmodelchecker).

-   Study the existing PRISM case study of a [workstation cluster](/casestudies/cluster/). For this exercise, we will assume that there are **N**\=8 workstations in each sub-cluster. You can find the PRISM files here: \[[cluster.sm](/view/?f=/casestudies/examples/cluster.sm)\] \[[cluster.csl](/view/?f=/casestudies/examples/cluster.csl)\]  
      
    
-   Add a constant **rw** to the model representing the rate at which the repairman repairs a workstation (currently, this is 2). Then plot graphs for two of the time-bounded properties for various **rw**. Let time **T** range from 0-80 and let **rw** take the following values: 0.5, 1, 2, 2.5. For the remainder of the exercise, fix **rw** at 2 as before.  
      
    
-   Now, consider the following property on your model: "the expected time that the repairman spends working up until time T". For this, you will need to add a new reward structure to the model, and adapt one of the existing **R=?** properties. As above, generate a plot, varying **T** from 0-80.  
      
    
-   Let us assume that the repairman costs 100 euros per time unit when he is active and 10 euros per time unit otherwise. Adapting your existing reward structure, plot "the expected cost of the repairman up until time **T**" for the same time range as above.  
      
    
-   Now, make one of the following alterations to your model and then re-plot one of the graphs from above.  
      
    
    <ul class="prism-sublist"><li>Replace the single repairman with three separate repairmen: one each for the left and right sub-clusters and one for the central backbone.</li><li>Add a backup unit to the central backbone which has an identical failure rate to the existing one, but can only fail when it is operational.</li><li>Add two further sub-clusters of workstations (and modify the QoS definitions accordingly).</li></ul>
    

## Submission

Solutions to the exercise should include:

-   A brief description of your model, properties and the resulting analysis (graphs)
-   The files for the PRISM models and properties used
