/* global $ch, $$CHOP */
$ch.define('context', function () {
  'use strict';

  $$CHOP.context = {};

  var userAgentLanguage = function () {
    var language = window.navigator.userLanguage || window.navigator.language;
    return language;
  };

  var geolocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var coords = position.coords;
        $$CHOP.context.latitude = coords.latitude;
        $$CHOP.context.longitude = coords.longitude;
        $$CHOP.context.altitude = coords.altitude;
      });

    } else {
      throw new Error('Geolocation is not supported by this browser.');
    }
  };
  geolocation();

  $$CHOP.context = {
    language: userAgentLanguage()
  };

});
