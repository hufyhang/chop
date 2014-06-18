/* global $ch */
$ch.require(['ui', 'widget']);

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
    $ch.widget.tunnel.set('information', {
      message: 'Hello world!!!'
    });
    return makeView(data.name);
  }
});
