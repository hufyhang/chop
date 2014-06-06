chop.js regex module
====================

Dependeces
----------

None

$ch.regex.replace(`target`, `regex`[, `flag`], `to`)
----------------------------------------------------

Returns a string by replacing `target` with `to` according regular expression
`regex` and optional `flag`.


$ch.regex.match(`target`, `regex`[, `flag`], `callback`)
----------------------------------------------------

Matches `regex` in `target` and calls `callback`.

Each matched substring will be passed to `callback` in turn.

If nothing matched, `callback` receives a `null` parameter. Othewise, receives
`matchedString`, `stringIndex`, `allMatchedString`.

