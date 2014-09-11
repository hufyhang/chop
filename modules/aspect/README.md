chop.js aspect module

Dependencies
============

None

$ch.aspect.before(`obj`, `method`, `advice`)
--------------------------

Run `advice` before the execution of `method` of `obj`.

e.g.:

~~~javascript
var getName = function (id) {
    return id + ': Example';
}

$ch.aspect.before(this, 'getName', function (id) {
    console.log('Getting name of ' + id + ' now...');
});
~~~

$ch.aspect.after(`obj`, `method`, `advice`)
-------------------------

Run `advice` after the execution of `method` of `obj` no matter if `method` is returned normally or has thrown an exception.

e.g.:

~~~javascript
var test = function (name, age) {
    console.log('Hi, ' + name);
    if (age > 26) {
        throw new Error('Big age :-)');
    }
    return '[' + age + ']';
};

$ch.aspect.after(this, "test", function (data) {
    console.log('Process returned: ' + data)
});
~~~

$ch.aspect.afterReturn(`obj`, `method`, `advice`)
-------------------------

Run `advice` after the execution of `method` of `obj` only if `method` is returned normally.

e.g.:

~~~javascript
var test = function (name, age) {
    console.log('Hi, ' + name);
    if (age > 26) {
        throw new Error('Big age :-)');
    }
    return '[' + age + ']';
};

$ch.aspect.afterReturn(this, "test", function (data) {
    console.log('Process returned: ' + data)
});
~~~

$ch.aspect.afterThrow(`obj`, `method`, `advice`)
-------------------------

Run `advice` after the execution of `method` of `obj` only if `method` has thrown an exception.

e.g.:

~~~javascript
var test = function (name, age) {
    console.log('Hi, ' + name);
    if (age > 26) {
        throw new Error('Big age :-)');
    }
    return '[' + age + ']';
};

$ch.aspect.afterThrow(this, "test", function (err) {
    console.log('Test has thrown: ' + err.message);
});
~~~

$ch.aspect.around(`obj`, `method`, `advice`)
-------------------------

Surrounds `method` of `obj` with `advice`.

`advice` will automatically received a copy of the original function as its first parameter.

e.g.:

~~~javascript
var test = function (name, age) {
    console.log('Hi, ' + name);
    if (age > 26) {
        throw new Error('Big age :-)');
    }
    return '[' + age + ']';
};

$ch.aspect.around(this, "test", function (orig, name, age) {
    console.log('====================');
    orig(name, age);
    console.log('====================');
});
~~~

