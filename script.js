/* global $ch */

var doClick = function () {
  'use strict';
  var from = $ch.find('#from-input').val();
  var to = $ch.find('#to-input').val();
  var data = {name: to, sender: from};

  var msg = $ch.view({
    html: function () {
      var template = $ch.find('#msg-template').html();
      return $ch.template(template, data);
    }
  });

  $ch.find('.message').view(msg);
};

var doKeypress = function (evt) {
  'use strict';
  doClick();
};

var sayHi = function () {
  'use strict';
  alert('Hi');
};

var tail = $ch.view({
  html: '<hr/><br/>&copy; 2012-2014 Feifei Hang <input type="button" value="CLICK" ch-click="sayHi"/>'
});

var banner = $ch.view({
  html: function () {
    'use strict';
    var template = $ch.find('#banner-template').html();
    return $ch.template(template);
  }
});

// $ch.find('.banner').view([banner]);
$ch.find('#from-input').focus();


$ch.find('.banner').css('color', 'red')
  .css('font-size', '2em')
  .css('margin-bottom', '10px')
  .css('font-family', 'Arial,sans-serif');

$ch.findAll('input').forEach(function (input) {
  'use strict';
  input.css('font-size', '1.5em');
});

