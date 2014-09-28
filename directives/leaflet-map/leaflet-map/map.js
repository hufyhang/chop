/* global $ch, L */
$ch.define('leaflet-map/map', function () {
  'use strict';

  $ch.require(['node', 'directive', 'context', 'event', 'import']);
  var _map;
  var _markers = [];

  var template = $ch.http({
    url: 'leaflet-map/template.html',
    async: false
  }).responseText;

  var MAP_TILE = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

  var loadMarkers = function (com) {
    // clean all markers first
    while (_markers.length !== 0) {
      var marker = _markers.pop();
      _map.removeLayer(marker);
    }

    var markers = $ch.findAll('map-marker', com);
    $ch.each(markers, function (marker) {
      var lat = marker.attr('lat');
      var lng = marker.attr('lng');
      var info = marker.html();
      var m = new L.Marker([lat, lng]);
      _map.addLayer(m);
      m.bindPopup(info);
      _markers.push(m);
    });
  };

  var loadMap = function (lat, lng, zoom, maxZoom, com, shadow) {
    $ch.find('style#map-style', shadow).import('leaflet-map/style.css');

    var js = $ch.node('script').attr('id', 'leaflet-map-js').attr('src',
                       'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js');
    $ch.find('body').node().appendNode(js);

    $ch.find('script#leaflet-map-js').el.onload = function () {

      _map = L.map($ch.find('#map', shadow).el).setView([lat, lng], zoom);
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
      }).addTo(_map);

      // now load markers
      loadMarkers(com);
    };

  };

  var onCreated = function (element, shadow) {
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
  };

  var onUpdated = function (html, element) {
    loadMarkers(element);
  };

  $ch.directive.add('leaflet-map', template, {
    onCreated: onCreated,
    onUpdated: onUpdated
  });
});