chop.js
====

A Super Light-Weight JavaScript Framework

Browser support
===============

- IE: 8+
- Chrome: 30+
- Firefox: 4+
- Safari: 5+
- Opera: 11+

Usage
=====

    <script src="chop.js" ch-main="js/main.js"></script>

- The `ch-main` attribute indicates the entry point/script of the web page.

APIs - HTML attributes
===========

ch-view
-------

Sets chop.js view.

ch-keypress, ch-keydown, ch-click, ch-dbclick, ch-change, ch-mouseover, ch-mouseenter, ch-mouseout, ch-mouseleave, ch-mousemove, ch-mouseup, ch-mousedown
--------------------------------------------

Adds event listener. Use `$ch.event` for event parameter. To access "data source", use `{{sourceName}}`. Filter can also be used in data-source expression, e.g. `{{users | filter: superUserFilter}}`.

ch-source
---------

Defines/adds data sources.

APIs - $ch
==========

$ch.find(`query`)
-----------------

Returns an HTML element in the form of a chop.js element object. If no elements
found, returns `undefined`.

$ch.findAll(`query`)
--------------------

Returns an chop.js element array that contains all the found elements. If no
elements found, returns an emptry array.

$ch.source(`source`, `data`)
----------------------------

If only `source` provided, returns the value of `source`. Otherwise, sets the value of `source` to `data`.

$ch.store(`key`, `data`)
-----------------

If only `key` provided, returns the value of `key` from local storage.
Otherwise, sets and saves `key` to `data`.

$ch.view(`param`)
-----------------

Creates and returns a chop.js view object. If no `param` provided, returns `false`.

`param` should at least contains an `html` property, which can be either
a value or a function with return value. The `html` represents the HTML of
the chop.js view.

To manually render a view, call `render()`.

$ch.template(`template`, `data`)
--------------------------------

Returns a processed string against the `template`. If no `data` provided, returns the content of `template`.

Use `type='text/template'` to define a template in `script` elements. Use `{{something}}` to indicate the place to be processed.

`data` should be in the form of an object.

$ch.http(`param`)
---------------

Performs an AJAX request.

The object `param` contains:

- `url`: the target URL of the AJAX call
- `method`: HTTP verb (get, post, put, delete)
- `async`: asynchronous, default: `true` (`true` or `false`)
- `data`: data to be sent in the form of an object
- `done`: the callback function for async AJAX

If `async` is `false`, returns the response text.

$ch.define(`name`, `function`)
------------------------------

Defines a chop.js module.

- `name`: the name of the module. __Has to be same with filename, but without extension name (i.e. `.js`)__
- `function`: the function of the module. The return value will be stored in `$ch.module.module_name`.

$ch.module(`module`)
--------------------

Returns the returned data of `module`.

$ch.require(`module`, `function`)
---------------------------------

Requires/loads a chop.js module.

- `module`: chop.js module name. If multiple modules, then in the form of an array.
- `function`: _optional_. The callback function on module loaded.

$ch.router.add(`param`)
-----------------------

Adds hash routings. E.g.:

~~~
$ch.router.add({
    'home': function () {...},
    'user/:id': function (params) {
        console.log(params.id);
    }
});
~~~

- `param`: the routing rules in the form of an object. E.g. `{'home': function () {...}}`

$ch.router.navigate(`path`)
---------------------------

Redirects to `path`.

$ch.each(`obj`, `callback`)
------------------------

Iterates `obj` call `callback`. Parameters to `callback`:

- for array: `currentItem`, `index`, `obj`
- for object: `key`, `value`, `index`, `obj`

$ch.filter(`obj`, `expression`)
-----------------------------

Filters and returns the array in `obj` according to `expression`.

`expression` is a function which takes a parameter representing `obj` and returns either true or false.

$ch.xmlToJson(`xml`)
--------------------

Converts a `xml` string or object into JSON. Returns the converted javascript object.

$ch.urlParams(`query`)
----------------------

Returns the URL `query` parameter of the page. If no `query` provided, returns
all query parameters in a javascript object.

APIs - chop.js view
===================

css(`style`, `value`)
-------------------------

Sets CSS style. If no parameters, returns CSS text.

html(`html`)
------------

Sets inner HTML into `html`. If no `html` provided, returns inner HTML.

append(`html`)
--------------

Appends `html`.

val(`value`)
------------

Sets value to `value`. If no `value` provided, returns value.

attr(`key`, `value`)
--------------------

Sets attribute `key` to `value`. If no parameters, returns all attributes.

click(`callback`)
-----------------

Adds event listener on click. If no `callback`, trigger click event.

keypress(`callback`)
--------------------

Adds event listener on keypress.

keydown(`callback`)
-------------------

Adds event listener on keydown.

change(`callback`)
------------------

Adds event listener on change.


Chop.js global variables
========================

- `$ch`/`$$CHOP` -- chop.js main variable.
- `$$CHOPEL` -- chop.js html element.
- `$$CHOPVIEW` -- chop.js view.

