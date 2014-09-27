/* global $ch, L */
$ch.define('leaflet-map/map', function () {
  'use strict';

  $ch.require(['node', 'directive', 'context', 'event', 'import']);

  var template = $ch.http({
    url: 'leaflet-map/template.html',
    async: false
  }).responseText;

  var MAP_TILE = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

  var loadMap = function (lat, lng, zoom, maxZoom, com, shadow) {
    $ch.find('style#map-style', shadow).import('leaflet-map/style.css');

    var js = $ch.node('script').attr('id', 'leaflet-map-js').attr('src',
                       'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js');
    $ch.find('body').node().appendNode(js);

    $ch.find('script#leaflet-map-js').el.onload = function () {

      var map = L.map($ch.find('#map', shadow).el).setView([lat, lng], zoom);
      var tileEl = $ch.find('map-tile', com);
      var tile, attribution;
      if (tileEl === undefined) {
        tile = MAP_TILE;
        attribution = ATTRIBUTION;
      } else {
        tile = tileEl.attr('src');
        attribution = tileEl.html();
      }

      L.tileLayer(tile, {
        attribution: attribution,
        maxZoom: maxZoom
      }).addTo(map);

      // now load markers
      var markers = $ch.findAll('map-marker', com);
      $ch.each(markers, function (marker) {
        var lat = marker.attr('lat');
        var lng = marker.attr('lng');
        var info = marker.html();
        L.marker([lat, lng]).addTo(map)
        .bindPopup(info);
      });
    };

  };

  $ch.directive.add('leaflet-map', template, function (element, shadow) {
    var lat = element.getAttribute('lat');
    var lng = element.getAttribute('lng');

    var zoom = element.getAttribute('zoom');
    zoom = zoom === null ? 13 : parseInt(zoom, 10);

    var maxZoom = element.getAttribute('maxZoom');
    maxZoom = maxZoom === null ? 18 : parseInt(maxZoom, 10);

    if (lat === null || lng === null) {
      $ch.context.geolocation(function (data) {
        lat = data.latitude;
        lng = data.longitude;

        loadMap(lat, lng, zoom, maxZoom, element, shadow);
      });
    } else {
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      loadMap(lat, lng, zoom, maxZoom, element, shadow);
    }
  });
});