---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "PRISM publications{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
  # the other orders repeat the main page, so only that is in the site search
  searchExclude: "{% if view.id != 'date' %}true{% endif %}"
---
{% set items = bib.items | bibSelect({ cats: ["prism"] }) %}
# PRISM publications

All {{ items.length }} PRISM-related papers authored or co-authored by members of the PRISM team.
See also the [selected publications](/publications/selected/),
the full [PRISM bibliography](/publications/bibliography/)
and [external PRISM papers](/publications/external/).
If you have a PRISM-related publication not included in these lists, please [tell](/contact/) us.

{% include "partials/bib-views.njk" %}
