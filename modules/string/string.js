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
          key = key.replace(/}/g, '');
          if (data[key] !== undefined) {
            pattern = pattern.replace(regex, data[key]);
          }
        });
      }

      pattern = pattern.replace(/\\{/g, '{');
      pattern = pattern.replace(/\\}/g, '}');

      return pattern;
    },

    buffer: function (str) {
      var buf = {
        buffer: [],
        append: function (data) {
          if (data !== undefined) {
            if ($$CHOP.isArray(data)) {
              var that = this;
              $$CHOP.each(data, function (item) {
                that.buffer.push(item);
              });
            } else {
              this.buffer.push(data);
            }
          }
          return this;
        },

        prepend: function (data) {
          if (data !== undefined) {
            if ($$CHOP.isArray(data)) {
              var that = this;
              for (var index = data.length - 1, len = 0; index >= len; --index) {
                that.buffer.unshift(data[index]);
              }
            } else {
              this.buffer.unshift(data);
            }
          }
          return this;
        },

        dump: function (chars) {
          if (chars === undefined) {
            chars = '';
          }
          var result = this.buffer.join(chars);
          this.buffer = [];
          return result;
        },

        toString: function (chars) {
          if (chars === undefined) {
            chars = '';
          }
          return this.buffer.join(chars);
        }
      };

      if (str !== undefined) {
        if (typeof str === 'object' && $$CHOP.isArray(str)) {
          $$CHOP.each(str, function (item) {
            buf.append(item);
          });
        } else {
          buf.append(str);
        }
      }
      return buf;
    }

  };
});
