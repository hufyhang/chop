/* global $ch */
$ch.require(['ui', 'event', 'router', 'my-addon']);

$ch.find('#name-input').input().focus();
$ch.find('#age-input').input();
$ch.find('#click-btn').button();

$ch.source('person', [{
  name: '',
  age: ''
}]);

var ageFilter = function (item) {
  'use strict';
  return item.age > 20;
};

$ch.event.listen('update', function () {
  'use strict';
  var original = $ch.source('person');
  original.push({
    name: $ch.source('name'),
    age: $ch.source('age')
  });

  $ch.source('person', original);

  $ch.find('#preview').inline();
});

$ch.event.listen('greeting', function (data) {
  'use strict';
  var view = $ch.view({
    html: '<h3>Very welcome to ' + data.name + ', whose age is ' + data.age + '.</h3>'
  });
  $ch.find('#preview').view(view);
});

$ch.router.add({
  'greeting/:name/:age': function (param) {
    'use strict';
    $ch.event.emit('greeting', {name: param.name, age: param.age});
  }
});

$ch.addon('Hello, ' + $ch.module('my-addon').name + '!!!');
