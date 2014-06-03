/* global $ch, $$CHOP */
$ch.define('utils', function () {
  'use strict';
  $$CHOP.utils = {};

  $$CHOP.utils = {
    extend: function(destination, source) {
      if (arguments.length !== 2) {
        throw new Error('$ch.utils.extend requires two parameters');
      }

      for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          this.extend(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    },

    now: function () {
      return Date.parse(Date());
    },

    random: function (from, to) {
      if (arguments.length !== 2) {
        throw new Error('$ch.utils.random requires two parameters.');
      }

      var isFromOk = typeof from === 'string' || typeof from === 'number';
      var isToOk = typeof to === 'string' || typeof to === 'number';

      if (isFromOk === false || isToOk === false) {
        throw new Error('$ch.utils.random only takes either numbers or strings as parameters.');
      }

      if (typeof from === 'string') {
        from = Number.parseInt(from, 10);
      }
      if (typeof to === 'string') {
        to = Number.parseInt(to, 10);
      }

      return Math.floor(Math.random() * to) + from;
    },

    urlParams: function (variable) {
      var result = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (arguments.length === 0) {
          result[pair[0]] = pair[1];
        } else {
          if (pair[0] === variable) {
            return pair[1];
          }
        }
      }
      return result;
    },

    isString: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isString requires one parameter.');
      }

      return typeof obj === 'string';
    },

    isBoolean: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isBoolean requires one parameter.');
      }

      return typeof obj === 'boolean';
    },

    isNumber: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isNumber requires one parameter.');
      }

      return typeof obj === 'number';
    },

    isUndefined: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isUndefined requires one parameter.');
      }

      return obj === undefined;
    },

    isNull: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isNull requires one parameter.');
      }

      return obj === null;
    },

    isNaN: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isNaN requires one parameter.');
      }

      if (typeof obj === 'string') {
        obj = Number.parseFloat(obj);
      }
      return Number.isNaN(obj);
    },

    isArray: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isArray requires one parameter.');
      }

      return $$CHOP.isArray(obj);
    },

    isObject: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isObject requires one parameter.');
      }

      var result = false;
      if (typeof obj === 'object' && this.isArray(obj) === false) {
        result = true;
      }

      return result;
    },

    isFunction: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isFunction requires one parameter.');
      }

      return typeof obj === 'function';
    },

    isEmpty: function (obj) {
      if (arguments.length !== 1) {
        throw new Error('$ch.utils.isEmpty requires one parameter.');
      }

      if (this.isArray(obj) === true) {
        return obj.length === 0;
      }
      else if (this.isObject(obj) === true) {
        return Object.keys(obj).length === 0;
      }
    },

    isEqual: function (a, b) {
      if (arguments.length !== 2) {
        throw new Error('$ch.utils.isEqual requires two parameters.');
      }
      var index, len;

      if (typeof a !== typeof b) {
        return false;
      }

      if (this.isNumber(a) || this.isString(a) || this.isBoolean(a)) {
        return a === b;
      }

      if (this.isArray(a)) {
        if (a.length !== b.length) {
          return false;
        }

        for (index = 0, len = a.length; index !== len; ++index) {
          if (a[index] !== b[index]) {
            return false;
          }
        }
      }

      if (this.isObject(a)) {
        var aKeys = Object.keys(a);
        var bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
          return false;
        }

        var key;
        for (index = 0, len = aKeys.length; index !== len; ++index) {
          key = aKeys[index];
          if (a[key] !== b[key]) {
            return false;
          }

          key = bKeys[index];
          if (a[key] !== b[key]) {
            return false;
          }
        }

      }

      return true;
    }

  };

});