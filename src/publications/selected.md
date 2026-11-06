---
layout: layouts/base.njk
title: Selected PRISM publications
section: publ
permalink: /publications/selected/
sections:
  - title: The most recent PRISM and PRISM-games tool papers
    keys: [KNPS20, KNP11]
  - title: High-level overviews of the techniques underlying PRISM
    keys: [Par23, KNP22, KNP17, NP14]
  - title: Tutorial papers covering the techniques in PRISM
    keys: [KNP07a, FKNP11, NPS13, SK16, KNP10a]
---
# Selected PRISM publications

A selection of PRISM-related papers for those wanting to learn more about the tool,
its underlying techniques and ongoing work in the area.
See also the lists of [all PRISM papers](/publications/),
the full [PRISM bibliography](/publications/bibliography/)
and [external PRISM papers](/publications/external/).

{% for s in sections %}
## {{ s.title }}

<ul class="bib-list">
{%- for item in bib.items | bibSelect({ keys: s.keys }) %}
<li>{{ item | citation | safe }}</li>
{%- endfor %}
</ul>

{% endfor %}
