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

Returns all Chop.js child element of the current Chop.js element.

remove()
--------

Removes this Chop.js node from DOM.

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

context()
---------

Returns a DOM element object as the context for functions such as `$ch.find` and
`$ch.findAll`.

chopEl()
--------

Returns the Chop.js HTML element object of the node.

parent()
--------

Returns the parent Chop.js node object.

child()
-------

Returns the child Chop.js node object.

next()
------

Returns the next Chop.js node object.

previous()
------

Returns the previous Chop.js node object.

contains(`node`)
----------

Checks if contains Chop.js node object `node`.

html(`html`)
------------

If no `html` provided, returns innerHTML. Otherwise, sets innerHTML to `html`.

append(`html`)
--------------

Appends `html` to innerHTML.

prepend(`html`)
--------------

Prepends `html` to innerHTML.

appendNode(`node`)
------------

Appends the `node` element to the current Chop.js element.

prependNode(`node`)
------------

Prepends the `node` element to the current Chop.js element.


removeNode(`node`)
------------------

Removes the `node` element from the current Chop.js element.

insert(`content`, `where`)
--------------------------

Inserts `content` to `where`. `where` can be either `before` or `after`.

`content` is a string-type value.

class(`name`)
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
