/* 947947 — interactive tools. Each tool is a <div data-tool="..."> on its page. */
(function () {
  "use strict";
  var E = window.NumEngine, UI = window.N947UI, D = window.N947 || { roots: {}, digits: {}, codes: [] };
  var esc = UI.esc, url = UI.url;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function root(v) { return D.roots[String(v)] || {}; }
  function box(label, v, sub) { return '<div class="rbox"><b>' + esc(label) + '</b><span class="rv">' + v + "</span>" + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</div>"; }
  function cta(n) { return '<p class="hero-actions"><a class="btn btn-primary" href="' + url("reading/" + (n ? "?n=" + n : "")) + '">Get my full blueprint free</a></p>'; }
  function dob(form) { return { d: +form.day.value, m: +form.month.value, y: +form.year.value }; }
  function need(cond, msg) { if (!cond) UI.toast(msg); return cond; }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var tools = {
    "life-path": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var b = dob(f); if (!need(b.d && b.m && b.y, "Choose your full birth date.")) return;
        var l = E.lifePath(b.d, b.m, b.y), R = root(l.value);
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Your life path", l.value, R.title) + box("Birthday number", E.birthdayNumber(b.d), root(E.birthdayNumber(b.d)).title) + box("Personal year " + new Date().getFullYear(), E.personalYear(b.d, b.m, new Date().getFullYear())) + "</div>" +
          '<p class="work">Month ' + b.m + " → " + l.parts.month + " · Day " + b.d + " → " + l.parts.day + " · Year " + b.y + " → " + l.parts.year + " · " + l.parts.month + " + " + l.parts.day + " + " + l.parts.year + " = " + l.chain[3] + (l.chain.length > 4 ? " → " + l.chain.slice(4).join(" → ") : "") + "</p>" +
          "<h3>Life path " + l.value + ": " + esc(R.title || "") + "</h3><p>" + esc(R.essence || "") + "</p><p><strong>Strengths:</strong> " + esc(R.strengths || "") + "</p><p><strong>Watch for:</strong> " + esc(R.challenges || "") + "</p><p><strong>Love:</strong> " + esc(R.love || "") + "</p><p><strong>Work:</strong> " + esc(R.career || "") + "</p>" +
          '<p>Harmonious numbers: ' + (R.family || []).map(function (x) { return '<a href="' + url(x + "/") + '">' + x + "</a>"; }).join(", ") + ". Vedic planet: " + esc(R.planet || "") + ". Tarot: " + esc(R.tarot || "") + ".</p>" + cta() + "</div>";
        out.hidden = false;
      });
    },
    "name": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var name = f.full_name.value.trim(); if (!need(/[a-z]/i.test(name), "Type a name using Latin letters.")) return;
        var sys = f.system.value, r = E.nameNumbers(name, sys);
        var rows = name.split(/\s+/).map(function (w) {
          var map = sys === "chaldean" ? { a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1, j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2, s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7 } : null;
          var letters = w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "").split("");
          return "<tr><th scope=\"row\">" + esc(w) + "</th><td>" + letters.map(function (c) { var v = map ? map[c] : ((c.charCodeAt(0) - 97) % 9) + 1; return c.toUpperCase() + "=" + v; }).join(" ") + "</td></tr>";
        }).join("");
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Expression (destiny)", r.expression.value, root(r.expression.value).title) + box("Soul urge (heart's desire)", r.soul.value, root(r.soul.value).title) + box("Personality", r.personality.value, root(r.personality.value).title) + "</div>" +
          '<div class="table-wrap"><table><thead><tr><th scope="col">Word</th><th scope="col">Letter values (' + (sys === "chaldean" ? "Chaldean" : "Pythagorean") + ")</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
          '<p class="work">All letters: ' + r.raw.full + " → " + r.expression.chain.slice(1).join(" → ") + " · Vowels: " + r.raw.vowels + " → " + r.soul.value + " · Consonants: " + r.raw.consonants + " → " + r.personality.value + "</p>" +
          "<h3>Expression " + r.expression.value + ": " + esc(root(r.expression.value).title || "") + "</h3><p>" + esc(root(r.expression.value).essence || "") + "</p><h3>Soul urge " + r.soul.value + "</h3><p>" + esc(root(r.soul.value).essence || "") + "</p>" + cta() + "</div>";
        out.hidden = false;
      });
    },
    "decoder": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var a = E.analyze(f.seq.value); if (!need(a, "Type the digits you keep seeing, for example 1111 or 947.")) return;
        var page = a.hasPage ? '<p><a class="btn btn-ghost" href="' + url(a.s + "/") + '">Open the full ' + a.s + " page</a></p>" : "";
        out.innerHTML = '<div class="result">' + UI.explorerHtml(a) + page + "</div>"; out.hidden = false;
      });
    },
    "lucky": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var b = dob(f); if (!need(b.d && b.m && b.y, "Choose your full birth date.")) return;
        var l = E.lifePath(b.d, b.m, b.y), nn = f.full_name.value.trim() ? E.nameNumbers(f.full_name.value) : null, bd = E.birthdayNumber(b.d);
        var lucky = E.luckyNumbers(l.value, nn ? nn.expression.value : 0, bd), R = root(l.value);
        var days = { "Sun (Surya)": "Sunday", "Moon (Chandra)": "Monday", "Mars (Mangal)": "Tuesday", "Mercury (Budha)": "Wednesday", "Jupiter (Guru)": "Thursday", "Venus (Shukra)": "Friday", "Saturn (Shani)": "Saturday" };
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Lucky numbers", lucky.join(", ")) + box("Life path", l.value, R.title) + box("Birthday number", bd) + (nn ? box("Name number", nn.expression.value) : "") + "</div>" +
          "<p>Your core numbers are " + l.value + (nn ? " and " + nn.expression.value : "") + ". Numbers that reduce to them, such as " + lucky.slice(0, 4).join(", ") + ", are traditionally treated as your lucky numbers. Harmonious roots: " + (R.family || []).join(", ") + "." + (days[R.planet] ? " In Vedic tradition your ruling planet is " + esc(R.planet) + ", linked with " + days[R.planet] + "." : "") + "</p>" +
          '<p class="note">Lucky numbers are cultural tradition. Never rely on them for gambling or financial decisions.</p>' + cta() + "</div>";
        out.hidden = false;
      });
    },
    "phone": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var raw = f.phone.value.replace(/\D/g, ""); if (!need(raw.length >= 3 && raw.length <= 15, "Type a phone number with 3 to 15 digits.")) return;
        var a = E.analyze(raw), b = dob(f), lp = b.d && b.m && b.y ? E.lifePath(b.d, b.m, b.y) : null, c = lp ? E.compat(lp.value, a.root) : null;
        var fours = a.counts[4], eights = a.counts[8], nines = a.counts[9], sixes = a.counts[6];
        var tail = raw.slice(-4), ta = E.analyze(tail);
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Digit total", a.sum) + box("Number root", a.root, (a.R || {}).title) + box("Chinese verdict", '<span style="font-size:22px">' + esc(a.zh.verdict) + "</span>") + (lp ? box("Your life path", lp.value) : "") + "</div>" +
          "<p>" + esc(f.phone.value.trim()) + " reduces to <strong>" + a.root + "</strong>, " + esc((a.R || {}).title || "") + ": " + esc((a.R || {}).essence || "") + "</p>" +
          "<p>Digit check: " + eights + " × 8 (prosper), " + sixes + " × 6 (smooth), " + nines + " × 9 (long-lasting), " + fours + " × 4 (sounds like death in Chinese, Japanese and Korean). The last four digits, " + tail + ", reduce to " + ta.root + ".</p>" +
          (a.codes.length ? "<p>Codes inside: " + a.codes.slice(0, 5).map(function (x) { return "<strong>" + esc(x.code) + "</strong> (" + esc(x.culture) + ": " + esc(x.meaning) + ")"; }).join("; ") + ".</p>" : "") +
          (c ? "<p><strong>" + esc(c.label) + " with your life path " + lp.value + ".</strong> " + esc(c.note) + "</p>" : "<p>Add your birth date to see how this number matches your life path.</p>") +
          '<p class="note">For fun and cultural interest. A phone number does not change your fortune.</p><p class="hero-actions"><a class="btn btn-primary" href="' + url("reading/?focus=" + encodeURIComponent("Choosing a lucky number")) + '">Help me choose a lucky number</a></p></div>';
        out.hidden = false;
      });
    },
    "compat": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var a = { d: +f.day.value, m: +f.month.value, y: +f.year.value }, b = { d: +f.day2.value, m: +f.month2.value, y: +f.year2.value };
        if (!need(a.d && a.m && a.y && b.d && b.m && b.y, "Choose both full birth dates.")) return;
        var la = E.lifePath(a.d, a.m, a.y), lb = E.lifePath(b.d, b.m, b.y), c = E.compat(la.value, lb.value);
        var na = f.name1.value.trim() || "Person A", nb = f.name2.value.trim() || "Person B";
        out.innerHTML = '<div class="result"><div class="result-grid">' + box(na, la.value, root(la.value).title) + box(nb, lb.value, root(lb.value).title) + box("Match", '<span style="font-size:24px">' + esc(c.label) + "</span>") + "</div><p>" + esc(c.note) + "</p><p><strong>" + esc(na) + ":</strong> " + esc(root(la.value).love || "") + "</p><p><strong>" + esc(nb) + ":</strong> " + esc(root(lb.value).love || "") + '</p><p class="note">Compatibility readings are a conversation starter, not a verdict on a relationship.</p>' + cta() + "</div>";
        out.hidden = false;
      });
    },
    "year": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      if (f.target_year && !f.target_year.value) f.target_year.value = new Date().getFullYear();
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var b = dob(f), ty = +f.target_year.value; if (!need(b.d && b.m && ty, "Choose your birth day, month and the year to check.")) return;
        var py = E.personalYear(b.d, b.m, ty), R = root(py);
        var months = MONTHS.map(function (name, i) { var pm = E.reduce(py + E.reduce(i + 1, false).value, false).value; return "<tr><th scope=\"row\">" + name + "</th><td>" + pm + "</td><td>" + esc((root(pm).keywords || []).join(", ")) + "</td></tr>"; }).join("");
        var today = new Date(), pd = E.reduce(E.reduce(py + today.getMonth() + 1, false).value + today.getDate(), false).value;
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Personal year " + ty, py, R.title) + box("Today's personal day", pd) + "</div><p>" + esc(R.essence || "") + " " + esc(R.spiritual || "") + '</p><div class="table-wrap"><table><thead><tr><th scope="col">Month</th><th scope="col">Personal month</th><th scope="col">Themes</th></tr></thead><tbody>' + months + "</tbody></table></div>" + cta() + "</div>";
        out.hidden = false;
      });
    },
    "factor": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var s = E.clean(f.num.value); if (!need(s && +s <= 1e14, "Type a whole number up to 100 trillion.")) return;
        var n = +s, fs = E.factorize(n), g = E.group(fs), divs = n > 0 && g.reduce(function (a, x) { return a * (x.e + 1); }, 1) <= 400 ? E.divisorsFrom(g) : null, trace = [], m = n;
        fs.forEach(function (p) { trace.push(E.fmt(m) + " ÷ " + p + " = " + E.fmt(m / p)); m = m / p; });
        out.innerHTML = '<div class="result"><h3>' + E.fmt(n) + " = " + (n < 2 ? "no prime factors" : g.map(function (x) { return x.p + (x.e > 1 ? "<sup>" + x.e + "</sup>" : ""); }).join(" × ")) + "</h3>" +
          (fs.length === 1 ? "<p><strong>" + E.fmt(n) + " is prime.</strong></p>" : "") + (trace.length > 1 ? '<p class="work">' + trace.join("<br>") + "</p>" : "") +
          (divs ? "<p><strong>" + divs.length + " divisors:</strong> " + divs.map(E.fmt).join(", ") + "</p>" : "") + (E.hasPage(n) ? '<p><a href="' + url(s + "/") + '">Everything about ' + s + "</a></p>" : "") + "</div>";
        out.hidden = false;
      });
    },
    "base": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var from = +f.from.value, v = f.val.value.trim().toLowerCase().replace(/[\s_]/g, "");
        var digits = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, from);
        if (!need(v && v.split("").every(function (c) { return digits.indexOf(c) > -1; }), "That value is not valid in base " + from + ".")) return;
        var n = parseInt(v, from); if (!need(Number.isSafeInteger(n), "That number is too large for this converter.")) return;
        var steps = [], m = n; if (m === 0) steps.push("0 ÷ 2 = 0 remainder 0"); while (m > 0 && steps.length < 64) { steps.push(m + " ÷ 2 = " + Math.floor(m / 2) + " remainder " + (m % 2)); m = Math.floor(m / 2); }
        out.innerHTML = '<div class="result"><div class="result-grid">' + box("Decimal", E.fmt(n)) + box("Binary", '<span class="mono-num" style="font-size:20px">' + n.toString(2) + "</span>") + box("Octal", n.toString(8)) + box("Hexadecimal", n.toString(16).toUpperCase()) + box("Base 36", n.toString(36)) + "</div>" +
          "<p><strong>Decimal to binary, step by step</strong> (read the remainders from bottom to top):</p><p class=\"work\">" + steps.join("<br>") + "</p></div>";
        out.hidden = false;
      });
    },
    "roman": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var v = f.val.value.trim(), res;
        if (/^[\d,\s]+$/.test(v)) { var n = +v.replace(/\D/g, ""), r = E.roman(n); if (!need(r, "Roman numerals cover 1 to 3,999,999 (with a bar for thousands).")) return; res = box(E.fmt(n), r.html) + "<p>" + (n > 3999 ? "A bar over letters multiplies them by 1,000. " : "") + (E.hasPage(n) ? '<a href="' + url(n + "/") + '">More about ' + n + "</a>" : "") + "</p>"; }
        else { var t = E.fromRoman(v); if (!need(t, "That is not a valid Roman numeral (standard form, up to MMMCMXCIX).")) return; res = box(v.toUpperCase(), E.fmt(t)) + (E.hasPage(t) ? '<p><a href="' + url(t + "/") + '">More about ' + t + "</a></p>" : ""); }
        out.innerHTML = '<div class="result"><div class="result-grid">' + res + "</div></div>"; out.hidden = false;
      });
    },
    "words": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var s = E.clean(f.num.value); if (!need(s && +s < 1e15, "Type a whole number below one quadrillion.")) return;
        var n = +s, a = E.analyze(s);
        out.innerHTML = '<div class="result"><dl class="facts"><div><dt>US / UK English</dt><dd>' + esc(E.words(n)) + "</dd></div><div><dt>Indian numbering</dt><dd>" + esc(a.indian) + " — " + esc(E.indianWords(n)) + "</dd></div><div><dt>Chinese</dt><dd lang=\"zh\">" + esc(E.chinese(n)) + "</dd></div><div><dt>Digit by digit (Mandarin)</dt><dd>" + esc(a.zhDigits) + " (" + esc(a.pinyin) + ")</dd></div><div><dt>Roman numeral</dt><dd>" + (a.roman ? a.roman.html : "—") + "</dd></div></dl></div>";
        out.hidden = false;
      });
    },
    "trick": function (el) {
      var f = $("form", el), out = $(".tool-out", el);
      f.addEventListener("submit", function (e) {
        e.preventDefault(); var v = f.abc.value.replace(/\D/g, ""); if (!need(/^[1-9]\d{2}$/.test(v), "Type a three-digit number from 100 to 999.")) return;
        var x = +(v + v), a7 = x / 7, a11 = a7 / 11, a13 = a11 / 13;
        out.innerHTML = '<div class="result"><div class="trick-steps"><div>Write it twice: ' + v + " → " + x + "</div><div>" + x + " ÷ 7 = " + a7 + "</div><div>" + a7 + " ÷ 11 = " + a11 + "</div><div>" + a11 + " ÷ 13 = " + a13 + " ← your number is back</div></div>" +
          "<p>Writing a three-digit number twice is the same as multiplying it by 1,001, and 1,001 = 7 × 11 × 13. Dividing by all three simply undoes the multiplication.</p><p><a class=\"btn btn-ghost\" href=\"" + url(x + "/") + '">See everything about ' + x + "</a></p></div>";
        out.hidden = false;
      });
    }
  };
  $$("[data-tool]").forEach(function (el) { var fn = tools[el.getAttribute("data-tool")]; if (fn) fn(el); });
})();
