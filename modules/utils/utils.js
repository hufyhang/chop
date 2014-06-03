/* global $ch, $$CHOP */
$ch.define('utils', function () {
  'use strict';
  $$CHOP.utils = {};

  $$CHOP.utils.extend = function(destination, source) {
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
  };

});
