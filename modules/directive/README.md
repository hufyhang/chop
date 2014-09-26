chop.js directive module
========================

Dependencies
------------

`event` - automatically included.

Browser requirements
---------------------

With support of Shadow DOM.

$ch.directive.add(`tag`, `template`[, `afterCreated`])
------------------------------------

Registers `tag` according to `template`, and fires `afterCreated` if presented.

`afterCreated` is a function, takes two parameters:

1. `theElement` - the customized component itself.

2. `shadowRoot` - the Shadow Root of the customized component.

Please refer to the corresponding example for usage.