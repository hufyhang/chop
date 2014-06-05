chop.js node module
===================

Dependences
-----------

None

APIs on Chop.js Elements through `$ch.find(...)` & `ch.findAll(...)`
====================================================================

node()
------

Returns the DOM element of the current Chop.js element.

child()
-------

Returns all child DOM element of the current Chop.js element.

appendNode(`node`)
------------

Appends the `node` element to the current Chop.js element.

removeNode(`node`)
------------------

Removes the `node` element from the current Chop.js element.

APIs on `$ch`
=============

$ch.node(`tag` [, `html`])
--------------------------

Creates and returns a Chop.js Node object.

APIs on node objects
====================

html(`html`)
------------

If no `html` provided, returns innerHTML. Otherwise, sets innerHTML to `html`.

append(`html`)
--------------

Appends `html` to innerHTML.

className(`name`)
---------

If no `name` provided, returns the class name of the node. Otherwise, checks if
contains class `name`.

addClass(`class`)
-----------------

Adds class `class`.

removeClass(`class`)
--------------------

Removes class `class`.

attr(`key`, `value`)
--------------------

If no arguments provided, returns all attributes. If only `key` presented,
   returns attribute `key`. Otherwise, sets the value of attribute `key`to `value`.