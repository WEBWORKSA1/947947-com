# 947947.com — phase-wise build prompts

Copy each prompt into your AI builder in order. Each phase ends with acceptance checks; do not start the next phase until they pass. Phases 1–12 describe what is already built in this repository; phases 13–18 are the growth roadmap.

**Fixed requirements for every phase**
- Domain: 947947.com. Hosting: GitHub Pages, free plan, repo `WEBWORKSA1/947947-com`, built by GitHub Pages' own Jekyll (no Actions workflow needed).
- Every page shows a top bar: "Contact, if you are interested in this website / domain name / Sponsorship / Advertisement / Partnership" linking to https://web.works/contact.
- Every form posts to one private inbox through FormSubmit. The address must never appear in HTML, visible text or the repository; build it at runtime from obfuscated character codes, then switch to the FormSubmit alias.
- Google AdSense publisher `ca-pub-6620975821265271`; `ads.txt` at the root.
- Avoid any trademark use of "947" (radio, events, 94.7 FM imagery). Include a trademark and copyright notice.

---

## Phase 1 — Positioning and research
> Research the number 947947 and its parts (947, 94, 9, 4, 7) across maths, telecom (area codes, country codes, mobile prefixes), postal codes, Chinese, Japanese, Korean, Thai, Vedic, Western and biblical number traditions, history (the year 947), astronomy and brands that use "947" or "94.7". Then research the numeric-domain market and the monetisation economics of numerology, angel-number, number-fact and area-code sites (search volumes, RPMs, affiliate CPAs). Score at least five site concepts on demand, revenue per visit, lead value, competition, domain fit and static-hosting fit. Output `docs/RESEARCH.md` with sources for every fact.
>
> **Accept when:** every claim has a source URL or is marked computed; the winning concept has a revenue table with conservative, base and bold cases.

## Phase 2 — Competitive audit
> Visit at least 25 leading sites across numerology, angel numbers, psychic lead-gen platforms, number-fact references, calculators, area-code lookups, number sellers, donation platforms and contest platforms. For each, record features, forms, page anatomy, trust signals, monetisation and design. Produce a must-have checklist and the best lead-form patterns.
>
> **Accept when:** the audit table lists 25+ sites and each adopted feature is traceable to at least one site.

