chop.js directive module
========================

Dependencies
------------

<!-- `event` - automatically included. -->

None

Browser requirements
---------------------

With support of Shadow DOM.

For the browsers do not support Web Components, consider to load Polymer Platform.js in `<head></head>`

E.g.:

~~~html
<script src="//cdnjs.cloudflare.com/ajax/libs/polymer/0.3.4/platform.js"></script>
~~~

$ch.directive.add(`tag`, `template`[, `callback`])
------------------------------------

Registers `tag` according to `template`.

If `callback` is a function, it will be fired when the element is created and takes two parameters:

1. `theElement` - the customized component itself.

2. `shadowRoot` - the Shadow Root of the customized component.

Or, if `callback` is an object:

~~~javascript
$ch.directive.add('my-tag', template, {
        onCreated: function () {
            // an instance of the element is created
        },
        onAttached: function () {
            // an instance was inserted into the document
        },
        onDetached: function () {
            // an instance was removed from the document
        },
        onAttribute: function (attrName, oldVal, newVal) {
            // an attribute was added, removed, or updated
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
