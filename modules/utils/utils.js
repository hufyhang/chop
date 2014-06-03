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
    }
  };

});
