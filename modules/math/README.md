chop.js math module
===================

Dependences
-----------

None

$ch.math.eval(`calc`)
---------------------

Returns the result of calculation `calc`. `calc` has to be a string.

~~~
0.1 + 0.2
// 0.30000000000000004

$ch.math.eval('0.1 + 0.2')
// 0.3
~~~

- When conducting nested calculation with `^` inside, use ` `(whitespace) to
indicate different nesting level.

E.g.

~~~
$ch.math.eval('log( sin(10)^2 )');
~~~
