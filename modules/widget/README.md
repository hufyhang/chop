chop.js widget framework
=========================

Dependences
-----------

_router_ (included)


What is a Chop.js Widget?
--------------------------

Any visible Chop.js view element can potentially be a Chop.js widget in any other
Web apps.

APIs
----

$ch.widget.register(`widgets`)
---------------------------------------

`widgets` is a JavaScript object in the form of:

~~~
{
   `name1`: `viewFunction1`,
   `name2`: `viewFunction2`
}
~~~

- `name`: name of the Chop.js widget.
- `viewFunction`: a function that returns a Chop.js view object.

E.g.:

~~~
$ch.require('widget', false);

var makeView = function (name) {
  'use strict';
  return $ch.view({
    html: 'Hello, ' + name
  });
};

$ch.widget.add('greeting', function (data) {
  'use strict';
  return makeView(data.name);
});
~~~

$ch.wdiget.tunnel.set(`name`, `obj`)
----------------------------

Sets `name` to `obj` through widget tunnel.

$ch.wdiget.tunnel.get(`widget`[, `key`], `callback`)
----------------------------------------

Gets data passed via widget data tunnel of `widget` and invokes `callback`. If no `key` presented,
     returns all passed data in the form of a JavaScript object.

Callbacks will be executed when Chop.js view is loaded.

HTML Directive Examples
-----------------------

~~~
<ch-widget src="http://localhost:8000/" widget="greeting">
  <ch-data key="name">Chop.js Framework (Service module)</ch-data>
</ch-widget>
~~~

