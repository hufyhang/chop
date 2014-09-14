/* global $ch, $$CHOP */
$ch.define('layout', function () {
  'use strict';

  var CSS = 'http://feifeihang.info/chop/style.php?q=chopjs-layout';

  var hasStyle = $$CHOP.find('.chopjs-layout-css') !== undefined;
  if (!hasStyle) {
    var node = document.createElement('style');
    node.className += ' chopjs-layout-css';
    node.innerHTML = $$CHOP.http({url: CSS, async: false}).responseText;
    document.head.appendChild(node);
  }

});