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

Put the following code at the bottom of `body` tag:

    <script src="chop.js" ch-main="js/main.js"></script>

- The `ch-main` attribute indicates the entry point/script of the web page.

APIs - HTML attributes
===========

ch-init
-------

Initializes data sources. E.g. ch-init="list = []; msg = {from: 'a', to: 'b'}"

ch-require
----------

Loads Chop.js modules. E.g.: `ch-require="event; string; local/module"`

ch-view
-------

Sets chop.js view.

ch-keypress, ch-keydown, ch-click, ch-dbclick, ch-change, ch-mouseover, ch-mouseenter, ch-mouseout, ch-mouseleave, ch-mousemove, ch-mouseup, ch-mousedown, ch-mousewheel, ch-drag, ch-dragstart, ch-dragend, ch-dragover, ch-dragenter, ch-drop
--------------------------------------------

Adds event listener. Use `$$event` for event parameter. To access "data source", use `{{sourceName}}`. Filter can also be used in data-source expression, e.g. `{{users | filter: superUserFilter}}`.

ch-source
---------

Defines/adds data sources.

To use inline data source, the DOM element then has to have an ID. E.g.:

~~~html
<div id="inline-div" ch-source>This is a inline {{data}} source.</div>
~~~

ch-inline
---------

Turns the enclosed HTML element into an inline chop.js template, and renders the
template according the value chop.js expression.

Each ch-inline element __has to__ have an id.

APIs - $ch
==========

$ch.find(`query` [, `context`])
-------------------------------

Returns an HTML element in the form of a chop.js element object. If no elements
found, returns `undefined`.

`context` could be an HTML element. E.g. `$ch.find('#btn', $ch.find('#context').el)`.

$ch.findAll(`query` [, `context`])
----------------------------------

Returns an chop.js element array that contains all the found elements. If no
elements found, returns an emptry array.

`context` could be an HTML element. E.g. `$ch.findAll('.btn', $ch.find('#context').el)`.

$ch.chopEl(`DOMElement`)
------------------------

Converts a DOM element into Chop.js element object, and returns the Chop.js
element object.

$ch.source(`source`, `data`)
----------------------------

If only `source` provided, returns the value of `source`. Otherwise, sets the value of `source` to `data`.

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
- `header`: HTTP request headers to be set in the form of an object (e.g. {'header1': 'value1', 'header2': 'value2'})
- `async`: asynchronous, default: `true` (`true` or `false`)
- `responseType`: the response type of the AJAX request
- `data`: data to be sent in the form of an object
- `done`: the callback function for async AJAX
- `cache`: indicates if the AJAX request should be cached. Default `false`

If `async` is `false`, returns the returned AJAX object.

$ch.jsonp(`url`, `callback`)
----------------------------

Performs a JSONP request.

`url` should be in the format of: `http://example.com/data.json?jsonp={callback}`.

`callback` is a function and takes a data parameter refers to the loaded JSON.

$ch.define(`name`, `function`)
------------------------------

Defines a chop.js module.

- `name`: the name of the module. __Has to be same with filename, but without extension name (i.e. `.js`)__
- `function`: the function of the module. The return value will be stored in `$ch.module.module_name`.

Each customized module _HAS TO BE_ packed in a module folder.

$ch.module(`module`)
--------------------

Returns the returned data of `module`.

$ch.require(`module`, `useLoader`)
---------------------------------

Requires/loads a chop.js module, and returns the returned value of `module`.

- `module`: chop.js module name. If multiple modules, then in the form of an array.
- `useLoader`: [__Optional__] either `true` or `false` to define if to use
Chop.js online module loader. Default: `true`.

$ch.readFile(`src`[, `callback`])
---------------

Reads and returns the content of local file `src`. If `callback` presented, read the file asynchronously and fire `callback` after loading.

$ch.each(`obj`, `callback`)
------------------------

Iterates `obj` call `callback`. Parameters to `callback`:

- for array: `currentItem`, `index`, `obj`
- for object: `key`, `value`, `index`, `obj`

$ch.filter(`obj`, `expression`)
-----------------------------

Filters and returns the array in `obj` according to `expression`.

`expression` is a function which takes a parameter representing `obj` and returns either true or false.

APIs - chop.js element
===================

css(`style`, `value`)
-------------------------

Sets CSS style. If no parameters, returns CSS text.

html(`html`)
------------

Sets inner HTML into `html`. If no `html` provided, returns inner HTML.

content(`html`)
----------------

Sets text content to `html`. If no `html` presented, returns text content.

append(`html`)
--------------

Appends `html`.

prepend(`html`)
---------------

Prepends `html`.

appendChild(`HTMLElement`)
-------------------

Appends `HTMLElement` as child.

prependChild(`HTMLElement`)
-----------------------

Prepends `HTMLElement` as child.

scrollTop(`value`)
-------------------

If no `value` presented, set the element's scrollTop to `value`. Otherwise, returns current scrollTop.

scrollLeft(`value`)
-------------------

If no `value` presented, set the element's scrollLeft to `value`. Otherwise, returns current scrollLeft.

offset()
---------

Returns the offset properties of the element in the form of:

~~~javascript
{
    left: offsetLeft,
    top: offsetTop,
    width: offsetWidth,
    height: offsetHeight,
    parent: offsetParent
}
~~~

get(`property`)
----------------

Returns `property` value of the element.

set(`property`, `value`)
----------------

Sets `property` of the element to `value`.

addClass(`class`)
-----------------

Adds `class`.

removeClass(`class`)
-------------------

Removes `class`.

toggleClass(`class`)
-----------------

Toggles `class`.

val(`value`)
------------

Sets value to `value`. If no `value` provided, returns value.

attr(`key`, `value`)
--------------------

Sets attribute `key` to `value`. If no parameters, returns all attributes.

hasAttr(`key`)
----------------

Checks if the element has attribute `key`.

removeAttr(`key`)
--------------------

Removes attribute `key`.

inline(`data`)
----------------

Renders the inline-tempalte element with object `data`.

show()
------

Shows the element.

hide()
------

Hides the element.

on(`event`, `callback`)
-----------------------

Registers `callback` to `event`.

detach(`event`, `callback`)
---------------------------

Detaches the subscription of `callback` on `event`.

delegate(`event`, `callback`, `query`)
--------------------------------------

Adds `callback` to all `query` element on `event`. Multiple `query` can present.

E.g.:

~~~javascript
aViewObject.delegate('click', triggerSomething, 'button', 'div.btn');

// all buttons and btn-class divs in 'aViewObject' will fire 'triggersomething'
on click.
~~~

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

