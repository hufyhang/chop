/* global $ch, $$CHOP */
$ch.define('context', function () {
  'use strict';

  $$CHOP.context = {};

  var userAgentLanguage = function () {
    var language = window.navigator.userLanguage || window.navigator.language;
    return language;
  };

  var userAgent = function () {
    return window.navigator.userAgent;
  };

  var geolocation = function (callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var coords = position.coords;
        callback(coords);
      });

    } else {
      throw new Error('Geolocation is not supported by this browser.');
    }
  };
  geolocation();

  $$CHOP.context = {
    language: userAgentLanguage(),
    userAgent: userAgent(),
    geolocation: function (callback) {
      if (callback === undefined) {
        throw new Error('$ch.context.geolocation requires a callback parameter.');
      }
      geolocation(callback);
    }
  };

});
