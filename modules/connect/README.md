chop.js HTML5 connectivity module
=================================

Dependences
-----------

None

$ch.connect.worker(`url`, `callback`)
----------------------

Returns a Worker object which referring to `url`.

When received a message, calls `callback` with a `data` parameter.

Example:

~~~javascript
var w = $ch.connect.worker('worker.js', function (data) {
    console.log('Received: ' + data);
});
~~~

$ch.connect.sse(`param`)
------------------------

Returns an EventSource (Server-Sent Event) object according to `param`.

`param` has to be an object and contains at least an `url` property.

To close a SSE, call `close()`.

Example:

~~~
$ch.require('connect');
var sse = $ch.connect.sse({
    url: 'http://example.com/sse.php',

    open: function (e) {
        console.log('SSE opened');
    },

    message: function (e) {
        console.log('Received: ' + e.data);
    }
});

...

sse.close();
~~~

$ch.connect.socket(`param`)
---------------------------

Returns an WebSockets object according to `param`.

`param` has to be an object and contains at least an `url` property.

To send a WebSockets message, call `send(...)`.

Example:

~~~
$ch.require('connect');
var socket = $ch.connect.socket({
    url: 'ws://example.com/socket',

    open: function () {
        console.log('Socket opened');
    },

    message: function (e) {
        console.log('Received: ' + e.data);
    }
});

...

socket.send('Hello world!!!');
~~~
