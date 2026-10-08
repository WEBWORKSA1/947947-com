# 947947.com — every number, decoded

A number-meaning reference: 2,402 number pages, 12 free tools and 10 guides that read every number through maths, numerology, angel-number folklore, Chinese, Japanese, Korean and Thai wordplay, and phone codes and dates. Monetised with Google AdSense, a personal-reading lead funnel, a B2B number audit, sponsorships, YouTube and reader support.

- **Live (GitHub Pages):** https://webworksa1.github.io/947947-com/
- **Production domain:** https://947947.com (see the go-live checklist)
- **Research and business case:** [`docs/RESEARCH.md`](docs/RESEARCH.md)
- **Phase-wise build prompts:** [`docs/BUILD-PROMPTS.md`](docs/BUILD-PROMPTS.md)

## How it is built

GitHub Pages builds the site itself with Jekyll (free plan, no Actions workflow). Each number page is a two-line stub in `_numbers/`; Jekyll turns it into a full page with `_layouts/number.html`, which computes every fact at build time. A full build takes about 3.5–4 minutes.

```
_config.yml              site settings (production URL, collections)
_data/settings.yml       ONE file for AdSense slots, form alias, payment links, YouTube, partners, contest
_data/digits.yml         meanings of 0–9 across traditions
_data/roots.yml          numerology roots 1–9, 11, 22, 33
_data/codes.yml          famous number codes (Chinese, Japanese, Korean, Thai, Western)
_data/areacodes.json     North American area codes (from libphonenumber)
_data/callingcodes.json  country calling codes
_includes/num/           the Liquid number engine
_layouts/                number, page, guide, tool and range layouts
_numbers/                2,402 number stubs (generated)
assets/                  CSS, JavaScript (engine, app, forms, tools), images
scripts/                 make-stubs.mjs, build-data.mjs (not published)
docs/                    research and build prompts (not published)
```

## Editing

- **Monetisation and contact settings:** edit `_data/settings.yml` on GitHub and commit. AdSense manual units appear when you paste slot IDs; payment buttons switch from the pledge form to your links as soon as you add them; YouTube videos appear on `/videos/` when you list their IDs.
- **Add or remove number pages:** change the rules in `scripts/make-stubs.mjs` and the matching `_includes/num/has-page.html`, run `node scripts/make-stubs.mjs`, and commit `_numbers/`. Keep the total under about 5,000 pages so the GitHub Pages build stays well inside its 10-minute limit.
- **Add a guide:** copy any file in `guides/`, change the front matter and text, and add it to `_data/guides.yml`.
- **Refresh phone data:** `node scripts/build-data.mjs` (Node 18+).
- **Local preview:** `bundle exec jekyll serve` with the `github-pages` gem, or any Jekyll 3.10 install.

## Publishing updates

GitHub Pages publishes the `gh-pages` branch. After committing to `main`, open a pull request from `main` into `gh-pages` and merge it, or change Settings → Pages → Source to `main` / root and publish straight from `main`.

## Go-live checklist

1. **Custom domain.** At your registrar, add A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a `www` CNAME to `webworksa1.github.io`. Then in Settings → Pages enter `947947.com` and tick *Enforce HTTPS*. All internal links are relative, so nothing else changes.
2. **Social image.** Upload `assets/img/og.png` (1200 × 630; the SVG source is `assets/img/og.svg`).
3. **Forms.** Submit any form once on the live site (once on github.io and again after the custom domain is live). FormSubmit emails an activation link to the inbox; click it. FormSubmit then offers a random alias: paste it into `forms.alias` in `_data/settings.yml` so the inbox address is no longer needed at all.
4. **Search Console.** Verify the domain and submit `https://947947.com/sitemap.xml`.
5. **AdSense.** Add 947947.com in AdSense (`ads.txt` is already at the root), turn on Auto ads and enable the certified consent message for the EEA, UK and Switzerland. Optional: create four display units and paste their slot IDs into `settings.yml`.
6. **Payments.** Paste Stripe Payment Links, PayPal, Buy Me a Coffee, Ko-fi, GitHub Sponsors or a UPI ID into `settings.yml`.
7. **Partners.** After approval, add psychic or numerology reading, report, vanity-number and business-phone affiliate links under `partners`.
8. **YouTube.** Add the channel URL and video IDs under `youtube`.
9. **Contest.** Before announcing prizes, confirm the rules with a lawyer for the countries you allow. Contests open to Quebec residents may require a declaration to the Régie des alcools, des courses et des jeux, and Canadian winners must answer a skill-testing question (already in the rules).

## Trademark and copyright

"947947" is used as a domain name and a number. The site is not affiliated with any broadcaster on 94.7 FM, the Johannesburg station known as 947, its events, or any company using 947 in its name; third-party names are used only to state facts. Original text, design and code © 947947.com. Phone-code data: Google libphonenumber (Apache 2.0) and mledoze/countries (ODbL).
