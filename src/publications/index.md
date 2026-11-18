---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/
crumb: "Publications"
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "PRISM publications{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
  # the other orders repeat the main page, so only that is in the site search
  searchExclude: "{% if view.id != 'date' %}true{% endif %}"
---
{% set items = bib.items | bibSelect({ cats: ["prism"] }) %}
# PRISM publications

All PRISM-related (and PRISM-games related) papers authored or co-authored by members of the PRISM team.
**{{ items.length }}** papers in total.

See also the full [PRISM bibliography](/publications/bibliography/)
and "[About PRISM](/about/)" for specific pointers to background reading.

{% include "partials/bib-views.njk" %}
