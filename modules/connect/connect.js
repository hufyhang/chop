/* global $ch, $$CHOP */
$ch.define('connect', function () {
  'use strict';
  $$CHOP.connect = {};

  $$CHOP.connect = {
    worker: function (url, callback) {
      if (!window.Worker) {
        throw new Error('Worker is not supported by this browser.');
      }

      if (arguments.length !== 2) {
        throw new Error('$ch.connect.worker requires two parameters.') ;
      }

      if (typeof url !== 'string') {
        throw new Error('$ch.connect.worker requires a string-type URL parameter.');
      }

      if (typeof callback !== 'function') {
        throw new Error('$ch.connect.worker requires a function-type callback parameter.');
      }

      var w = new Worker(url);
      w.onmessage = function (evt) {
        var data = evt.data;
        callback(data);
      };
      w.postMessage();
      return w;
    },

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
