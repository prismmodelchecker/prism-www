---
layout: layouts/base.njk
title: "PRISM-games publications"
section: games
permalink: /games/publ/
subjects:
  - { id: techniques, cats: [techniques], title: "Underlying models, logics and algorithms for PRISM-games" }
  - { id: casestudies, cats: [casestudies], title: "Case studies using PRISM-games" }
  - { id: extensions, cats: [extensions, connections], title: "Techniques and tools building on PRISM-games" }
  - { id: toolpapers, cats: [toolpapers], title: "Tool papers" }
  - { id: tutorials, cats: [tutorials], title: "Survey/tutorial papers" }
subjectCats: [techniques, casestudies, extensions, connections, toolpapers, tutorials]
---
{% set all = bib.items | bibSelect({ cats: ["prism-games"] }) | sortByDate %}
# PRISM-games publications

{% for s in subjects %}
-   [{{ s.title }}](#{{ s.id }})
{%- endfor %}
-   [Others](#others)

{% for s in subjects %}
{%- set items = all | bibSelect({ cats: s.cats }) %}
## {{ s.title }} <small>({{ items.length }})</small> { #{{ s.id }} }

<ul class="bib-list">{% for item in items %}<li>{{ item | citation | safe }}</li>{% endfor %}</ul>

{% endfor %}
{%- set others = all | bibSelect({ notCats: subjectCats }) %}
## Others <small>({{ others.length }})</small> { #others }

<ul class="bib-list">{% for item in others %}<li>{{ item | citation | safe }}</li>{% endfor %}</ul>