## Phase 3 — Architecture
> Build a Jekyll 3.10-compatible site (GitHub Pages' default versions, safe mode, no custom plugins). Use a `numbers` collection where each number is a two-line stub (`---\n---`) in `_numbers/`, rendered by `_layouts/number.html`, permalink `/:name/` so pages live at `/947/`. Generate stubs with `scripts/make-stubs.mjs` for: 0–1000, 1900–2100, four-digit ABAB/ABBA/AABB patterns, round thousands and sequences, 5- and 7-digit repdigits, all 900 ABCABC numbers and famous codes. Mirror the same rule in `_includes/num/has-page.html`. Make every internal link relative (`{{ r }}path/`) using `_includes/rel.html` so the site works on github.io and on the custom domain without changes; the 404 page sets a `<base>` with a tiny script. Keep all editable settings in `_data/settings.yml`.
>
> **Accept when:** `jekyll build --safe` with Jekyll 3.10.0 and Liquid 4.0.4 passes; build time stays under 5 minutes; no absolute internal links.

## Phase 4 — Design system
> Create a distinctive "computation notebook" identity: cool sage paper (#f2f5f0), prussian ink (#14233f), jade actions (#176a5a), red pencil (#b8332a) for annotations only, Archivo for numbers and UI, Literata for reading. Grid-paper hero, the number as the hero, and a Lo Shu square that plots each number's digits with an animated path. Light and dark themes (system plus toggle), visible focus, reduced-motion support, no horizontal scroll at 390px, line length under 80 characters.
>
> **Accept when:** screenshots at 1366px and 390px show no overflow; contrast passes WCAG AA for text.

## Phase 5 — Number engine
> In Liquid (`_includes/num/compute.html`), compute for each number: digits, digit sum and product, numerology reduction keeping 11/22/33, digital root, reverse, palindrome, repdigit, doubled and ABCABC patterns, sequences, integer square and cube roots, triangular, Fibonacci, prime factorisation by trial division, divisor count and list (generated from the factorisation), σ, φ, perfect/abundant/deficient, square-free, power of two, binary, octal, hex, base 36, English words, ordinal, Roman numerals including vinculum up to 3,999,999, Harshad, Armstrong, happy, evil/odious, clock time, seconds as a duration, other numeral systems (Chinese, Devanagari, Eastern Arabic, Thai, Bengali), Indian grouping, Chinese luck score, famous code detection, area code, calling code, special service codes and, for 1900–2100, the Chinese zodiac. Use only filters available in Liquid 4.0.4 and Jekyll 3.10 (no `remove_last`, `find`, `sum`). Mirror everything in `assets/js/engine.js` for numbers without a page.
>
> **Accept when:** values for 0, 1, 11, 947, 1111, 2026 and 947947 match a reference implementation; no Liquid errors.

## Phase 6 — Number page template
> Sections in order: breadcrumb; hero with the number, a 40–60 word answer and fact tags; Lo Shu figure; sponsor slot; facts table; "Is N good for you?" birth-date widget; meaning (digits, love, career and money, spiritual and twin flame, what to do); numerology root card; Chinese/Japanese/Korean table and famous codes; maths (factors, divisors, property grid, bases, powers, numeral systems); codes, dates and times; lead band; FAQ with FAQPage schema; related numbers; share, cite and report-an-error; sticky rail with contents and lookup. Repdigits draw their reading from the repeated digit (and 11/22/33 for even-length 1s, 2s and 3s). Add the 947947 report and the 947 notes as special includes.
>
> **Accept when:** titles are unique per number class; every page has computed facts in HTML; folklore is labelled as folklore.

## Phase 7 — Hubs, navigation and SEO
> Build the explorer (`/numbers/`, with client-side analysis for any number up to 15 digits), range hubs (0–99 … 900–999), years, ABCABC and patterns hubs, angel numbers, numerology roots, tools and guides hubs. Add canonical URLs to 947947.com, Open Graph tags, WebSite + SearchAction, BreadcrumbList, FAQPage, Article and WebApplication schema, a Liquid `sitemap.xml` covering every page and number, `robots.txt`, `manifest.webmanifest` and an SVG favicon.
>
> **Accept when:** every number page is reachable within three clicks of the home page and listed in the sitemap.

## Phase 8 — Tools
> Twelve browser-only tools with their working shown: life path, name numerology (Pythagorean and Chaldean), angel number decoder, lucky numbers, lucky phone number check, compatibility, personal year (with 12 personal months), prime factorisation (to 10^14), base converter with binary steps, Roman numerals both ways (vinculum), number to words (English, Indian lakh/crore, Chinese) and the 1001 trick. Each tool page has an explanation, an FAQ with schema and links to the other tools.
>
> **Accept when:** an automated browser test fills and submits every tool without console errors.

## Phase 9 — Lead generation
> Build `/reading/`, a four-step funnel: focus (tap to choose), birth date (instant life path teaser), full name (instant expression teaser), then first name, email, optional WhatsApp, country, session interest, budget, required privacy consent and an unticked newsletter opt-in, plus a honeypot. On submit, score the lead (HOT/WARM/NEW) into the email subject, send all fields with page, referrer and UTM attribution, send the visitor an autoresponse summary through FormSubmit's `_autoresponse`, and render the full blueprint on screen whatever the network result. Add a B2B `/business/` audit with packages and a qualifying form, plus mini lead hooks on every number page, the home page and tools.
>
> **Accept when:** a mocked submission produces a subject like "[HOT] Number blueprint lead — Ada — life path 11" and the inbox address appears in no HTML file.

## Phase 10 — Monetisation
> AdSense Auto ads in the head plus optional manual slots (top, mid, side, foot) configured by slot ID in `settings.yml`; when a slot is empty, show a labelled house promotion (sponsor this page, get a reading, support us, enter the contest). Add `/advertise/` with placements, founding rates, banned categories and an enquiry form; partner offers shown with disclosure after the reading; `/videos/` with a click-to-load YouTube facade fed by `settings.yml` and topic playlists until the channel launches.
>
> **Accept when:** with no slot IDs configured, no empty ad boxes appear; with a slot ID, an `<ins class="adsbygoogle">` unit renders.

## Phase 11 — Support, contests and hiring
> `/support/` with purpose tiers ($5 operations, $15/month keep it free, $50 promotion, $100 hiring talent, $250 contest prizes, any amount), an allocation bar, payment links from `settings.yml`, a pledge dialog fallback when no payment link exists, a not-tax-deductible disclosure and a supporters wall. `/contests/` with prizes, categories, judging weights and an entry form; `/contests/rules/` with eligibility, skill judging, a skill-testing question for Canadian winners and the Quebec RACJ clause. `/careers/` with seven roles, indicative pay and an application form.
>
> **Accept when:** every form submits through the same private channel and shows a success state.

## Phase 12 — Trust, legal and launch
> Write `/about/` (methods, editorial policy, AI-assistance disclosure, funding), `/privacy/` (forms, FormSubmit, AdSense cookies with opt-out links, YouTube privacy mode, rights, retention, children), `/terms/` and `/disclaimer/` (trademark notice naming the 94.7/947 broadcasters generically, nominative use, copyright, takedown, affiliate disclosure). Run link checks, a scan proving the inbox address is absent, a mobile overflow scan and a full Jekyll build. Push to `main`, create `gh-pages` from `main` to publish, then follow the go-live checklist in `README.md`.
>
> **Accept when:** the live github.io site returns 200 for the home page, a number page, `ads.txt` and `sitemap.xml`.

---

## Growth roadmap

## Phase 13 — Custom domain and approvals
> Point 947947.com to GitHub Pages (A records 185.199.108.153/109/110/111, `www` CNAME to `webworksa1.github.io`), set the custom domain in Settings → Pages, enforce HTTPS, verify in Google Search Console, submit the sitemap, apply to AdSense, enable the certified consent message, then apply to psychic and numerology affiliate programmes and paste their links into `settings.yml`.

## Phase 14 — Email automation
> Connect the blueprint form to an email platform (for example MailerLite or Brevo) through a serverless relay, send a three-email welcome sequence and the monthly number forecast, and tag leads by focus and life path.

## Phase 15 — Languages
> Translate the top 300 number pages and all tools into Simplified Chinese, Traditional Chinese, Japanese, Korean, Hindi and Spanish under `/zh/`, `/zh-hant/`, `/ja/`, `/ko/`, `/hi/`, `/es/` with hreflang tags; hire native translators through `/careers/`.

## Phase 16 — Video
> Publish one YouTube Short per popular number (111 → 9999, 520, 1314, 947947), embed each on its page by adding the ID to `settings.yml`, and link back in every description.

## Phase 17 — Data depth
> Add area-code pages for every North American code (city lists, overlays, time zones), country calling code pages, and a "where did you see this number?" reader-submission feature moderated before publishing.

## Phase 18 — Scale beyond GitHub Pages
> When number pages exceed about 5,000, move the build to a host with a longer build window or prebuilt output (Cloudflare Pages or Netlify), keep the same Liquid templates, and add 4-digit and selected 6-digit ranges where search data supports them.
