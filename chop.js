(function (window, undefined) {
  'use strict';
  var root = window;

  var chopView = {
    render: function () {
      return false;
    }
  };

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
        if (Array.isArray(v)) {
          var isAppending = v.length > 1;
          for (var index = 0; index !== v.length; ++index) {
            this._addView(v[index], autoRender, isAppending);
          }
        } else {
          this._addView(v, autoRender);
        }
        chop._registerEvents();
      }
    },

    _addView: function (v, autoRender, isAppending) {
      if (!v.render) {
        v.render = function () {
          return false;
        };
      }
      if (autoRender === undefined || autoRender) {
        if (isAppending) {
          this.el.innerHTML += v.render();
        } else {
          this.el.innerHTML = v.render();
        }
      }
      this._views.push(v);
    }

  };

  var chop = {
    els: [],
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
      if (data.render) {
        obj.render = data.render;
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
      return html;
    },

    _registerEvents: function () {
      var elements, callbackName;
      var index;
      // event: click
      elements = document.querySelectorAll('[ch-click]');
      for (index = 0; index !== elements.length; ++index) {
        callbackName = elements[index].getAttribute('ch-click');
        elements[index].addEventListener('click', window[callbackName]);
      }
      // event: keypress
      elements = document.querySelectorAll('[ch-keypress]');
      for (index = 0; index !== elements.length; ++index) {
        callbackName = elements[index].getAttribute('ch-keypress');
        elements[index].addEventListener('keypress', window[callbackName]);
      }
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

    _loadView: function () {
      var callbackName;
      var elements = document.querySelectorAll('[ch-view]');
      for (var index = 0; index !== elements.length; ++index) {
        callbackName = elements[index].getAttribute('ch-view');
        elements[index].innerHTML = window[callbackName].render();
      }
      chop._registerEvents();
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
      var async = param.async || true;

      var ajax = new XMLHttpRequest();
      ajax.open(method, url, async);
      ajax.onreadystatechange = function () {
        if (ajax.readyState !== 4) {
          return;
        }
        callback({data: ajax.responseText, status: ajax.status});
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
    }
  };

  root.$ch = chop;
  root.onload = function () {
    chop._loadMain();
  };
}(window));
