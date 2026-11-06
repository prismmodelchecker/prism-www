---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/external/
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "External PRISM publications{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
  # the other orders repeat the main page, so only that is in the site search
  searchExclude: "{% if view.id != 'date' %}true{% endif %}"
---
{% set items = bib.items | bibSelect({ cats: ["prismbib"] }) %}
# PRISM bibliography (external)

The {{ items.length }} PRISM-related papers by authors outside the PRISM team.
See also the full [PRISM bibliography](/publications/bibliography/)
and the papers [by the PRISM team](/publications/).
If there is something we have omitted, please [contact](/contact/) us.

{% include "partials/bib-views.njk" %}
