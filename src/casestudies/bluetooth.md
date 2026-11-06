---
layout: layouts/base.njk
title: "Bluetooth Device Discovery"
section: casestudies
permalink: /casestudies/bluetooth/
---
# Bluetooth Device Discovery

## Contents

-   [Introduction](#intro)
-   [The Protocol](#protocol)
-   [The Model](#model)
-   [Analysis Results](#results)

**Related publications**: {% cite "DKNP04", "DKNP06" %}

## Introduction { #intro }

Bluetooth is a short-range low-power open standard for implementing wireless personal area networks. To avoid potential problems of interference, it uses a *frequency hopping* scheme, where devices alternate rapidly in a pseudo-random fashion among agreed sets of frequencies. Before communication can take place, devices must undergo an initialisation process, organising themselves into small networks called *piconets*, comprising one master and up to 7 slave devices in which frequency hopping sequences are synchronised. The first step of this initialisation process is called *device discovery* or *inquiry*. During this, an **inquiring device** (which will become the master of a piconet) broadcasts messages to discover **scanning devices** in the vicinity (potential slave devices).

## The Protocol { #protocol }

The following is a short description of the behaviour of inquiring and scanning devices according to the Bluetooth protocol. We work from the current version (1.2) of the [Bluetooth Specification](http://www.bluetooth.org).

All Bluetooth devices use a 28 bit free-running clock which ticks in 312.5μs time-slots. Communicating devices use a previously agreed sequence of 32 frequencies which, for convenience, we refer simply to as 1,2,...,32.

### The Inquiring Device

On two consecutive 312.5μs time slots, the inquiring device broadcasts inquiry packets on two sequential frequencies. During the next two time slots, the device scans for a reply on these same two frequencies. It then moves on to the next two frequencies. This process continues until some specified bound on the number of replies received or the total time is exceeded.

The 32 frequencies used are split into two trains, A and B, of 16 frequencies each. The inquiring device swaps between trains, repeating each one 256 times (i.e. for 2.56 seconds). In addition, every 1.28 seconds, a frequency is swapped between train A and B. The resulting sequence of frequencies is shown below. Each line of the table is repeated 128 times, taking 1.28 seconds. Initially, train A (light grey) contains frequencies 1...16 and train B (dark grey) contains 17...32.

<center><table cellpadding="2" cellspacing="0"><tbody><tr><td bgcolor="#000000"><table cellpadding="1" cellspacing="1" width="100%"><tbody><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>29</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#eeeeee"><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>30</td><td>31</td><td>32</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>15</td><td>16</td></tr><tr bgcolor="#cccccc"><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td>16</td></tr></tbody></table></td></tr></tbody></table></center>

### The Scanning Device

Scanning devices, i.e. those which wish to be discovered, listen on the same 32 frequencies, but hopping at a much slower speed to ensure eventual synchronisation. The devices alternate between a **sleep** state and a **scan** state. If, in the scan state, they successfully hear an inquiry packet, they wait 2 time slots and then send a reply packet. Subsequently, they performs a random back-off, waiting a random number of slots (0...127) before returning to the scan state. This is to prevent repeated collision of messages sent by two or more contending devices. In fact, the official Bluetooth specification permits a range of values for the maximum back-off. Our choice (127) is consistent with the other parameters we have adopted. Below is a summary of the behaviour and the time spent in each state.

![Behaviour of the sender](/images/cs/bluetooth.scanning.gif)

The frequency on which a device listens when it enters its scan state, known as its *phase*, cycles through the 32 frequencies in order according to the value of its clock and changes every 1.28 seconds.

## The Model { #model }

We consider a single inquiring device and a single scanning device, which we refer to as the **sender** and **receiver**, respectively. Since the clocks of each device are digital (resolution 312.5μs) and drift can be assumed to be negligible over the (relative short) inquiry process, we model time elapsing in a synchronous fashion and our PRISM model is a DTMC.

A key modelling issue is the initial configuration of the model. We cannot assume that the sender and receiver both start in some fixed state because this is unrealistic. We restrict ourselves to the case where the sender is already transmitting inquiry packets and a receiver begins scanning after some unknown delay, which is a reasonable scenario. We can hence only fix the initial state of the receiver (variables `r`, `freq` and `y`) and also the counter `rec`. This gives a total of 17,179,869,184 possible initial states. For efficiency, we also fix the value of `phase`, and therefore must perform model checking on 32 separate DTMCs, each with 536,870,912 initial states.

In our model, the protocol ends when the sender has successfully received `mrec` replies from the receiver. For `mrec=1`, the average number of states in the 32 DTMCs was 3,440,187,794 and the PRISM MTBDD representation of it averaged at 13,713 nodes (267.8 KB). For `mrec=2`, the respective figures are 56,341,202,369 and 1,807,868 (35,310 KB).

The PRISM source code is given below.

{% prismCode "casestudies/examples/bluetooth.pm", false, true %}

## Analysis results { #results }

We compute the expected time for completion of the inquiry process, i.e. the time elapsed until the bound `mrec` on the number of replies heard by the sender has been met. We compute this for all 17,179,869,184 possible initial states.

For `mrec=1`, the best- and worst-case expected times are 635μs (2 slots) and 2.5716s (8,229 slots), respectively. Below is a plot of the expected time against the number of initial states which result in this time. The discontinuities (an example is highlighted in the inset) correspond to the cases where the receiver sleeps different numbers of times before successfully hearing an inquiry packet. The 5 peaks correspond to 0,1,2,3 and 4 sleeps.

![distribution over initial states (mrec=1)](/images/graphs/bluetooth.dist1.gif)

For `mrec=2`, the best- and worst-case expected times are 0.0456s (146.0 slots) and 5.1569 seconds 5.177 seconds (16,565 slots), respectively. Again, we plot the expected time against the number of initial states which result in this time. Here, there are 9 peaks (of which 4 are much smaller) corresponding to the receiver sleeping 0,1,...,8 times before hearing a message.

![distribution over initial states (mrec=2)](/images/graphs/bluetooth.dist2.gif)

By assuming that there is a uniform distribution on the set of possible initial configurations, we can calculate the cumulative probability distribution function for the time that it takes the sender to hear either one or two replies. This is shown in the graph below. In addition, we compare the function for two replies to a derived cumulative probability distribution function, based on the additional assumption that the times to hear each of the two messages are independent. This is constructed as a convolution of two copies of the distribution plotted for the case `mrec=1` together with a distribution representing the random delay made by the receiver between sending the first reply and beginning its next scan. Clearly, we see that any analysis based on such an assumption is flawed and results in incorrect results. We illustrate that, if the receiver sleeps before sending its first reply, it is less likely to sleep the second time.

![cdfs over initial states](/images/graphs/bluetooth.cdfs.gif)

Finally, we extract from the three cumulative probability distributions we have presented above, the probability that the receiver sleeps at most **K** times before sending its first reply to the sender. These are shown in the table below.

| K:  | Probability: ||||
| ^^  | mrec=1       | mrec=1 (v.1.1) | mrec=2 (exact) | mrec=2 (derived) |
|-----|--------------|----------------|----------------|------------------|
| 0   | 0.500305     | 0.461240       | 0.455377       | 0.250305         |
| 1   | 0.633575     | 0.596265       | 0.591388       | 0.383657         |
| 2   | 0.759062     | 0.731585       | 0.729611       | 0.526981         |
| 3   | 0.879674     | 0.857913       | 0.855804       | 0.681114         |
| 4   | 1            | 0.984295       | 0.984253       | 0.849408         |
| 5   | 1            | 0.988269       | 0.988328       | 0.911750         |
| 6   | 1            | 0.992398       | 0.992546       | 0.956496         |
| 7   | 1            | 0.996294       | 0.996534       | 0.985521         |
| 8   | 1            | 1              | 1              | 1                |

We also include in this table results from an additional verification we have performed, on a model of the previous version (1.1) of the Bluetooth specification (our analysis uses the current version 1.2). The main difference is that, in version 1.1, the receiver only sends a reply to every second message received. We were able to modify our PRISM model to reflect this change and rerun our experiments. Above, we successfully illustrate that, as was intended, version 1.2 indeed results in improved expected times.
