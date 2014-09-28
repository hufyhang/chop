/* global $ch */

$ch.require(['layout', 'ui', 'event', 'string', 'context']);

var checkBrowser = function () {
  'use strict';

  var container = document.createElement('div');
  if (container.createShadowRoot === undefined) {
    alert('Your browser doesn\'t support Shadow DOM');
  }
};

checkBrowser();

$ch.require('leaflet-map/map');

var OSM = 'http://nominatim.openstreetmap.org/search?format=json&q=';

$ch.event.listen('search', function () {
  'use strict';

  var q = $ch.source('query').trim();
  if (q !== '') {
    $ch.http({
      url: OSM + q,
      done: function (res) {
        if (res.status === 200) {
          var data = JSON.parse(res.responseText);

          var buffer = $ch.string.buffer('');
          $ch.each(data, function (item) {
            var info = $ch.string.build('<map-marker lat="{{lat}}" lng="{{lng}}">{{name}}</map-marker>', {
              lat: item.lat,
              lng: item.lon,
              name: item.display_name
            });
            buffer.append(info);
          });

          $ch.directive.update('myMap', buffer.toString(''));
        }
      }
    });

  }
});
