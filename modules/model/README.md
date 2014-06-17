chop.js model module
====================

Dependences
-----------

None

$ch.model(`obj`)
----------------

Creates and returns a Chop.js model object. If `obj` presented, initialized the
model object with `obj`.

~~~
$ch.require('model');

var myModel = $ch.model({
    version: 1,
    message: '{{this_is_a_chop.js_data_source}}',
    information: 'this is a string'
});
~~~

APIs of a Chop.js model object
==============================

.get(`key`)
-----------

Returns the value of `key`. If no `key` provided, returns all the data.

.set(`key`[, `value`])
----------------------

Sets `key` to `value`. If only an object parameter presented, sets the model
object to the object.

.toJSON()
---------

Returns a JavaScript object of the Chop.js model.

.reset()
--------

Resets the entire model object.

.size()
-------

Returns the size of the model object.

