/* global $ch, google */
$ch.define('google-maps/maps', function () {
  'use strict';

  $ch.require(['directive', 'node', 'context']);

  var template = $ch.http({
    url: 'google-maps/template.html',
    async: false
  }).responseText;

  var loadMap = function (lat, lng, com, shadow) {
    var api = $ch.node('script').attr('src',
                          'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
                          'callback=initializeGoogleMaps');
    $ch.find('body').node().appendNode(api);

    window.initializeGoogleMaps = function () {
      var mapOptions = {
        center: { lat: lat, lng: lng},
        zoom: 8
      };
      var mapContainer = $ch.find('#map', shadow).el;
      var map = new google.maps.Map(mapContainer,
                                    mapOptions);
      loadMarker(com, map);
    };
  };

  var loadMarker = function (com, map) {
    var markers = $ch.findAll('map-marker', com);
    if (markers !== undefined) {

      var infowindow = new google.maps.InfoWindow();

      $ch.each(markers, function (marker) {
        var lat = marker.attr('lat');
        var lng = marker.attr('lng');
        var title = marker.html();

        lat = parseFloat(lat);
        lng = parseFloat(lng);

        var loc = new google.maps.LatLng(lat, lng);
        var m = new google.maps.Marker({
          position: loc,
          title: title,
          map: map
        });

        google.maps.event.addListener(m, 'click', (function(marker) {
          return function() {
            infowindow.setContent(title);
            infowindow.open(map, marker);
          };
        })(m));
      });

    }
  };

  $ch.directive.add('google-maps', template, function (com, shadow) {
    var h = com.getAttribute('height') || '100%';
    var w = com.getAttribute('width') || '100%';
    $ch.find('#map', shadow).css('height', h).css('width', w);

    var lat = com.getAttribute('lat');
    var lng = com.getAttribute('lng');

    if (lat === null || lng === null) {
      $ch.context.geolocation(function (data) {
        lat = data.latitude;
        lng = data.longitude;

        loadMap(lat, lng, com, shadow);

      });
    } else {
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      loadMap(lat, lng, com, shadow);
    }
  });
});