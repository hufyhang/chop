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

Matches `regex` in `target` and calls `callback`. An array of the _matched_ 
substrings will be the parameter when calling `callback`.

