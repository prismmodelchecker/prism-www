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
# PRISM bibliography

A bibliography of all {{ items.length }} PRISM-related papers, from the PRISM team and from elsewhere.
See also the separate lists of papers [produced externally](/publications/external/)
and [by the PRISM team](/publications/), and the [selected PRISM papers](/publications/selected/).
If there is something we have omitted, please [contact](/contact/) us.

{% include "partials/bib-views.njk" %}
