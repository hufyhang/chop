/* global $ch */
$ch.require('ui', false);
$ch.find('#input').input();
$ch.find('#textarea').input();
$ch.find('#click-btn').button(function () {
  'use strict';
  alert('Message:\n' + $ch.source('message'));
  $ch.source('message', 'Welcome to Chop.js');
});

$ch.find('#select').dropbox(function (value) {
  'use strict';
  console.log('Selected: ' + value);
});

$ch.find('#multipe-select').selectbox(function (value) {
  'use strict';
  console.log('Selected: ' + value);
});

