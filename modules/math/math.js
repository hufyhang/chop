/* global $ch, $$CHOP */
$ch.define('math', function () {
  'use strict';

  $$CHOP.math = {};

  // Add the cot function to the Math object
  function cot(aValue)
  {
    return 1/Math.tan(aValue);
  }
  // Register the new function
  Math.constructor.prototype.cot = cot;

  var generateEval = function (str) {
    var sins =  str.match(/sin\(.*?\)/g);
    if (sins !== null) {
      $$CHOP.each(sins, function (sin) {
        var mathStr = sin.replace(/sin\(/g, 'Math.sin(');
        str = str.replace(sin, mathStr);
      });
    }

    var coss =  str.match(/cos\(.*?\)/g);
    if (coss !== null) {
      $$CHOP.each(coss, function (cos) {
        var mathStr = cos.replace(/cos\(/g, 'Math.cos(');
        str = str.replace(cos, mathStr);
      });
    }

    var tans =  str.match(/tan\(.*?\)/g);
    if (tans !== null) {
      $$CHOP.each(tans, function (tan) {
        var mathStr = tan.replace(/tan\(/g, 'Math.tan(');
        str = str.replace(tan, mathStr);
      });
    }

    var cots =  str.match(/cot\(.*?\)/g);
    if (cots !== null) {
      $$CHOP.each(cots, function (cot) {
        var mathStr = cot.replace(/cot\(/g, 'Math.cot(');
        str = str.replace(cot, mathStr);
      });
    }

    var sqrts =  str.match(/sqrt\(.*?\)/g);
    if (sqrts !== null) {
      $$CHOP.each(sqrts, function (sqrt) {
        var mathStr = sqrt.replace(/sqrt\(/g, 'Math.sqrt(');
        str = str.replace(sqrt, mathStr);
      });
    }

    var pows =  str.match(/\d\ *\^\ *\d/g);
    if (pows !== null) {
      $$CHOP.each(pows, function (pow) {
        var mathStr = pow.replace(/\^/g, ',');
        mathStr = 'Math.pow(' + mathStr + ')';
        str = str.replace(pow, mathStr);
        console.log(str);
      });
    }


    return str;
  };

  $$CHOP.math = {
    eval: function (calc) {
      if (arguments.length !== 1) {
        throw new Error('$ch.math.eval requires a calculation parameter.');
      }

      if (typeof calc !== 'string') {
        return false;
      }

      calc = generateEval(calc);
      var value = eval(calc);
      var valueStr = value + '';
      var factor = 2;
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
