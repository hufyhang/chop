/* jshint multistr:true */
/*

  chop.js
  Licensed under the MIT license
  Copyright (c) Feifei Hang, 2014
  https://github.com/hufyhang/chop

*/

(function (window, undefined) {
  'use strict';
  var root = window;
  var MODULE_LOADER = 'http://feifeihang.info/chop/loader.php?module=';

  // var DISPLAY_ELEMENT = document.createElement('style');
  // DISPLAY_ELEMENT.innerHTML = 'html body * {display: none}';
  // root.document.querySelector('head').appendChild(DISPLAY_ELEMENT);

  // bind sizzle
  document.querySelector = function (query) {
    if (arguments.length !== 1) {
      throw new Error ('$ch.find requires one query parameter.');
    }
    var el = Sizzle(query);
    if (el.length === 0) {
      el = null;
    } else {
      el = el[0];
    }
    return el;
  };

  document.querySelectorAll = function (query) {
    if (arguments.length !== 1) {
      throw new Error ('$ch.findAll requires one query parameter.');
    }
    return Sizzle(query);
  };

  Element.prototype.querySelector = function (query) {
    if (arguments.length !== 1) {
      throw new Error ('$ch.find requires one query parameter.');
    }
    var el = Sizzle(query, this);
    if (el.length === 0) {
      el = null;
    } else {
      el = el[0];
    }
    return el;
  };

  Element.prototype.querySelectorAll = function (query) {
    if (arguments.length !== 1) {
      throw new Error ('$ch.findAll requires one query parameter.');
    }
    return Sizzle(query, this);
  };

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
  }

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
      if (html !== undefined) {
        this.el.innerHTML = html;
        return this;
      } else {
        return this.el.innerHTML;
      }
    },

    content: function (data) {
      if (data === undefined) {
        return this.el.textContent;
      } else {
        this.el.textContent = data;
        return this;
      }
    },

    append: function (html) {
      if (html !== undefined) {
        this.el.innerHTML = this.el.innerHTML + html;
      }
      return this;
    },

    attr: function (key, value) {
      if (arguments.length === 0) {
        return this.el.attributes;
      }

      if (arguments.length === 1) {
        var attr = this.el.getAttribute(key);
        return attr;
      }

      if (arguments.length === 2) {
        this.el.setAttribute(key, value);
        return this;
      }
    },

    hasAttr: function (key) {
      if (typeof key !== 'string') {
        throw new Error('.hasAttr requires a string type parameter.');
      }

      return this.el.hasAttribute(key);
    },

    removeAttr: function (key) {
      if (chop.isArray(key)) {
        chop.each(key, function (attr) {
          this.el.removeAttribute(attr);
        });
      }

      if (typeof key === 'string') {
        this.el.removeAttribute(key);
      }
      return this;
    },

    on: function (evt, callback) {
      if (arguments.length !== 2) {
        throw new Error('$ch.on requires an event and a callback parameter.');
      }

      this.el.addEventListener(evt, callback);
      return this;
    },

    detach: function (evt, callback) {
      if (arguments.length !== 2) {
        throw new Error('$ch.detach requires two parameters.');
      }

      this.el.removeEventListener(evt, callback);
      return this;
    },

    delegate: function (evt, callback) {
      if (arguments.length < 3) {
        throw new Error('$ch.delegate requires at least three parameters.');
      }

      for (var index = 2, len = arguments.length; index !== len; ++index) {
        var query = arguments[index];
        var founds = this.el.querySelectorAll(query);

        for (var i = 0, l = founds.length; i !== l; ++i) {
          var found = founds[i];
          found.addEventListener(evt, callback);
        }
      }

      return this;
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
      if (arguments.length === 0) {
        return this.el.style.cssText;
      }

      if (arguments.length === 1) {
        return this.el.style[key];
      }

      if (arguments.length === 2) {
        key = key.replace(/(-[a-z])/g, this._cssReplacer);
        this.el.style[key] = value;
        return this;
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
      return this;
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
      var element = this.el;
      var id = element.id;
      if (id === undefined || chop._inlineTemplates['#' + id] === undefined) {
        throw new Error('ID attribute is mandatory for chop.js inline template.');
      }

      var template = chop._inlineTemplates['#' + id];
      var html = '';
      var founds, found, obj, i, ii;
      if (arguments.length === 0) {
        var inlineStr = element.getAttribute('ch-inline');
        var substr = inlineStr.split('|');
        var src = substr[0].trim();
        var filter;
        if (substr.length > 1) {
          for (var fi = 1; fi !== substr.length; ++fi) {
            if (substr[fi].trim().match(/filter\:.+/g)) {
              filter = substr[fi].trim().replace(/filter\:\ */g, '');
            }
          }
        }

        if (filter === undefined) {
          source = chop.source(src);
        } else {
          source = chop.filter(chop.source(src), window[filter]);
        }

      }
      if (_isArray(source)) {
        for (i = 0; i !== source.length; ++i) {
          html += template;
          obj = source[i];
          founds = template.match(/{{[^{]{1,}}}/g);

          for (ii = 0; ii !== founds.length; ++ii) {
            found = founds[ii].replace(/{/g, '');
            found = found.replace(/}/g, '');
            html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
          }

        }
      } else {
        html = template;
        founds = template.match(/{{[^{]{1,}}}/g);
        obj = source;

        for (ii = 0; ii !== founds.length; ++ii) {
          found = founds[ii].replace(/{/g, '');
          found = found.replace(/}/g, '');
          html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
        }
      }

      html = html.replace(/\\{/g, '{');
      html = html.replace(/\\}/g, '}');
      this.el.innerHTML = html;
      chop._loadView(this.el);
      return this;
    },
  };
//}}}

  // chop//{{{
  var chop = {
    _path: '',
    els: [],
    _chopEls: [],
    modules: {},
    sources: {},
    _misc: {},

    _isArray: _isArray,
    isArray: _isArray,

    indexOfElement: function (element) {
      for (var index = 0, len = this._chopEls.length; index !== len; ++index) {
        var chel = this._chopEls[index];
        if (chel.el === element) {
          return index;
        }
      }
      return -1;
    },

    chopEl: function (htmlElement) {
      if (htmlElement === undefined) {
        return undefined;
      }

      var elt;
      var elementIndex = this.indexOfElement(htmlElement);
      if (elementIndex === -1) {
        elt = Object.create(chopEl);
        elt.el = htmlElement;
        this._chopEls.push(elt);
      } else {
        elt = this._chopEls[elementIndex];
      }
      return elt;
    },

    find: function (query, context) {
      if (query !== undefined) {
        if (context === undefined) {
          context = document;
        }

        var htmlElement = context.querySelector(query);
        if (!htmlElement) {
          return undefined;
        }

        var elt = this.chopEl(htmlElement);

        return elt;
      } else {
        throw new Error('$ch.find requires a parameter.');
      }
    },

    findAll: function (query, context) {
      if (query !== undefined) {
        if (context === undefined) {
          context = document;
        }

        var els = context.querySelectorAll(query);
        var elts = [];
        for (var index = 0; index !== els.length; ++index) {
          var elt = this.chopEl(els[index]);
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

      var founds = html.match(/{{[^{]{1,}}}/g);
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

        var founds = callback.match(/{{[^{]{1,}}}/g);
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
        elements[index][evt] = func;
      }
    },
    _registerEvents: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }

      // event: click
      this._addEvent(baseElement, 'ch-click', 'onclick');
      // event: dbclick
      this._addEvent(baseElement, 'ch-dbclick', 'ondbclick');

      // event: keypress
      this._addEvent(baseElement, 'ch-keypress', 'onkeypress');
      // event: keydown
      this._addEvent(baseElement, 'ch-keydown', 'onkeydown');
      // event: keyup
      this._addEvent(baseElement, 'ch-keyup', 'onkeyup');

      // event: change
      this._addEvent(baseElement, 'ch-change', 'onchange');

      // event: mousedown
      this._addEvent(baseElement, 'ch-mousedown', 'onmousedown');
      // event: mouseup
      this._addEvent(baseElement, 'ch-mouseup', 'onmouseup');
      // event: mouseenter
      this._addEvent(baseElement, 'ch-mouseenter', 'onmouseenter');
      // event: mousemove
      this._addEvent(baseElement, 'ch-mousemove', 'onmousemove');
      // event: mouseout
      this._addEvent(baseElement, 'ch-mouseout', 'onmouseout');
      // event: mouseover
      this._addEvent(baseElement, 'ch-mouseover', 'onmouseover');
      // event: mouseleave
      this._addEvent(baseElement, 'ch-mouseleave', 'onmouseleave');
      // event: mousewheel
      this._addEvent(baseElement, 'ch-mousewheel', 'onmousewheel');
      // event: drag
      this._addEvent(baseElement, 'ch-drag', 'ondrag');
      // event: dragenter
      this._addEvent(baseElement, 'ch-dragenter', 'ondragenter');
      // event: dragend
      this._addEvent(baseElement, 'ch-dragend', 'ondragend');
      // event: dragstart
      this._addEvent(baseElement, 'ch-dragstart', 'ondragstart');
      // event: dragover
      this._addEvent(baseElement, 'ch-dragover', 'ondragover');
      // event: drop
      this._addEvent(baseElement, 'ch-drop', 'ondrop');



    },

    _inlineTemplates: {},
    _renderInline: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
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
        var html = '';
        var founds, found, obj, ii;
        if (_isArray(source)) {
          for (i = 0; i !== source.length; ++i) {
            html += template;
            obj = source[i];
            founds = template.match(/{{[^{]{1,}}}/g);

            for (ii = 0; ii !== founds.length; ++ii) {
              found = founds[ii].replace(/{/g, '');
              found = found.replace(/}/g, '');
              html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
            }

          }
        } else {
          html = template;
          founds = template.match(/{{[^{]{1,}}}/g);
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

    _addInlineTemplate: function (baseElement) {
      if (baseElement === undefined) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-inline]');
      for (var index = 0; index !== elements.length; ++index) {
        var element = elements[index];
        var id = element.getAttribute('id');
        if (id === undefined) {
          continue;
        }
        chop._inlineTemplates['#' + id] = element.innerHTML;
      }
    },

    _loadInit: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-init]');
      for (var index = 0, len = elements.length; index !== len; ++index) {
        var element = elements[index];
        var str = element.getAttribute('ch-init');
        if (str === undefined) {
          return;
        }
        var strs = str.trim().split(';');
        for (var i = 0, l = strs.length; i !== l; ++i) {
          var init = strs[i].trim();
          var name = init.split('=')[0].trim();
          init = init.replace(/'/g, "\\'");
          init = init.replace(name, 'data');
          var data = eval("'" + init + "'");
          data = eval(data);
          this.source(name, data);
        }
      }
    },

    _loadMain: function () {
      chop._loadInit();
      chop._addInlineTemplate();

      // load requires first
      var requires = document.querySelector('script[ch-require]');
      if (requires !== null) {
        requires = requires.getAttribute('ch-require');
        requires = requires.split(/;/g);

        // trim all
        requires = requires.map(function (item) {
          return item.trim();
        });

        var reqs = [];
        this.each(requires, function (r) {
          if (r !== '') {
            reqs.push(r);
          }
        });

        this.require(reqs);
      }

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
        document.head.appendChild(scriptEl);
        scriptEl.onload = function () {
          chop._loadView();
        };
      }
    },

    _afterLoadView: function () {
      // DISPLAY_ELEMENT.remove();
      return true;
    },
    _loadView: function (baseElement) {
      var callbackName;
      if (baseElement === undefined || baseElement === null) {
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

      chop._loadInit(baseElement);
      chop._registerEvents(baseElement);
      chop._bindSources(baseElement);
      chop._renderInline(baseElement);
      chop._afterLoadView();
    },

    http: function (param) {
      if (!param.url) {
        throw new Error('URL parameter not found for $ch.http.');
      }

      var url = param.url;
      var method = param.method || 'GET';
      var responseType = param.responseType;
      var headers = param.header;
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
      if (responseType !== undefined) {
        ajax.responseType = responseType;
      }
      ajax.onreadystatechange = function () {
        if (ajax.readyState !== 4) {
          return;
        }
        if (async) {
          var o;
          if (responseType === undefined || responseType === null ||
              responseType === '' || responseType === 'text') {
            o = {
             data: ajax.responseText,
             responseText: ajax.responseText,
             response: ajax.response,
             status: ajax.status
           };
          } else {
            o = {
              response: ajax.response,
              status: ajax.status
            };
          }

          callback(o);
        }
      };

      var hasHeadersToSet = headers !== undefined && headers.length !== 0;
      if (hasHeadersToSet) {
        this.each(headers, function (header, value) {
          ajax.setRequestHeader(header, value);
        });
      }

      var hasDataToSend = method &&
          method.toUpperCase() !== 'GET' && data.length !== 0;
      if (hasDataToSend) {
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        ajax.send(data);
      } else {
        ajax.send();
      }

      if (!async) {
        return ajax;
      }
    },

    readFile: function (src, callback) {
      if (arguments.length === 0) {
        throw new Error('$ch.readFile requires at least one parameter.');
      }

      if (typeof src !== 'string') {
        throw new Error('$ch.readFile requires a string type parameter.');
      }

      var originalPath = this._path;
      this._path = this._currentPath.replace(/\/\w+$/, '/');

      var url = this._path + src;

      this._path = originalPath;

      if (callback === undefined) {
        var data = this.http({
          url: url,
          async: false
        }).responseText;

        return data;
      } else if (typeof callback === 'function') {
        this.http({
          url: url,
          done: function (res) {
            if (res.status === 200 || res.status === 304) {
              callback(res.responseText);
            } else {
              throw new Error('$ch.readFile received error code: ' + res.status);
            }
          }
        });
      } else {
        throw new Error('$ch.readFile requires a function type pamameter for callback.');
      }
    },

    define: function (name, callback) {
      var originalPath = this._path;
      this._path = this._currentPath.replace(/\/\w+$/, '/');

      var result = callback();
      this.modules[name] = result;

      this._path = originalPath;
      return result;
    },

    _loaded: {},
    _currentPath: '',
    _useModule: function (src, useLoader) {
      var url = this._path + src + '.js';
      var originalCurrentPath = this._currentPath;
      this._currentPath = this._path + src;

      if (useLoader === true) {
        if (src.indexOf('/') === -1) {
          url = MODULE_LOADER + src ;
        }
      }

      var result;
      var hasScriptLoaded = Object.keys(this._loaded).indexOf(url) !== -1;
      if (!hasScriptLoaded) {
        // synchronously download script
        var text = this.http({
          url: url,
          method: 'get',
          async: false
        }).responseText;

        result = eval(text);
        this._loaded[url] = result;
      } else {
        result = this._loaded[url];
      }

      this._currentPath = originalCurrentPath;
      return result;
    },

    require: function (srcs, useLoader) {
      if (!srcs) {
        return false;
      }

      if (useLoader === undefined) {
        useLoader = true;
      }

      if (typeof srcs === 'string') {
        return this._useModule(srcs, useLoader);
      }
      else if (this._isArray(srcs)) {
        var result = {};
        var that = this;
        this.each(srcs, function (src) {
          result[src] = that._useModule(src, useLoader);
        });

        return result;
      }

      return false;
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
          var attr = element.getAttribute('ch-source');
          if (typeof attr === 'string' && attr !== '') {
            var tag = element.tagName.toUpperCase();
            if (tag === 'INPUT' || tag === 'TEXTAREA') {
              element.value = data;
            } else {
              element.innerHTML = data;
            }
          } else {
            var content = this._inlineSource[element.getAttribute('id')];
            var founds = content.match(/{{[^{]{1,}}}/g);
            if (founds !== null) {
              for (var i = 0, ll = founds.length; i !== ll; ++i) {
                var srcName = founds[i].replace(/{{/g, '');
                srcName = srcName.replace(/}}/g, '').trim();
                var reg = new RegExp('{{' + srcName + '}}', 'g');
                var d = this.sources[srcName];
                d = d.data === undefined ? '' : d.data;
                content = content.replace(reg, d);
                content = content.replace(/\\{/g, '{');
                content = content.replace(/\\}/g, '}');
              }
            }
            element.innerHTML = content;
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

    _inlineSource: {},
    _processInlineSourceContent: function (item, that) {
      var content = that._inlineSource[item.getAttribute('id')];
      var founds = content.match(/{{[^{]{1,}}}/g);
      if (founds !== null) {
        for (var i = 0, l = founds.length; i !== l; ++i) {
          var src = founds[i].replace(/{{/g, '');
          src = src.replace(/}}/g, '').trim();
          var reg = new RegExp('{{' + src + '}}', 'g');
          var ds = that.sources[src];
          var d = ds.data === undefined ? '' : ds.data;
          content = content.replace(reg, d);
          content = content.replace(/\\{/g, '{');
          content = content.replace(/\\}/g, '}');
        }
        return content;
      }
    },
    _addSource: function (name, element, isInline) {
      var source = this.sources[name];
      if (source === undefined) {
        this.sources[name] = {};
        source = this.sources[name];
        source.els = [];
      }

      if (isInline) {
        var id = element.getAttribute('id');
        if (this._inlineSource[id] === undefined) {
          this._inlineSource[element.getAttribute('id')] = element.innerHTML;
        }
        var result = element.innerHTML;
        if (typeof result === 'string') {
          var reg = new RegExp('{{' + name + '}}', 'g');
          var d = source.data === undefined ? '' : source.data;
          result = result.replace(reg, d);
        }
        result = result.replace(/\\{/g, '{');
        result = result.replace(/\\}/g, '}');
        element.innerHTML = result;
      }

      if (source.data !== undefined) {
        var tagName = element.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          element.value = source.data;
        } else {
          if (isInline) {
            element.innerHTML = this._processInlineSourceContent(element, this);

          } else {
            element.innerHTML = source.data;
          }
        }
      }

      var shouldAdd = true;
      for (var index = 0, len = source.els.length; index !== len; ++index) {
        // var sid = source.els[index].id;
        // if (sid === element.id) {
        if (source.els[index] === element) {
          shouldAdd = false;
          break;
        }
      }
      if (shouldAdd) {
        source.els.push(element);
      }
    },

    _bindSources: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }
      var elements = baseElement.querySelectorAll('[ch-source]');
      for (var index = 0; index !== elements.length; ++index) {
        var element = elements[index];
        var name = element.getAttribute('ch-source');
        // if ch-source="xxx"
        if (name !== null && name !== '') {
          this._addSource(name, element, false);
        } else { // if in-line ch-source
          var names = element.innerHTML.match(/{{[^{]{1,}}}/g);
          if (names !== null) {
            for (var i = 0, l = names.length; i !== l; ++i) {
              name = names[i];
              name = name.replace(/{{/g, '');
              name = name.replace(/}}/g, '');
              this._addSource(name, element, true);
            }
          }
        }

        var that = this;
        var eventType = 'keyup';
        var type = element.getAttribute('type');
        if (type !== null) {
          type = type.toUpperCase();
          if (type === 'RANGE') {
            eventType = 'change';
          }
        }

        var tagName = element.tagName.toUpperCase();
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {

          element.addEventListener(eventType, function () {
            var source = that.sources[this.getAttribute('ch-source')];
            source.data = this.value;
            source.els.forEach(function (item) {
              var valueContainer;
              tagName = item.tagName.toUpperCase();
              if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                valueContainer = 'value';
              } else {
                valueContainer = 'innerHTML';
              }

              // check if is inline data source
              var attr = item.getAttribute('ch-source');
              if (typeof attr === 'string' && attr !== '') {
                if (item[valueContainer] !== source.data) {
                  item[valueContainer] = source.data;
                }
              } else {
                item[valueContainer] = that._processInlineSourceContent(item, that);
              }

            });
          });

        }
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

    _jsonpCallbackCounter: 0,
    _jsonpCallbacks: {},

    jsonp: function(url, callback) {
      var fn = 'JSONPCallback_' + this._jsonpCallbackCounter++;
      this._jsonpCallbacks[fn] = this._evalJSONP(callback);
      url = url.replace('={callback}', '=$ch._jsonpCallbacks[\'' + fn + '\']');

      var scriptTag = document.createElement('SCRIPT');
      scriptTag.src = url;
      document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    },

    _evalJSONP: function(callback) {
      return function(data) {
        var validJSON = false;
        if (typeof data === "string") {
          try {validJSON = JSON.parse(data);} catch (e) {
            /*invalid JSON*/
          }
        } else {
          validJSON = JSON.parse(JSON.stringify(data));
          window.console && console.warn(
            '$ch.JSONP: response data was not a JSON string');
        }
        if (validJSON) {
          callback(validJSON);
        } else {
          throw("$ch.JSONP: JSONP call returned invalid or empty JSON");
        }
      };
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
