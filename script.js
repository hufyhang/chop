/* global $ch */

var doClick = function () {
  'use strict';
  alert('hehe');
};

var doKeypress = function (evt) {
  'use strict';
  if (evt.which === 13) {
    console.log('Bingo!!! ' + $ch.find('input[type="text"]').val());
  }
};

var banner = $ch.view({
  render: function () {
    'use strict';
    return 'Hello world!!!';
  }
});


var title = $ch.view({
  render: function () {
    'use strict';
    var template = $ch.find('#test-template').html();
    var data = {name: 'Feifei', sender: 'Lanlan'};

    return $ch.template(template, data);
  }
});

$ch.find('.banner').view([banner]);
$ch.find('.title').view(title);


$ch.find('.banner').append('123')
  .append('<br/>Not bad!!!')
  .css('color', 'red')
  .css('font-size', '2em')
  .css('font-family', 'Arial,sans-serif');

// $ch._registerEvents();

// $ch.find('.banner').view([banner]);
