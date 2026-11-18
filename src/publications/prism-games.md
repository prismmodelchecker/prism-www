---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/prism-games/
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "PRISM-games bibliography{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
  # the other orders repeat the main page, so only that is in the site search
  searchExclude: "{% if view.id != 'date' %}true{% endif %}"
---
{% set items = bib.items | bibSelect({ cats: ["prism-games"] }) %}
{% set team = items | bibSelect({ cats: ["prism"] }) %}
# PRISM-games bibliography

All papers related to [PRISM-games](/games/).
**{{ items.length }}** papers in total ({{ team.length }} from the PRISM team, {{ items.length - team.length }} external).

See also the full [PRISM bibliography](/publications/bibliography/).
If there is something we have omitted, please [contact](/contact/) us.

{% include "partials/bib-views.njk" %}
