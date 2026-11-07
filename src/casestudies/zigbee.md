---
layout: layouts/base.njk
title: "IEEE 802.15.4 CSMA-CA protocol (ZigBee)"
section: casestudies
permalink: /casestudies/zigbee/
---
# IEEE 802.15.4 CSMA-CA protocol (ZigBee)

## Contents

-   [Introduction](#intro)
-   [The networking standard IEEE 802.15.4](#standard)
-   [The contention resolution protocol CSMA-CA](#protocol)
-   [The model](#model)
-   [Verification results](#results)

**Related publications**: {% cite "Fru06", "Fru11" %}

## Introduction { #intro }

In this case study {% cite "Fru06" %}, we use probabilistic model checking to analyse the contention resolution protocol CSMA-CA in the recently published international standard IEEE 802.15.4, which defines the lower network layers for ZigBee.

We model the protocol using probabilistic timed automata (PTAs), a formalism that supports dense time, nondeterminism, and probabilistic choice. Using the *digital clocks approach* presented in {% cite "KNPS06" %}, we obtain a finite (integral-time) Markov decision process model of the protocol. Using different variants of this model, we verify the correctness of the protocol, compare the main operation modes of the protocol, and analyse performance and accuracy of different model abstractions.

## The networking standard IEEE 802.15.4 { #standard }

### Superframe structure

In order to allow *guaranteed time slots* for low-latency applications and applications requiring a specific data bandwidth, IEEE 802.15.4 networks can choose to synchronise their communication according to a *superframe* structure, as shown in the figure below. Each superframe consists of 16 equally sized slots and is bounded by network beacons, which are periodically broadcast by a designated coordinator device.

For transmissions of data frames in the contention access period, the *slotted* mode of the CSMA-CA algorithm is used, while transmissions in the contention free period take place according to pre-assigned guaranteed timeslots. In networks without beacon synchronisation, data frames are transmitted using *unslotted* CSMA-CA.

![data frames picture](/images/cs/zigbee.superframe2.gif)

### Parameters

All values refer to the physical (PHY) layer, taking into account an additional six *octets* (an octet is a grouping of eight bits) needed to transmit a frame that has been received from the media access control (MAC) layer.

| Attribute                        | Value                                                                     |
|----------------------------------|---------------------------------------------------------------------------|
| CCA duration                     | 8 symbol periods                                                          |
| PHY acknowledgement frame length | 11 octets                                                                 |
| PHY beacon frame length          | 23--100 octets                                                            |
| PHY data frame length            | 15--133 octets                                                            |
| **aBaseSlotDuration**            | 60 symbol periods                                                         |
| **aMaxBE**                       | 5                                                                         |
| **aMaxFrameRetries**             | 3                                                                         |
| **aMaxSIFSFrameSize**            | 18 octets                                                                 |
| **aMinCAPLength**                | 440 symbol periods                                                        |
| **aMinLIFSPeriod**               | 40 symbol periods                                                         |
| **aMinSIFSPeriod**               | 12 symbol periods                                                         |
| **aTurnaroundTime**              | 12 symbol periods                                                         |
| **aUnitBackoffPeriod**           | 20 symbol periods                                                         |
| **macAckWaitDuration**           | 120 or 54 symbol periods<br>(channels 0 to 10 and 11 to 26, respectively) |
| **macBeaconOrder**               | 0-15 (default 15)                                                         |
| **macMaxCSMABackoffs**           | 0-5 (default 4)                                                           |
| **macMinBE**                     | 0-3 (default 3)                                                           |
| **macSuperframeOrder**           | 0-15 (default 15)                                                         |

## The contention resolution protocol CSMA-CA { #protocol }

When more than one station attempts to transmit a frame at the same time, a *collision* occurs, and subsequently all frames get corrupted. The standard mechanism for contention resolution in computer networks is called *carrier-sense multiple access (CSMA)*. CSMA algorithms attempt to break symmetries of failing transmissions being restarted at almost the same time by using randomised binary exponential backoff procedures. While wired devices can listen during their own transmissions and employ CSMA with collision detection (CSMA/CD), stations in wireless networks usually cannot listen to their own transmissions, and consequently colliding transmissions can only be detected after they have been completed. Thus wireless devices use CSMA with collision avoidance (CSMA/CA or CSMA-CA).

In the past, probabilistic model checking has been applied successfully to the contention resolution protocols in the standards IEEE 802.3 Ethernet (CSMA/CD) {% cite "KNSW04" %} and IEEE 802.11 Wireless LAN (CSMA/CA) {% cite "KNS02a" %}.

The CSMA-CA algorithm works as follows:

1.  Initialisation: If a device wishes to transmit a frame using CSMA-CA, it first initialises the local variables **BE:=macMinBE** for the *backoff exponent* and **NB:=0** for the number of successive backoffs before the current transmission.  
      
    
2.  Backoff: Before a station attempts to send a frame, it waits for a random integer number between **0** and **2^BE-1** complete *backoff periods* of length **aUnitBackoffPeriod**. If slotted CSMA-CA is used, transmissions are synchronised with the beacon, and therefore the backoff starts at the beginning of the next backoff period; if unslotted CSMA-CA is used, the backoff starts immediately. The first backoff period of each superframe starts with the transmission of the beacon. If the backoff has not been completed at the end of the CAP, it resumes at the start of the next superframe.  
      
    
3.  Clear Channel Assessment: After completing its backoff, the station performs a *clear channel assessment (CCA)*. If, after eight symbol periods, the channel is assessed to be busy, both **BE** and **NB** are incremented by one, up to a maximum of **aMaxBE** for **BE** and **macMaxCSMABackoffs+1** for **NB**. If **NB** exceeds **macMaxCSMABackoffs**, the protocol terminates with a *channel access failure*; if not, the protocol returns to the backoff step. If the channel is assessed to be free, the data frame can be transmitted. In slotted CSMA-CA, two CCAs, each starting at the beginning of a backoff period, have to be performed.  
      
    
4.  Starting the transmission: In slotted CSMA-CA, a transmission can only start at a backoff period boundary and only if all steps (two CCAs, frame transmission, and acknowledgement) can be completed at least one interframe space (IFS) period before the end of the CAP.  
      
    
5.  Acknowledgement: If the originator has not requested an acknowledgement, the transmission is assumed to have been successful. If an acknowledgement has been requested, the sender needs **aTurnaroundTime** to switch from sending to receiving mode and vice versa. The recipient starts the transmission of the acknowledgement **aTurnaroundTime** after the reception of the last symbol of the data or MAC command frame if unslotted CSMA-CA is used; it starts at a backoff period boundary between **aTurnaroundTime** and **aTurnaroundTime + aUnitBackoffPeriod** after the reception of the last symbol of the data or MAC command frame if slotted CSMA-CA is used. If the originator receives an acknowledgement from the recipient within a time of **macAckWaitDuration**, the data transfer has been successful. If no acknowledge is received within that time, the frame will be retransmitted up to a maximum of **aMaxFrameRetries** times, after which the protocol terminates and a *communications failure* is issued.  
      
    

## The model { #model }

The (PTA) model uses features such as urgent events (which have to be executed as soon as possible) and urgent locations (which have to be left without time passing).

We consider a network of two sending stations s1 and s2, and two receiving stations r1 and r2. Each sending station intends to send a single data frame to its corresponding receiving station. Both stations start sending at the same time, thus a collision will occur. As the behaviour of the destination stations is deterministic, they have been incorporated into the sending stations.

The probabilistic timed automata models for the channel and a station are shown in the figures below. In the channel model, the integer variables **c1** and **c2** describe the status of frames being sent by the corresponding station. A value of **0** describes that nothing is being sent, **1** represents that a frame is being sent correctly, and **2** expresses that a frame is being sent, but the transmission has been corrupted. The events **send** and **finish** describe that the respective station has started or finished sending.

![PTA of the channel](/images/cs/zigbee.channel.gif)

The station model describes a station in the unslotted mode as described in the previous section.

[![PTA of a station (unslotted version)](/images/cs/zigbee.station_unslotted.gif)](/images/cs/zigbee.station_unslotted.gif)

<a name="results"></a>

## Verification results

We analyse probabilistic and expected reachability properties in probabilistic computation tree logic with rewards.

### Performance and accuracy of model abstractions

In this experiment, we analyse the impact of various modelling decisions on model checking performance and accuracy of results. We consider different parameters for operation mode (unslotted and slotted), modelling of the data frame length (fixed or nondeterministic), and granularity of the timescale abstraction.

**Assumptions:**

-   20 kbit/s channel
-   transmissions without acknowledgement
-   maximum number of backoffs set to infinity
-   macBeaconOrder=1, macSuperframeOrder=1 for slotted mode

| Model     | Data frame length | Time unit | Probability of successful transmission ||| Expected number of collisions ||| Expected time for successful transmission |||
|           |                   |           | mem.                                   | nnz  | result | mem.                          | nnz  | result | mem.                                      | nnz   | result               |
|-----------|-------------------|-----------|----------------------------------------|------|--------|-------------------------------|------|--------|-------------------------------------------|-------|----------------------|
| unslotted | fixed             | 4         | 22k                                    | 120k | 1.0    | 22k                           | 120k | 0.125  | 93k                                       | 210k  | 112.8 ms             |
| unslotted | nondet.           | 4         | 180k                                   | 960m | 1.0    | 180k                          | 960m | 0.125  | 280k                                      | 1.6bn | out of memory (2 GB) |
| unslotted | fixed             | 20        | 6.8k                                   | 13k  | 1.0    | 6.9k                          | 13k  | 0.125  | 10k                                       | 17k   | 123.1 ms             |
| unslotted | nondet.           | 20        | 56k                                    | 19m  | 1.0    | 56k                           | 19m  | 0.125  | 83k                                       | 26m   | 123.1 ms             |
| slotted   | fixed             | 20        | 29k                                    | 47k  | 1.0    | 29k                           | 27k  | 0.125  | 45k                                       | 67k   | 166.0 ms             |
| slotted   | nondet.           | 20        | 1m                                     | 130m | 1.0    | 1m                            | 130m | 0.125  | 1.6m                                      | 180m  | 166.0 ms             |

### Probability of successful transmission

In this experiment, we analyse the minimum probability of both stations successfully completing their transmissions.

**Assumptions:**

-   20 kbit/s channel
-   transmissions with acknowledgement
-   macBeaconOrder=1, macSuperframeOrder=1 (slotted mode)
-   beacon frame length set to minimum value (slotted mode)
-   CAP length set to maximum value (slotted mode)
-   timescale abstraction: 20 symbol periods

  
![Probability of successful transmission](/images/cs/zigbee.pr1.png)

### Expected number of collisions before a succesful transmission

In this experiment, we calculate the maximum expected number of collisions before both stations have successfully completed their transmissions.

**Assumptions:**

-   20 kbit/s channel
-   transmissions with acknowledgement
-   maximum numbers of backoffs and of retransmissions set to infinity
-   macBeaconOrder=1, macSuperframeOrder=1 (slotted mode)
-   beacon frame length set to minimum value (slotted mode)
-   CAP length set to maximum value (slotted mode)
-   timescale abstraction: 20 symbol periods

  
![Expected number of collisions before a succesful transmission](/images/cs/zigbee.er1.png)

### Expected time until successful transmission

In this experiment, we calculate the maximum expected time until both stations have successfully completed their transmissions.

**Assumptions:**

-   20 kbit/s channel
-   transmissions with acknowledgement
-   maximum numbers of backoffs and of retransmissions set to infinity
-   macBeaconOrder=1, macSuperframeOrder=1 (slotted mode)
-   beacon frame length set to minimum value (slotted mode)
-   CAP length set to maximum value (slotted mode)
-   timescale abstraction: 20 symbol periods

  
![Expected time until successful transmission](/images/cs/zigbee.er2.png)
