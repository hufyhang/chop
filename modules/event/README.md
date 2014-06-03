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
