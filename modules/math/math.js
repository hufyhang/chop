/* global $ch, $$CHOP */
$ch.define('math', function () {
  'use strict';

  $$CHOP.math = {};
  $$CHOP.math = {
    eval: function (calc) {
      if (arguments.length !== 1) {
        throw new Error('$ch.math.eval requires a calculation parameter.');
      }

      if (typeof calc !== 'string') {
        return false;
      }

      var value = eval(calc);
      var valueStr = value + '';
      var factor = 0;
      var prev = '', startMatch = false;
      for (var index = valueStr.length - 1; index !== -1; --index) {
        var digit = valueStr[index];
        if (digit === prev) {
          if (startMatch === false) {
            startMatch = true;
          }
          ++factor;
        } else {
          if (startMatch === true) {
            break;
          }
        }
        prev = digit;
      }
      factor = Math.pow(10, factor);

      return Math.round(value * factor) / factor;
    }
  };
});
