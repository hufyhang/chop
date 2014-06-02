/* global $ch, $$CHOP */
$ch.define('router', function () {
  'use strict';

  var _isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  $$CHOP.router = {};

  $$CHOP.router = {
    routes: {},
    mode: 'hash',
    root: '/',
    getFragment: function() {
      var match = window.location.href.match(/#(.*)$/);
      var fragment = match ? match[1] : '';
      return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
      return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(params) {
      if (params === undefined) {
        throw new Error('$ch.router.add requires a parameter.');
      }

      var re, handler;
      for (var item in params) {
        if (params.hasOwnProperty(item)) {
          re = item;
          handler = params[item];

          this.routes[re] = handler;
        }
      }
      return true;
    },
    remove: function(re) {
      if (re) {
        if (!_isArray(re)) {
          re = [re];
        }

        re.forEach(function (item) {
          delete this.routes[item];
        });
      }
      return this;
    },
    flush: function() {
      this.routes = {};
      this.mode = 'hash';
      this.root = '/';
      return this;
    },
    navigate: function(path) {
      if (arguments.length === 0) {
        throw new Error('$ch.navigate requires a parameter.');
      }

      path = path ? path : '';
      var firstNotSlash = path.match(/^\/.*/);
      if (!firstNotSlash) {
        path = '/' + path;
      }
      window.location.href.match(/#(.*)$/);
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
      var re = this.getFragment(path);
      var params = {};

      var keys = Object.keys(this.routes);
      for (var index = 0, l = keys.length; index !== l; ++index) {
        var exp = keys[index];
        exp = exp.replace(/:\w+/g, '.+');
        var regex = new RegExp(exp);

        // find matched routing pattern
        var matchedUrl = re.match(regex);
        if (matchedUrl !== null) {
          var routePath = keys[index];
          var order = [];

          var founds = routePath.match(/:\w+/g);
          if (founds !== null) {
            var i, len;
            var parts = routePath.split('/');
            // extract param patterns and order from routing setup
            for (i = 0, len = founds.length; i !== len; ++i) {
              var found = founds[i];
              var pos = parts.indexOf(found);
              var name = found.replace(/:/, '');
              if (pos !== -1 && params[name] === undefined) {
                order.push(pos);
                params[name] = '';
              }
            }

            // now extract url params according to fetched param order
            parts = re.split('/');
            var keyNames = Object.keys(params);
            for (i = 0, len = order.length; i !== len; ++i) {
              var number = order[i];
              params[keyNames[i]] = parts[number];
            }
          }
        }
      }

      // finally, find and fire coresponding callback function
      keys = Object.keys(this.routes);
      for (var ii = 0; ii !== keys.length; ++ii) {
        var pattern = keys[ii];
        var original = keys[ii];
        if (pattern !== undefined) {
          pattern = pattern.replace(/\//g, '\\\/');
          pattern = pattern.replace(/:\w+/g, '.+');
          var regexp = new RegExp(pattern);
          if (re.match(regexp) !== null) {
            this.routes[original](params);
          }
        }
      }

      return this;
    }
  };

});
