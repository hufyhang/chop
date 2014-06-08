/* global $ch */
$ch.require(['ui', 'event', 'router']);

var HOME = $ch.find('#home-template').html();
var GREETING = $ch.find('#greeting-template').html();

$ch.event.listen('load-home', function () {
  'use strict';
  var view = $ch.view({
    html: HOME
  });
  $ch.find('#container').view(view);
  $ch.find('input').input().focus();
});

$ch.event.listen('load-greeting', function () {
  'use strict';
  var view = $ch.view({
    html: $ch.template(GREETING, {})
  });
  $ch.find('#container').view(view);
});

$ch.event.listen('greeting', function () {
  'use strict';
  $ch.router.navigate('greeting/' + $ch.source('name'));
});

$ch.router.add({
  'home': function () {
    'use strict';
    $ch.event.emit('load-home');
  },
  'greeting/:name': function () {
    'use strict';
    $ch.event.emit('load-greeting');
  }
});

$ch.router.navigate('home');
