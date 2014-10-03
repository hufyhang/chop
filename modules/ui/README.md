chop.js UI module
=================

Dependences
-----------

None

__All UI module APIs are exposed through `$ch.find(...)` and each `$ch.findAll(...)`__

.show()
-------

Shows the element.

.hide()
-------

Hides the element.

.videoBackground()
------------------

Converts the video element into video background.

.button(`callback`)
-------------------

Converts the element into Chop.js UI button. If `callback` provided, triggers
`callback` when the element is clicked.

.pager(`callback`)
------------------

Converts the element into Chop.js UI pager button. If `callback` provided, triggers
`callback` when the element is clicked.

.input()
--------

Convers the element into Chop.js UI input.

.dropbox(`callback`)
-----------------

Converts the element into Chop.js dropbox (single-value selectbox). If `callback`
presetned, triggers `callback` when the value of the dropbox is changed.
`callback` can takes a `currentValue` parameter.

.selectbox(`callback`)
----------------------

Converts the element into Chop.js selectbox (if has attribute `multipe`). If `callback`
presetned, triggers `callback` when the value of the selectbox is changed.
`callback` can takes a `currentValue` parameter.

.topbar(`zindex`, `nextElement`)
----------------------

Converts the element into Chop.js topbar element.

If `zindex` is provided, sets z-index to `zindex`. Otherwise sets to 1.

If `nextelement` presetned, sets `nextelement` to has a margin to the element.

~~~
<header id="topbar">
  <img src="logo.png" alt="logo" ch-logo />
  <div>Home</div>
  <div>Conact</div>
  <div>About</div>
</header>

<div id="content">Hello world!!!</div>

...

<script>
$ch.find('#topbar').topbar($ch.find('#content'));
</script>
~~~

.normal()
---------

Sets text style of the element to normal.

.warning()
---------

Sets text style of the element to warning.


.danger()
---------

Sets text style of the element to danger.


.success()
---------

Sets text style of the element to success.

.information()
---------

Sets text style of the element to information.

