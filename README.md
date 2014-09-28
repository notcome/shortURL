# URL Shorter

A normal practice for URL shorter is to assign each inputed URL with a number
incremented from 1 and map this number to a random short string.

Here I proposed a simple algorithm. It has following advatanges:

1. avoid similar characters (1Il, Oo0, ZzSsUuPpVv)
2. random enough (001 => aaZ is undesired)
3. with a checksum
4. both simple and complex enough

## What's it?

Though shortening URL is a simple boring question, I must say
[the question on StackOverflow](http://stackoverflow.com/questions/742013/how-to-code-a-url-shortener)
disappointed me. The most accepted answer is somehow incomplete. So I spent
one minute on a sketch paper (actually TextEdit.app on OS X) and satisfied
myself.

The key idea is the same: convert the number into a N-base number. But the way
I map it to a text representation is slighly trickier. In the following steps,
I will calculate a three-digit URL with a checksum at the end of it.

First, we need to exclude \[1IlOo0ZzSsUuPpVv\] from our charset. We still have
46 (62 - 16) characters for each digit. Then, we generate a map between those
characters and numbers from 0 to 45.

_Usually we generate only one map. But, we can generate different maps for
different digits._ This can avoid mapping like 001 => aaZ.

Second, we can calculate a checksum. Similarly, we need to determine the range
of our checksum. I initially chose \[0-9Qq\] since if I append this checksum
at the end of a three-digit short URL, the result wouldn't be "fxxk". In this
example, we can add three numbers and mod 12 to get the checksum.

But then, I suddenly realized that, if we divid all 46 characters into 4 blocks,
I could make the URL more complex. Say we now have a URL ``$A$B$C$S``, we can
shuffle ``$A$B$C`` based on which block ``$S`` is in. If ``$S`` is in the first
block, we can generate a URL ``$A$B$C$S``, but if it is in the second one, the
output can be ``$B$C$A$S``.

My English is poor, so let's say the pseudo-code:

```
let $A = 'CWetFgj5nNxrdcK4BQmGYJ7yhTk8H2RwMLaD6ifbE3Aq9X'
let $B = '7gRwKE29ANf43BHGiMFqXxDj6aLQWCbkdmJcer5Ytyn8hT'
let $C = 'gth2FLKYb6eJGiXc5fHmr97Cw4DTjRq8EWMNnxyQA3kBad'
let $S = ['wxd6CmQrhy', 'aXKYtcNbJB', 'DRG8Aj45in', 'MEe39Hq2W7']
let $Type = [[0, 1, 2], [2, 0, 1], [1, 0, 2], [2, 1, 0]]


let NumberToDigits = (number, base) =>
  [numberToDigits (number / base)..., number % base]
                   = (0, base) => 0

let DigitsToNumber ([digits..., digit], base, power = 1) =>
  DigitsToNumber(digits, base, power * base) + digit * power
                   ([], base, power) => 0

let FinalTransform (digits, type] => {
  type = $Type[type]
  return map(type, digit => digits[digit])
}

let Encode (number) => {
  let type = number % 4
  number = number / 4
  let [A, B, C] = NumberToDigits(number, 46)
  let S = (A + B + C) % 10
  A = $A[A]
  B = $B[B]
  C = $C[C]
  S = $S[type];
  return [FinalTransform([A, B, C], type)..., S]
}
```

``Decode`` is similar and therefore omitted.