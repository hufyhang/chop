/* global $ch */

var doClick = function () {
  'use strict';
  console.log('Now');
  $ch.http({
    url: 'http://localhost:8000',
    method: 'get',
    done: function (data) {
      console.log(data.data);
    }
  });
};

var doKeypress = function (evt) {
  'use strict';
  if (evt.which === 13) {
    var style = $ch.find('input[type="text"]').val();
    $ch.find('.title').css('font-size', style);
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


