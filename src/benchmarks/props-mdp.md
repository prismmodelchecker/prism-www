---
layout: layouts/base.njk
title: "Benchmark properties for MDPs"
section: downloads
permalink: /benchmarks/props-mdp/
---
{% from "partials/benchmark-tables.njk" import propertyTable %}
# Benchmark properties for MDPs

## MDP quantitative reachability { #mdps-reachability-quantitative }

Computing the minimum or maximum probability of reaching some set of states in an MDP,
i.e. PRISM properties of the form:

```prism
Pmin=? [ F ... ]
Pmax=? [ F ... ]
Pmin=? [ ... U ... ]
Pmax=? [ ... U ... ]
```

Quantitative properties only (i.e. the probability is not 0/1 for at least some states).

We also only include properties that do not require fairness.

{{ propertyTable(benchmarks.mdp, "quant-prob-reach") }}

## MDP qualitative reachability { #mdps-reachability-qualitative }

Checking whether the minimum or maximum probability of reaching some set of states in an MDP is 0 or 1,
e.g. PRISM properties of the form:

```prism
P>=1 [ F ... ]
P>0 [ F ... ]
```

We also only include properties that do not require fairness.

{{ propertyTable(benchmarks.mdp, "qual-prob-reach") }}

## MDP expected reachability { #mdps-expected-reachability }

Computing the minimum or maximum expected accumulated reward/cost to reach some set of states in an MDP,
i.e. PRISM properties of the form:

```prism
Rmin=? [ F ... ]
Rmax=? [ F ... ]
```

{{ propertyTable(benchmarks.mdp, "quant-exp-reach") }}
