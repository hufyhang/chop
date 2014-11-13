ChopJS Offline Database Module
===========================

Dependencies
============

None

WebSQL
============

$ch.db.websql(`name`[, `version`, `description`, `size`])
------------------------------

Creates and returns a ChopJS WebSQL object.

+ `name`: name of the WebSQL database.
+ `version`: database version.
+ `description`: database description.
+ `size`: database size in number. Default: 5 * 1024 * 1024 === 5MB.

ChopJS WebSQL Object
====================

.query(`sql`[, `data`])
------------------------

Executes `sql`. If `data` presented, use `data` to prepare `sql` statement.

.done(`successCb`[, `errorCb`])
----------------------------

Adds success and error callbacks to the ChopJS WebSQL object.

+ `successCb`: function (`tx`, `rows`) {...} `rows`: the SQL query results in form of array.
+ `errorCb`: function (`tx`, `error`) {...}
