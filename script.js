/* global $ch */

var doClick = function () {
  'use strict';
  var from = $ch.find('#from-input').val();
  var to = $ch.find('#to-input').val();
  var data = {name: to, sender: from};

  var msg = $ch.view({
    render: function () {
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

var banner = $ch.view({
  render: function () {
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

