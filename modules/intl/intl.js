/* global $ch, $$CHOP */
$ch.define('intl', function () {
  'use strict';

  $$CHOP.intl = {};

  var originalLoadView = $$CHOP._loadView;

  var loadIntl = function (baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }
    var founds = baseElement.querySelectorAll('[ch-intl]');
    $$CHOP.each(founds, function (element) {
      var key = element.getAttribute('ch-intl');
      var value = $$CHOP.intl.get(key);
      var tagName = element.tagName.toUpperCase();
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        element.value = value;
      } else {
        element.innerHTML = value;
      }
    });
  };

  $$CHOP._loadView = function (baseElement) {
    if (baseElement === undefined) {
      baseElement = document;
    }
    originalLoadView(baseElement);
    loadIntl(baseElement);
  };

  var parsePrefs = function (path) {
    var doc = $$CHOP.http({url: path, async: false});
    var obj = {};
    var lines = doc.split('\n');
    $$CHOP.each(lines, function (line) {
      line = line.trim();
      var isComment = line.match(/^\#.*$/g) !== null;
      var isValid = line.match(/^[0-9A-Za-z\-]+\ *=.*$/g) !== null;
      if (!isComment && isValid) {
        var key = line.split('=')[0].trim();
        var regex = new RegExp(key + '\\ *=');
        var value = line.replace(regex, '').trim();

        obj[key] = value;
      }
    });

    return obj;
  };

  $$CHOP.intl = {
    current: '',
    languages: {},

    init: function (def, data) {
      if (arguments.length !== 2) {
        throw new Error('$ch.intl.init requires two parameters.');
      }
      if (typeof def !== 'string') {
        throw new Error('$ch.intl.init requires a string-type default parameter.');
      }
      if (typeof data !== 'object' || $$CHOP.isArray(data) === true) {
        throw new Error('$ch.intl.init requires a object data parameter.');
      }
      this.current = def;

      var that = this;
      $$CHOP.each(data, function (key, value) {
        that.languages[key] = {};
        that.languages[key] = parsePrefs(value);
      });

      loadIntl();
    },

    lang: function (lang) {
      if (typeof lang !== 'string') {
        return this.current;
      }

      this.current = lang;
      loadIntl();
      return this;
    },

    get: function (lang, key) {
      if (arguments.length === 0) {
        return this.languages[this.current];
      }

      if (arguments.length === 1) {
        if (typeof lang !== 'string') {
          throw new Error('$ch.intl.get requires string-type parameters.');
        }

        key = lang;
        lang = this.current;
        return this.languages[lang][key];
      }

      if (arguments.length === 2) {
        if (typeof lang !== 'string' || typeof key !== 'string') {
          throw new Error('$ch.intl.get requires string-type parameters.');
        }
        return this.languages[lang][key];
      }
    }

  };

});
