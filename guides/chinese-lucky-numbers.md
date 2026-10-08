---
title: "Chinese lucky and unlucky numbers, plus Chinese number slang"
crumb: "Chinese lucky numbers"
permalink: /guides/chinese-lucky-numbers/
description: "Why 8 is lucky and 4 is avoided in Chinese culture, what 520, 1314 and 666 mean in Chinese slang, and how number beliefs affect prices, phone numbers and buildings."
lede: "In Chinese, numbers are judged by what they sound like. That simple rule explains why 8 is prized, 4 is avoided and 520 means I love you."
date_published: 2026-10-08
---
{% include rel.html %}
Mandarin and Cantonese have many words that sound alike, so a number can echo a lucky or unlucky word. Over centuries this turned into a rich culture of number preferences that still shapes prices, phone numbers, wedding dates and even building designs across Greater China and the Chinese diaspora.

## The digits, one by one

| Digit | Character | Sounds like | Feeling |
|---|---|---|---|
{%- for k in (0..9) %}{% assign kk = k | append: "" %}{% assign dg = site.data.digits[kk] %}
| [{{ k }}]({{ r }}{{ k }}/) | {{ dg.zh.char }} {{ dg.zh.pinyin }} | {{ dg.zh.sound }} | {% if dg.zh.tone == "good" %}Lucky{% elsif dg.zh.tone == "bad" %}Avoided{% else %}Neutral or mixed{% endif %} |
{%- endfor %}

### Why 8 is the luckiest number

八 (bā) sounds like 发 (fā), the verb for prospering or getting rich. The preference is famous: the Beijing Olympics opened at 8:08 pm on 8 August 2008, and number plates, phone numbers and addresses full of 8s command premium prices.

### Why 4 is avoided

四 (sì) sounds close to 死 (sǐ), death. Many buildings in Chinese-speaking cities skip fourth floors, or label them differently, and numbers containing 4 sell for less. Cantonese speakers also avoid 14, which sounds like "will certainly die", and 24, "easy to die". There are exceptions: Teochew speakers, for example, consider 4 lucky.

### Nine and six

九 (jiǔ) sounds like 久 (jiǔ), long-lasting, so 9 is a favourite for weddings and anniversaries. 六 (liù) echoes 流 (liú), flowing smoothly, which is why young Chinese internet users type [666]({{ r }}666/) to mean "awesome" or "nicely done", the opposite of its Western reputation.

<!--mid-->

## Number slang you will see online

Chinese internet users turn numbers into words by sound. Some are sweet, some are rude.

| Code | Sounds like | Meaning |
|---|---|---|
{%- for cd in site.data.codes %}{% if cd.culture contains "Chinese" or cd.culture contains "Cantonese" %}{% assign cl = cd.code | size %}{% if cl > 1 %}
| [{{ cd.code }}]({{ r }}{{ cd.code }}/) | {{ cd.reading }} | {{ cd.meaning }}{% if cd.culture contains "Taiwan" %} (Taiwan){% endif %}{% if cd.tone == "rude" %} — rude{% endif %} |
{%- endif %}{% endif %}{% endfor %}

May 20 (5/20) has become an unofficial Valentine's Day in mainland China because 520 sounds like 我爱你, "I love you".

## Where number beliefs matter in practice

- **Prices.** Prices ending in 8 feel generous; prices with 4 can feel unlucky. A retailer might choose ¥888 over ¥899.
- **Phone numbers and addresses.** Mobile operators and property developers in China price "good" numbers higher. Buyers of numeric web domains in China also avoid 4 and 0.
- **Dates.** Weddings and launches favour dates with 8, 6 or 9 and avoid the seventh lunar month, known as ghost month.
- **Gifts.** Gifts are often given in pairs because "good things come in pairs" (好事成双), but never in sets of four.

If you sell to Chinese-speaking customers, a quick check costs nothing. Score a phone number with the [lucky phone number checker]({{ r }}tools/phone-number-numerology/) or ask for a [business number audit]({{ r }}business/).

## How strong are these beliefs?

They vary by person, generation and region. Many people treat them as light-hearted tradition, while others take them seriously for big purchases. Avoiding obvious negatives, such as 4s in a hotline or 250 in a price, is simply good manners.

*Sources: [Chinese numerology, Wikipedia](https://en.wikipedia.org/wiki/Chinese_numerology); [Tetraphobia, Wikipedia](https://en.wikipedia.org/wiki/Tetraphobia); [Chinese number slang, LingoAce](https://www.lingoace.com/blog/chinese-number-slang-explained/); [A numbers game, The World of Chinese](https://www.theworldofchinese.com/2019/08/a-numbers-game/); [Lucky number 8, China Highlights](https://www.chinahighlights.com/travelguide/culture/lucky-number-8.htm); [Hong Kong numerology, Zolima CityMag](https://zolimacitymag.com/hong-kong-numerology-why-is-four-so-unlucky/).*
