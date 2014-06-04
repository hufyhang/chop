chop.js HTML5 connectivity module
=================================

Dependences
-----------

None

$ch.connect.sse(`param`)
------------------------

Returns an EventSource (Server-Sent Event) object according to `param`.

`param` has to be an object and contains at least an `url` property.

To close a SSE, call `close()`.

$ch.connect.socket(`param`)
---------------------------

Returns an WebSockets object according to `param`.

`param` has to be an object and contains at least an `url` property.

To send a WebSockets message, call `send(...)`.
