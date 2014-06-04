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
      return Math.round(value * 100) / 100;
    }
  };
});
