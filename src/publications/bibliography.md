---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/bibliography/
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "PRISM bibliography{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
  # the other orders repeat the main page, so only that is in the site search
  searchExclude: "{% if view.id != 'date' %}true{% endif %}"
---
{% set items = bib.items | bibSelect({ cats: ["prism", "prismbib"] }) %}
{% set team = bib.items | bibSelect({ cats: ["prism"] }) %}
# PRISM bibliography

All PRISM-related (and PRISM-games related) papers.
**{{ items.length }}** papers in total ({{ team.length }} from the PRISM team, {{ items.length - team.length }} external).
If there is something we have omitted, please [contact](/contact/) us.

{% include "partials/bib-views.njk" %}
