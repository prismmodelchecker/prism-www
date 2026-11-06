---
layout: layouts/base.njk
section: publ
pagination:
  data: bibViews
  size: 1
  alias: view
listUrl: /publications/references/
permalink: "{{ listUrl }}{% if view.id != 'date' %}by-{{ view.id }}/{% endif %}"
eleventyComputed:
  title: "References{% if view.id != 'date' %} (by {{ view.name }}){% endif %}"
# (every item has a page of its own in the site search)
searchExclude: "true"
---
{% set items = bib.items | bibSelect({}) %}
# References

A full list of {{ items.length }} related reference.

{% include "partials/bib-views.njk" %}
