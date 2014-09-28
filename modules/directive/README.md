chop.js directive module
========================

Dependencies
------------

`event` - automatically included.

Browser requirements
---------------------

With support of Shadow DOM.

$ch.directive.add(`tag`, `template`[, `callback`])
------------------------------------

Registers `tag` according to `template`.

If `callback` is a function, it will be fired when the element is created and takes two parameters:

1. `theElement` - the customized component itself.

2. `shadowRoot` - the Shadow Root of the customized component.

Or, if `callback` is an object:

~~~javascript
$ch.directive.add('my-tag', template, {
        onCreated: function (element, shadow) {
            // onCreated...
        },
        onUpdated:  function (content, element, shadow) {
            // onUpdated by $ch.directive.update(...)
        }
    });
~~~

Please refer to the corresponding example for usage.

$ch.directive.update(`id`, `html`)
----------------------------------

Updates the inner HTML of `id` (the custom element) to `html`.
