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
    }

  };

});
