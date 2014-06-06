/* global $ch, $$CHOP */
$ch.define('regex', function () {
  'use strict';

  $$CHOP.regex = {};

  $$CHOP.regex = {
    replace: function (tar, reg, flag, value) {
      if (arguments.length < 3) {
        throw new Error('$ch.regex.replace requires at least three parameters.');
      }

      var result = tar;
      if (arguments.length === 3) {
        value = flag;
        flag = '';
      }

      if (typeof reg !== 'string') {
        throw new Error('$ch.regex.replace requires a string-type regex pattern.');
      }

      if (typeof tar !== 'string' || typeof value !== 'string') {
        throw new Error('$ch.regex.replace can only replace strings.');
      }

      var regex = new RegExp(reg, flag);
      result = result.replace(regex, value);
      return result;
    },

    match: function (tar, reg, flag, callback) {
      if (arguments.length < 3) {
        throw new Error('$ch.regex.match requires at least three parameters.');
      }

      if (arguments.length === 3) {
        callback = flag;
        flag = '';
      }

      if (typeof reg !== 'string') {
        throw new Error('$ch.regex.match requires a string-type regex pattern.');
      }

      if (typeof tar !== 'string') {
        throw new Error('$ch.regex.match can only match strings.');
      }

      var regex = new RegExp(reg, flag);
      var founds = tar.match(regex);
      if (founds !== null) {
        $$CHOP.each(founds, function (found, index, founds) {
          callback(found, index, founds);
        });
      } else {
        callback(founds);
      }
    }
  };
});
