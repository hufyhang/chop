ChopJS Scope module
===================

This `scope` module is designed to provide a more effective way to bind front-end HTML markups and JavaScript codes. Similar as AngularJS controllers, `scope` provides unique name spaces for the HTML snippets being annotated by `ch-scope`.

Dependencies:
=============

None

Instruction
============

`ch-scope`
---------- 

declare an HTML tag as the root of a ChopJS scope

e.g.:

~~~html
<body ch-scope="appScope">
   ... 
</body>
~~~

`body` will be the root of scope `appScope`.

Now, to initialize `appScope`, go to JavaScript and:

~~~javascript
$ch.scope('appScope', false, function ($scope, $event) {
// $scope refers to the scope that being initialized.
// $event refers to scope events.
});
~~~

`ch-name`
-----------------

give a JavaScript accessible name to an element inside a ChopJS scope. __N.B. an `id` attribute HAS TO BE given to the element.__

e.g.:

~~~html
<body ch-scope="appScope">
    <div id="container-div" ch-name="container">
        ...
    </div>
</body>
~~~

Therefore, `container-div` can now be easily accessed in JavaScript:

~~~javascript
$ch.scope('appScope', function ($scope, $event) {
    $scope.container.html('Hello world!!!');
});
~~~

`ch-event`
-------------

assign scope event to an element.

e.g.: 

~~~html
<body ch-scope="appScope">
    <div id="container-div" ch-name="container" ch-event="click: sayHi; mouseover: logging">
        ...
    </div>
</body>
~~~

Then, in JavaScript:

~~~javascript
$ch.scope('appScope', function ($scope, $event) {
    $scope.container.html('Hello world!!!');

    $event.listen('sayHi', function () {
        console.log('Hi');
    })
    .listen('logging', function () {
        console.log('mouse over');
    });
});
~~~

`ch-data`
------------

bind a two-way data.

In HTML:

~~~html
<body ch-scope="appScope">
    <div id="container-div" ch-name="container" ch-data>
        {{message}}
    </div>
</body>
~~~

Then in JavaScript:

~~~javascript
$ch.scope('appScope', function ($scope) {
    $scope.message.set('Hello world!!!');

    console.log($scope.message.get()); // Hello world!!!
})
~~~

Use `|` for pipe operations.
---------------

in HTML:

~~~html
<body ch-scope="appScope">
    <div id="container-div" ch-name="container" ch-data>
        {{message | upperCase}}
    </div>
</body>
~~~

Then in JavaScript:

~~~javascript
$ch.scope('appScope', function ($scope) {
    $scope.upperCase = function (str) {
        return str.toUpperCase();
    };

    $scope.message.set('Hello world!!!'); // should get: HELLO WORLD!!!
});
~~~

