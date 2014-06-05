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

      var regex, data;
      if (arguments.length === 0) {
        data = document.cookie;
        if (data === undefined || data === '') {
          return '';
        }
        return data;
      }

      if (arguments.length === 1) {
        data = document.cookie;
        if (typeof key === 'object') {
          $$CHOP.each(key, function (k, v) {
            regex = new RegExp(k + '\\ *=[0-9A-Za-z\\.\\ \\-%]+;?', 'g');
            data = data.replace(regex, '');
            data = k + '=' + encodeURIComponent(v) + ';' + data;
          });
          document.cookie = data;
        }

        if (typeof key === 'string') {
          data = document.cookie;
          if (data === undefined || data === '') {
            return '';
          } else {
            regex = new RegExp(key + '\\ *=[0-9A-Za-z\\.\\ \\-%]+;?', 'g');
            var founds = data.match(regex);
            if (founds !== null) {
              var found =  founds[0];
              regex = new RegExp(key + '\\ *=\\ *', 'g');
              found = found.trim().replace(regex, '').trim();
              return decodeURIComponent(found);
            } else {
              return null;
            }
          }
        }
      }

      if (arguments.length === 2) {
        data = document.cookie;
        if (data === undefined) {
          data = '';
        }
        regex = new RegExp(key + '\\ *=[0-9A-Za-z\\.\\ \\-%]+;?', 'g');
        data = data.replace(regex, '');
        data = key + '=' + encodeURIComponent(value) + ';' + data;

        document.cookie = data;
      }
    }

  };

});
