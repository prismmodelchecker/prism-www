---
layout: layouts/base.njk
title: "games - Property Specification"
section: games
permalink: /games/properties/
---
# PRISM-games: Property Specification

Specification of properties to be checked in PRISM-games is based on the temporal logic rPATL {% cite "CFK+12", "CFK+13b" %}, which combines elements of the probabilistic temporal logic PCTL for MDPs, the logic ATL for games and agent-based systems, and extensions of PRISM's reward operators. The properties can be divided into:

-   **zero-sum** properties, where one coalition of players tries to optimise/satisfy an objective (maximising/minimising a probability/reward) while the remaining players form a second coalition with the opposite objective;
-   **nonzero-sum** properties, where the players are divided into two coalitions, each with a separate objective (maximising/minimising a probability/reward), and the coalitions try to find an equilibrium for these objectives.

For the formal syntax and semantics of zero-sum properties see {% cite "CFK+13b" %} for SMG/TSGs and {% cite "KNPS18" %} for CSGs. For the case of nonzero-sum properties, see {% cite "KNPS19", "KNPS22" %}.  
  

## Zero-Sum Properties

Some simple zero-sum property are listed below.

{% prismCode "games/examples/smg_example.props", false, false %}

In general, `<<...>>` contains a *coalition* of players for which strategies are required. Some further (generic) example properties of the `P` operator are listed below.

{% prismCode "games/examples/rpatl_examples.props", false, false %}

Specifications of rPATL coalitions (within `<<..>>`) can use either the player names or their indices separated by commas. Player numbering is determined by the order or their specification in the model file, starting from 1. To specify the empty set of players, use `<<>>`.

PRISM-games also has a variety of *reward*\-based properties (see {% cite "CFK+12", "CFK+13b" %} for details):

{% prismCode "games/examples/rpatl_rewards.props", false, false %}

To use expected total rewards, the game must be a *stopping game* (i.e., terminal states with zero reward must be reached almost surely under all strategies).

When verifying SMGs/TSGs there are additional reward-based properties that can be verified including:

<ol style="list-style-type: lower-roman;"><li>expected mean-payoff;</li><li>ratios of expected mean-payoffs;</li><li>almost-sure satisfaction of mean-payoff or ratio rewards.</li></ol>

For expected long-run objectives or ratio objectives, games must be *controllable multichain* (i.e., the sets of states that can occur in any maximal end component are almost surely reachable).

Examples of these properties are:

{% prismCode "games/examples/rpatl_rewards2.props", false, false %}

<a id="multi"></a>Finally, PRISM-games also supports *multi-objective* properties for SMGs/TSGs, in which multiple objectives can be combined using a Boolean expression comprising the operators `&` (conjunction), `|` (disjunction), `!` (negation) and `=>` (implication). Currently, the objectives combined together must of the same type (e.g. expected total reward). For the case of almost-sure satisfaction properties, objectives must be combined into a conjunction, not an arbitrary Boolean expression.

{% prismCode "games/examples/rpatl_multi.props", false, false %}

## Nonzero-Sum (Equilibria) Properties

Some simple nonzero-sum properties, which describe *Nash equilibria*, are listed below. More precisely, these refer to *social welfare* Nash equilibria, i.e., they also maximise the *sum* of the two objectives.

{% prismCode "games/examples/nonzero_example.props", false, false %}

Unlike zero-sum properties, nonzero sum properties need to specify two coalitions of players. This is again achieved using the `<<...>>` construct, but now containing two comma-separated lists of players, split by a colon.

Some further example of probabilistic nonzero-sum properties are listed below.

{% prismCode "games/examples/nonzero_example2.props", false, false %}

And some examples of reward nonzero-sum properties are:

{% prismCode "games/examples/nonzero_example3.props", false, false %}

Different variants of equilibria are supported. The type of equilibrium can be either *Nash* (the default, as in above examples) or a *correlated* equilibrium. The optimisation criterion can be either *social welfare* (the default, as in above examples) or *social fairness*, which minimises the difference between coalitions' objectives, rather than maximising the sum. For details, see {% cite "KNPS22" %}. These are specified as in the following examples.

{% prismCode "games/examples/equilibria_example.props", false, false %}
