/*

  chop.js
  Licensed under the MIT license
  Copyright (c) Feifei Hang, 2014
  https://github.com/hufyhang/chop

*/

(function (window, undefined) {
  'use strict';
  var root = window;

  // browser utils functions//{{{
  var _isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  if (!Object.create) {
    Object.create = (function(){
      function F(){}

      return function(o){
        if (arguments.length !== 1) {
          throw new Error('Object.create implementation only accepts one parameter.');
        }
        F.prototype = o;
        return new F();
      };
    })();

    if (!Object.keys) {
      Object.keys = function(obj) {
        var keys = [];

        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            keys.push(i);
          }
        }

        return keys;
      };
    }
  }
//}}}

  // chop.js view//{{{
  var chopView = {
    el: undefined,
    html: '',
    render: function () {
      var html;
      if (typeof this.html === 'function') {
        html = this.html();
      } else {
        html = this.html;
      }

      if (this.el !== undefined) {
        this.el.innerHTML = html;
        chop._loadView(this.el);
      } else {
        return html;
      }
    }
  };
//}}}

  // chop.js html element//{{{
  var chopEl = {
    el: undefined,
    _views: [],
    focus: function () {
      this.el.focus();
      return this;
    },

    val: function (val) {
      if (val !== undefined) {
        this.el.value = val;
        return this;
      } else {
        return this.el.value;
      }
    },

    html: function (html) {
      if (html) {
        this.el.innerHTML = html;
        return this;
      } else {
        return this.el.innerHTML;
      }
    },

    append: function (html) {
      if (html !== undefined) {
        this.el.innerHTML = this.el.innerHTML + html;
      }
      return this;
    },

    show: function () {
      this.el.style.display = 'block';
      return this;
    },

    hide: function () {
      this.el.style.display = 'none';
      return this;
    },

    attr: function (key, value) {
      if (arguments.length === 0) {
        return this.el.attributes;
      } else {
        if (arguments.length === 2) {
          this.el.setAttribute(key, value);
        }
        return this;
      }
    },

    on: function (evt, callback) {
      if (arguments.length !== 2) {
        throw new Error('$ch.on requires an event and a callback parameter.');
      }

      this.el.addEventListener(evt, callback);
    },

    click: function (callback) {
      if (callback === undefined) {
        this.el.click();
      } else {
        this.el.addEventListener('click', callback);
        return this;
      }
    },

    keypress: function (callback) {
      if (callback === undefined) {
        throw new Error('$ch.keypress requires a parameter.');
      } else {
        this.el.addEventListener('keypress', callback);
        return this;
      }
    },

    change: function (callback) {
      if (callback === undefined) {
        throw new Error('$ch.keypress requires a parameter.');
      } else {
        this.el.addEventListener('change', callback);
        return this;
      }
    },

    _cssReplacer: function (match, p1) {
      p1 = p1.replace(/-/g, '');
      return p1.toUpperCase();
    },
    css: function (key, value) {
      if (arguments.length !== 0) {
        key = key.replace(/(-[a-z])/g, this._cssReplacer);
        this.el.style[key] = value;
        return this;
      } else {
        return this.el.style.cssText;
      }
    },

    view: function (v) {
      if (v) {
        var baseElement = this.el;
        baseElement.innerHTML = '';
        var isAppending = false;
        if (_isArray(v)) {
          isAppending = true;
          for (var index = 0; index !== v.length; ++index) {
            var item = v[index];
            this._addView(baseElement, item, isAppending);
          }
        } else {
          this._addView(baseElement, v);
        }
        chop._loadView(baseElement);
      }
    },

    _addView: function (baseElement, v, isAppending) {
      var result;
      if (typeof v.html === 'function') {
        result = v.html();
      } else {
        result = v.html;
      }
      if (result !== undefined) {
        if (isAppending === true) {
          baseElement.innerHTML += result;
        } else {
          baseElement.innerHTML = result;
        }
      }
      this._views.push(v);
    },

    inline: function (source) {
      if (arguments.length === 0) {
        return;
      }
      var element = this.el;
      var id = element.id;
      if (id === undefined || chop._inlineTemplates[id] === undefined) {
        throw new Error('ID attribute is mandatory for chop.js inline template.');
      }

      var template = chop._inlineTemplates[id];
      var html = '';
      var founds, found, obj, i, ii;
      if (_isArray(source)) {
        for (i = 0; i !== source.length; ++i) {
          html += template;
          obj = source[i];
          founds = template.match(/{{.+?}}/g);

          for (ii = 0; ii !== founds.length; ++ii) {
            found = founds[ii].replace(/{/g, '');
            found = found.replace(/}/g, '');
            html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
          }

        }
      } else {
        html = template;
        founds = template.match(/{{.+?}}/g);
        obj = source;

        for (ii = 0; ii !== founds.length; ++ii) {
          found = founds[ii].replace(/{/g, '');
          found = found.replace(/}/g, '');
          html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
        }

      }
      this.el.innerHTML = html;
    },
  };
