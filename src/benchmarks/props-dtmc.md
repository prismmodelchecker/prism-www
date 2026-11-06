---
layout: layouts/base.njk
title: "Properties (DTMCs)"
section: downloads
permalink: /benchmarks/props-dtmc/
---
{% from "partials/benchmark-tables.njk" import propertyTable %}
# PRISM Benchmark Suite - Properties (DTMCs)

## DTMC quantitative reachability { #dtmcs-reachability-quantitative }

Computing the probability of reaching some set of states in a DTMC,
i.e. PRISM properties of the form:

```prism
P=? [ F ... ]
P=? [ ... U ... ]
```

Quantitative properties only (i.e. the probability is not 0/1 for at least some states).

{{ propertyTable(benchmarks.dtmc, "quant-prob-reach") }}

## DTMC qualitative reachability { #dtmcs-reachability-qualitative }

Checking whether the probability of reaching some set of states in an MDP is 0 or 1,
e.g. PRISM properties of the form:

```prism
P>=1 [ F ... ]
P>0 [ F ... ]
```

{{ propertyTable(benchmarks.dtmc, "qual-prob-reach") }}

## DTMC expected reachability { #dtmcs-expected-reachability }

Computing the expected accumulated reward/cost to reach some set of states in a DTMC,
i.e. PRISM properties of the form:

```prism
R=? [ F ... ]
```

{{ propertyTable(benchmarks.dtmc, "quant-exp-reach") }}
