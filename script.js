/* global $ch */
var doClick, doKeypress, sayHi;
$ch.use('events', function () {
  'use strict';
  var events = $ch.modules.events;
  doClick = events.doClick;
  doKeypress = events.doKeypress;
  sayHi = events.sayHi;
});

var banner, tail;
$ch.use('views', function () {
  'use strict';
  var views = $ch.modules.views;
  banner = views.banner;
  tail = views.tail;
});

$ch.find('#from-input').focus();

$ch.find('.banner').css('color', 'red')
  .css('font-size', '2em')
  .css('margin-bottom', '10px')
  .css('font-family', 'Arial,sans-serif');

$ch.findAll('input').forEach(function (input) {
  'use strict';
  input.css('font-size', '1.5em');
});

$ch.use('greetings');
console.log('CHECK: ' + $ch.modules.greetings.msg);

$ch.use('greetings', function () {
  'use strict';
  console.log('DONE');
});

$ch.use(['greetings', 'information'], function () {
  'use strict';
  console.log('INFO: ' + $ch.modules.information.msg);
  console.log('MSG: ' + $ch.modules.greetings.msg);
});

