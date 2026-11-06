---
layout: layouts/base.njk
title: "Publications: David Parker"
section: publ
permalink: /publications/parker/
---
{% set items = bib.items | bibSelect({ cats: ["dave"] }) %}
# Publications – David Parker

{% include "partials/bib-by-year.njk" %}
