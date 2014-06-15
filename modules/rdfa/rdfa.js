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

    _checkProperty: function (found, result, buffer, main) {
      var elements = found.querySelectorAll('[property],[rel]');
      $$CHOP.each(elements, function (element) {
        var href = element.getAttribute('href');
        var t = element.getAttribute('typeof');
        var attr = element.getAttribute('property') || element.getAttribute('rel');
        var value = element.getAttribute('content') || element.getAttribute('resource') ||
         t || href || element.innerHTML;

        if (t !== null) {
          if (result[main][attr] === undefined || $$CHOP.isArray(result[main][attr]) === false) {
            result[main][attr] = [];
          }
          result[main][attr].push(value);
        } else {
          if (href !== null) {
            if (result[main][attr] === undefined || $$CHOP.isArray(result[main][attr]) === false) {
              result[main][attr] = [];
            }
            result[main][attr].push(href);
          } else {
            result[main][attr] = value;
          }
          buffer.push(element);
        }

      });
      return result;
    },

    _linkSubjects: function (subjects, toBeRemoved) {
      var that = this;
      $$CHOP.each(subjects, function (key, subject) {
        delete subject.graph;
        delete subject.origins;
        var predicates = subject.predicates;
        if (predicates === undefined) {
          return;
        }

        $$CHOP.each(predicates, function (key, predicate) {
          var objs = predicate.objects;
          if ($$CHOP.isArray(objs) === false) {
            return;
          }

          $$CHOP.each(objs, function (object) {
            delete object.origin;
            var subjectName = object.value;
            if (subjects[subjectName] !== undefined) {
              var subj = subjects[subjectName];
              subj = that._linkSubjects(subj, toBeRemoved);
              object.subject = subj;
              toBeRemoved.push(subjectName);
            }
          });
        });

      });

      return subjects;
    },

    graph: function () {
      var subjects = document.data.graph.subjects;
      var toBeRemoved = [];
      subjects = this._linkSubjects(subjects, toBeRemoved);
      $$CHOP.each(toBeRemoved, function (item) {
        delete subjects[item];
      });
      return subjects;
    },

    subject: function (sub) {
      if (typeof sub !== 'string') {
        return document.data.graph.subjects;
      } else {
        return document.data.getSubject(sub);
      }
    }

  };

});
