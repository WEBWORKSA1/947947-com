/* 947947 number engine (browser). Mirrors the build-time Liquid engine in
   _includes/num/compute.html so numbers without a page get the same analysis. */
(function (w) {
  "use strict";
  var D = function () { return w.N947 || { digits: {}, roots: {}, codes: [] }; };

  var EXTRAS = [1004, 1192, 1314, 1337, 2333, 3150, 4649, 7456, 9413, 9487, 14106, 12345, 54321, 5201314];
  var SEQ4 = [1234, 2345, 3456, 4567, 5678, 6789, 9876, 8765, 7654, 6543, 5432, 4321, 3210];

  function hasPage(x) {
    if (!Number.isInteger(x) || x < 0) return false;
    if (x <= 1000) return true;
    if (x >= 1900 && x <= 2100) return true;
    var s = String(x), L = s.length, d = s.split("");
    if (L === 4) {
      if (d[0] === d[2] && d[1] === d[3]) return true;
      if (d[0] === d[3] && d[1] === d[2]) return true;
      if (d[0] === d[1] && d[2] === d[3]) return true;
      if (x % 1000 === 0) return true;
      if (SEQ4.indexOf(x) > -1) return true;
    }
    if ((L === 5 || L === 7) && new Set(d).size === 1) return true;
    if (L === 6 && x % 1001 === 0) return true;
    return EXTRAS.indexOf(x) > -1;
  }

  function clean(input) {
    var s = String(input == null ? "" : input).replace(/[\s,._:'’-]/g, "");
    if (!/^\d{1,15}$/.test(s)) return null;
    s = s.replace(/^0+(?=\d)/, "");
    return s;
  }
  function digitSum(s) { var t = 0; for (var i = 0; i < s.length; i++) t += +s[i]; return t; }
  function reduce(v, keepMaster) {
    var chain = [v];
    while (v > 9 && !(keepMaster !== false && (v === 11 || v === 22 || v === 33))) { v = digitSum(String(v)); chain.push(v); }
    return { value: v, chain: chain };
  }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function fmtBig(s) { s = String(s); return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s; }
  function indian(s) { if (s.length <= 3) return s; var t = s.slice(-3), h = s.slice(0, -3); return h.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + t; }

  function factorize(n) {
    var f = [], m = n;
    if (n < 2) return f;
    while (m % 2 === 0) { f.push(2); m /= 2; }
    for (var p = 3; p * p <= m; p += 2) { while (m % p === 0) { f.push(p); m /= p; } }
    if (m > 1) f.push(m);
    return f;
  }
  function group(f) { var g = []; f.forEach(function (p) { var last = g[g.length - 1]; if (last && last.p === p) last.e++; else g.push({ p: p, e: 1 }); }); return g; }
  function divisorsFrom(g) {
    var ds = [1];
    g.forEach(function (x) { var nd = []; ds.forEach(function (d) { var m = d; for (var k = 0; k <= x.e; k++) { nd.push(m); m *= x.p; } }); ds = nd; });
    return ds.sort(function (a, b) { return a - b; });
  }
  function toBase(n, b) { return n.toString(b).toUpperCase(); }

  var ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
  var TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function words3(g) {
    var h = Math.floor(g / 100), r = g % 100, out = [];
    if (h) out.push(ONES[h] + " hundred");
    if (r) out.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? "-" + ONES[r % 10] : ""));
    return out.join(" ");
  }
  function words(n) {
    if (n === 0) return "zero";
    var scales = ["", " thousand", " million", " billion", " trillion"], parts = [], i = 0;
    while (n > 0 && i < scales.length) { var g = n % 1000; if (g) parts.unshift(words3(g) + scales[i]); n = Math.floor(n / 1000); i++; }
    return parts.join(" ");
  }
  function indianWords(n) {
    if (n === 0) return "zero";
    var crore = Math.floor(n / 1e7), lakh = Math.floor(n / 1e5) % 100, thousand = Math.floor(n / 1000) % 100, rest = n % 1000, out = [];
    if (crore) out.push((crore >= 1000 ? words(crore) : words3(crore % 1000) || words(crore)) + " crore");
    if (lakh) out.push(words3(lakh) + " lakh");
    if (thousand) out.push(words3(thousand) + " thousand");
    if (rest) out.push(words3(rest));
    return out.join(" ");
  }
  var RV = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1], RS = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  function roman(n) { var o = ""; for (var i = 0; i < RV.length; i++) { while (n >= RV[i]) { o += RS[i]; n -= RV[i]; } } return o; }
  function romanFull(n) {
    if (n < 1 || n > 3999999) return null;
    if (n <= 3999) return { html: roman(n), text: roman(n) };
    var hi = roman(Math.floor(n / 1000)), lo = n % 1000 ? roman(n % 1000) : "";
    return { html: '<span class="ovl">' + hi + "</span>" + lo, text: hi.split("").map(function (c) { return c + "̅"; }).join("") + lo };
  }
  function fromRoman(str) {
    var s = String(str).toUpperCase().replace(/[^MDCLXVI]/g, ""), map = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }, t = 0;
    for (var i = 0; i < s.length; i++) { var v = map[s[i]], nx = map[s[i + 1]] || 0; t += v < nx ? -v : v; }
    return s && roman(t) === s ? t : null;
  }
  var ZH = "零一二三四五六七八九";
  function chinese(n) {
    if (n === 0) return "零";
    function four(g, leadZero) {
      var units = ["千", "百", "十", ""], ds = String(g).padStart(4, "0").split("").map(Number), out = "", zero = false, started = false;
      for (var i = 0; i < 4; i++) {
        var dgt = ds[i];
        if (dgt === 0) { if (started || leadZero) zero = true; continue; }
        if (zero) { out += "零"; zero = false; }
        out += ZH[dgt] + units[i]; started = true;
      }
      return out;
    }
    var groups = [], units = ["", "万", "亿", "万亿"], m = n, i = 0, out = "";
    while (m > 0) { groups.push(m % 10000); m = Math.floor(m / 10000); }
    for (i = groups.length - 1; i >= 0; i--) {
      var g = groups[i];
      if (g === 0) { if (out && !/零$/.test(out)) out += "零"; continue; }
      var needZero = out !== "" && g < 1000;
      out += (needZero && !/零$/.test(out) ? "零" : "") + four(g, false) + units[i];
    }
    out = out.replace(/零+$/, "");
    if (/^一十/.test(out)) out = out.slice(1);
    return out;
  }
  var PY = ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"];
  var ZW = [0, 0, 1, 1, -3, 0, 2, 0, 3, 2];

  function analyze(input) {
    var s = clean(input); if (s === null) return null;
    var n = Number(s), len = s.length, d = s.split(""), data = D();
    var sum = digitSum(s), prod = d.reduce(function (a, c) { return a * +c; }, 1);
    var red = (n === 11 || n === 22 || n === 33) ? { value: n, chain: [n] } : reduce(sum);
    var chain = len === 1 ? [n] : [n].concat(red.chain);
    if (n === 11 || n === 22 || n === 33) chain = [n];
    var f = n <= 1e14 ? factorize(n) : null, g = f ? group(f) : null;
    var tau = g ? g.reduce(function (a, x) { return a * (x.e + 1); }, 1) : null;
    var sigma = g ? g.reduce(function (a, x) { return a * (Math.pow(x.p, x.e + 1) - 1) / (x.p - 1); }, 1) : null;
    var phi = g ? g.reduce(function (a, x) { return a / x.p * (x.p - 1); }, n) : null;
    var divs = g && tau <= 64 && n > 0 ? divisorsFrom(g) : null;
    var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; d.forEach(function (c) { counts[+c]++; });
    var top = 0; for (var k = 0; k < 10; k++) if (counts[k] > counts[top]) top = k; if (!counts[top]) top = +d[0];
    var rev = d.slice().reverse().join("");
    var sq = Math.floor(Math.sqrt(n)), cb = Math.round(Math.cbrt(n));
    var t8 = 8 * n + 1, st = Math.floor(Math.sqrt(t8));
    var fib = (function () { var a = 0, b = 1; while (b < n) { var c = a + b; a = b; b = c; } return n === 0 || n === b || n === 1; })();
    var happy = (function () { var v = n, seen = {}; while (v !== 1 && !seen[v]) { seen[v] = 1; v = String(v).split("").reduce(function (a, c) { return a + c * c; }, 0); } return v === 1; })();
    var collatz = (function () { if (n < 2 || n > 1e12) return null; var v = n, steps = 0, peak = n; while (v !== 1 && steps < 5000) { v = v % 2 ? 3 * v + 1 : v / 2; if (v > peak) peak = v; steps++; } return { steps: steps, peak: peak }; })();
    var pat = "", rep = len > 1 && new Set(d).size === 1, half = len / 2, tandem = len % 2 === 0 && len > 1 && s.slice(0, half) === s.slice(half);
    if (len === 4 && !rep) { if (d[0] === d[2] && d[1] === d[3]) pat = "ABAB"; else if (d[0] === d[3] && d[1] === d[2]) pat = "ABBA"; else if (d[0] === d[1] && d[2] === d[3]) pat = "AABB"; }
    var up = len > 2, down = len > 2; for (var i = 1; i < len; i++) { if (+d[i] !== +d[i - 1] + 1) up = false; if (+d[i] !== +d[i - 1] - 1) down = false; }
    var zs = d.reduce(function (a, c) { return a + ZW[+c]; }, 0), hits = [];
    (data.codes || []).forEach(function (cd) {
      if ((cd.code.length > 1 || cd.code === s) && s.indexOf(cd.code) > -1) {
        hits.push(cd);
        if (/Chinese|Cantonese/.test(cd.culture)) zs += cd.tone === "good" ? 2 : (cd.tone === "bad" || cd.tone === "rude") ? -2 : 0;
      }
    });
    var avg = zs / len, zh = avg >= 1.2 ? ["Very auspicious", "good"] : avg >= .4 ? ["Auspicious", "good"] : avg > -.4 ? ["Neutral to mixed", "neutral"] : ["Usually avoided", "bad"];
    var arm = d.reduce(function (a, c) { return a + Math.pow(+c, len); }, 0) === n && len > 1;
    var ones = n.toString(2).split("").filter(function (c) { return c === "1"; }).length;
    return {
      s: s, n: n, len: len, digits: d, sum: sum, product: prod, root: red.value, chain: chain,
      digitalRoot: n === 0 ? 0 : 1 + (n - 1) % 9, R: data.roots[String(red.value)] || null,
      factors: f, groups: g, isPrime: !!(f && n > 1 && f.length === 1), tau: tau, sigma: sigma, phi: phi, divisors: divs,
      aliquot: sigma != null ? sigma - n : null, even: n % 2 === 0, reversed: rev, palindrome: len > 1 && rev === s,
      repdigit: rep, tandem: tandem, pattern: pat, seqUp: up, seqDown: down, counts: counts, top: top,
      square: sq * sq === n, sqrt: Math.sqrt(n), cube: cb * cb * cb === n, cbrt: Math.cbrt(n), triangular: n > 0 && st * st === t8,
      fibonacci: fib, happy: happy, harshad: n > 0 && n % sum === 0, armstrong: arm, evil: ones % 2 === 0, ones: ones,
      collatz: collatz, bin: n.toString(2), oct: n.toString(8), hex: toBase(n, 16), b36: n.toString(36),
      words: n < 1e15 ? words(n) : "", indianWords: n < 1e12 ? indianWords(n) : "", roman: romanFull(n), chinese: n < 1e16 ? chinese(n) : "",
      zhDigits: d.map(function (c) { return ZH[+c]; }).join(""), pinyin: d.map(function (c) { return PY[+c]; }).join(" "),
      zh: { verdict: zh[0], tone: zh[1], score: zs }, codes: hits, indian: indian(s), formatted: fmtBig(s), hasPage: hasPage(n)
    };
  }

  /* ---------- personal numerology ---------- */
  var PYTH = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  var CHAL = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1, j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2, s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7 };
  function normName(name) { return String(name || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, ""); }
  function isVowel(ch, word, idx) {
    if ("aeiou".indexOf(ch) > -1) return true;
    if (ch !== "y") return false;
    var prev = word[idx - 1], next = word[idx + 1];
    return !(prev && "aeiou".indexOf(prev) > -1) && !(next && "aeiou".indexOf(next) > -1);
  }
  function nameNumbers(name, system) {
    var map = system === "chaldean" ? CHAL : PYTH, full = 0, vow = 0, con = 0;
    String(name || "").split(/\s+/).forEach(function (word) {
      var w = normName(word);
      for (var i = 0; i < w.length; i++) { var v = map[w[i]] || 0; full += v; if (isVowel(w[i], w, i)) vow += v; else con += v; }
    });
    if (!full) return null;
    return { expression: reduce(full), soul: reduce(vow || 0), personality: reduce(con || 0), raw: { full: full, vowels: vow, consonants: con } };
  }
  function lifePath(day, month, year) {
    day = +day; month = +month; year = +year;
    if (!day || !month || !year) return null;
    var a = reduce(month).value, b = reduce(day).value, c = reduce(year).value;
    var total = a + b + c, r = reduce(total);
    return { value: r.value, chain: [a, b, c, total].concat(r.chain.slice(1)), parts: { month: a, day: b, year: c } };
  }
  function personalYear(day, month, year) {
    var r = reduce(reduce(+month, false).value + reduce(+day, false).value + reduce(+year, false).value, false);
    return r.value;
  }
  function birthdayNumber(day) { return reduce(+day).value; }
  var FAMILIES = [[1, 5, 7], [2, 4, 8], [3, 6, 9]];
  function base(v) { return v === 11 ? 2 : v === 22 ? 4 : v === 33 ? 6 : v; }
  function compat(a, b) {
    a = base(a); b = base(b);
    if (!a || !b) return null;
    if (a === b) return { level: "strong", label: "Strong match", note: "Same root: you recognise each other's motives quickly, though you may share the same blind spots." };
    var same = FAMILIES.some(function (fam) { return fam.indexOf(a) > -1 && fam.indexOf(b) > -1; });
    if (same) return { level: "strong", label: "Natural match", note: "You sit in the same number family, so your priorities tend to line up without much negotiation." };
    var friendly = { 1: [3, 9], 2: [6, 9], 3: [1, 5], 4: [6, 7], 5: [3, 9], 6: [2, 4], 7: [4, 9], 8: [6, 3], 9: [1, 2, 7] };
    if ((friendly[a] || []).indexOf(b) > -1 || (friendly[b] || []).indexOf(a) > -1) return { level: "good", label: "Complementary", note: "Different strengths that fill each other's gaps; it works best when you name who leads on what." };
    return { level: "work", label: "Growth match", note: "Different rhythms. It asks for patience and clear communication, and often teaches the most." };
  }
  function luckyNumbers(lp, expr, bday) {
    var set = [lp, expr, bday].filter(Boolean).map(base), out = [];
    set.forEach(function (v) { if (out.indexOf(v) < 0) out.push(v); });
    set.forEach(function (v) { [v + 9, v + 18].forEach(function (x) { if (out.indexOf(x) < 0 && out.length < 6) out.push(x); }); });
    return out;
  }

  w.NumEngine = {
    analyze: analyze, clean: clean, hasPage: hasPage, fmt: fmt, fmtBig: fmtBig, words: words, indianWords: indianWords,
    roman: romanFull, fromRoman: fromRoman, chinese: chinese, toBase: toBase, factorize: factorize, group: group,
    divisorsFrom: divisorsFrom, reduce: reduce, digitSum: digitSum, nameNumbers: nameNumbers, lifePath: lifePath,
    personalYear: personalYear, birthdayNumber: birthdayNumber, compat: compat, luckyNumbers: luckyNumbers, base: base
  };
})(window);
