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

$ch.string.buffer(`str`)
------------------------

Creates a buffer object for constructing string. If `str` is provided,
        initializes the buffer with `str`.

APIs of buffer object
=====================

.append(`data`)
---------------

Appends `data` to buffer.

.prepend(`data`)
----------------

Prepends `data` to buffer.

.dump()
-------

Returns the constructed string and clears the buffer.

.toString()
-----------

Returns the constructed string.

