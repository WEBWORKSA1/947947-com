#!/usr/bin/env node
// Creates one tiny stub file per number page in _numbers/.
// GitHub Pages (Jekyll) turns each stub into a full page using _layouts/number.html.
// The same set is mirrored in _includes/num/has-page.html (used for internal links) —
// if you change the rules here, change them there too.
//
// Usage: node scripts/make-stubs.mjs            -> writes stubs, prints count
//        node scripts/make-stubs.mjs --list     -> prints the numbers only
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";

const EXTRAS = [1004, 1192, 1314, 1337, 2333, 3150, 4649, 7456, 9413, 9487, 14106, 12345, 54321, 5201314];
const SEQ4 = [1234, 2345, 3456, 4567, 5678, 6789, 9876, 8765, 7654, 6543, 5432, 4321, 3210];

export function hasPage(x) {
  if (!Number.isInteger(x) || x < 0) return false;
  if (x <= 1000) return true;
  if (x >= 1900 && x <= 2100) return true;
  const s = String(x), L = s.length, d = s.split("");
  if (L === 4) {
    if (d[0] === d[2] && d[1] === d[3]) return true;          // ABAB (incl. AAAA)
    if (d[0] === d[3] && d[1] === d[2]) return true;          // ABBA
    if (d[0] === d[1] && d[2] === d[3]) return true;          // AABB
    if (x % 1000 === 0) return true;                          // 1000 … 9000
    if (SEQ4.includes(x)) return true;
  }
  if ((L === 5 || L === 7) && new Set(d).size === 1) return true; // 11111, 1111111 …
  if (L === 6 && x % 1001 === 0) return true;                 // ABCABC, e.g. 947947
  return EXTRAS.includes(x);
}

function allNumbers() {
  const out = new Set();
  for (let x = 0; x <= 1000; x++) out.add(x);
  for (let x = 1900; x <= 2100; x++) out.add(x);
  for (let x = 1001; x <= 9999; x++) if (hasPage(x)) out.add(x);
  for (let a = 1; a <= 9; a++) { out.add(a * 11111); out.add(a * 1111111); }
  for (let k = 100; k <= 999; k++) out.add(k * 1001);
  EXTRAS.forEach(x => out.add(x));
  return [...out].filter(hasPage).sort((a, b) => a - b);
}

const nums = allNumbers();
if (process.argv.includes("--list")) { console.log(nums.join("\n")); process.exit(0); }

const dir = new URL("../_numbers/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const f of readdirSync(dir)) if (f.endsWith(".html")) unlinkSync(new URL(f, dir));
for (const x of nums) writeFileSync(new URL(`${x}.html`, dir), "---\n---\n");
console.log(`wrote ${nums.length} stubs to _numbers/`);
