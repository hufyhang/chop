chop.js event module
====================

Dependences
-----------

None

$ch.event.listen(`event`, `callback`)
-------------------------------------

Listens `event` for `callback`.

$ch.event.emit(`event`, `data`)
-----------------------

Emits `event` signal and passes parameter `data`.

$ch.event.watch(`source`, `callback`)
-------------------------------------

Triggers `callback` if data source `source` is changed.

Parameter to `callback`: `change`. `change` contains `.current` and `.old`.

$ch.event.unwatch(`source`)
---------------------------

Unwatchs the changes on `source`.

$ch.event.queue(`callback`)
---------------------------

Creates and returns a callback queue. All function-type parameters will be added to the queue.

$ch.event.once(`function`[, `context`])
----------------------------

Returns a function that will self-destruct after being invoked once. If `context` presented, sets the context of the function to `context`.

$ch.event.nextTick(`fn`)
----------------------

Delays the execution of `fn` until next event loop idle.

APIs of "queue"
===============

.add(`callback`)
----------------

Appends `callback` to the queue.

.remove(`callback`)
-------------------

Removes `callback` from the queue.

.promote(`callback`)
--------------------

Moves `callback` to the front of the queue.

.run(`data`)
------------

Executes one queued callback with parameter `data`. If `data` is not presented,
         executing with runtime data of the queue.

Also returns the return value of the callback.

.stop()
-------

Stops and resets the queue. Also flush the runtime data of the queue.

.reset()
--------

Rests the running position of the queue to 0.

