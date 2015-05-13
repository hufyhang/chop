chop.js utils module
====================

Dependences
-----------

None

$ch.utils.extend(`destination`, `source`)
-----------------------------------------

Returns the `destination` object after extends against `source`.

$ch.utils.bind(`function`, `context`)
-------------------------------------

Creates and return a new function that will call `function` in `context`.

$ch.utils.changes(`previous`, `now`)
------------------------------------

Compares object `now` with object `previous`, and returns all the changes in an object. If no changes found, returns `false`.

$ch.utils.sort(`target`[, `by`, `descending`])
--------------------------------------

Sorts `target` array and returns the sorted result.

- `by`: the key to be sorted by when sorting array of objects.
- `descending`: `false` by default.

$ch.utils.map(`array`, `callback`)
----------------------------------

Returns an array which is created by iterate through `array` and call `callback`
on each of its items.

$ch.utils.first(`array`[, `howMany`])
-------------------------------------

Returns the first `howMany` elements in `array`. If `howMany` is not presented,
        returns the whole `array`.

$ch.utils.last(`array`[, `howMany`])
-------------------------------------

Returns the last `howMany` elements in `array`. If `howMany` is not presented,
        returns the whole `array`.

$ch.utils.now()
---------------

Returns current time value.

$ch.utils.fromNow(`date`)
-----------------------

Returns how long ago the `date` is in human-readable string.

$ch.utils.random(`from`, `to`)
------------------------------

Returns a random integer number between `from` and `to - 1`.

$ch.utils.isString, isArray, isObject, isNumber, isNull, isUndefined, isNaN, isBoolean, isFunction
--------------------------------------------------------------------------------------------------

Checks object type.

$ch.utils.isEmpty(`obj`)
------------------------

Checks if `obj` is an empty object or array.

$ch.utils.isEqual(`a`, `b`)
---------------------------

Checks if `a` equals to `b`.

$ch.utils.urlParams(`query`)
----------------------

Returns the URL `query` parameter of the page. If no `query` provided, returns
all query parameters in a javascript object.
