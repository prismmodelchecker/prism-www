---
layout: layouts/base.njk
title: "Properties (SMGs)"
section: downloads
permalink: /benchmarks/props-smg/
---
{% from "partials/benchmark-tables.njk" import propertyTable %}
# PRISM Benchmark Suite - Properties (SMGs)

## SMG quantitative reachability { #smgs-reachability-quantitative }

Computing the minimum or maximum probability of reaching some set of states in an SMG,
i.e. PRISM properties of the form:

```prism
<<C>>Pmin=? [ F ... ]
Pmax=? [ F ... ]
<<C>>Pmin=? [ ... U ... ]
<<C>>Pmax=? [ ... U ... ]
```

Quantitative properties only (i.e. the probability is not 0/1 for at least some states).

{{ propertyTable(benchmarks.smg, "quant-prob-reach") }}

## SMG qualitative reachability { #smgs-reachability-qualitative }

Checking whether the minimum or maximum probability of reaching some set of states in an SMG is 0 or 1,
e.g. PRISM properties of the form:

```prism
<<C>>P>=1 [ F ... ]
<<C>>P>0 [ F ... ]
```

{{ propertyTable(benchmarks.smg, "qual-prob-reach") }}

## SMG expected reachability { #smgs-expected-reachability }

Computing the minimum or maximum expected accumulated reward/cost to reach some set of states in an SMG,
i.e. PRISM properties of the form:

```prism
<<C>>Rmin=? [ F ... ]
<<C>>Rmax=? [ F ... ]
```

{{ propertyTable(benchmarks.smg, "quant-exp-reach") }}
