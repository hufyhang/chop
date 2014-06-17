/* global $ch */
$ch.require('ui');
$ch.require('service', false);

var makeView = function (name) {
  'use strict';
  return $ch.view({
    html: 'Hello, ' + name + '!!!!!!'
  });
};

var showInfo = function () {
  'use strict';
  var view = makeView($ch.source('name'));
  $ch.find('#container').view(view);
};

$ch.service.add('greeting', function (data) {
  'use strict';
  return makeView(data.name);
});
