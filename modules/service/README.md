chop.js service framework
=========================

Dependences
-----------

_router_ (included)


What is a Chop.js Service?
--------------------------

Each visible Chop.js view element can potentially be a Chop.js service in any other
Web apps.

APIs
----

$ch.service.add(`name`, `viewFunction`)
---------------------------------------

- `name`: name of the Chop.js service.
- `viewFunction`: a function that returns a Chop.js view object.

E.g.:

~~~
$ch.require('service', false);

var makeView = function (name) {
  'use strict';
  return $ch.view({
    html: 'Hello, ' + name
  });
};

$ch.service.add('greeting', function (data) {
  'use strict';
  return makeView(data.name);
});
~~~

HTML Directive Examples
-----------------------

~~~
<ch-service src="http://localhost:8000/" service="greeting">
  <ch-data key="name">Chop.js Framework (Service module)</ch-data>
</ch-service>
~~~

