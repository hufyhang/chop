/* global $ch */
var doClick, doKeypress, sayHi;
$ch.require('events', function () {
  'use strict';
  var events = $ch.modules.events;
  doClick = events.doClick;
  doKeypress = events.doKeypress;
  sayHi = events.sayHi;
});

var banner, tail;
$ch.require('views', function () {
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

$ch.require('greetings');
console.log('CHECK: ' + $ch.modules.greetings.msg);

$ch.require('greetings', function () {
  'use strict';
  console.log('DONE');
});

$ch.require(['greetings', 'information'], function () {
  'use strict';
  console.log('INFO: ' + $ch.modules.information.msg);
  console.log('MSG: ' + $ch.modules.greetings.msg);
});

var gotoAdvert = function () {
  'use strict';
  $ch.router.navigate('advert/something/hi/something');

};

$ch.router.add({
  'home': function () {
    'use strict';
    console.log('Routed: home');
  },
  'advert/:name/hi/:name': function (params) {
    'use strict';
    console.log(params);
    sayHi(params.name);
  }
});

$ch.router.navigate('home');