//}}}

  // chop//{{{
  var chop = {
    _path: '',
    els: [],
    modules: {},
    sources: {},
    find: function (query) {
      if (query !== undefined) {
        var htmlElement = document.querySelector(query);
        if (!htmlElement) {
          return undefined;
        }

        var elt = Object.create(chopEl);
        elt.el = htmlElement;
        return elt;
      } else {
        throw new Error('$ch.find requires a parameter.');
      }
    },

    findAll: function (query) {
      if (query !== undefined) {
        var els = document.querySelectorAll(query);
        var elts = [];
        for (var index = 0; index !== els.length; ++index) {
          var elt = Object.create(chopEl);
          elt.el = els[index];
          elts[index] = elt;
        }
        return elts;
      } else {
        throw new Error('$ch.findAll requires a parameter.');
      }
    },

    view: function (data) {
      if (arguments.length === 0) {
        throw new Error('$ch.view requires a parameter.');
      }

      var obj = Object.create(chopView);
      if (data.html) {
        obj.html = data.html;
      }
      return obj;
    },

    template: function (html, data) {
      if (!html && !data) {
        throw new Error('invalid parameters for $ch.template.');
      }

      if (!data) {
        return html;
      }

      var founds = html.match(/{{.+?}}/g);
      if (founds) {
        founds.forEach(function (found) {
          var key = found.replace(/{/g, '');
          key = key.replace(/}/g, '');
          if (data[key] !== undefined) {
            html = html.replace(found, data[key]);
          }
        });
      }
      // espace \{, \}
      html = html.replace(/\\{/g, '{');
      html = html.replace(/\\}/g, '}');
      return html;
    },

    _addEvent: function (baseElement, attr, evt) {
      var elements = baseElement.querySelectorAll('[' + attr + ']');
      for (var index = 0; index !== elements.length; ++index) {
        var callback = elements[index].getAttribute(attr);
        callback = callback.replace(/\$\$event/g, 'arguments[0]');

        var founds = callback.match(/{{.+?}}/g);
        if (founds) {
          for (var i = 0; i !== founds.length; ++i) {
            var found = founds[i];
            var key = found.replace(/{/g, '');
            key = key.replace(/}/g, '');
            // check if using pipe operations e.g. filter
            var parts = key.split('|');
            if (parts.length === 1) {
              callback = callback.replace(found, '$ch.sources.' + key + '.data');
            } else {
              key = parts[0].trim();
              // iterate pipe operations
              for (var ii = 1; ii !== parts.length; ++ii) {
                var opt = parts[ii].trim();
                var isFilter = opt.match(/filter\:.+/g) !== null;
                if (isFilter) {
                  opt = opt.replace(/filter\:\ */g, '');
                  callback = callback.replace(found, '$ch.filter($ch.sources.' +
                                              key + '.data, ' + opt + ')');
                }
              }
            }
          }
        }
        // espace \{, \}
        callback = callback.replace(/\\{/g, '{');
        callback = callback.replace(/\\}/g, '}');

        var func = new Function (callback);
        elements[index].addEventListener(evt, func);
      }
    },
    _registerEvents: function (baseElement) {
      if (baseElement === undefined) {
        baseElement = document;
      }

      // event: click
      this._addEvent(baseElement, 'ch-click', 'click');
      // event: dbclick
      this._addEvent(baseElement, 'ch-dbclick', 'dbclick');

      // event: keypress
      this._addEvent(baseElement, 'ch-keypress', 'keypress');
      // event: keydown
      this._addEvent(baseElement, 'ch-keydown', 'keydown');
      // event: keyup
      this._addEvent(baseElement, 'ch-keyup', 'keyup');

      // event: change
      this._addEvent(baseElement, 'ch-change', 'change');

      // event: mousedown
      this._addEvent(baseElement, 'ch-mousedown', 'mousedown');
      // event: mouseup
      this._addEvent(baseElement, 'ch-mouseup', 'mouseup');
      // event: mouseenter
      this._addEvent(baseElement, 'ch-mouseenter', 'mouseenter');
      // event: mousemove
      this._addEvent(baseElement, 'ch-mousemove', 'mousemove');
      // event: mouseout
      this._addEvent(baseElement, 'ch-mouseout', 'mouseout');
      // event: mouseover
      this._addEvent(baseElement, 'ch-mouseover', 'mouseover');
      // event: mouseleave
      this._addEvent(baseElement, 'ch-mouseleave', 'mouseleave');
    },

    _inlineTemplates: {},
    _renderInline: function (baseElement) {
      if (baseElement === undefined) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-inline]');
      var element, renderStr, source;
      var i;
      for (var index = 0; index !== elements.length; ++index) {
        element = elements[index];
        var id = element.getAttribute('id');
        if (id === undefined) {
          continue;
        }

        renderStr = element.getAttribute('ch-inline');
        renderStr = renderStr.replace(/{{/g, '');
        renderStr = renderStr.replace(/}}/g, '');
        var parts = renderStr.split('|');

        source = chop.source(parts[0].trim());

        if (parts.length > 1) {
          for (i = 1; i !== parts.length; ++i) {
            var part = parts[i].trim();
            var isFilter = part. match(/filter\:.+/g) !== null;
            if (isFilter) {
              part = part.replace(/filter\:\ */g, '');
              source = chop.filter(source, window[part]);
            }
          }
        }

        var template = element.innerHTML;
        this._inlineTemplates[id] = template;
        var html = '';
        var founds, found, obj, ii;
        if (_isArray(source)) {
          for (i = 0; i !== source.length; ++i) {
            html += template;
            obj = source[i];
            founds = template.match(/{{.+?}}/g);

            for (ii = 0; ii !== founds.length; ++ii) {
              found = founds[ii].replace(/{/g, '');
              found = found.replace(/}/g, '');
              html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
            }

          }
        } else {
          html = template;
          founds = template.match(/{{.+?}}/g);
          obj = source;

          for (ii = 0; ii !== founds.length; ++ii) {
            found = founds[ii].replace(/{/g, '');
            found = found.replace(/}/g, '');
            html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
          }

        }
        html = html.replace(/\\{/g, '{');
        html = html.replace(/\\}/g, '{');
        element.innerHTML = html;

        chop._loadView(element);
      }
    },

    _loadMain: function () {
      var element = document.querySelector('script[ch-main]');
      if (element === null) {
        chop._loadView();
        return;
      }

      var script = element.getAttribute('ch-main');
      this._path = script.substring(0, script.lastIndexOf('/') + 1);
      if (script) {
        var scriptEl = document.createElement('script');
        scriptEl.src = script;
        document.querySelector('head').appendChild(scriptEl);
        scriptEl.onload = function () {
          chop._loadView();
        };
      }
    },

    _loadView: function (baseElement) {
      var callbackName;
      if (baseElement === undefined) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-view]');
      for (var index = 0; index !== elements.length; ++index) {
        callbackName = elements[index].getAttribute('ch-view');
        callbackName = callbackName.replace(/\ /g, '');
        elements[index].innerHTML = '';
        var vs = callbackName.split(',');
        var v;
        for (var i = 0; i !== vs.length; ++i) {
          v = vs[i];
          window[v].el = undefined;
          var result = window[v].render();
          window[v].el = elements[index];
          if (result) {
            elements[index].innerHTML += result;
          }
        }
      }
      chop._registerEvents(baseElement);
      chop._bindSources(baseElement);
      chop._renderInline(baseElement);
    },

    http: function (param) {
      if (!param.url) {
        throw new Error('URL parameter not found for $ch.http.');
      }

      var url = param.url;
      var method = param.method || 'GET';
      method = method.toUpperCase();
      var data = param.data || {};
      var tempData = '';
      for (var item in data) {
        if (data.hasOwnProperty(item)) {
          tempData += item + '=' + data[item] + '&';
        }
      }
      data = tempData.slice(0, -1);

      var callback = param.done || function () {return false;};
      if (param.async === undefined) {
        param.async = true;
      }
      var async = param.async;

      var ajax;
      if (window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
      } else {
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
      }
      ajax.open(method, url, async);
      ajax.onreadystatechange = function () {
        if (ajax.readyState !== 4) {
          return;
        }
        if (async) {
          callback({data: ajax.responseText, status: ajax.status});
        }
      };

      var hasDataToSend = method &&
          method.toUpperCase() !== 'GET' && data.length !== 0;
      if (hasDataToSend) {
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send(data);
      } else {
        ajax.send();
      }

      if (!async) {
        return ajax.responseText;
      }
    },

    define: function (name, callback) {
      this.modules[name] = callback();
    },

    _useModule: function (srcs, callback) {
      var tempSrcs = srcs;
      var script = tempSrcs.shift();
      var scriptEl;
      var that = this;

      var hasScriptInHead = document.querySelector('script[ch-module="' +
                                                   script + '"]');
      if (!hasScriptInHead) {
        // synchronously download script
        var text = this.http({
          url: this._path + script + '.js',
          method: 'get',
          async: false
        });

        scriptEl = document.createElement('script');
        scriptEl.setAttribute('ch-module', script);
        scriptEl.text = text;
        document.querySelector('head').appendChild(scriptEl);
        that._executeModule(tempSrcs, callback);
      } else {
        this._executeModule(tempSrcs, callback);
      }
    },

    _executeModule: function (srcs, callback) {
      if (srcs.length) {
        this._useModule(srcs, callback);
      } else {
        if (callback) {
          callback();
        }
      }
    },

    require: function (srcs, callback) {
      if (!srcs) {
        return false;
      }

      if (!_isArray(srcs)) {
        srcs = [srcs];
      }

      this._useModule(srcs, callback);
    },

    module: function (mod) {
      if (mod !== undefined) {
        return this.modules[mod];
      } else {
        return this.modules;
      }
    },

    source: function (key, data) {
      if (arguments.length === 0) {
        return this.sources;
      }

      if (arguments.length === 1) {
        var src = this.sources[key];
        return src === undefined
          ? undefined
          : src.data;
      }

      var goodToSet = arguments.length === 2 &&
                this.sources[key] !== undefined;
      if (goodToSet) {
        var source = this.sources[key];
        source.data = data;
        for (var index = 0, l = source.els.length; index !== l; ++index) {
          var element = source.els[index];
          var tag = element.tagName.toUpperCase();
          if (tag === 'INPUT' || tag === 'TEXTAREA') {
            element.value = data;
          } else {
            element.innerHTML = data;
          }
        }
      } else {
        if (arguments.length === 2) {
          this.sources[key] = {};
          this.sources[key].els = [];
          this.sources[key].data = data;
          return this.sources[key];
        }

        return false;
      }
    },

    _bindSources: function (baseElement) {
      if (baseElement === undefined) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-source]');
      for (var index = 0; index !== elements.length; ++index) {
        var element = elements[index];
        var name = element.getAttribute('ch-source');
        var source = this.sources[name];
        var val = '';
        if (source === undefined) {
          this.sources[name] = {};
          source = this.sources[name];
          source.els = [];
          if (element.value !== undefined) {
            val = element.value;
          }
        }
        source.els.push(element);
        source.data = val;

        element.addEventListener('keyup', function () {
          source.data = this.value;
          source.els.forEach(function (item) {
            var valueContainer;
            if (item.tagName.toUpperCase() === 'INPUT') {
              valueContainer = 'value';
            } else {
              valueContainer = 'innerHTML';
            }

            if (item[valueContainer] !== source.data) {
              item[valueContainer] = source.data;
            }
          });
        });
      }
    },


    each: function (obj, callback) {
      var func, item, index;
      if (arguments.length !== 2) {
        throw new Error('$ch.each requires two parameters (i.e. obj, callback).');
      }

      func = callback;

      if (_isArray(obj)) {
        for (index = 0; index !== obj.length; ++index) {
          item = obj[index];
          func(item, index, obj);
        }
      } else {
        var keys = Object.keys(obj);
        for (index = 0; index !== keys.length; ++index) {
          var key = keys[index];
          var value = obj[key];
          func(key, value, index, obj);
        }
      }
    },

    filter: function (obj, expr) {
      var results = [];
      if (arguments.length !== 2) {
        throw new Error('$ch.filter requires two parameters (i.e. obj, expr).');
      }

      if (obj === undefined || obj === null) {
        return results;
      }

      for (var index = 0; index !== obj.length; ++index) {
        var item = obj[index];
        if (expr(item) === true) {
          results.push(item);
        }
      }

      return results;
    },

    store: function (key, value) {
      if (typeof Storage === 'undefined') {
        throw new Error('Local storage is not supported by browser.');
      }

      if (arguments.length === 0) {
        throw new Error('$ch.store requires at least one parameter.');
      }

      if (arguments.length === 1) {
        var data = localStorage.getItem(key);
        if (data !== null) {
          data = JSON.parse(data);
        }
        return data;
      } else {
        if (value === undefined) {
          throw new Error('$ch.store does not allow undefined value.');
        }

        localStorage.setItem(key, JSON.stringify(value));
      }
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
//}}}

  root.$ch = chop;
  root.$$CHOP = chop;
  root.$$CHOPEL = chopEl;
  root.$$CHOPVIEW = chopView;

  root.onload = function () {
    chop._loadMain();
  };
}(window));
