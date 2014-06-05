chop.js string module
=====================

Dependeces
----------

None

$ch.string.build(`pattern`, `data`)
-----------------------------------

Returns the string built against the `pattern` and `data`.

`data` should be an object.

~~~
var str = $ch.string.build('This is a {{type}}.', {type: 'string'});

// str === 'This is a string.'
~~~
