chop.js import module
=====================

Dependencies
------------

None

HTML directive
==============

ch-import
----------

Imports a resource declared by `src` attribute, and puts into the parent node.

APIs on Chop ELements
=====================

.import(`url`)
--------------

Imports the resource from `url`, and puts into the Chop element object.

E.g.:

~~~javascript
$ch.find('#container').import('http://example.com/header');
~~~


