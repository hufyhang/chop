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

If `query` attribute presented, imports the inner HTML of `query`.

APIs on Chop ELements
=====================

.import(`url`[, `query`])
--------------

Imports the resource from `url`, and puts into the Chop element object.

If `query` attribute presented, imports the inner HTML of `query`.

E.g.:

~~~javascript
$ch.find('#container').import('http://example.com/header');
$ch.find('#container').import('http://example.com/header', '#main-content');
~~~


