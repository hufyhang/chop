/* global $ch */
$ch.require(['router', 'my-addon']);

var doClick, doKeypress, sayHi;
$ch.require('my-events', function () {
  'use strict';
  var events = $ch.module('my-events');
  doClick = events.doClick;
  doKeypress = events.doKeypress;
  sayHi = events.sayHi;
});

var banner, tail;
$ch.require('my-views', function () {
  'use strict';
  var views = $ch.module('my-views');
  banner = views.banner;
  tail = views.tail;
});


$ch.source('list', [{
  name: 'Daniel',
  age: 26
}, {
  name: 'Audrey',
  age: 25
}, {
  name: 'Tom',
  age: 26
}]);

var ageFilter = function (item) {
  'use strict';
  return item.age > 25;
};


$ch.find('#from-input').focus();

$ch.find('.banner').css('color', 'red')
  .css('font-size', '2em')
  .css('margin-bottom', '10px')
  .css('font-family', 'Arial,sans-serif');

$ch.findAll('input').forEach(function (input) {
  'use strict';
  input.css('font-size', '1.5em');
});

$ch.require('my-greetings', function () {
  'use strict';
  console.log('DONE');
});

$ch.require(['my-greetings', 'my-information'], function () {
  'use strict';
  console.log('INFO: ' + $ch.module('my-greetings').msg);
  console.log('MSG: ' + $ch.module('my-information').msg);
});

var gotoAdvert = function () {
  'use strict';
  $ch.router.navigate('advert/something/hi/123');

};

$ch.router.add({
  'home': function () {
    'use strict';
    console.log('Routed: home');
  },
  'advert/:name/hi/:age': function (params) {
    'use strict';
    console.log(params);
    sayHi(params.name, params.age);
  }
});

$ch.router.navigate('home');
