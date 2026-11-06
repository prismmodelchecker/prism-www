---
layout: layouts/base.njk
title: "Symmetry Reduction"
section: downloads
permalink: /symm/
---
# PRISM - Symmetry Reduction

Here you can find details about the prototype implementation of symmetry reduction in PRISM, as described in our CAV'06 paper {% cite "KNP06a" %}.

## Examples

Below are links to the files and web pages for the 4 examples used in the paper. Each directory contains PRISM files for both the models and the properties used plus a script showing the options/switches used for PRISM.

-   IEEE 802.3 CSMA/CD communication protocol ([files](/symm/csma/), [web page](/casestudies/csma/))
-   Aspnes and Helihy's randomised consensus protocol ([files](/symm/consensus/), [web page](/casestudies/consensus_prism/))
-   Cachin/Kursawe/Shoup's randomised Byzantine agreement protocol ([files](/symm/byzantine/), [web page](/casestudies/byzantine_prism/))
-   simple peer-to-peer (P2P) protocol based on BitTorrent ([files](/symm/torrent/), [web page](/casestudies/peer2peer/))

Alternatively, download all examples files here: [all.tar.gz](/symm/all.tar.gz).

## Running the tool

As of PRISM version 3.3, the symmetry-reduction implementation is included in the main PRISM code base. It can (only) be accessed from the command-line version of the tool:

-   Run PRISM as normal but with the additional switch `-symm <before> <after>` where `<before>` and `<after>` are the number of modules in the PRISM model file before and after the block of symmetric modules. For example:
    -   `cd csma`
    -   `prism -h csma4.nm csma4.pctl -prop 1 -symm 1 0`

## Important notes

Please remember:

-   PRISM-symm requires models to be fully symmetric (i.e. all of the symmetric processes are indistinguishable).  
      
    
-   PRISM-symm assumes, but does not check, that your model is symmetric. If it is not, you may get unpredictable results.

## Contact

If you have any problems, questions or comments about any of these, please [contact](/contact/) us.
