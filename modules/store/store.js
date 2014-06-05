/* global $ch, $$CHOP */
$ch.define('store', function () {
  'use strict';

  $$CHOP.store = {};
  $$CHOP.store = {
    local: function (key, value) {
      if (typeof Storage === 'undefined') {
        throw new Error('Local storage is not supported by browser.');
      }

      if (arguments.length === 0) {
        throw new Error('$ch.store.local requires at least one parameter.');
      }

      if (arguments.length === 1) {
        var data = localStorage.getItem(key);
        if (data !== null) {
          data = JSON.parse(data);
        }
        return data;
      } else {
        if (value === undefined) {
          throw new Error('$ch.store.local does not allow undefined value.');
        }

        localStorage.setItem(key, JSON.stringify(value));
      }
    },

    cookie: function (key, value) {
      if (document.cookie === undefined) {
        throw new Error('Cookie is not supported by this browser.');
      }

      var obj;
      if (arguments.length === 0) {
        obj = document.cookie;
        if (obj === undefined || obj === '') {
          return {};
        }
        return JSON.parse(obj);
      }

      if (arguments.length === 1) {
        if (typeof key === 'object') {
          var str = JSON.stringify(key);
          document.cookie = str;
        }

        if (typeof key === 'string') {
          obj = document.cookie;
          if (obj === undefined || obj === '') {
            obj = {};
          } else {
            obj = JSON.parse(obj);
          }
          return obj[key];
        }
      }

      if (arguments.length === 2) {
        obj = document.cookie;
        if (obj === undefined) {
          obj = {};
        } else {
          obj = JSON.parse(obj);
        }

        obj[key] = {};
        obj[key] = value;
        document.cookie(JSON.parse(obj));
      }
    }

  };

});
