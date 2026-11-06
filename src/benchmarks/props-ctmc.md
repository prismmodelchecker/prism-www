---
layout: layouts/base.njk
title: "Properties (CTMCs)"
section: downloads
permalink: /benchmarks/props-ctmc/
---
{% from "partials/benchmark-tables.njk" import propertyTable %}
# PRISM Benchmark Suite - Properties (CTMCs)

## CTMC steady-state { #ctmcs-steady-state }

Computing the steady state probabilities or rewards in a CTMC,
i.e. PRISM properties of the form:

```prism
S=? [ ... ]
R=? [ S ]
```

{{ propertyTable(benchmarks.ctmc, "steady-state") }}

## CTMC quantitative reachability { #ctmcs-reachability-quantitative }

Computing the probability of reaching some set of states in a CTMC,
i.e. PRISM properties of the form:

```prism
P=? [ F ... ]
P=? [ ... U ... ]
```

Quantitative properties only (i.e. the probability is not 0/1 for at least some states).

{{ propertyTable(benchmarks.ctmc, "quant-prob-reach") }}

## CTMC expected reachability { #ctmcs-expected-reachability }

Computing the expected accumulated reward to reach some set of states in a CTMC,
i.e. PRISM properties of the form:

```prism
R=? [ F ... ]
```

{{ propertyTable(benchmarks.ctmc, "quant-exp-reach") }}

## CTMC time-bounded reachability { #ctmcs-timebounded-reachability }

Computing the probability of a formula holding for some time bound in a CTMC,
i.e. PRISM properties of the form:

```prism
P=? [ F<=T ... ]
P=? [ F[T1,T2] ... ]
P=? [ F>=T ... ]
P=? [ ... U<=T ... ]
P=? [ ... U[T1,T2] ... ]
P=? [ ... U>=T ... ]
```

{{ propertyTable(benchmarks.ctmc, "time-bounded-reach") }}

## CTMC transient { #ctmcs-transient }

Computing the probability or expected value of a reward at a time instant in a CTMC,
i.e. PRISM properties of the form:

```prism
P=? [ F=T ]
R=? [ I=T ]
```

{{ propertyTable(benchmarks.ctmc, "transient") }}

## CTMC cumulative (time-bounded) reward { #ctmcs-timebounded-rewards }

Computing the expected accumulated reward up to some time bound in a CTMC,
i.e. PRISM properties of the form:

```prism
R=? [ C<=T ]
```

{{ propertyTable(benchmarks.ctmc, "cumul-reward") }}
