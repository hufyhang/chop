/* global $ch */
$ch.require(['ui', 'widget']);

$ch.widget.tunnel.fetch('greeting-widget', 'information', function (data) {
  'use strict';
  console.log(data);
});
