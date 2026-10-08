---
layout: null
permalink: /assets/js/site-data.js
---
/* Generated from _data at build time. Do not edit here: edit the YAML files in _data/. */
window.N947 = {
  digits: {{ site.data.digits | jsonify }},
  roots: {{ site.data.roots | jsonify }},
  codes: {{ site.data.codes | jsonify }},
  settings: {
    contact: {{ site.data.settings.owner_contact_url | jsonify }},
    adsense: {{ site.data.settings.adsense.client | jsonify }},
    formAlias: {{ site.data.settings.forms.alias | jsonify }},
    payments: {{ site.data.settings.payments | jsonify }},
    youtube: {{ site.data.settings.youtube | jsonify }},
    partners: {{ site.data.settings.partners | jsonify }},
    contest: {{ site.data.settings.contest | jsonify }}
  }
};
