chop.js storage module
======================

Dependences
-----------

None

$ch.store.local(`key`[, `data`])
------------------------------

If only `key` provided, returns the value of `key` from local storage.
Otherwise, sets and saves `key` to `data`.

$ch.store.session(`key`[, `data`])
----------------------------------

Same as `$ch.store.local`, but use `sessionStorage` instead.

$ch.store.cookie(`key`[, `value`[, `days`]])
-----------------------------------

If only `key` provides:

- when `key` is an object: sets cookie to `key`.
- otherwise, returns the data of `key` stored in cookie.

Otherwise, sets value of `key` to `value` and saves in cookie.

If `days` presented, sets the cache data to expire in `days`.

$ch.store.cache(`key`[, `value`, `expire`])
---------------------------------

Temporary session cache.

If no parameters provided, returns all cached data in the form of an object.

If only `key` presented, returns the cached data of `key`.

Otherwise, sets `key` to `value`.

If `expire` presented, sets the cached data expires in `expire` days.

