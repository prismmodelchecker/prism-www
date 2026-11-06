---
layout: layouts/base.njk
title: "Properties (PTAs)"
section: downloads
permalink: /benchmarks/props-pta/
---
{% from "partials/benchmark-tables.njk" import propertyTable %}
# PRISM Benchmark Suite - Properties (PTAs)

## PTA time-bounded reachability { #pta-timebounded-reachability }

Computing the minimum or maximum probability of reaching some set of states in a PTA
within a time-bound, i.e. PRISM properties of the form:

```prism
Pmin=? [ F<=T ... ]
Pmax=? [ F<=T ... ]
Pmin=? [ ... U<=T ... ]
Pmax=? [ ... U<=T ... ]
```

{{ propertyTable(benchmarks.pta, "time-bounded-reach") }}

## PTA quantitative reachability { #ptas-reachability-quantitative }

Computing the minimum or maximum probability of reaching some set of states in a PTA,
i.e. PRISM properties of the form:

```prism
Pmin=? [ F ... ]
Pmax=? [ F ... ]
Pmin=? [ ... U ... ]
Pmax=? [ ... U ... ]
```

Quantitative properties only (i.e. the probability is not 0/1 for at least some states).

Note that time-bounded reachability queries (see below)
are reduced to reachability queries for PTAs
so this as an additional source of benchmarks for this property class.

{{ propertyTable(benchmarks.pta, "quant-prob-reach") }}

## PTA qualitative reachability { #ptas-reachability-qualitative }

Computing the minimum or maximum probability of reaching some set of states in a PTA,
i.e. PRISM properties of the form:

```prism
Pmin=? [ F ... ]
Pmax=? [ F ... ]
Pmin=? [ ... U ... ]
Pmax=? [ ... U ... ]
```

where the probability is 0/1 for all states.

{{ propertyTable(benchmarks.pta, "qual-prob-reach") }}
