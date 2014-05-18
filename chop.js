(function (window, undefined) {
  'use strict';
  var root = window;

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

      if (this.el) {
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

    val: function (value) {
      if (value) {
        this.el.value = value;
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

    view: function (v, autoRender) {
      if (v) {
        this.el.innerHTML = '';
        if (Array.isArray(v)) {
          var isAppending = v.length > 1;
          for (var index = 0; index !== v.length; ++index) {
            this._addView(v[index], autoRender, isAppending);
          }
        } else {
          this._addView(v, autoRender);
        }
        chop._registerEvents(this.el);
      }
    },

    _addView: function (v, autoRender, isAppending) {
      v.el = this;
      var result;
      if (autoRender === undefined || autoRender) {
        result = v.render();
        if (result) {
          if (isAppending) {
            this.el.innerHTML += v.render();
          } else {
            this.el.innerHTML = v.render();
          }
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
        if (!Array.isArray(re)) {
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
      var routeEvent = this.routes[re];
      if (routeEvent) {
        routeEvent();
      }
      return this;
    }
  };
//}}}

  // chop//{{{
  var chop = {
    els: [],
    modules: {},
    router: Router,
    find: function (query) {
      if (query) {
        var elt = Object.create(chopEl);
        elt.el = document.querySelector(query);
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
          if (data[key]) {
            html = html.replace(found, data[key]);
          }
        });
      }
      // espace \{, \}
      html = html.replace(/\\{/g, '{');
      html = html.replace(/\\}/g, '}');
      return html;
    },

    _addEvent: function (baseElement, attr, event) {
      var elements = baseElement.querySelectorAll('[' + attr + ']');
      for (var index = 0; index !== elements.length; ++index) {
        var callbackName = elements[index].getAttribute(attr);
        elements[index].addEventListener(event, window[callbackName]);
      }
    },
    _registerEvents: function (baseElement) {
      if (!baseElement) {
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
      if (!baseElement) {
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

      var ajax = new XMLHttpRequest();
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
        ajax.setRequestHeader("Content-length", data.length);
        ajax.setRequestHeader("Connection", "close");
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
          url: script + '.js',
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

      if (!Array.isArray(srcs)) {
        srcs = [srcs];
      }

      this._useModule(srcs, callback);
    }
  };
//}}}

  root.$ch = chop;
  root.onload = function () {
    chop._loadMain();
  };
}(window));
