---
layout: layouts/base.njk
title: "Case Studies"
section: casestudies
permalink: /casestudies/
---
# PRISM Case Studies

PRISM has been used to analyse a wide range of case studies in many different application domains. A non-exhaustive list of these is given below. In many cases, we provide detailed information about the case study, including PRISM language source code and experimental results. For others, we just include links to the relevant publication.

We are always happy to include details of externally developed case studies. If you would like to contribute content about your work with PRISM, or you want us to add a pointer to a publication about your PRISM-related work, please [contact](/contact/) us.

If you are interested in PRISM models for the purposes of **benchmarking**, see also the [PRISM benchmark suite](/benchmarks/).

## Randomised distributed algorithms { #randoalgs }

These case studies examine the correctness and performance of various *randomised distributed algorithms* taken from the literature.

-   [Randomised self-stabilising algorithms](/casestudies/self-stabilisation/) (Herman) (Israeli & Jalfon) (Beauquier et al.) {% cite "KNP12a" %}
-   [Randomised two process wait-free test-and-set](/casestudies/test-and-set/) (Tromp & Vitanyi)
-   [Synchronous leader election protocol](/casestudies/synchronous_leader/) (Itai & Rodeh)
-   [Asynchronous leader election protocol](/casestudies/asynchronous_leader/) (Itai & Rodeh)
-   [Randomised dining philosophers](/casestudies/phil/) (Lehmann & Rabin)
-   [Randomised dining philosophers](/casestudies/phil_lss/) (Lynch, Saias & Segala)
-   [Dining cryptographers](/casestudies/dining_crypt/) (Chaum)
-   [Randomised mutual exclusion](/casestudies/rabin/) (Rabin)
-   [Randomised mutual exclusion](/casestudies/mutual/) (Pnueli & Zuck)
-   [Randomised consensus protocol](/casestudies/consensus/) (Aspnes & Herlihy) (with Cadence SMV and PRISM) {% cite "KNS01a" %}
-   [Randomised consensus shared coin protocol](/casestudies/consensus_prism/) (Aspnes & Herlihy) (with PRISM) {% cite "KNS01a" %}
-   [Byzantine agreement protocol](/casestudies/byzantine/) (Cachin, Kursawe & Shoup) (with Cadence SMV and PRISM) {% cite "KN02" %}
-   [Byzantine agreement protocol](/casestudies/byzantine_prism/) (Cachin, Kursawe & Shoup) (with PRISM) {% cite "KN02" %}
-   [Rabin’s Choice Coordination Problem](/casestudies/rabin_choice/) {% cite "NM10" %}  
    *(contributed by Ukachukwu Ndukwu and Annabelle McIver)*{.note}
-   [Dice programs](/casestudies/dice/) (Knuth & Yao)

Other related case studies:

