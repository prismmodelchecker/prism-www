---
layout: layouts/base.njk
title: "PRISM-games"
section: games
permalink: /games/
---
# PRISM-games

**PRISM-games** is an extension of [PRISM](/) for the verification of probabilistic systems that can incorporate competitive or collaborative behaviour, modelled as *stochastic multi-player games*. The tool supports several variants of the model:

-   turn-based stochastic multi-player games (SMGs or TSGs);
-   concurrent stochastic multi-player games (CSGs);
-   (turn-based) probabilistic timed games (TPTGs).

Stochastic multi-player games are specified in the [PRISM-games modelling language](/games/modelling/), which extends the existing language used by PRISM. There are many illustrations of using the language in our [case studies](/games/casestudies/) section and also some [detailed examples](/games/examples/) with explanations.

For verification and strategy synthesis on stochastic games, a [property specification language](/games/properties/) is used that again extends the core version found in PRISM. This based on the logic rPATL (probabilistic alternating temporal logic with rewards) {% cite "CFK+13b" %}, which is extended to also include multi-objective and equilibria-based properties.

We provide specific instructions for [installation](/games/installation/) and [usage](/games/examples/) of PRISM-games, but the [main manual](/manual/) for PRISM will also be a useful reference. You can also look at the list of [PRISM-games case studies](/games/casestudies/) and [related publications](/games/publ/). Currently, [compositional](/games/compositional/) functionality is kept in a [separate branch](https://github.com/prismmodelchecker/prism-games/tree/compo).

The tool can be downloaded from [here](/games/download/). If you have questions or comments, you can use the main PRISM [support forum](http://groups.google.com/group/prismmodelchecker).

PRISM-games has been developed by: [Dave Parker](http://www.cs.bham.ac.uk/~parkerdx/), [Marta Kwiatkowska](http://www.cs.ox.ac.uk/people/marta.kwiatkowska/), [Gethin Norman](http://www.dcs.gla.ac.uk/people/personal/gethin/), [Gabriel Santos](https://www.cs.ox.ac.uk/people/gabriel.santos/), [Clemens Wiltsche](http://www.cs.ox.ac.uk/people/Clemens.wiltsche/), [Mateusz Ujma](http://www.cs.ox.ac.uk/people/mateusz.ujma/), [Vojtěch Forejt](http://www.cs.ox.ac.uk/people/vojtech.forejt/) and [Aistis Simaitis](http://www.cs.ox.ac.uk/people/aistis.simatis/). It builds upon PRISM, for which there is also a [list of contributors](/people/). Details of those that have worked on the techniques implemented in PRISM-games can be found in this [publication list](/games/publ/).

<div class="prism-citebox"><div class="prism-citeboxheader">To cite PRISM-games, please use the most recent tool paper:</div><ul><li>Marta Kwiatkowska, Gethin Norman, David Parker and Gabriel Santos. <a href="/bibitem/KNPS20/">PRISM-games 3.0: Stochastic Game Verification with Concurrency, Equilibria and Time</a>. In <em>Proc. 32nd International Conference on Computer Aided Verification (CAV'20)</em>, Springer, 2020. [<a href="/papers/cav20pg3.pdf">pdf</a>] [<a href="/bibtex/KNPS20.bib">bib</a>]</li></ul></div>
