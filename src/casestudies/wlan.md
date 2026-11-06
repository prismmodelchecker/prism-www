---
layout: layouts/base.njk
title: "IEEE 802.11 Wireless LAN"
section: casestudies
permalink: /casestudies/wlan/
---
# IEEE 802.11 Wireless LAN

## Contents

-   [Introduction](#intro)
-   [Probabilistic Timed Automata Model](#model)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Analysis Results](#results)
    -   [Probabilistic reachability](#prob)
    -   [Time-bounded probabilistic reachability](#time)
    -   [Expected reachability](#expected)

**Related publications**: {% cite "KNS02a" %}

## Introduction { #intro }

This case study concerns probabilistic model checking of certain aspects of the IEEE 802.11 Wireless LAN. The international standard IEEE 802.11 was developed recently in recognition of the increased demand for wireless local area networks which permit interoperability of heterogeneous communication devices. In contrast to wired devices, stations of a wireless network cannot listen to their own transmission, and are therefore unable to employ medium access control schemes such as Carrier Sense Multiple Access with Collision Detection (CSMA/CD) in order to prevent simultaneous transmission on the channel. Instead, the IEEE 802.11 standard describes a Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA) mechanism, using a randomised exponential backoff rule to minimise the likelihood of transmission collision.

We model a two-way handshake mechanism of the IEEE 802.11 medium access control scheme, operating in a fixed network topology, using the modelling formalism of *probabilistic timed automata*. This formalism allows both nondeterministic choice (which, for example, can be used to model the unspecified data packet length) and probabilistic choice (which, for example, is present in the randomised backoff procedure) to coexist in the same model.

## Probabilistic Timed Automata Model { #model }

We consider a probabilistic timed automata model **WLAN** of the IEEE 802.11 Wireless LAN which models two stations colliding - trying to send messages at the same time - and then entering the randomised exponential backoff procedure. The timing constraints of the model correspond to the Frequency Hopping Spread Spectrum (FHSS) physical layer, rounded by a factor of 50 (i.e. 1 time unit equals 50 μs) to reduce complexity. We constructed an MDP of the model using the integer semantics given in {% cite "KNS02a" %}.

The mode consists of three components operating in parallel, namely **chan** (the channel) and **sender\_i** for i=1,2 (the sending stations).

### The channel

The probabilistic timed automaton representing the channel is shown in below. This automaton has two variables **c1** and **c2** which record the status of the packet being sent by station 1 and station 2 respectively, and which are updated both when a station starts sending a packet (event send) and when a station finishes sending a packet (event finish). These variables have the following interpretation: **ci**\=0 - nothing being sent by station i; **ci**\=1 - packet from station i being sent correctly; **ci**\=2 - packet from station i being sent garbled.

![timed automaton representing the channel](/images/cs/wlan.channel.gif)

### The sending stations

The probabilistic timed automaton **sender\_1** representing station 1 is shown below and the automaton for station 2 is symmetric. The sender begins in **SENSE** with a data packet ready to send, and senses the channel. If the channel remains free for **DIFS**, then the sender enters its vulnerable period and starts sending a packet (event send), otherwise the station enters backoff via an urgent transition. The time taken to send a packet is nondeterministic (within **TTMIN** and **TTMAX**). The success of the transmission depends on whether a collision has occurred, and is recorded by setting the variable **status** to the value of the channel variable **c1**. The sender then immediately tests the channel (represented by the urgent location **TESTC**). If the channel is busy, the sender enters the backoff procedure, otherwise it waits for an acknowledgement. If the packet was sent correctly (**status**\=1), then the destination station waits for **SIFS** and sends the acknowledgement; the sending station then receives this acknowledgement and finishes. On the other hand, if the packet was not sent correctly (**status**\=2), then the destination station does nothing. In this case, the sender times-out and enters the backoff procedure.

In the backoff procedure, the sender first waits for the channel to be free for **DIFS** and then sets its backoff value according to the random assignment **backoff**:=**RAND**(**bc**) The automaton then decrements **backoff** by 1 if the channel remains free for **ASLOT**. However, if the channel is sensed busy within this slot, it waits until the channel becomes free and then waits for **DIFS** before resuming its backoff procedure. When the value of **backoff** reaches 0 the sender starts re-sending its data packet.

![timed automaton representing a station](/images/cs/wlan.station.gif)

### Parameters

We use the parameters of the Frequency Hopping Spread Spectrum (FHSS) physical layer, with a transmission bit rate of 2Mbps for the data payload, as given below.

| variable       | description                                              | value    |
|----------------|----------------------------------------------------------|----------|
| **ASLOT**      | length of each backoff slot                              | 50μs     |
| **CCA**        | time receiver needs to asses the medium                  | 27μs     |
| **Turnaround** | time a station needs to change from receiving to sending | 20μs     |
| **SIFS**       | short interframe space                                   | 28μs     |
| **DIFS**       | DCF interframe space                                     | 128μs    |
| **TT_MIN**     | minimum time to send a packet                            | 224μs    |
| **TT_MAX**     | maximum time to send a packet                            | 15,717μs |
| **ACK**        | time to send an acknowledgement                          | 205μs    |
| **ACK_TO**     | time sender waits for acknowledgement before timing-out  | 300μs    |
| **AIRPROP**    | the air propagation time                                 | 1μs      |
| **VULN**       | vulnerable period (**AIRPROP+CCA+Turnaround**)           | 48μs     |

### PRISM model

The PRISM source code for this model is given below.

{% prismCode "casestudies/examples/wlan.nm", true, true %}

When checking probabilistic reachability and expected reachability properties we vary the value of **bcmax** (the maximum value a station's backoff counter can take) from **0** up to **6**. A station increases its backoff counter (up to the value of **bcmax**) each time a collision occurs and that the value of the backoff counter influences the range over which its next backoff is chosen. More precisely, a station's chooses its next backoff value uniformly from the range **{0,1,..., 2<sup>(k+4-1)</sup>}** when its backoff counter equals **k**.

When checking deadline properties (by adding an extra clock to the model and preventing progress once the clock reaches a certain deadline) we consider different values of **TT\_MAX**, in particular the values 500, 1,250 and 2,500 (again rounding by a factor of 50 to reduce complexity).

For details on the correctness of the integer semantics when verifying probabilistic timed automata against performance measures see {% cite "KNPS06" %}.

## Model Statistics { #stats }

The tables below shows statistics for each model we have built. The first section gives the number of **states** in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of **nodes** and the number of **leaves** (terminal nodes).

{: columns="1 3" }

| bcmax: | States:   | Nodes:  | Leaves: |
|--------|-----------|---------|---------|
| 0      | 16,069    | 31,540  | 3       |
| 1      | 34,855    | 39,436  | 4       |
| 2      | 87,345    | 54,130  | 5       |
| 3      | 217,082   | 64,756  | 6       |
| 4      | 586,255   | 81,684  | 6       |
| 5      | 1,774,068 | 92,744  | 7       |
| 6      | 5,958,233 | 105,876 | 8       |

**Deadline Models:**

{: columns="1 3" }

| **TT_MAX**=500 ||||
| DEADLINE (μs): | States:     | Nodes:  | Leaves: |
|----------------|-------------|---------|---------|
| 2,500          | 478,881     | 65,797  | 6       |
| 5,000          | 71,521,898  | 153,032 | 8       |
| 10,000         | 569,487,340 | 267,961 | 8       |

  

{: columns="1 3" }

| **TT_MAX**=1,250 ||||
| DEADLINE (μs):   | States:     | Nodes:  | Leaves: |
|------------------|-------------|---------|---------|
| 2,500            | 534,850     | 71,822  | 6       |
| 5,000            | 72,262,456  | 176,932 | 8       |
| 10,000           | 575,779,335 | 361,675 | 8       |

  

{: columns="1 3" }

| **TT_MAX**=2,500 ||||
| DEADLINE (μs):   | States:     | Nodes:  | Leaves: |
|------------------|-------------|---------|---------|
| 2,500            | 557,141     | 82,459  | 6       |
| 5,000            | 72,676,168  | 216,971 | 8       |
| 10,000           | 583,661,380 | 415,007 | 8       |

## Model Construction Times { #times }

The tables below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. The number of iterations for this process is also given.

| bcmax: | Construction: | Reachability: ||
| ^^     | Time (s):     | Iter.s:       | Time per iter. (s): |
|--------|---------------|---------------|---------------------|
| 0      | 8.39          | 346           | 0.0186              |
| 1      | 11.8          | 371           | 0.0268              |
| 2      | 17.4          | 396           | 0.0380              |
| 3      | 23.0          | 421           | 0.0493              |
| 4      | 29.0          | 446           | 0.0583              |
| 5      | 35.8          | 471           | 0.0681              |
| 6      | 44.3          | 496           | 0.0794              |

**Deadline Models:**

{: columns="2 2" }

| **TT_MAX**=500 ||||
| DEADLINE (μs): | Construction: | Reachability: ||
| ^^             | Time (s):     | Iter.s:       | Time per iter. (s): |
|----------------|---------------|---------------|---------------------|
| 2,500          | 11.8          | 100           | 0.104               |
| 5,000          | 61.2          | 222           | 0.253               |
| 10,000         | 243           | 477           | 0.481               |

  

{: columns="2 2" }

| **TT_MAX**=1,250 ||||
| DEADLINE (μs):   | Construction: | Reachability: ||
| ^^               | Time (s):     | Iter.s:       | Time per iter. (s): |
|------------------|---------------|---------------|---------------------|
| 2,500            | 13.4          | 99            | 0.121               |
| 5,000            | 72.9          | 196           | 0.339               |
| 10,000           | 472           | 417           | 1.03                |

  

{: columns="2 2" }

| **TT_MAX**=2,500 ||||
| DEADLINE (μs):   | Construction: | Reachability: ||
| ^^               | Time (s):     | Iter.s:       | Time per iter. (s): |
|------------------|---------------|---------------|---------------------|
| 2,500            | 16.8          | 99            | 0.153               |
| 5,000            | 94.9          | 196           | 0.459               |
| 10,000           | 482           | 322           | 1.41                |

## Analysis results { #results }

We now report on the model checking results obtained using PRISM when considering a number of different parameters. We consider three different types performance measures:

-   [probabilistic reachability](#prob)
-   [time-bounded probabilistic reachability](#time)
-   [expected reachability](#expected)

Due to the size of the deadline models, all experiments on these models were performed with PRISM's MTBDD engine.

<a name="prob"></a>

-   **Probabilistic reachability:** The following probabilistic reachability properties have been verified.
    
    -   "With probability 1, eventually both stations have sent their packet correctly." In PCTL this is expressed by:
        
        ```prism
        P>=1 [ true U s1=12 & s2=12 ].
        ```
        
        **Model checking times:**
        
        {: columns="1 2" }

        | bcmax: | Iterations: | Time per iter. (s): |
        |--------|-------------|---------------------|
        | 0      | 1,049       | 0.0158              |
        | 1      | 1,097       | 0.0237              |
        | 2      | 1,193       | 0.0378              |
        | 3      | 1,385       | 0.0669              |
        | 4      | 1,769       | 0.1295              |
        | 5      | 2,537       | 0.2184              |
        | 6      | 4,073       | 0.3602              |
        
          
        
        **Conclusion:** the property holds in the initial state.
        
    -   "The maximum probability that either station's backoff counter reaches **k**." To verify this property we add an extra variable to the model which counts the number of collisions, and then find the maximum probability of this variable reaching **k**. In PRISM this is expressed by:
        
        ```prism
        Pmax=? [ true U bc1=k | bc2=k ]
        ```
        
        **Model checking times:**
        
        {: columns="1 8" }

        | bcmax: | k=2    || k=4    || k=6    || k=8    ||
        | ^^     | iters: | time per<br>iter (s): | iters: | time per<br>iter (s): | iters: | time per<br>iter (s): | iters: | time per<br>iter (s): |
        |--------|--------|-----------------------|--------|-----------------------|--------|-----------------------|--------|-----------------------|
        | 0      | 28     | 0.0353                | 170    | 0.2348                | 308    | 0.5483                | 436    | 0.0353                |
        | 1      | 28     | 0.0378                | 218    | 0.3188                | 447    | 0.7781                | 658    | 0.0378                |
        | 2      | 28     | 0.0425                | 218    | 0.3770                | 636    | 1.2197                | 1,019  | 0.0425                |
        | 3      | 28     | 0.0489                | 218    | 0.4340                | 825    | 2.1654                | 1,596  | 0.0489                |
        | 4      | 28     | 0.0528                | 218    | 0.4748                | 825    | 2.0959                | 2,313  | 0.0528                |
        | 5      | 28     | 0.0571                | 218    | 0.5146                | 825    | 2.2331                | 3,022  | 0.0571                |
        | 6      | 28     | 0.0585                | 218    | 0.5037                | 825    | 2.2494                | 3,022  | 0.0585                |
        
        **Model checking results:**
        
        {: columns="1 7" }

        | bcmax: | k=2      | k=3      | k=4      | k=5      | k=6      | k=7      | k=8      |
        |--------|----------|----------|----------|----------|----------|----------|----------|
        | 0      | 0.183594 | 0.033707 | 0.006188 | 0.001136 | 0.000209 | 0.000038 | 7.03e-6  |
        | 1      | 0.183594 | 0.017033 | 0.001580 | 0.000147 | 0.000014 | 1.26e-6  | 1.17e-7  |
        | 2      | 0.183594 | 0.017033 | 0.000794 | 0.000037 | 1.73e-6  | 8.05e-8  | 3.75e-9  |
        | 3      | 0.183594 | 0.017033 | 0.000794 | 0.000019 | 4.34e-7  | 1.01e-8  | 2.37e-10 |
        | 4      | 0.183594 | 0.017033 | 0.000794 | 0.000019 | 2.17e-7  | 2.54e-9  | 2.98e-11 |
        | 5      | 0.183594 | 0.017033 | 0.000794 | 0.000019 | 2.17e-7  | 1.27e-9  | 7.45e-12 |
        | 6      | 0.183594 | 0.017033 | 0.000794 | 0.000019 | 2.17e-7  | 1.27e-9  | 3.72e-12 |
        
        <a name="time"></a>
        
    -   **Time-bounded probabilistic reachability:** for the deadline models the following properties are verified:
        
        -   **P1** - the minimum probability of both stations correctly delivering their packets within time **T**;
        -   **P2** - the minimum probability of either station correctly delivering its packet within time **T**;
        -   **P3** - the minimum probability of station 1 correctly delivering its packet within time **T**.
        
        In PCTL these is expressed by:
        
        ```prism
        	Pmin=? [ true U s1=12 & s2=12 & t<=T ]
        ```
        
        ```prism
        	Pmin=? [ true U (s1=12 | s2=12) & t<=T ]
        ```
        
        ```prism
        	Pmin=? [ true U s1=12 & t<=T ]
        ```
        
        **Model checking times:**
        
        {: columns="1 3 3" }

        | **TT_MAX**=500 |||||||
        | DEADLINE (μs): | Iterations: ||| Time per iter. (s): |||
        | ^^             | P1          | P2  | P3  | P1                  | P2    | P3    |
        |----------------|-------------|-----|-----|---------------------|-------|-------|
        | 2,500          | 73          | 92  | 89  | 0.061               | 0.166 | 0.115 |
        | 5,000          | 187         | 215 | 215 | 1.06                | 1.44  | 1.78  |
        | 10,000         | 445         | 465 | 469 | 12.6                | 10.4  | 11.7  |
        
          
        
        {: columns="1 3 3" }

        | **TT_MAX**=1,250 |||||||
        | DEADLINE (μs):   | Iterations: ||| Time per iter. (s): |||
        | ^^               | P1          | P2  | P3  | P1                  | P2    | P3    |
        |------------------|-------------|-----|-----|---------------------|-------|-------|
        | 2,500            | 59          | 71  | 71  | 0.044               | 0.060 | 0.051 |
        | 5,000            | 142         | 164 | 170 | 0.285               | 0.650 | 0.596 |
        | 10,000           | 358         | 405 | 410 | 8.44                | 8.54  | 8.79  |
        
          
        
        {: columns="1 3 3" }

        | **TT_MAX**=2,500 |||||||
        | DEADLINE (μs):   | Iterations: ||| Time per iter. (s): |||
        | ^^               | P1          | P2  | P3  | P1                  | P2    | P3    |
        |------------------|-------------|-----|-----|---------------------|-------|-------|
        | 2,500            | 8           | 10  | 10  | 0.047               | 0.072 | 0.052 |
        | 5,000            | 108         | 132 | 132 | 0.093               | 0.239 | 0.160 |
        | 10,000           | 227         | 354 | 354 | 3.02                | 3.21  | 2.77  |
        
        **Model checking results:** in the graph below, for a selection of different values for **DEADLINE**, we have plotted the model checking results for each value of **TT\_MAX**.
        
        -   **TT\_MAX**\=500
            
            ![graph for deadline properties when TT\_MAX=500](/images/graphs/wlan.10.png)

        -   **TT\_MAX**\=1,250
            
            ![graph for deadline properties when TT\_MAX=1,250](/images/graphs/wlan.25.png)

        -   **TT\_MAX**\=2,500
            
            ![graph for deadline properties when TT\_MAX=2,500](/images/graphs/wlan.50.png)
        
        <a name="expected"></a>
        
    -   **Expected reachability:** based on the reward structures given in the PRISM source code we consider the following expected reachability properties.
        
        -   Maximum expected number of collisions before both stations correctly send their packets (`R{"collisions"}max`\=? \[ `F` `s1=12` & `s2=12` \])
            
            **Model checking times and results:**
            
            {: columns="1 2 1" }

            | bcmax: | Iterations: | Time per iter. (s): | Max expected collisions: |
            |--------|-------------|---------------------|--------------------------|
            | 0      | 340         | 0.0035              | 1.2248                   |
            | 1      | 422         | 0.0087              | 1.2023                   |
            | 2      | 616         | 0.0281              | 1.2014                   |
            | 3      | 1000        | 0.0807              | 1.2014                   |
            | 4      | 1565        | 0.2005              | 1.2014                   |
            | 5      | 3101        | 0.5403              | 1.2014                   |
            | 6      | 6169        | 1.8212              | 1.2014                   |
            
        -   Maximum expected time until both stations correctly deliver their packets (`R{"time"}max`\=? \[ `F` `s1=12` & `s2=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 996          | 0.0009              | 3,743         | 0.0032              |
            | 1      | 1,017        | 0.0026              | 3,130         | 0.0085              |
            | 2      | 1,264        | 0.0097              | 3,019         | 0.0270              |
            | 3      | 1,853        | 0.0420              | 3,398         | 0.0709              |
            | 4      | 3,089        | 0.1312              | 4,390         | 0.1818              |
            | 5      | 5,442        | 0.4398              | 6,813         | 0.4985              |
            | 6      | 9,385        | 1.5949              | 10,848        | 1.6467              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax  |||||||
            | ^^     | 0      | 1      | 2      | 3      | 4      | 5      | 6      |
            |--------|--------|--------|--------|--------|--------|--------|--------|
            | 500    | 3,792  | 3,865  | 3,882  | 3,883  | 3,883  | 3,883  | 3,883  |
            | 1,250  | 6,206  | 6,263  | 6,280  | 6,281  | 6,281  | 6,281  | 6,281  |
            | 2,500  | 10,230 | 10,261 | 10,276 | 10,277 | 10,277 | 10,277 | 10,277 |
            | 5,000  | 18,278 | 18,255 | 18,268 | 18,270 | 18,270 | 18,270 | 18,270 |
            | 10,000 | 34,401 | 34,265 | 34,274 | 34,275 | 34,275 | 34,275 | 34,275 |
            | 15,000 | 50,521 | 50,271 | 50,275 | 50,279 | 50,281 | 50,281 | 50,281 |
            | 15,800 | 52,944 | 52,677 | 52,681 | 52,682 | 52,682 | 52,682 | 52,682 |
            
        -   Maximum expected cost until both stations correctly deliver their packets (`R{"cost"}max`\=? \[ `F` `s1=12` & `s2=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 1,251        | 0.0009              | 4,511         | 0.0038              |
            | 1      | 1,210        | 0.0025              | 3,669         | 0.0086              |
            | 2      | 1,469        | 0.0121              | 3,418         | 0.0260              |
            | 3      | 2,120        | 0.0347              | 3,769         | 0.0683              |
            | 4      | 3,330        | 0.1221              | 4,952         | 0.1804              |
            | 5      | 5,974        | 0.3810              | 7,280         | 0.4989              |
            | 6      | 10,406       | 1.4110              | 12,429        | 1.6510              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax     |||||||
            | ^^     | 0         | 1         | 2         | 3         | 4         | 5         | 6         |
            |--------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
            | 500    | 250,633   | 228,206   | 227,315   | 227,297   | 227,297   | 227,297   | 227,297   |
            | 1,250  | 617,953   | 561,758   | 559,505   | 559,457   | 559,456   | 559,456   | 559,456   |
            | 2,500  | 1,230,154 | 1,117,678 | 1,113,153 | 1,113,056 | 1,113,055 | 1,113,055 | 1,113,055 |
            | 5,000  | 2,454,555 | 2,229,519 | 2,220,450 | 2,220,254 | 2,220,252 | 2,220,252 | 2,220,252 |
            | 10,000 | 4,903,359 | 4,453,200 | 4,435,045 | 4,434,650 | 4,434,646 | 4,434,646 | 4,434,646 |
            | 15,000 | 7,352,163 | 6,676,882 | 6,649,639 | 6,649,046 | 6,649,040 | 6,649,040 | 6,649,040 |
            | 15,800 | 7,719,484 | 7,010,435 | 6,981,829 | 6,981,206 | 6,981,199 | 6,981,199 | 6,981,199 |
            
        -   Maximum expected time until either station correctly delivers its packet (`R{"time"}max`\=? \[ `F` `s1=12 | s2=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 918          | 0.0009              | 3,414         | 0.0033              |
            | 1      | 927          | 0.0024              | 2,792         | 0.0108              |
            | 2      | 1,159        | 0.0125              | 2,660         | 0.0340              |
            | 3      | 1,712        | 0.0372              | 3,003         | 0.0716              |
            | 4      | 2,893        | 0.2152              | 3,972         | 0.1988              |
            | 5      | 5,032        | 0.3803              | 6,189         | 0.7594              |
            | 6      | 9,130        | 1.4180              | 9,984         | 1.6505              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax  |||||||
            | ^^     | 0      | 1      | 2      | 3      | 4      | 5      | 6      |
            |--------|--------|--------|--------|--------|--------|--------|--------|
            | 500    | 2,525  | 2,551  | 2,558  | 2,559  | 2,559  | 2,559  | 2,559  |
            | 1,250  | 4,190  | 4,199  | 4,206  | 4,207  | 4,207  | 4,207  | 4,207  |
            | 2,500  | 6,963  | 6,946  | 6,952  | 6,953  | 6,953  | 6,953  | 6,953  |
            | 5,000  | 12,512 | 12,441 | 12,445 | 12,446 | 12,446 | 12,446 | 12,446 |
            | 10,000 | 23,636 | 23,451 | 23,450 | 23,451 | 23,451 | 23,451 | 23,451 |
            | 15,000 | 34,761 | 34,462 | 34,457 | 34,457 | 34,457 | 34,457 | 34,457 |
            | 15,800 | 36,429 | 36,113 | 36,107 | 36,108 | 36,108 | 36,108 | 36,108 |
            
        -   Maximum expected cost until either station correctly delivers its packets (`R{"cost"}max`\=? \[ `F` `s1=12 | s2=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 1,247        | 0.0010              | 4,506         | 0.0034              |
            | 1      | 1,200        | 0.0024              | 3,603         | 0.0084              |
            | 2      | 1,452        | 0.0084              | 3,285         | 0.0256              |
            | 3      | 2,096        | 0.0346              | 3,642         | 0.0682              |
            | 4      | 3,276        | 0.1212              | 4,763         | 0.1800              |
            | 5      | 5,856        | 0.3804              | 7,074         | 0.4995              |
            | 6      | 9,651        | 1.4109              | 11,867        | 1.6513              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax     |||||||
            | ^^     | 0         | 1         | 2         | 3         | 4         | 5         | 6         |
            |--------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
            | 500    | 243,068   | 220,593   | 219,692   | 219,673   | 219,673   | 219,673   | 219,673   |
            | 1,250  | 602,888   | 546,644   | 544,381   | 544,333   | 544,332   | 544,332   | 544,332   |
            | 2,500  | 1,202,589 | 1,090,065 | 1,085,530 | 1,085,432 | 1,085,431 | 1,085,431 | 1,100,858 |
            | 5,000  | 2,401,991 | 2,176,906 | 2,167,828 | 2,167,630 | 2,167,628 | 2,167,628 | 2,167,628 |
            | 10,000 | 4,800,795 | 4,350,587 | 4,332,422 | 4,332,026 | 4,332,022 | 4,332,022 | 4,332,022 |
            | 15,000 | 7,199,599 | 6,524,268 | 6,497,017 | 6,496,422 | 6,496,416 | 6,496,416 | 6,496,416 |
            | 15,800 | 7,559,420 | 6,850,321 | 6,821,706 | 6,821,082 | 6,821,075 | 6,821,075 | 6,821,075 |
            
        -   Maximum expected time until station 1 correctly delivers its packet (`R{"time"}max`\=? \[ `F` `s1=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 824          | 0.0009              | 3,074         | 0.0061              |
            | 1      | 924          | 0.0031              | 2,919         | 0.0098              |
            | 2      | 1,201        | 0.0097              | 2,904         | 0.0296              |
            | 3      | 1,774        | 0.0365              | 3,288         | 0.0740              |
            | 4      | 3,012        | 0.1270              | 4,301         | 0.1932              |
            | 5      | 5,247        | 0.7049              | 6,616         | 0.6965              |
            | 6      | 9,274        | 1.4121              | 10,360        | 1.6465              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax  |||||||
            | ^^     | 0      | 1      | 2      | 3      | 4      | 5      | 6      |
            |--------|--------|--------|--------|--------|--------|--------|--------|
            | 500    | 3,322  | 3,352  | 3,359  | 3,360  | 3,360  | 3,360  | 3,360  |
            | 1,250  | 5,572  | 5,581  | 5,586  | 5,587  | 5,587  | 5,587  | 5,587  |
            | 2,500  | 9,333  | 9,310  | 9,314  | 9,314  | 9,314  | 9,314  | 9,314  |
            | 5,000  | 16,855 | 16,768 | 16,769 | 16,769 | 16,770 | 16,770 | 16,770 |
            | 10,000 | 31,899 | 31,685 | 31,679 | 31,680 | 31,680 | 31,680 | 31,68  |
            | 15,000 | 46,943 | 46,601 | 46,589 | 46,590 | 46,590 | 46,590 | 46,590 |
            | 15,800 | 49,200 | 48,839 | 48,826 | 48,826 | 48,826 | 48,826 | 48,826 |
            
        -   Maximum expected cost until station 1 correctly delivers its packets (`R{"cost"}max`\=? \[ `F` `s1=12` \])
            
            **Model checking times:**
            
            | bcmax: | TT_MAX=2,500 || TT_MAX=15,000 ||
            | ^^     | Iterations:  | Time per iter. (s): | Iterations:   | Time per iter. (s): |
            |--------|--------------|---------------------|---------------|---------------------|
            | 0      | 1,250        | 0.0009              | 4,509         | 0.0034              |
            | 1      | 1,206        | 0.0025              | 3,646         | 0.0083              |
            | 2      | 1,462        | 0.0084              | 3,373         | 0.0262              |
            | 3      | 2,109        | 0.0347              | 3,712         | 0.0681              |
            | 4      | 3,300        | 0.1212              | 4,877         | 0.1801              |
            | 5      | 5,923        | 0.3800              | 7,208         | 0.4975              |
            | 6      | 10,095       | 1.4089              | 12,216        | 1.6523              |
            
            **Model checking results:**
            
            | TT_MAX | bcmax     |||||||
            | ^^     | 0         | 1         | 2         | 3         | 4         | 5         | 6         |
            |--------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
            | 500    | 247,345   | 224,851   | 223,953   | 223,934   | 223,934   | 223,934   | 223,934   |
            | 1,250  | 611,400   | 555,091   | 552,829   | 552,781   | 552,780   | 552,780   | 552,780   |
            | 2,500  | 1,218,159 | 1,105,494 | 1,100,957 | 1,100,859 | 1,100,858 | 1,100,858 | 1,085,431 |
            | 5,000  | 2,431,675 | 2,206,299 | 2,197,211 | 2,197,014 | 2,197,012 | 2,197,012 | 2,197,012 |
            | 10,000 | 4,858,709 | 4,407,909 | 4,389,721 | 4,389,324 | 4,389,320 | 4,389,320 | 4,389,320 |
            | 15,000 | 7,285,742 | 6,609,518 | 6,582,229 | 6,581,635 | 6,581,628 | 6,581,628 | 6,581,628 |
            | 15,800 | 7,649,797 | 6,939,760 | 6,911,106 | 6,910,482 | 6,910,475 | 6,910,475 | 6,910,475 |
