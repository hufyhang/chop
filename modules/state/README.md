chop.js state machine module
=======================

Dependencies
------------

None

$ch.state.create(`states`)
------------------

Creates a Chop.js State Machine object.

`states` defines the behavior of each state.

E.g.:

~~~javascript
var s = $ch.state.create({
        'ready': function () {
            console.log('Ready');
        },
        'done': function (data) {
            console.log('Done: ' + data);
        }
    });
~~~

APIs of Chop.js State Machine objects
===============

.add(`states`)
--------------

Adds `states` to state machine.

.remove(`states`)
----------------

Removes `states` from state machine.

.goto(`state`[, `data`])
-------------------

Jumps to `state` and passes `data`.

.state(`state`)
--------------

If no `state` provided, returns the current state. Otherwise, returns the callback function of `state`.

.length
--------

The length of the state machine.

.states
--------

All the states registered in state machine.
