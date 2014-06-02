chop.js router module
=====================

Dependencies
------------

None

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

