/* global $ch */
$ch.require('ui');
$ch.require('widget', false);

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

$ch.widget.register({
  'greeting': function (data) {
    'use strict';
    $ch.widget.tunnel.feed('information', {
      message: 'Hello world!!!'
    });
    return makeView(data.name);
  }
});
