/* global $ch, $$CHOP */
$ch.define('string', function () {
  'use strict';
  $$CHOP.string = {};

  $$CHOP.string = {
    build: function (pattern, data) {
      if (arguments.length === 0) {
        throw new Error('$ch.string.build requires at least one pattern parameter.');
      }

      pattern = pattern.replace(/\\{/g, '{');
      pattern = pattern.replace(/\\}/g, '}');

      if (typeof data === 'object' && $$CHOP.isArray(data) === false) {
        var founds = pattern.match(/{{.+?}}/g);
        $$CHOP.each(founds, function (found) {
          var regex = new RegExp(found, 'g');
          var key = '';
          key = found.replace(/{/g, '');
          key = key.replace(/}/g, '');
          if (data[key] !== undefined) {
            pattern = pattern.replace(regex, data[key]);
          }
        });
      }
      return pattern;
    },

    buffer: function (str) {
      var buf = {
        buffer: [],
        append: function (data) {
          if (data !== undefined) {
            if ($$CHOP.isArray) {
              $$CHOP.each(data, function (item) {
                this.buffer.push(item);
              });
            } else {
              this.buffer.push(data);
            }
          }
          return this;
        },

        prepend: function (data) {
          if (data !== undefined) {
            if ($$CHOP.isArray) {
              for (var index = data.length - 1, len = 0; index >= len; --index) {
                this.buffer.unshift(data[index]);
              }
            } else {
              this.buffer.unshift(data);
            }
          }
          return this;
        },

        dump: function () {
          var result = this.buffer.join('');
          this.buffer = [];
          return result;
        },

        toString: function () {
          return this.buffer.join('');
        }
      };

      if (str !== undefined) {
        if ($$CHOP.isArray(str)) {
          $$CHOP.each(str, function (item) {
            buf.append(item);
          });
        }
      } else {
        buf.append(str);
      }

      return buf;
    }

  };
});
