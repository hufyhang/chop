/* global $ch */
$ch.require(['ui', 'context', 'widget', 'event']);

$ch.event.listen('map', function () {
  'use strict';
  var div = $ch.find('#map-div');
  var template = $ch.find('#map-template').html();

  $ch.context.geolocation(function (geo) {
    var lon = geo.longitude;
    var lat = geo.latitude;

    var v = $ch.view({
      html: $ch.template(template, {
        src: 'http://localhost:8000/',
        widget: 'map',
        lon: lon,
        lat: lat
      })
    });
    div.view(v).css('height', '100%');
  });

});


$ch.find('header').topbar($ch.find('nav'));
