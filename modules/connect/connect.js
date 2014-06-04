/* global $ch, $$CHOP */
$ch.define('connect', function () {
  'use strict';
  $$CHOP.connect = {};

  $$CHOP.connect = {
    sse: function (param) {
      if (!window.EventSource) {
        throw new Error('Server-Sent Event is not supported by this browser.');
      }

      if (typeof param !== 'object') {
        throw new Error('$ch.connect.sse requires an object-type parameter.');
      }

      if (param.url === undefined) {
        throw new Error('$ch.connect.sse requires an URL value in parameter object.');
      }

      var source = new window.EventSource(param.url);
      $$CHOP.each(param, function (key, value) {
        if (key.toUpperCase() !== 'URL') {
          source.addEventListener(key, value, false);
        }
      });

      return source;
    },

    socket: function (param) {
      if (!window.WebSocket) {
        throw new Error('WebSocket is not supported by this browser.');
      }

      if (typeof param !== 'object') {
        throw new Error('$ch.connect.socket requires an object-type parameter.');
      }

      if (param.url === undefined) {
        throw new Error('$ch.connect.socket requires an URL value in parameter object.');
      }

      var connection = new window.WebSocket(param.url);
      $$CHOP.each(param, function (key, value) {
        if (key.toUpperCase() !== 'URL') {
          connection['on' + key.toLowerCase()] = value;
        }
      });
      return connection;
    }
  };
});
