chop.js storage module
======================

Dependences
-----------

None

$ch.store.local(`key`[, `data`])
------------------------------

If only `key` provided, returns the value of `key` from local storage.
Otherwise, sets and saves `key` to `data`.

$ch.store.cookie(`key`[, `value`])
-----------------------------------

If only `key` provides:

- when `key` is an object: sets cookie to `key`.
- otherwise, returns the data of `key` stored in cookie.

Otherwise, sets value of `key` to `value` and saves in cookie.


