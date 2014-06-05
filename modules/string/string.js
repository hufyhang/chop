/* global $ch, $$CHOP */
$ch.define('string', function () {
  'use strict';
  $$CHOP.string = {};

  $$CHOP.string = {
    build: function (pattern, data) {
      if (arguments.length === 0) {
        throw new Error('$ch.string.build requires at least one pattern parameter.');
      }

      if (typeof data === 'object' && $$CHOP.isArray(data) === false) {
        var founds = pattern.match(/{{.+?}}/g);
        $$CHOP.each(founds, function (found) {
          var regex = new RegExp(found, 'g');
          var key = '';
          key = found.replace(/{/g, '');
          key = found.replace(/}/g, '');
          console.log(key);
          if (data[key] !== undefined) {
            pattern = pattern.replace(regex, data[key]);
          }
        });

        // pattern = pattern.replace(/\\{/g, '{');
        // pattern = pattern.replace(/\\}/g, '}');
      }
      return pattern;
    }
  };
});
