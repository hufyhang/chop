/* global $ch, $$CHOP */
$ch.define('aspect', function () {
  'use strict';

  var threeParams = function () {
    if (arguments.length !== 3) {
      throw new Error('$ch.aspect API requires three parameters.');
    }
    if (typeof arguments[0] !== 'object') {
      throw new Error('$ch.aspect API requires an object-type parameter for "object".');
    }
    if (typeof arguments[1] !== 'string') {
      throw new Error('$ch.aspect API requires an string-type parameter for "method".');
    }
    if (typeof arguments[2] !== 'function') {
      throw new Error('$ch.aspect API requires an function-type parameter for "advice".');
    }
  };

  $$CHOP.aspect = {};
  $$CHOP.aspect = {
    before: function (obj, method, advice) {
      threeParams.apply(this, arguments);
      var orig = obj[method];
      obj[method] = function () {
        advice.apply(this, arguments);
        return orig.apply(this, arguments);
      };
    },

    after: function (obj, method, advice) {
     threeParams.apply(this, arguments);
     var orig = obj[method];
     obj[method] = function () {
      var value;
      try {
        value = orig.apply(this, arguments);
      } catch (err) {
        value = err;
      }
      return advice.call(this, value);
     };
    },

    afterReturn: function (obj, method, advice) {
     threeParams.apply(this, arguments);
     var orig = obj[method];
     obj[method] = function () {
      var value = orig.apply(this, arguments);
      return advice.call(this, value);
    };
   },

   afterThrow: function (obj, method, advice) {
    threeParams.apply(this, arguments);
    var orig = obj[method];
     obj[method] = function () {
      var value;
      try {
        value = orig.apply(this, arguments);
      } catch (err) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(err);
        advice.apply(this, args);
      }
      return value;
     };
   },

    around: function (obj, method, advice) {
      threeParams.apply(this, arguments);
      var orig = obj[method];
      obj[method] = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(orig);
        return advice.apply(this, args);
      };
    }

  };

});