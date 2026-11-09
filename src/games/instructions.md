---
layout: layouts/base.njk
title: "games - Instructions"
section: games
permalink: /games/instructions/
---
# PRISM-games: Instructions

First, you need to [download](/games/download/) and [install](/games/installation/) PRISM-games.

We provide separate guidance on [modelling](/games/modelling/) and [specifying properties](/games/properties/) for stochastic games.

There are also many examples available in the [case studies](/games/casestudies/) section.

PRISM-games is an extension of [PRISM](/), so basic execution of the tool is the same and you will find the [main manual](/manual/) a useful reference.

To get started, you can look at some examples in the `prism-examples` directory within the PRISM-games distribution. Corresponding properties files are in the same directory.

Instructions for key features specific to PRISM-games can be found below.

## Strategy synthesis { #stratsynth }

PRISM-games supports strategy synthesis for all property types. The fuctionality can be accessed using the "Strategies" menu when right-clicking a property in the "Properties" tab:

[![](/games/Screenshot_props.png){.medium}](/games/Screenshot_props.png)

Once generated, a strategy can be viewed interactively in the simulator tab. Strategy information is displayed in the "Strategy information" panel (top, right). The simulator choice table column named "Strategy choice" displays what the optimal strategy would do. The notation used is "choice id -> probability", e.g., in the example from the screenshot below, the strategy would choose the action indexed 1 with probability 1.0, hence "1->1.0" is displayed.

[![](/games/Screenshot_simulator.png){.medium}](/games/Screenshot_simulator.png)

Other properties can also be verified under the generated strategy. If this option is chosen, PRISM-games will build a product of the game and a strategy to obtain a new game. For example, if the original game had players 1, 2 and 3, and a strategy for player 1 has been generated (e.g., for property <<`1`\>> `P`\>`0.5` \["`a`" `U` "`b`"\]), when the product is built, the game effectively becomes a two-player game between players 2 and 3, because choices of player 1 have been fixed according to the strategy.
