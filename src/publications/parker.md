---
layout: layouts/base.njk
title: "Publications by David Parker"
section: publ
permalink: /publications/parker/
---
{% set items = bib.items | bibSelect({ cats: ["dave"] }) %}
# Publications by David Parker

{% include "partials/bib-by-year.njk" %}
