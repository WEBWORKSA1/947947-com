---
title: "Why 947947 divides by 7, 11 and 13: the 1001 trick explained"
crumb: "The 1001 trick"
permalink: /guides/the-1001-trick/
description: "Any three-digit number written twice, like 947947, is divisible by 7, 11 and 13. Here is the two-line proof, the party trick and some related patterns."
lede: "Write any three-digit number twice and the result is always divisible by 7, 11 and 13. The proof takes two lines; the trick takes ten seconds."
date_published: 2026-10-08
---
{% include rel.html %}
Take any three-digit number, say 947. Write it twice: 947947. Divide by 7. Divide the answer by 11, then by 13. You are back at 947, with no remainder at any step. It works for every three-digit number, from 100100 to 999999.

## The proof

Writing a number twice shifts the first copy three places to the left and adds the second copy:

947947 = 947 × 1000 + 947 = 947 × 1001

And 1001 is not just any number:

1001 = 7 × 11 × 13

So every number of the form ABCABC equals ABC × 7 × 11 × 13. Dividing by 7, 11 and 13 simply removes the 1001 again. That is the whole trick.

## Try it

Use the [interactive 1001 trick]({{ r }}tools/1001-trick/) or pick from all [900 ABCABC numbers]({{ r }}numbers/abcabc/). Our namesake is a good example: [947947]({{ r }}947947/) = 7 × 11 × 13 × 947, and because 947 is prime, it has exactly 16 divisors.

<!--mid-->

## How to perform it as a party trick

1. Ask a friend to choose a three-digit number and type it twice into a calculator.
2. Announce that 7 is lucky, so dividing by 7 will leave no remainder. It won't.
3. Ask them to divide by 11, "because elevens are tidy". No remainder again.
4. Finally, divide by 13, "the unlucky number that breaks the spell". Their original number appears.

## Related patterns

- **Two digits written three times:** ABABAB = AB × 10101, and 10101 = 3 × 7 × 13 × 37. So [474747]({{ r }}numbers/?n=474747) divides by 3, 7, 13 and 37.
- **Four digits written twice:** ABCDABCD = ABCD × 10001, and 10001 = 73 × 137.
- **One digit written six times:** AAAAAA = A × 111111, and 111111 = 3 × 7 × 11 × 13 × 37. That is why every six-digit repdigit such as [777777]({{ r }}777777/) divides by 7, 11 and 13 too.

## Why it is good for teaching

The trick turns place value into something you can see: multiplying by 1000 is "adding three zeros", and adding the original number fills them back in. It is also a gentle introduction to prime factorisation. Factor any number with the [prime factorization calculator]({{ r }}tools/prime-factorization/).

*Source: [1001 (number), Wikipedia](https://en.wikipedia.org/wiki/1001_(number)).*
