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

$ch.utils.map(`array`, `callback`)
----------------------------------

Returns an array which is created by iterate through `array` and call `callback`
on each of its items.

$ch.utils.now()
---------------

Returns current time value.

$ch.utils.random(`from`, `to`)
------------------------------

Returns a random integer number between `from` and `to`.

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
