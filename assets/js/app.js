/* 947947 — site behaviour: theme, menu, number look-ups, widgets, sharing, video facades. */
(function () {
  "use strict";
  var E = window.NumEngine, doc = document;
  var rootMeta = doc.querySelector('meta[name="site-root"]');
  var ROOT = rootMeta ? rootMeta.getAttribute("content") : "/";
  function url(path) { return ROOT + path; }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var toastEl = $(".toast"), toastT;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2600); }
  window.N947UI = { toast: toast, url: url, esc: esc };

  /* theme */
  $$("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      var cur = doc.documentElement.getAttribute("data-theme");
      if (!cur) cur = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      doc.documentElement.setAttribute("data-theme", next); store("theme", next);
    });
  });

  /* mobile menu */
  var menuBtn = $("[data-menu]"), nav = $("#site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); } });
  }
  $$(".nav-more details").forEach(function (d) {
    doc.addEventListener("click", function (e) { if (d.open && !d.contains(e.target)) d.open = false; });
  });

  /* number look-up forms */
  function go(raw) {
    var s = E.clean(raw);
    if (s === null) { toast("Type a whole number with up to 15 digits."); return; }
    var n = Number(s);
    location.href = E.hasPage(n) ? url(s + "/") : url("numbers/?n=" + s);
  }
  $$("[data-lookup]").forEach(function (f) {
    f.addEventListener("submit", function (e) { e.preventDefault(); var i = f.querySelector("input"); if (i) go(i.value); });
  });

  /* year selects */
  var nowY = new Date().getFullYear();
  $$("select[data-years]").forEach(function (sel) {
    var html = '<option value="">Year</option>';
    for (var y = nowY; y >= 1920; y--) html += "<option>" + y + "</option>";
    sel.innerHTML = html;
  });

  /* "Is this number good for you?" widget on number pages */
  $$("[data-luckcheck]").forEach(function (box) {
    var form = box.querySelector("form"), out = box.querySelector(".lc-out");
    var n = box.getAttribute("data-n"), nroot = +box.getAttribute("data-root");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = form.day.value, m = form.month.value, y = form.year.value;
      if (!d || !m || !y) { toast("Choose your day, month and year of birth."); return; }
      var lp = E.lifePath(d, m, y), c = E.compat(lp.value, nroot || 0);
      var R = (window.N947 && window.N947.roots[String(lp.value)]) || {};
      var q = "?n=" + encodeURIComponent(n) + "&d=" + d + "&m=" + m + "&y=" + y;
      out.innerHTML = '<p class="lc-score">Life path ' + lp.value + (R.title ? ": " + esc(R.title) : "") + "</p>" +
        (c ? "<p><strong>" + esc(c.label) + " with " + esc(n) + ".</strong> " + esc(c.note) + "</p>" : "<p>Zero has no numerology root, so it reads as neutral for every life path: pure potential.</p>") +
        '<p><a class="btn btn-primary" href="' + url("reading/") + q + '">See my full number blueprint</a></p>';
      out.hidden = false;
    });
  });

  /* birth-date reveal: instant life path, then the full blueprint */
  $$("[data-reveal]").forEach(function (box) {
    var form = box.querySelector("form"), out = box.querySelector(".lc-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = form.day.value, m = form.month.value, y = form.year.value;
      if (!d || !m || !y) { toast("Choose your day, month and year of birth."); return; }
      var lp = E.lifePath(d, m, y), R = (window.N947 && window.N947.roots[String(lp.value)]) || {};
      out.innerHTML = '<p class="lc-score"><span class="big-n">' + lp.value + "</span>" + esc(R.title || "") + "</p><p>" + esc(R.essence || "") + "</p>" +
        '<p><a class="btn btn-primary" href="' + url("reading/?d=" + d + "&m=" + m + "&y=" + y) + '">Get my full blueprint free</a></p>';
      out.hidden = false;
    });
  });

  /* guide contents list built from the headings */
  $$("[data-autotoc]").forEach(function (toc) {
    var list = toc.querySelector("ol"), hs = $$(".guide-body > h2[id]");
    if (hs.length < 3) { toc.hidden = true; return; }
    list.innerHTML = hs.map(function (h) { return '<li><a href="#' + h.id + '">' + esc(h.textContent) + "</a></li>"; }).join("");
  });

  /* share and copy */
  $$("[data-share]").forEach(function (box) {
    var title = box.getAttribute("data-title") || doc.title, here = location.href.split("#")[0];
    box.addEventListener("click", function (e) {
      var a = e.target.closest("[data-net],[data-copy]"); if (!a) return;
      e.preventDefault();
      if (a.hasAttribute("data-copy")) {
        if (navigator.clipboard) navigator.clipboard.writeText(here).then(function () { toast("Link copied"); }, function () { toast(here); });
        else toast(here);
        return;
      }
      var t = encodeURIComponent(title), u = encodeURIComponent(here), net = a.getAttribute("data-net");
      var href = net === "whatsapp" ? "https://wa.me/?text=" + t + "%20" + u : net === "x" ? "https://twitter.com/intent/tweet?text=" + t + "&url=" + u : "https://www.facebook.com/sharer/sharer.php?u=" + u;
      window.open(href, "_blank", "noopener,width=640,height=560");
    });
  });

  /* table of contents highlight */
  var tocLinks = $$(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { tocLinks.forEach(function (a) { a.classList.remove("active"); }); var a = map[en.target.id]; if (a) a.classList.add("active"); } });
    }, { rootMargin: "-20% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { var el = doc.getElementById(id); if (el) io.observe(el); });
  }

  /* YouTube facade: loads the player only when clicked */
  $$(".yt[data-id]").forEach(function (box) {
    var id = box.getAttribute("data-id");
    if (!/^[\w-]{11}$/.test(id)) return;
    if (!box.querySelector("img")) box.insertAdjacentHTML("afterbegin", '<img loading="lazy" alt="" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg">');
    function play() { box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + esc(box.getAttribute("data-title") || "YouTube video") + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'; }
    box.addEventListener("click", play);
    box.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
  });

  /* mobile sticky call to action */
  var sticky = $(".sticky-cta");
  if (sticky && !sessionStorageGet("cta-x")) {
    var shown = false;
    window.addEventListener("scroll", function () {
      if (!shown && window.scrollY > 900) { sticky.classList.add("show"); shown = true; }
    }, { passive: true });
    var x = sticky.querySelector(".x");
    if (x) x.addEventListener("click", function () { sticky.classList.remove("show"); sessionStorageSet("cta-x", "1"); });
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } }

  /* ---------- analysis renderer (home decoder and explorer) ---------- */
  function yes(b) { return b ? "Yes" : "No"; }
  function pfHtml(a) {
    if (!a.groups) return "Too large to factor here";
    if (a.n < 2) return "None";
    if (a.isPrime) return a.s + " is prime";
    return a.groups.map(function (g) { return g.p + (g.e > 1 ? "<sup>" + g.e + "</sup>" : ""); }).join(" × ");
  }
  function quickHtml(a) {
    var kind = a.n === 0 ? "zero" : a.n === 1 ? "one, neither prime nor composite" : (a.even ? "an even " : "an odd ") + (a.isPrime ? "prime number" : a.groups ? "composite number equal to " + pfHtml(a) : "number");
    var R = a.R;
    return esc(a.formatted) + " is " + kind + ". " + (R ? "In numerology it reduces to " + a.root + " (" + esc(R.title) + "), linked with " + esc(R.keywords.join(", ")) + ". " : "") + "In Chinese number lore it is " + a.zh.verdict.toLowerCase() + ".";
  }
  function factsGrid(a) {
    var rows = [
      ["Digit sum", a.sum], ["Numerology root", a.chain.join(" → ")], ["Prime factors", pfHtml(a)],
      ["Divisors", a.tau == null ? "—" : a.tau], ["Binary", a.bin], ["Hexadecimal", a.hex],
      ["Roman numeral", a.roman ? a.roman.html : "—"], ["Chinese", esc(a.chinese)]
    ];
    return '<div class="dec-facts">' + rows.map(function (r) { return "<div><b>" + r[0] + "</b><span>" + r[1] + "</span></div>"; }).join("") + "</div>";
  }
  function decoderOut(a) {
    var link = a.hasPage ? '<a class="btn btn-primary btn-sm" href="' + url(a.s + "/") + '">Open the full ' + esc(a.s) + ' page</a>' : '<a class="btn btn-primary btn-sm" href="' + url("numbers/?n=" + a.s) + '">See the full analysis</a>';
    return '<p class="dec-n">' + esc(a.formatted) + "</p><p>" + quickHtml(a) + "</p>" + factsGrid(a) + '<p class="hero-actions">' + link + ' <a class="btn btn-ghost btn-sm" href="' + url("reading/?n=" + a.s) + '">Is it my number?</a></p>';
  }
  $$("[data-decoder]").forEach(function (box) {
    var input = box.querySelector("input"), out = box.querySelector(".dec-out"), t;
    function run(v) {
      var a = E.analyze(v);
      if (!a) { out.hidden = true; return; }
      out.innerHTML = decoderOut(a); out.hidden = false;
    }
    box.addEventListener("submit", function (e) { e.preventDefault(); var a = E.analyze(input.value); if (a) location.href = a.hasPage ? url(a.s + "/") : url("numbers/?n=" + a.s); else toast("Type a whole number with up to 15 digits."); });
    input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { run(input.value); }, 160); });
    $$("[data-try]", box).forEach(function (b) { b.addEventListener("click", function () { input.value = b.getAttribute("data-try"); run(input.value); input.focus(); }); });
  });

  /* explorer page: full client-side analysis for any number */
  var ex = $("[data-explorer]");
  if (ex) {
    var q = new URLSearchParams(location.search).get("n");
    var exIn = $("#explore-n");
    if (q && exIn) exIn.value = q;
    var target = $("#explorer-result");
    if (q && target) {
      var a = E.analyze(q);
      if (!a) { target.innerHTML = '<p class="form-msg err">That is not a whole number we can read. Use digits only, up to 15 of them.</p>'; }
      else if (a.hasPage) { location.replace(url(a.s + "/")); }
      else { target.innerHTML = explorerHtml(a); doc.title = a.s + " meaning, numerology and number facts | 947947"; }
    }
  }
  function explorerHtml(a) {
    var D = window.N947 || { digits: {} }, R = a.R, uniq = [];
    a.digits.forEach(function (c) { if (uniq.indexOf(c) < 0) uniq.push(c); });
    var top = String(a.top), tdg = D.digits[top] || {};
    var h = '<section class="block"><h2>' + esc(a.formatted) + ' at a glance</h2><p class="answer">' + quickHtml(a) + "</p>";
    h += '<dl class="facts">' +
      row("In words", esc(a.words)) + row("Indian numbering", esc(a.indian) + (a.indianWords ? " (" + esc(a.indianWords) + ")" : "")) +
      row("Digits", a.len + ": " + a.digits.join(" ")) + row("Digit sum", a.sum) + row("Numerology root", a.chain.join(" → ") + (R ? " (" + esc(R.title) + ")" : "")) +
      row("Prime factors", pfHtml(a)) + row("Divisors", a.tau == null ? "—" : a.tau + (a.divisors ? ": " + a.divisors.join(", ") : "")) +
      row("Reversed", esc(a.reversed)) + row("Roman numeral", a.roman ? a.roman.html : "Beyond 3,999,999") + row("Chinese numeral", esc(a.chinese)) +
      row("Read digit by digit", esc(a.zhDigits) + " (" + esc(a.pinyin) + ")") + "</dl></section>";
    if (R) {
      h += '<section class="block prose"><h2>What does ' + esc(a.formatted) + " mean?</h2><p>" + esc(a.formatted) + " reduces to " + a.root + ", " + esc(R.title) + ". " + esc(R.essence) + "</p><ul class=\"digit-list\">";
      uniq.forEach(function (c) { var dg = D.digits[c] || {}; var k = a.counts[+c]; h += '<li><a class="dl-num" href="' + url(c + "/") + '">' + c + "</a><span><strong>" + esc(cap(dg.theme || "")) + "</strong>" + (k > 1 ? ", appearing " + k + " times" : "") + ". " + esc(dg.meaning || "") + "</span></li>"; });
      h += "</ul><h3>Love</h3><p>" + esc(R.love) + " " + esc(cap(tdg.love || "")) + ".</p><h3>Career and money</h3><p>" + esc(R.career) + " " + esc(R.money) + "</p><h3>What to do when you see it</h3><ol class=\"steps\">" +
        R.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "<li>" + esc(tdg.action || "") + "</li></ol>" +
        '<p class="note">Angel-number and numerology meanings are folklore, offered for reflection rather than prediction.</p></section>';
    }
    h += '<section class="block"><h2>Chinese, Japanese and Korean readings</h2><p><span class="tag tag-' + a.zh.tone + '">' + esc(a.zh.verdict) + "</span> in Chinese number lore.</p>";
    if (a.codes.length) h += '<ul class="codes">' + a.codes.slice(0, 6).map(function (c) { return '<li class="tone-' + c.tone + '"><span class="code">' + esc(c.code) + '</span> <span class="cult">' + esc(c.culture) + '</span> <span class="rd">' + esc(c.reading) + '</span> <span class="mn">' + esc(c.meaning) + "</span></li>"; }).join("") + "</ul>";
    h += '<div class="table-wrap"><table class="dtable"><thead><tr><th scope="col">Digit</th><th scope="col">Chinese</th><th scope="col">Japanese</th><th scope="col">Korean</th></tr></thead><tbody>';
    uniq.forEach(function (c) { var dg = D.digits[c]; if (!dg) return; h += '<tr><th scope="row">' + c + '</th><td class="tone-' + dg.zh.tone + '">' + esc(dg.zh.char) + " " + esc(dg.zh.pinyin) + "<br><small>" + esc(dg.zh.note) + '</small></td><td class="tone-' + dg.ja.tone + '">' + esc(dg.ja.char) + " " + esc(dg.ja.reading) + "<br><small>" + esc(dg.ja.note) + '</small></td><td class="tone-' + dg.ko.tone + '">' + esc(dg.ko.char) + " " + esc(dg.ko.reading) + "<br><small>" + esc(dg.ko.note) + "</small></td></tr>"; });
    h += "</tbody></table></div></section>";
    h += '<section class="block"><h2>The maths of ' + esc(a.formatted) + '</h2><div class="table-wrap"><table class="flags"><tbody>' +
      "<tr><th scope=\"row\">Prime</th><td>" + yes(a.isPrime) + "</td><th scope=\"row\">Perfect square</th><td>" + yes(a.square) + "</td></tr>" +
      "<tr><th scope=\"row\">Perfect cube</th><td>" + yes(a.cube) + "</td><th scope=\"row\">Triangular</th><td>" + yes(a.triangular) + "</td></tr>" +
      "<tr><th scope=\"row\">Fibonacci</th><td>" + yes(a.fibonacci) + "</td><th scope=\"row\">Palindrome</th><td>" + yes(a.palindrome) + "</td></tr>" +
      "<tr><th scope=\"row\">Harshad</th><td>" + yes(a.harshad) + "</td><th scope=\"row\">Happy number</th><td>" + yes(a.happy) + "</td></tr>" +
      "<tr><th scope=\"row\">Evil or odious</th><td>" + (a.evil ? "Evil" : "Odious") + " (" + a.ones + " ones)</td><th scope=\"row\">Collatz steps</th><td>" + (a.collatz ? a.collatz.steps + " (peak " + E.fmt(a.collatz.peak) + ")" : "—") + "</td></tr>" +
      '</tbody></table></div><dl class="facts facts-2">' + row("Binary", '<span class="mono-num">' + a.bin + "</span>") + row("Octal", a.oct) + row("Hexadecimal", a.hex) + row("Base 36", a.b36) +
      row("Square root", a.square ? Math.sqrt(a.n) : "≈ " + a.sqrt.toFixed(4)) + row("Cube root", a.cube ? Math.round(a.cbrt) : "≈ " + a.cbrt.toFixed(4)) +
      (a.sigma != null ? row("Sum of divisors", E.fmt(a.sigma)) + row("Euler's totient", E.fmt(a.phi)) : "") + "</dl></section>";
    h += '<section class="leadband"><h2>Is ' + esc(a.formatted) + ' your number? Find yours.</h2><p>Your birth date and full name give five core numbers. See them free, then get the full blueprint by email.</p><a class="btn btn-primary btn-lg" href="' + url("reading/?n=" + a.s) + '">Get my free blueprint</a></section>';
    return h;
    function row(k, v) { return "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>"; }
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  window.N947UI.explorerHtml = explorerHtml;
})();
