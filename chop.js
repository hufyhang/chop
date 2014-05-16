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
          var isArray = true;
          for (var index = 0; index !== v.length; ++index) {
            this._addView(v[index], autoRender, isArray);
          }
        } else {
          this._addView(v, autoRender);
        }
      }
    },

    _addView: function (v, autoRender, isArray) {
      if (!v.render) {
        v.render = function () {
          return false;
        };
      }
      if (autoRender === undefined || autoRender) {
        if (isArray) {
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
    el: function (query) {
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
      var founds = html.match(/{{.+?}}/g);
      for (var index = 0; index !== founds.length; ++index) {
        var key = founds[index].replace(/{/g, '');
        key = key.replace(/}/g, '');
        if (data[key]) {
          html = html.replace(founds[index], data[key]);
        }
      }
      return html;
    }
  };

  root.$ch = chop;
}(window));
