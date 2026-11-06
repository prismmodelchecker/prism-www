---
layout: layouts/base.njk
title: "Models"
section: downloads
permalink: /benchmarks/models/
---
{% from "partials/benchmark-tables.njk" import modelTable %}
# PRISM Benchmark Suite - Models

Below are details of all the models in the benchmark suite, grouped by type.
Click on the name of a model to browse the model/property files.

"Name" gives a short, unique name that can be used to refer to each model unambiguously,
for example in a table of experimental results.

"Model reference" gives a citation to the paper in which the model (PRISM or otherwise) was presented, if there is one.
Other references, e.g. to the original system being modelled, are also given.

{% for id, type in benchmarks %}
## {{ type.title }} ({{ type.acronym }}s) { #{{ id }}s }

{{ modelTable(type) }}

**Links:** [[source](https://github.com/prismmodelchecker/prism-benchmarks/tree/master/models/{{ id }}s/models.json)] [[model stats](https://github.com/prismmodelchecker/prism-benchmarks/tree/master/models/{{ id }}s/models.csv)] [[properties](/benchmarks/props-{{ id }}/)]
{% if type.note %}
**Note:** {{ type.note }}
{% endif %}
{% endfor %}
