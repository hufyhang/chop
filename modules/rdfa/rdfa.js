/* global $ch, $$CHOP */
$ch.define('rdfa', function () {
  'use strict';
  $$CHOP.rdfa = {};

  var getter = function (scope, attribute, value) {
    if (value === undefined) {
      var els = scope.querySelectorAll('[' + attribute + ']');
      var temp = [];
      $$CHOP.each(els, function (item) {
        item = item.getAttribute(attribute).trim();
        if (temp.indexOf(item) === -1) {
          temp.push(item);
        }
      });
      els = temp;
      return els;

    } else {
      var elements = scope.querySelectorAll('[' + attribute + '="' + value + '"]');
      if (elements === null) {
        return null;
      }

      var result = [];
      $$CHOP.each(elements, function (item) {
        var container = {};
        container.el = item;
        container.scope = container.el;
        container.innerHTML = item.innerHTML;

        var attr = item.getAttribute('href');
        if (attr !== null) {
          container.href = attr;
        }

        attr = item.getAttribute('about');
        if (attr !== null) {
          container.about = attr;
        }

        attr = item.getAttribute('typeof');
        if (attr !== null) {
          container.typeof = attr;
        }

        attr = item.getAttribute('resource');
        if (attr !== null) {
          container.resource = attr;
        }

        attr = item.getAttribute('property');
        if (attr !== null) {
          container.property = attr;
        }

        attr = item.getAttribute('rel');
        if (attr !== null) {
          container.rel = attr;
        }

        attr = item.getAttribute('content');
        if (attr !== null) {
          container.content = attr;
        }

        result.push(container);
      });

      return result;
    }
  };

  $$CHOP.rdfa = {
    scope: document,

    about: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'about', value);
    },

    rel: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'rel', value);
    },

    property: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'property', value);
    },

    typeof: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'typeof', value);
    },

    content: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'content', value);
    },

    resource: function (scope, value) {
      if (arguments.length === 0) {
        scope = this.scope;
        value = undefined;
      }
      else if (arguments.length === 1) {
        if (typeof scope === 'string') {
          value = scope;
          scope = this.scope;
        } else {
          value = undefined;
        }
      }
      return getter(scope, 'resource', value);
    },

    trace: function (scope, target, attr) {
      if (arguments.length === 0) {
        throw new Error('$ch.rdfa.trace requires at least one parameter.');
      }

      if (typeof scope === 'string') {
        target = scope;
        scope = this.scope;
      } else {
        if (arguments.length < 2) {
          throw new Error('$ch.rdfa.trace requires a target parameter.');
        }
      }

      if (attr === undefined) {
        attr = 'href';
      }

      var founds = scope.querySelectorAll('[' + target + ']');
      var result = {};
      $$CHOP.each(founds, function (found) {
        var name = found.getAttribute(attr);
        result[name] = {};

        var element = scope.querySelector('[resource="' + name + '"]');
        if (element === null) {
          element = scope.querySelector('[about="' + name + '"]');
        }

        result[name].scope = element;
        var type = element.getAttribute('typeof');
        result[name].typeof = type;
        var meta = element.querySelectorAll('[property]');
        $$CHOP.each(meta, function (item) {
          var key = item.getAttribute('property');
          var value = item.getAttribute('content') || item.innerHTML;
          result[name][key] = value;
        });

      });

      return result;
    },

    _tree: function (scope, buffer, result, query) {
      if (query === undefined) {
        query = '[about],[resource]';
      } else {
        query = '[about="' + query + '"],[resource="' + query + '"]';
      }

      // get all about/resource first
      var founds = scope.querySelectorAll(query);
      $$CHOP.each(founds, function (found) {
        if (buffer.indexOf(found) === -1) {
          buffer.push(found);
          var name = found.getAttribute('about') || found.getAttribute('resource');
          result[name] = {};
          result[name].typeof = found.getAttribute('typeof');

          var elements = found.querySelectorAll('[property]');
          $$CHOP.each(elements, function (element) {
            buffer.push(element);
            var href = element.getAttribute('href');
            var attr = element.getAttribute('property');
            var value = element.getAttribute('content') || element.innerHTML;
            if (href !== null) {
              if (result[name][attr] === undefined || $$CHOP.isArray(result[name][attr]) === false) {
                result[name][attr] = [];
              }
              result[name][attr].push(href);
            } else {
              result[name][attr] = value;
            }
          });
        }
      });

      // get all stand-alone properties
      founds = scope.querySelectorAll('[property]');
      $$CHOP.each(founds, function (found) {
        if (buffer.indexOf(found) === -1) {
          var attr = found.getAttribute('property');
          if (attr !== null) {
            result[attr] = found.getAttribute('content') || found.innerHTML;
          }
        }
      });

      return result;
    },

    tree: function (scope) {
      if (scope === undefined) {
        scope = this.scope;
      }
      var result = {};
      var buffer = [];

      result = this._tree(scope, buffer, result);

      return result;
    }

  };

});
