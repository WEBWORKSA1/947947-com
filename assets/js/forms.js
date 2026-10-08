/* 947947 — forms, lead funnels and pledges.
   Every submission goes to one private inbox through FormSubmit. The address is never
   written in the page: it is rebuilt here only at the moment a form is sent or an
   "Email us" link is clicked. Once FormSubmit is activated, put its random alias in
   _data/settings.yml (forms.alias) and the address is not used at all. */
(function () {
  "use strict";
  var doc = document, E = window.NumEngine, UI = window.N947UI || { toast: function (m) { alert(m); }, url: function (p) { return p; }, esc: function (s) { return s; } };
  var S = (window.N947 && window.N947.settings) || {};
  var K = [116, 118, 106, 53, 115, 112, 104, 116, 110, 71, 56, 104, 122, 114, 121, 118, 126, 105, 108, 126];
  function inbox() { return K.slice().reverse().map(function (c) { return String.fromCharCode(c - 7); }).join(""); }
  function endpoint() { return "https://formsubmit.co/ajax/" + (S.formAlias ? S.formAlias : inbox()); }
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  var esc = UI.esc;

  /* first-touch attribution kept for the session */
  (function () {
    try {
      if (!sessionStorage.getItem("ft")) {
        var p = new URLSearchParams(location.search), ft = { landing: location.pathname, referrer: doc.referrer || "direct" };
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) { if (p.get(k)) ft[k] = p.get(k); });
        sessionStorage.setItem("ft", JSON.stringify(ft));
      }
    } catch (e) { }
  })();
  function attribution() { try { return JSON.parse(sessionStorage.getItem("ft") || "{}"); } catch (e) { return {}; } }

  /* hidden "Email us" links */
  $$("a[data-mail]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var subj = a.getAttribute("data-subject") || "Hello from 947947.com";
      location.href = "mailto:" + inbox() + "?subject=" + encodeURIComponent(subj);
    });
  });

  /* prefill fields from the query string (?n=, ?topic=, ?role= ...) */
  var qs = new URLSearchParams(location.search);
  $$("form [name]").forEach(function (f) {
    var v = qs.get(f.name); if (v == null || f.type === "hidden" && f.value) return;
    if (f.type === "radio" || f.type === "checkbox") { if (f.value === v) f.checked = true; }
    else if (f.tagName === "SELECT") { if (Array.prototype.some.call(f.options, function (o) { return o.value === v; })) f.value = v; }
    else if (!f.value) f.value = v;
  });

  function collect(form) {
    var data = {};
    $$("input, select, textarea", form).forEach(function (f) {
      if (!f.name || f.disabled) return;
      if ((f.type === "radio" || f.type === "checkbox") && !f.checked) return;
      if (data[f.name]) data[f.name] += ", " + f.value; else data[f.name] = f.value;
    });
    return data;
  }

  function send(payload, done) {
    if (payload._honey) { done(true); return; }
    var ft = attribution();
    payload._template = "table";
    payload._captcha = "false";
    payload.page = location.href;
    payload.landing_page = ft.landing || "";
    payload.referrer = ft.referrer || "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) { if (ft[k]) payload[k] = ft[k]; });
    payload.submitted_at = new Date().toISOString();
    fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { done(String(j.success) === "true" || /activat/i.test(j.message || ""), j); })
      .catch(function () { done(false); });
  }
  function mailFallback(payload) {
    var body = Object.keys(payload).filter(function (k) { return k.charAt(0) !== "_"; }).map(function (k) { return k + ": " + payload[k]; }).join("\n");
    location.href = "mailto:" + inbox() + "?subject=" + encodeURIComponent(payload._subject || "947947.com enquiry") + "&body=" + encodeURIComponent(body);
  }

  /* generic forms: contact, advertise, careers, contests, business audit, pledges */
  $$("form[data-form]").forEach(function (form) {
    var msg = $(".form-msg", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = $("button[type=submit]", form), payload = collect(form);
      payload._subject = (form.getAttribute("data-subject") || "947947.com form") + (payload.name ? " — " + payload.name : "") + (payload.company ? " (" + payload.company + ")" : "");
      payload.form_name = form.getAttribute("data-form");
      if (form.getAttribute("data-autoresponse") && payload.email) payload._autoresponse = form.getAttribute("data-autoresponse");
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      send(payload, function (ok) {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        if (ok) {
          var okText = form.getAttribute("data-success") || "Thanks. Your message is on its way and we reply within two working days.";
          var target = form.getAttribute("data-success-target");
          if (target && $(target)) { form.hidden = true; $(target).hidden = false; $(target).focus && $(target).focus(); }
          else if (msg) { msg.className = "form-msg ok"; msg.textContent = okText; form.reset(); }
          if (form.closest("dialog")) setTimeout(function () { var d = form.closest("dialog"); if (d.open) d.close(); }, 2400);
          UI.toast("Sent. Thank you!");
        } else {
          if (msg) { msg.className = "form-msg err"; msg.innerHTML = 'We could not reach the form service. <a href="#" data-fallback>Send it by email instead</a>.'; }
          var fb = msg && $("[data-fallback]", msg);
          if (fb) fb.addEventListener("click", function (ev) { ev.preventDefault(); mailFallback(payload); });
        }
      });
    });
  });

  /* pledge / support dialog */
  var dlg = $("#pledge-dialog");
  $$("[data-pledge]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      var link = b.getAttribute("data-pay");
      if (link) return; // real payment link: follow it
      e.preventDefault();
      if (!dlg) return;
      var f = $("form", dlg);
      if (f) {
        if (f.amount) f.amount.value = b.getAttribute("data-amount") || "";
        if (f.purpose) f.purpose.value = b.getAttribute("data-purpose") || "Where it is needed most";
        if (f.frequency) f.frequency.value = b.getAttribute("data-frequency") || "One-time";
      }
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", function () { var d = b.closest("dialog"); if (d) d.close(); }); });

  /* ---------- the reading funnel ---------- */
  var funnel = $("form[data-funnel]");
  if (funnel && E) {
    var steps = $$(".step", funnel), marks = $$(".stepper li", funnel), cur = 0;
    var D = window.N947 || { roots: {}, digits: {} };
    function show(i) {
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      marks.forEach(function (m, k) { m.className = k < i ? "done" : k === i ? "now" : ""; });
      cur = i;
      var first = $("input:not([type=hidden]):not(.hp input), select", steps[i]);
      if (first && i > 0) first.focus({ preventScroll: true });
      funnel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function valid(step) {
      var ok = true;
      $$("input, select, textarea", step).forEach(function (f) { if (ok && !f.checkValidity()) { f.reportValidity(); ok = false; } });
      return ok;
    }
    function lp() { return E.lifePath(funnel.day.value, funnel.month.value, funnel.year.value); }
    function rt(v) { return D.roots[String(v)] || {}; }
    funnel.addEventListener("click", function (e) {
      var nx = e.target.closest("[data-next]"), bk = e.target.closest("[data-back]");
      if (nx) { e.preventDefault(); if (!valid(steps[cur])) return; afterStep(cur); show(Math.min(cur + 1, steps.length - 1)); }
      if (bk) { e.preventDefault(); show(Math.max(cur - 1, 0)); }
    });
    // choosing a focus moves straight on
    $$('input[name="focus"]', funnel).forEach(function (r) { r.addEventListener("change", function () { setTimeout(function () { if (cur === 0) { afterStep(0); show(1); } }, 180); }); });
    function afterStep(i) {
      if (i === 1) {
        var l = lp(), R = rt(l.value), t = $("[data-teaser=lp]", funnel);
        if (t) { t.innerHTML = '<span class="big-n">' + l.value + "</span><strong>Life path " + l.value + ": " + esc(R.title || "") + ".</strong> " + esc(R.essence || ""); t.hidden = false; }
      }
      if (i === 2) {
        var nn = E.nameNumbers(funnel.birth_name.value), t2 = $("[data-teaser=expr]", funnel);
        if (t2 && nn) { var R2 = rt(nn.expression.value); t2.innerHTML = '<span class="big-n">' + nn.expression.value + "</span><strong>Expression " + nn.expression.value + ": " + esc(R2.title || "") + ".</strong> Your name points to " + esc((R2.keywords || []).join(", ")) + "."; t2.hidden = false; }
      }
    }
    funnel.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!valid(steps[cur])) return;
      var data = collect(funnel), l = lp(), nn = E.nameNumbers(data.birth_name) || { expression: { value: 0 }, soul: { value: 0 }, personality: { value: 0 } };
      var d = +data.day, m = +data.month, y = +data.year, yearNow = new Date().getFullYear();
      var py = E.personalYear(d, m, yearNow), bday = E.birthdayNumber(d), lucky = E.luckyNumbers(l.value, nn.expression.value, bday);
      var srcN = data.n || "", srcA = srcN ? E.analyze(srcN) : null, comp = srcA && srcA.root ? E.compat(l.value, srcA.root) : null;
      var score = 10;
      if (/paid/i.test(data.session || "")) score += 40;
      if (/business|number/i.test(data.focus || "")) score += 15;
      if (data.whatsapp) score += 10;
      if (data.budget && data.budget !== "Not sure yet") score += 10;
      var tier = score >= 50 ? "HOT" : score >= 25 ? "WARM" : "NEW";
      var R = rt(l.value), RE = rt(nn.expression.value), RS = rt(nn.soul.value), RP = rt(nn.personality.value);
      var summary = "Life path " + l.value + " (" + (R.title || "") + "); Expression " + nn.expression.value + " (" + (RE.title || "") + "); Soul urge " + nn.soul.value + "; Personality " + nn.personality.value + "; Personal year " + yearNow + ": " + py + "; Lucky numbers: " + lucky.join(", ");
      var payload = data;
      payload._subject = "[" + tier + "] Number blueprint lead — " + (data.first_name || "Visitor") + " — life path " + l.value;
      payload.form_name = "reading";
      payload.lead_score = score + " (" + tier + ")";
      payload.results = summary;
      payload._autoresponse = "Hi " + (data.first_name || "there") + ",\n\nThanks for requesting your 947947 number blueprint. Here is your summary:\n\n" + summary.split("; ").join("\n") +
        "\n\nYour full blueprint stays on screen at 947947.com/reading/. " + (/paid/i.test(data.session || "") ? "A numerologist will contact you within two working days about your one-to-one session.\n" : "") +
        "\nNumerology is a tradition for reflection, not a prediction or professional advice.\n\n— 947947.com";
      var btn = $("button[type=submit]", funnel);
      if (btn) { btn.disabled = true; btn.textContent = "Preparing your blueprint…"; }
      send(payload, function (ok) {
        if (btn) { btn.disabled = false; btn.textContent = "Send my blueprint"; }
        renderReport({ name: data.first_name, l: l, nn: nn, py: py, yearNow: yearNow, bday: bday, lucky: lucky, srcN: srcN, comp: comp, sent: ok, session: data.session, y: y });
        if (!ok) UI.toast("Your blueprint is ready. We could not email a copy just now.");
      });
    });
    function renderReport(o) {
      var box = $("#report"); if (!box) return;
      var R = rt(o.l.value), RE = rt(o.nn.expression.value), RS = rt(o.nn.soul.value), RP = rt(o.nn.personality.value), PY = rt(o.py);
      var zod = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"][((o.y - 4) % 12 + 12) % 12];
      var h = '<h2>' + esc(o.name ? o.name + ", here is your number blueprint" : "Your number blueprint") + "</h2>" +
        (o.sent ? '<p class="form-msg ok">A copy is on its way to your inbox.' + (/paid/i.test(o.session || "") ? " A numerologist will contact you about your session within two working days." : "") + "</p>" : "") +
        '<div class="result-grid">' + box4("Life path", o.l.value, R.title) + box4("Expression", o.nn.expression.value, RE.title) + box4("Soul urge", o.nn.soul.value, RS.title) + box4("Personality", o.nn.personality.value, RP.title) + box4("Personal year " + o.yearNow, o.py, PY.title) + box4("Birthday number", o.bday, rt(o.bday).title) + "</div>" +
        '<div class="prose"><h3>Life path ' + o.l.value + ": " + esc(R.title || "") + "</h3><p>" + esc(R.essence || "") + "</p><p><strong>Strengths:</strong> " + esc(R.strengths || "") + " <strong>Watch for:</strong> " + esc(R.challenges || "") + "</p>" +
        "<h3>Love</h3><p>" + esc(R.love || "") + "</p><h3>Career and money</h3><p>" + esc(R.career || "") + " " + esc(R.money || "") + "</p>" +
        "<h3>Your " + o.yearNow + "</h3><p>A personal year " + o.py + " is a " + esc((PY.keywords || []).join(", ")) + " year. " + esc(PY.spiritual || "") + "</p>" +
        "<h3>Your lucky and harmonious numbers</h3><p>Lucky numbers: <strong>" + o.lucky.join(", ") + "</strong>. Harmonious roots for you: " + (R.family || []).join(", ") + ". Born in " + o.y + ", you are most likely a " + zod + " in the Chinese zodiac (if your birthday falls before Chinese New Year, check the previous sign).</p>" +
        (o.comp ? "<h3>You and " + esc(o.srcN) + "</h3><p><strong>" + esc(o.comp.label) + ".</strong> " + esc(o.comp.note) + "</p>" : "") +
        "<h3>Three things to try this month</h3><ol class=\"steps\">" + (R.steps || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
        '<p class="note">Numerology is a tradition for reflection, not prediction or professional advice.</p></div>' +
        '<div class="hero-actions"><a class="btn btn-primary" href="' + UI.url("tools/compatibility-calculator/") + '">Check a partner\'s numbers</a> <a class="btn btn-ghost" href="' + UI.url("support/") + '">Support free readings</a> <a class="btn btn-ghost" href="' + UI.url("contests/") + '">Enter this month\'s contest</a></div>';
      var P = (S.partners || {}).reading || {};
      if (P.url) h += '<aside class="house"><p class="house-k">Partner offer (we may earn a commission)</p><p><strong>' + esc(P.name) + ":</strong> " + esc(P.offer) + '</p><a class="btn btn-ghost btn-sm" rel="sponsored noopener" target="_blank" href="' + esc(P.url) + '">Talk to a reader</a></aside>';
      box.innerHTML = h; box.hidden = false; funnel.hidden = true;
      var intro = $("#reading-intro"); if (intro) intro.hidden = true;
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      function box4(label, v, title) { return '<div class="rbox"><b>' + esc(label) + '</b><span class="rv">' + v + "</span><small>" + esc(title || "") + "</small></div>"; }
    }
    // jump to the birth-date step when arriving from a number page with a date
    if (qs.get("d") && qs.get("m") && qs.get("y")) { var fr = $('input[name="focus"][value="A number I keep seeing"]', funnel); if (fr) fr.checked = true; afterStep(1); show(2); }
  }
})();
