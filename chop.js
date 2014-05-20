/* global Sizzle */
(function (window, undefined) {
  'use strict';
  var root = window;

  var _isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

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
        this.el.html(html);
        chop._loadView(this.el.el);
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
      if (html) {
        this.el.innerHTML = this.el.innerHTML + html;
      }
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

    click: function (callback) {
      if (!callback) {
        this.el.click();
      } else {
        this.el.addEventListener('click', callback);
        return this;
      }
    },

    keypress: function (callback) {
      if (!callback) {
        return false;
      } else {
        this.el.addEventListener('keypress', callback);
        return this;
      }
    },

    change: function (callback) {
      if (!callback) {
        return false;
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
      var result = v.render();
      // v.el = baseElement;
      if (result) {
        if (isAppending) {
          baseElement.innerHTML += result;
        } else {
          baseElement.innerHTML = result;
        }
      }
      this._views.push(v);
    }

  };
//}}}

  // router//{{{
  var Router = {
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
      if (!params) {
        return false;
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
//}}}

  // chop//{{{
  var chop = {
    _path: '',
    els: [],
    modules: {},
    sources: {},
    router: Router,
    find: function (query) {
      if (query) {
        var htmlElement = document.querySelector(query);
        if (!htmlElement) {
          return undefined;
        }

        var elt = Object.create(chopEl);
        elt.el = htmlElement;
        return elt;
      }
      return false;
    },

    findAll: function (query) {
      if (query) {
        var els = document.querySelectorAll(query);
        var elts = [];
        for (var index = 0; index !== els.length; ++index) {
          var elt = Object.create(chopEl);
          elt.el = els[index];
          elts[index] = elt;
        }
        return elts;
      }
      return false;
    },

    view: function (data) {
      if (!data) {
        return false;
      }

      var obj = Object.create(chopView);
      if (data.html) {
        obj.html = data.html;
      }
      return obj;
    },

    template: function (html, data) {
      if (!html && !data) {
        return false;
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
        callback = callback.replace(/\$ch\.event/g, 'arguments[0]');

        var founds = callback.match(/{{.+?}}/g);
        if (founds) {
          for (var i = 0; i !== founds.length; ++i) {
            var found = founds[i];
            var key = found.replace(/{/g, '');
            key = key.replace(/}/g, '');
            callback = callback.replace(found, '$ch.sources.' + key + '.data');
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
      // event: keypress
      this._addEvent(baseElement, 'ch-keypress', 'keypress');
      // event: keydown
      this._addEvent(baseElement, 'ch-keydown', 'keydown');
      // event: keyup
      this._addEvent(baseElement, 'ch-keyup', 'keyup');
      // event: change
      this._addEvent(baseElement, 'ch-change', 'change');
    },

    _loadMain: function () {
      var element = document.querySelector('script[ch-main]');
      if (!element) {
        return false;
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
          var result = window[v].render();
          if (result) {
            elements[index].innerHTML += result;
          }
        }
      }
      chop._registerEvents(baseElement);
      chop._bindSources(baseElement);
    },

    http: function (param) {
      if (!param.url) {
        return false;
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
          if (element.tagName.toUpperCase() === 'INPUT') {
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
    }
  };
//}}}

  root.$ch = chop;
  root.onload = function () {
    chop._loadMain();
  };
}(window));
