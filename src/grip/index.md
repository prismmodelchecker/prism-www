---
layout: layouts/base.njk
title: "GRIP"
section: downloads
permalink: /grip/
---
# GRIP

GRIP {% cite "DMP07" %} is a symmetry reduction tool for [PRISM](/) developed at the University of Glasgow. It is based on the *generic representatives* approach of Emerson, Trefler and Wahl. The underlying techniques of GRIP are described in {% cite "DM06", "DMP09" %}. The tool also includes a number of optimisations, which are described below.

## Downloading GRIP

GRIP is a Java application, available as an executable JAR file ([GRIP.jar](/grip/GRIP.jar)).

The source code is also available on github:

-   [https://github.com/afd/symmetrytools/](https://github.com/afd/symmetrytools/)

Build instructions can be found in `GRIP/README.txt`.

## Running GRIP

Once you have downloaded the above JAR file (or built your own from source), and assuming that you have Java version 1.5 or higher installed, GRIP can be executed as follows:

```
java -jar $GRIP_PATH/GRIP.jar <source> <target>
```

where `$GRIP_PATH` is the location of the directory containing the GRIP jar file, `<source>` is a symmetric PRISM program, and `<target>` is the name of the desired reduced program.

## Optimisations

The tool includes two optimisations which can help reduce the MTBDD size associated with the reduced program, based on local reachability analysis, and counter elimination.

To apply local reachability analysis, insert the switch `-optimise` before the source file name. This optimisation will only work if you have prism in your path, such that simply typing prism will launch the model checker.

To eliminate the need for a single counter variable, insert the switch `-eliminate` before the source file name. This optimisation will not work on all CTMC input programs (in particular for the peer2peer examples provided below), since it can result in negative rates associated with transitions from unreachable states. If an error relating to this problem is encountered during verification of a reduced program then the program should be generated again, without this optimisation.

## Property translation

In addition to program translation, GRIP can be used to translate symmetric properties associated with an input program. A symmetric property is built up from fully symmetric propositional formula, similar to those used for guards in the example specifications below. To translate properties in tandem with program translation, type:

```
java -jar $GRIP_PATH/GRIP.jar [ -optimise -eliminate ] <source> <target> <properties> <target properties>
```

where `<source>` and `<target>` are as before; `<properties>` is the name of a file containing symmetric PCTL/CSL properties, and `<target properties>` is the name of the file to which reduced properties are to be written.

## Support

We are keen to improve the usability of GRIP, which is only a prototype tool at present. Please report any problems or suggestions for improvement to alastair.donaldson \[at\] cs.ox.ac.uk.

## Example specifications

-   Randomised consensus protocol {% cite "AH90" %} : [input](/casestudies/examples/consensus8.forgrip.nm), [output](/casestudies/examples/consensus8.fromgrip.nm), [property](/grip/props/consensus8.pctl)
-   Byzantine agreement protocol {% cite "CKS00" %} : [input](/casestudies/examples/byzantine8.forgrip.nm), [output](/casestudies/examples/byzantine8.fromgrip.nm), [property](/grip/props/byzantine8.pctl)
-   Rabin's mutual exclusion {% cite "Rab82" %} : [input](/casestudies/examples/rabin5.forgrip.nm), [output](/casestudies/examples/rabin5.fromgrip.nm), [property](/grip/props/rabin5.pctl)
-   FGF (Fibroblast Growth Factor) {% cite "HKN+08" %} : [input](/casestudies/examples/fgf4.forgrip.sm), [output](/casestudies/examples/fgf4.fromgrip.sm), [property](/grip/props/fgf4.csl)
-   Peer-to-peer protocol: [input](/casestudies/examples/peer2peer4.forgrip.sm), [output](/casestudies/examples/peer2peer4.fromgrip.sm), [property](/grip/props/peer2peer4.csl)
-   Pnueli & Zuck's mutual exclusion {% cite "PZ86" %} : [input](/casestudies/examples/mutex12.forgrip.nm), [output](/casestudies/examples/mutex12.fromgrip.nm), [property](/grip/props/mutex12.pctl)
-   Minimum space shared memory leader election protocol {% cite "DIM95" %} : [input](/casestudies/examples/leader_dim20.forgrip.nm), [output](/casestudies/examples/leader_dim20.fromgrip.nm), [property](/grip/props/leader_dim20.pctl)
