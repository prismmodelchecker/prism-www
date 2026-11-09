---
layout: layouts/base.njk
title: "Dynamic power management: results for the 4-state Fujitsu disk drive"
section: casestudies
permalink: /casestudies/power_ctmc4_graphs/
parent: /casestudies/power/
---
# Dynamic power management: results for the 4-state Fujitsu disk drive

(Qiu, Wu and Pedram)

Using the results presented in {% cite "KNP02d" %}, we have computed, for the optimal policies under different performance constraints and for a of selection distributions (deterministic, exponential, Erlang, uniform and Pareto), with the same mean (0.72), modelling the inter-arrival time of requests:

**Long-run Average Measures:**

-   [the average power consumption](#av.power);
-   [the average number of requests awaiting service](#av.power);
-   [the average number of lost requests](#av.power).

**Transient Measures:**

-   the expected power consumption when the **N**th request arrives: [constraint=10](#power10), [constraint=5](#power5), [constraint=2](#power2), [constraint=1](#power1), [constraint=0.1](#power01), [constraint=0.05](#power005);
-   The expected number of requests awaiting service when the **N**th request arrives: [constraint=10](#queue10), [constraint=5](#queue5), [constraint=2](#queue2), [constraint=1](#queue1), [constraint=0.1](#queue01), [constraint=0.05](#queue005);
-   the expected number of lost requests when the **N**th request arrives: [constraint=10](#lost10), [constraint=5](#lost5), [constraint=2](#lost2), [constraint=1](#lost1), [constraint=0.1](#lost01), [constraint=0.05](#lost005);
-   the probability a request is lost by the time the **N**th request arrives: [constraint=5](#prob.lost5), [constraint=2](#prob.lost2), [constraint=1](#prob.lost1), [constraint=0.1](#prob.lost01), [constraint=0.05](#prob.lost005);
-   the probability, from the state where the SP is in **standby** and there are no requests awaiting service, that at least **K** requests are awaiting service by the time the **N**th request arrives **K=10**: [constraint=5](#prob.queue10.5), [constraint=2](#prob.queue10.2), [constraint=1](#prob.queue10.1), [constraint=0.1](#prob.queue10.01), [constraint=0.05](#prob.queue10.005) **K=15**: [constraint=5](#prob.queue15.5), [constraint=2](#prob.queue15.2), [constraint=1](#prob.queue15.1), [constraint=0.1](#prob.queue15.01), [constraint=0.05](#prob.queue15.005).

Furthermore, restricting the inter-arrival time to be exponentially distributed, we have computed the following **transient** performance measures for the optimal policies under different constraints:

-   [the expected power consumption by time **T**](#T.power);
-   [the expected number of requests awaiting service at time **T**](#T.queue);
-   [the expected number of lost requests by time **T**](#T.lost);
-   the probability, from the state where the SP is in **standby** and there are no requests awaiting service, that at least **N** requests are awaiting service by time **T**: see [here](#T.queue10) for the case when **N=10** and [here](#T.queue15) for **N=15**;
-   the probability that a request is served by time **T**, given that it arrived into a certain position in the queue and that the SP is in **standby** when the request arrives: see [here](#served1) for the the case when the request arrives into the first position in the queue, [here](#served5) for the request arriving into the 5th position and and [here](#served10) when it arrives into the 10th position in the queue;
-   [from the state where the SRQ is empty and the SP is in **standby**, the probability that a request gets lost by time **T**](#prob.lost).

  
<a id="av.power"></a>

---

![](/images/graphs/power_ctmc4.av.power.gif)

<a id="av.queue"></a>

---

![](/images/graphs/power_ctmc4.av.queue.gif)

<a id="av.lost"></a>

---

![](/images/graphs/power_ctmc4.av.lost.gif)

<a id="power10"></a>

---

![](/images/graphs/power_ctmc4.power10.gif)

<a id="power5"></a>

---

![](/images/graphs/power_ctmc4.power5.gif)

<a id="power2"></a>

---

![](/images/graphs/power_ctmc4.power2.gif)

<a id="power1"></a>

---

![](/images/graphs/power_ctmc4.power1.gif)

<a id="power01"></a>

---

![](/images/graphs/power_ctmc4.power01.gif)

<a id="power005"></a>

---

![](/images/graphs/power_ctmc4.power005.gif)

<a id="queue10"></a>

---

![](/images/graphs/power_ctmc4.queue10.gif)

<a id="queue5"></a>

---

![](/images/graphs/power_ctmc4.queue5.gif)

<a id="queue2"></a>

---

![](/images/graphs/power_ctmc4.queue2.gif)

<a id="queue1"></a>

---

![](/images/graphs/power_ctmc4.queue1.gif)

<a id="queue01"></a>

---

![](/images/graphs/power_ctmc4.queue01.gif)

<a id="queue005"></a>

---

![](/images/graphs/power_ctmc4.queue005.gif)

<a id="lost10"></a>

---

![](/images/graphs/power_ctmc4.lost10.gif)

<a id="lost5"></a>

---

![](/images/graphs/power_ctmc4.lost5.gif)

<a id="lost2"></a>

---

![](/images/graphs/power_ctmc4.lost2.gif)

<a id="lost1"></a>

---

![](/images/graphs/power_ctmc4.lost1.gif)

<a id="lost01"></a>

---

![](/images/graphs/power_ctmc4.lost01.gif)

<a id="lost005"></a>

---

![](/images/graphs/power_ctmc4.lost005.gif)

<a id="prob.lost5"></a>

---

![](/images/graphs/power_ctmc4.prob.lost5.gif)

<a id="prob.lost2"></a>

---

![](/images/graphs/power_ctmc4.prob.lost2.gif)

<a id="prob.lost1"></a>

---

![](/images/graphs/power_ctmc4.prob.lost1.gif)

<a id="prob.lost01"></a>

---

![](/images/graphs/power_ctmc4.prob.lost01.gif)

<a id="prob.lost005"></a>

---

![](/images/graphs/power_ctmc4.prob.lost005.gif)

<a id="prob.queue10.5"></a>

---

![](/images/graphs/power_ctmc4.prob.queue10.5.gif)

<a id="prob.queue10.2"></a>

---

![](/images/graphs/power_ctmc4.prob.queue10.2.gif)

<a id="prob.queue10.1"></a>

---

![](/images/graphs/power_ctmc4.prob.queue10.1.gif)

<a id="prob.queue10.01"></a>

---

![](/images/graphs/power_ctmc4.prob.queue10.01.gif)

<a id="prob.queue10.005"></a>

---

![](/images/graphs/power_ctmc4.prob.queue10.005.gif)

<a id="prob.queue15.5"></a>

---

![](/images/graphs/power_ctmc4.prob.queue15.5.gif)

<a id="prob.queue15.2"></a>

---

![](/images/graphs/power_ctmc4.prob.queue15.2.gif)

<a id="prob.queue15.1"></a>

---

![](/images/graphs/power_ctmc4.prob.queue15.1.gif)

<a id="prob.queue15.01"></a>

---

![](/images/graphs/power_ctmc4.prob.queue15.01.gif)

<a id="prob.queue15.005"></a>

---

![](/images/graphs/power_ctmc4.prob.queue15.005.gif)

<a name="T.power"></a>

![](/images/graphs/power_ctmc4.power.gif)

<a name="T.queue"></a>

![](/images/graphs/power_ctmc4.queue.gif)

<a name="T.lost"></a>

![](/images/graphs/power_ctmc4.lost.gif)

<a name="T.queue10"></a>

![](/images/graphs/power_ctmc4.prob.queue10.gif)

<a name="T.queue15"></a>

![](/images/graphs/power_ctmc4.prob.queue15.gif)

<a name="served1"></a>

![](/images/graphs/power_ctmc4.served1.gif)

<a name="served5"></a>

![](/images/graphs/power_ctmc4.served5.gif)

<a name="served10"></a>

![](/images/graphs/power_ctmc4.served10.gif)

<a name="prob.lost"></a>

![](/images/graphs/power_ctmc4.prob.lost.gif)
