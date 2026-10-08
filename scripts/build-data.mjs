#!/usr/bin/env node
// Rebuilds _data/areacodes.json and _data/callingcodes.json from open datasets.
// Sources: Google libphonenumber geocoding (Apache-2.0) and mledoze/countries (ODbL).
// Usage: node scripts/build-data.mjs   (needs Node 18+ and internet access)
import { writeFileSync } from "node:fs";

const NANP_URL = "https://raw.githubusercontent.com/google/libphonenumber/master/resources/geocoding/en/1.txt";
const COUNTRIES_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

const get = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(u + " " + r.status); return r.text(); };

const nanpText = await get(NANP_URL);
const countries = JSON.parse(await get(COUNTRIES_URL));

// ---- NANP area codes -------------------------------------------------------
const area = {};          // "947" -> { r: region, c: [top cities] }
const cityCount = {};     // "947" -> { city: count }
for (const line of nanpText.split("\n")) {
  const m = line.match(/^1(\d{3})(\d*)\|(.+)$/);
  if (!m) continue;
  const [, npa, rest, desc] = m;
  if (rest === "") { area[npa] = { r: desc.trim(), c: [] }; continue; }
  const city = desc.replace(/,\s*[A-Z]{2}$/, "").trim();
  if (city.includes(",")) continue; // skip street-level labels
  (cityCount[npa] ||= {})[city] = ((cityCount[npa] || {})[city] || 0) + 1;
}
for (const [npa, counts] of Object.entries(cityCount)) {
  if (!area[npa]) continue;
  area[npa].c = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);
}
// Caribbean and Pacific NANP members (area codes live in the +1 "suffixes")
const nanpCountry = {};
for (const c of countries) {
  if (c.idd?.root !== "+1" || ["US", "CA"].includes(c.cca2)) continue;
  for (const s of c.idd.suffixes || []) nanpCountry[s] = c.name.common;
}
for (const [npa, name] of Object.entries(nanpCountry)) {
  if (!area[npa]) area[npa] = { r: name, c: [] };
}
// Small corrections to the upstream labels
if (area["257"]) area["257"].r = "British Columbia";
// Curated detail for the site's namesake code (sources in docs/RESEARCH.md)
area["947"] = {
  r: "Michigan",
  c: ["Troy", "Southfield", "Farmington Hills", "Pontiac", "Rochester Hills"],
  note: "Overlay of area code 248 (Oakland County), in service since September 7, 2002"
};
const sortedArea = Object.fromEntries(Object.keys(area).sort().map(k => [k, area[k]]));

// ---- Country calling codes -------------------------------------------------
const calling = {};
const add = (code, name) => { (calling[code] ||= []); if (!calling[code].includes(name)) calling[code].push(name); };
for (const c of countries) {
  const root = c.idd?.root; if (!root) continue;
  const name = c.name.common;
  const suf = c.idd.suffixes || [];
  if (root === "+1") { add("1", name); continue; }
  if (root === "+7") { add("7", name); continue; }
  if (!suf.length) { add(root.slice(1), name); continue; }
  for (const s of suf) {
    const code = (root + s).slice(1);
    if (code.length <= 3) add(code, name);
  }
}
const sortedCalling = Object.fromEntries(Object.keys(calling).sort((a, b) => a.localeCompare(b, "en", { numeric: true })).map(k => [k, calling[k]]));

writeFileSync(new URL("../_data/areacodes.json", import.meta.url), JSON.stringify(sortedArea));
writeFileSync(new URL("../_data/callingcodes.json", import.meta.url), JSON.stringify(sortedCalling));
console.log("area codes:", Object.keys(sortedArea).length, "calling codes:", Object.keys(sortedCalling).length);