-   Probabilistic leader election algorithms {% cite "FP04" %}  
    *(by [Wan Fokkink](http://www.cs.vu.nl/~wanf/) and [Jun Pang](http://www.lix.polytechnique.fr/~pangjun/))*{.note}

## Communication, network and multimedia protocols { #commprotocols }

The following case studies investigate properties such as *quality of service* for (probabilistic) *communication, network and multimedia protocols*.

-   [Bluetooth device discovery](/casestudies/bluetooth/) {% cite "DKNP04", "DKNP06" %} *(with [Marie Duflot](http://www.univ-paris12.fr/lacl/duflot/))*{.note}
-   [IEEE 802.3 CSMA/CD protocol](/casestudies/csma/) {% cite "KNSW04", "KNSW07" %}
-   [Bounded retransmission protocol](/casestudies/brp/) (D'Argenio, Jeannet, Jensen & Larsen)
-   [IEEE 1394 FireWire root contention protocol](/casestudies/firewire/) (with PRISM) {% cite "KNS03b" %}
-   [IEEE 1394 FireWire root contention protocol](/casestudies/firewire_kronos/) (with KRONOS & PRISM) {% cite "DKN02", "DKN04" %}
-   [IEEE 802.11 wireless LAN](/casestudies/wlan/) {% cite "KNS02a" %}
-   [IPv4 Zeroconf protocol](/casestudies/zeroconf/) (Cheshire, Adoba & Guttman) {% cite "KNPS06" %}
-   [IEEE 802.15.4 CSMA-CA protocol (ZigBee)](/casestudies/zigbee/) {% cite "Fru06", "Fru11" %} *(Work with Matthias Fruth)*{.note}
-   [Probabilistic broadcast protocols](/casestudies/prob_broadcast/) {% cite "FG06" %} *(by [Ansgar Fehnker](http://www.cse.unsw.edu.au/~ansgar/) and Peng Gao)*{.note}
-   [Gossip protocol](/casestudies/gossip/) {% cite "KNP08d" %}

Other related case studies:

-   Authenticated query flooding {% cite "WS08" %} *(by Frank Werner and Peter Schmitt)*{.note}
-   ECo-MAC protocol for wireless sensor networks {% cite "ZBB10" %}  
    *(by Hafedh Zayani, Kamel Barkaoui and Rahma Ben Ayed)*{.note}
-   Congestion control in vehicular ad-hoc networks (VANETs) {% cite "KF11" %} *(by Savas Konur and Michael Fisher)*{.note}

## Security { #security }

These case studies use PRISM to analyse the correctness and performance of several *security*\-related systems.

Contract signing and fair exchange protocols:

-   [Probabilistic contract signing](/casestudies/contract_egl/) (Even, Goldreich & Lempel) {% cite "NS06" %} *(with [Vitaly Shmatikov](http://www.cs.utexas.edu/~shmat/))*{.note}
-   [Probabilistic contract signing](/casestudies/contract/) (Ben-Or, Goldreich, Micali & Rivest) {% cite "NS02", "NS06" %} *(with [Vitaly Shmatikov](http://www.cs.utexas.edu/~shmat/))*{.note}
-   [Probabilistic fair exchange](/casestudies/fairexchange/) (Rabin) {% cite "NS06" %} *(with [Vitaly Shmatikov](http://www.cs.utexas.edu/~shmat/))*{.note}
-   The ASW fair exchange protocol {% cite "IZ08" %} *(by Salekul Islam and Mohammad Abu Zaid)*{.note}

Anonymity:

-   [Crowds protocol](/casestudies/crowds/) (Reiter & Rubin) {% cite "Shm02", "Shm04" %} *(contributed by [Vitaly Shmatikov](http://www.cs.utexas.edu/~shmat/))*{.note}
-   [Dining cryptographers](/casestudies/dining_crypt/) (Chaum)
-   Crowds, Adithia, Onion routing and Tarzan {% cite "Adi06" %} *(by Mariskha Adithia)*{.note}
-   Anonymity network topologies {% cite "DSS04" %} *(by Roger Dingledine, [Vitaly Shmatikov](http://www.cs.utexas.edu/~shmat/) and Paul Syverson)*{.note}

Threats and attacks:

-   [PIN cracking schemes](/casestudies/pincracking/) {% cite "Ste06" %} (see also [this WIRED article](http://blog.wired.com/27bstroke6/2009/04/pins.html)) *(contributed by [Graham Steel](http://homepages.inf.ed.ac.uk/gsteel/))*{.note}
-   PIN block attacks {% cite "Kal07" %} *(by Eirini Kaldeli)*{.note}
-   Quantification of Denial-of-Service (DoS) security threats {% cite "BKPA08", "BKPA09" %}  
    *(by Stylianos Basagiannis, Panagiotis Katsaros, Andrew Pombortsis and Nikolaos Alexiou)*{.note}
-   The Kaminsky DNS cache-poisoning attack {% cite "ABK+10" %} (see also [this page](http://www.cs.sunysb.edu/~sas/kaminsky/))  
    *(by Nikolaos Alexiou, Tushar Deshpande, Stylianos Basagiannis, Scott Smolka and Panagiotis Katsaros)*{.note}
-   The DNS bandwidth amplification attack {% cite "DKBS11" %}  
    *(by Tushar Deshpande, Panagiotis Katsaros, Stylianos Basagiannis and Scott Smolka)*{.note}

Quantum cryptography protocols:

-   BB84 {% cite "Pap04", "GNP05" %} *(by [Rajagopal Nagarajan](http://www.dcs.warwick.ac.uk/people/academic/Rajagopal.Nagarajan/), [Nikos Papanikolaou](http://www.dcs.warwick.ac.uk/~nikos/) and [Simon Gay](http://www.dcs.gla.ac.uk/~simon/))*{.note}
-   B92 and BB84 {% cite "EAA08", "EAA10a", "EAA10b" %} *(by Mohamed Elboukhari, Mostafa Azizi and Abdelmalek Azizi)*{.note}
-   BB84 {% cite "FGHM11" %} *(by Verónica Fernández, María-José García-Martínez, Luis Hernández-Encinas and Agustín Martín)*{.note}

Other security studies:

-   [Non-repudiation protocol](/casestudies/nonrepudiation/) (Markowitch & Roggeman) {% cite "NPS13" %}
-   [Network Virus Infection](/casestudies/virus/) {% cite "KNPV09" %}
-   Non-repudiation protocols  
    {% cite "LMST04", "Tro06" %} *(by Ruggero Lanotte, Andrea Maggiolo-Schettini and Angelo Troina)*{.note}  
    {% cite "SM09" %} *(by Indranil Saha and Debapriyay Mukhopadhyay)*{.note}
-   A Reinforcement Model for Collaborative Security {% cite "MS09" %}  
    *(by Janardan Misra and Indranil Saha)*{.note}
-   A Certified E-Mail Protocol In Mobile Environments {% cite "PBA+11", "BPA+11" %}  
    *(by Stylianos Basagiannis, Sophia Petridou, Nikolaos Alexiou, Georgios Papadimitriou and Panagiotis Katsaros)*{.note}
-   The Needham-Schroeder (NS) and TMN protocols {% cite "AA10" %}  
    *(by Mojtaba Akbarzadeh and Mohammad Abdollahi Azgomi)*{.note}
-   SSL Handshake Protocol in Mobile Communications {% cite "PB12" %}  
    *(by Sophia Petridou and Stylianos Basagiannis)*{.note}

## Biology { #biology }

The following examples use PRISM to study the behaviour of various *biological* or *biology-inspired* processes.

-   [Cell cycle control in Eukaryotes](/casestudies/cyclin/) (Lecca and Priami)
-   [FGF (Fibroblast Growth Factor) signalling](/casestudies/fgf/) {% cite "HKN+06", "HKN+08" %} *(with John Heath, Oksana Tymchyshyn)*{.note}
-   [MAPK cascade](/casestudies/mapk_cascade/) (Huang and Ferrell) {% cite "KNP08a" %}
-   DNA computing designs (with [Visual DSD](http://lepton.research.microsoft.com/webdna/) & PRISM) {% cite "LPC+12" %}
-   [DNA walkers](/casestudies/dna_walkers/) {% cite "DKTT13" %}
-   [Simple molecular reactions](/casestudies/molecules/) (Shapiro)

The [PRISM tutorial](/tutorial) also includes a PRISM model of:

-   A [circadian clock](/tutorial/circadian/) (Barkai & Leiber)

Other related case studies:

-   RKIP inhibited ERK pathway {% cite "CVGO05", "CVGO06", "CGHV09" %}  
    *(by [Muffy Calder](http://www.dcs.gla.ac.uk/~muffy/), [Vladislav Vyshemirsky](http://www.dcs.gla.ac.uk/~vlad/), [David Gilbert](http://www.dcs.gla.ac.uk/~drg/) and [Richard Orton](http://www.dcs.gla.ac.uk/~rorton/))*{.note}
-   Codon bias {% cite "PVBB07" %} *(by Tessa Pronk, Erik de Vink, Dragan Bosnacki and Timo Breit)*{.note}
-   Ribosome kinetics {% cite "BPdV08" %} *(by Dragan Bosnacki, Tessa Pronk and Erik de Vink)*{.note}
-   Sorbitol dehydrogenase {% cite "BCM+04", "BCM+05" %}  
    *(by [Roberto Barbuti](http://www.di.unipi.it/~barbuti/), [Stefano Cataudella](http://www.di.unipi.it/~cataudel/), [Andrea Maggiolo-Schettini](http://www.di.unipi.it/~maggiolo/), [Paolo Milazzo](http://www.di.unipi.it/~milazzo/) and [Angelo Troina](http://www.di.unipi.it/~troina/))*{.note}
-   T Cell Signalling Events {% cite "OTGT08" %} *(by Nick Owens, Jon Timmis, Andrew Greensted and Andy Tyrrell)*{.note}
-   Influenza virus fusion {% cite "DDBM11" %}  
    *(by Maria Pamela Dobay, Akos Dobay, Johnrob Bantang and Eduardo Mendoza)*{.note}
-   Platelet-Derived Growth Factor (PDGF) signalling {% cite "YPM+11" %}  
    *(by Qixia Yuan, Jun Pang, Sjouke Mauw, Panuwat Trairatphisan, Monique Wiesinger and Thomas Sauter)*{.note}
-   Bone pathologies {% cite "LMP11" %} *(by Pietro Liò, Emanuela Merelli and Nicola Paoletti)*{.note}

## Planning and synthesis { #planning }

These case studies use PRISM to synthesise and/or analyse *strategies* and *controllers*:

-   [Task Graph Scheduling](/casestudies/task_graph/) (Bouyer, Fahrenberg, Larsen & Markey) {% cite "NPS13" %}
-   [Dynamic power management controllers](/casestudies/power/) {% cite "NPK+02", "NPK+03" %}  
    *(with [Sandeep Shukla](http://www.ece.vt.edu/faculty/shukla.html) and [Rajesh Gupta](http://www.cecs.uci.edu/~rgupta/))*{.note}
-   [Human-in-the-loop UAV mission planning](/casestudies/human-uav/) {% cite "FWHT15" %}  
    *(with Lu Feng, Laura Humphrey and Ufuk Topcu)*{.note}
-   [Grid world robot](/casestudies/robot/) {% cite "YKNP04", "YKNP06" %}  
    *(with Håkan Younes)*{.note}
-   Robotic motion planning and control {% cite "LWAB10" %}  
    *(by M. Lahijanian, J. Wasniewski, S. B. Andersson, and C. Belta)*{.note}
-   Probabilistically safe vehicle control in a hostile environment {% cite "CDLPB11" %}  
    *(by Igor Cizelj, Xu Chu Ding, Morteza Lahijanian, Alessandro Pinto and Calin Belta)*{.note}

## Game theory { #gametheory }

The following case studies relate to or use *game-theoretic* concepts and techniques:

-   [Microgrid demand side management](/casestudies/mdsm/) {% cite "CFK+12", "CFK+13b" %}
-   [Stable matchings](/casestudies/stable_matching/) {% cite "BN12" %} *(with [Péter Biró](http://www.econ.core.hu/english/inst/biro.html))*{.note}
-   [Futures market investor](/casestudies/investor/) {% cite "MM07", "MM02" %}  
    *(with [Annabelle McIver](http://www.ics.mq.edu.au/~anabel/) and [Carroll Morgan](http://www.cse.unsw.edu.au/~carrollm/))*{.note}
-   [Alternating offers protocol](/casestudies/negotiation/) (Rubinstein) {% cite "BFW06" %}  
    *(contributed by Paolo Ballarini, Michael Fisher &amp; Michael Wooldridge)*{.note}

Other related case studies:

-   Collective decision making for sensor networks {% cite "CFK+12", "CFK+13b" %}
-   Trust models for user-centric networks {% cite "KPS13" %}

## Performance and reliability { #reliability }

These case studies consider *performance* and *reliability* properties of a variety of systems.

-   [The thinkteam user interface](/casestudies/thinkteam/) {% cite "BML+04", "BML+05", "BML05a", "BML05b" %}  
    *(contributed by Maurice ter Beek, Mieke Massink, Diego Latella, Stefania Gnesi, Alessandro Forghieri and Maurizio Sebastianis)*{.note}
-   [Embedded control system](/casestudies/embedded/) (Muppala, Ciardo & Trivedi) {% cite "KNP04c", "KNP07b" %}
-   [NAND multiplexing](/casestudies/nand/) {% cite "NPKS05" %}  
    *(with [Sandeep Shukla](http://www.ecpe.vt.edu/faculty/Shukla.html))*{.note}
-   [Workstation cluster](/casestudies/cluster/) (Haverkort, Hermanns & Katoen)
-   [Wireless communication cell](/casestudies/cell/) (Haring, Marie, Puigjaner & Trivedi)
-   [Simple peer-to-peer protocol](/casestudies/peer2peer/)

Other related case studies:

-   Cloud computing live migration {% cite "KM11" %}  
    *(by Shinji Kikuchi and Yasuhide Matsumoto at Fujitsu)*{.note}
-   Publish-subscribe systems {% cite "HBGS07" %}  
    *(by Fei He, Luciano Baresi, Carlo Ghezzi and Paola Spoletini)*{.note}
-   Group membership protocols {% cite "RSPV07" %}  
    *(by Valério Rosset, Pedro F. Souto, Paulo Portugal and Francisco Vasques)*{.note}
-   Crossbar molecular switch memory {% cite "CT08" %}  
    *(by Ayodeji Coker and Valerie Taylor)*{.note}
-   Software architectures for multi-core platforms {% cite "TK11" %}  
    *(by Li Tan and Axel Krings)*{.note}

## Power management { #power }

These case studies investigate the performance of several *power management systems*.

-   [Dynamic power management controllers](/casestudies/power/) {% cite "NPK+02", "NPK+03" %}  
    *(with [Sandeep Shukla](http://www.ece.vt.edu/faculty/shukla.html) and [Rajesh Gupta](http://www.cecs.uci.edu/~rgupta/))*{.note}
-   [Real-time dynamic voltage scaling](/casestudies/voltage/) (Pillai & Shin) {% cite "KNP05c" %}

Other related case studies:

-   Dynamic power management with two-priority request queues {% cite "SDM08" %}  
    *(by Aleksandra Sesic, Stanisa Dautovic and Veljko Malbasa)*{.note}
-   Environmentally powered wireless sensor nodes {% cite "SAA+08" %}  
    *(by Alexandru Susu, Andrea Acquaviva, David Atienza and Giovanni De Micheli)*{.note}

## CTMC benchmarks { #benchmarks }

These examples are often used in the literature as *benchmarks* to study the efficiency of CTMC analysis techniques. You can find a wider selection of benchmarks, for all models, in the [PRISM benchmark suite](/benchmarks/).

-   [Kanban system](/casestudies/kanban/) (Ciardo & Tilgner)
-   [Flexible manufacturing system](/casestudies/fms/) (Ciardo & Trivedi)
-   [Cyclic server polling system](/casestudies/polling/) (Ibe & Trivedi)
-   [Tandem queueing network](/casestudies/tandem/) (Hermanns, Meyer-Kayser & Siegle)

## Miscellaneous { #misc }

-   [Random graphs](/casestudies/graph_connected/)  
    *(with Michel de Rougemont)*{.note}
-   The Ising model {% cite "STKT07", "STTK09" %}  
    *(by Toshifusa Sekizawa, Tatsuhiro Tsuchiya, Tohru Kikuno and Koichi Takahashi)*{.note}
-   Cognitive assistive technology: The hand-washing problem {% cite "Ma08" %}  
    *(by Zhongdan Ma)*{.note}
