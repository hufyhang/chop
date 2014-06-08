/* global $ch, $$CHOP */
$ch.define('model', function () {
  'use strict';

  $$CHOP.model = {};

  var checkModelSource = function (item, model) {
    if (typeof item === 'string') {
      var prop = model._data[item];
      if (typeof prop === 'object' && $$CHOP.isArray(prop) === false) {
        var keys = Object.keys(prop);
        if (keys.indexOf('_chopjs-data-source') !== -1) {
          return $$CHOP.source(prop['_chopjs-data-source']);
        } else {
          return prop;
        }
      } else {
        return model._data[item];
      }
    } else {
      return undefined;
    }
  };

  var processValue = function (v) {
    if (typeof v === 'string') {
      var founds = v.trim().match(/{{[^{]{1,}}}/g);
      if (founds !== null) {
        var src = founds[0].replace(/{/g, '').trim();
        src = src.replace(/}/g, '').trim();
        src = src.replace(/\\{/g, '{');
        src = src.replace(/\\}/g, '}');
        v = {};
        v = {'_chopjs-data-source': src};
      } else {
        v = v.replace(/\\{/g, '{');
        v = v.replace(/\\}/g, '}');
      }
    }
    return v;
  };

  $$CHOP.model = function (data) {
    var model = {
      _data: {},

      reset: function () {
        this._data = {};
        return this;
      },

      size: function () {
        return Object.keys(this._data).length;
      },

      get: function (item) {
        if (item === undefined) {
          return this._data;
        }

        if ($$CHOP.isArray(item)) {
          var result = [];
          var that = this;
          $$CHOP.each(item, function (i) {
            var value = that._data[i];
            result.push(checkModelSource(value, that));
          });

          return result;
        }

        if (typeof item === 'string') {
          return checkModelSource(item, this);
        }
      },

      set: function (key, value) {
        if (arguments.length === 0) {
          return undefined;
        }

        if (arguments.length === 1) {
          var data = key;

          if (typeof key !== 'object' || $$CHOP.isArray(key)) {
            return undefined;
          }

          var that = this;
          $$CHOP.each(data, function (k, v) {
            that._data[k] = {};
            that._data[k] = processValue(v);
          });

          return this;
        }

        if (arguments.length === 2) {
          if (typeof key !== 'string') {
            return undefined;
          }

          this._data[key] = processValue(value);

          return this;
        }
      }
    };

    model = model.set(data);

    return model;
  };
});
