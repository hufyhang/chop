//  ChopJS
//  ==========
// ~~~txt
//  Licensed under the MIT license
//  Copyright (c) Feifei Hang, 2014
//  https://github.com/hufyhang/chop
// ~~~

// Allow multi-line strings in JSHint.
/* jshint multistr:true */
// JSHint global varaibles.
/* global Sizzle */

(function (window, undefined) {
  'use strict';

  // Set `root` to `window`.
  // ChopJS namespace is gonna be attached to `root`.
  var root = window;

  // Use [jsDelivr](http://jsdelivr.com) as module CDN.
  var MODULE_LOADER = 'http://cdn.jsdelivr.net/';

  // Define the versions of each official module to be shipped with ChopJS.
  var MODULE_VERSION = {
    'aspect'    : '0.1',
    'connect'   : '0.1',
    'context'   : '0.1',
    'crypto'    : '0.1',
    'db'        : '0.1',
    'directive' : '0.2.1',
    'event'     : '0.1',
    'import'    : '0.1',
    'intl'      : '0.1',
    'layout'    : '0.3.1',
    'math'      : '0.1',
    'model'     : '0.1',
    'node'      : '0.1',
    'promise'   : '0.1',
    'rdfa'      : '0.1',
    'regex'     : '0.1',
    'router'    : '0.3',
    'scope'     : '0.2.1',
    'state'     : '0.1',
    'store'     : '0.2',
    'string'    : '0.1',
    'svg'       : '0.1',
    'ui'        : '0.3',
    'utils'     : '0.2',
    'widget'    : '0.1',
    'xml'       : '0.1'
  };

  // Use [Sizzle](http://sizzlejs.com/) as CSS selector engine to ensure
  // `querySelector` and `querySelectorAll` are available even in those
  // browsers which do no support CSS selector.
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

  // Attach `querySelector` to `Element` prototype to enable selecting in context.
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

  // Attach `querySelectorAll` to `Element` prototype.
  Element.prototype.querySelectorAll = function (query) {
    if (arguments.length !== 1) {
      throw new Error ('$ch.findAll requires one query parameter.');
    }
    return Sizzle(query, this);
  };

  // ___isArray(obj)__
  //
  // Returns `true`/`false` to tell if `obj` is an array.
  // ~~~javascript
  // $ch._isArray([1, 2, 3]); // true
  // $ch._isArray({name: 'someone'}); // false
  // ~~~
  var _isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  // If the browser does not support `Object.create`, make it available.
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

  // If the browser does not support `Object.keys`, make it available.
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

  // ChopJS View
  // -------------
  var chopView = {
    // `el` is to keep an reference of the DOM element.
    el: undefined,
    // To define the HTML of the ChopJS view,
    // assign `html` to either an HTML string or
    // a function that returns an HTML string.
    html: '',
    // __render()__
    //
    // Call to render the ChopJS view object.
    // ~~~javascript
    // v.render(); // v is a ChopJS View object.
    // ~~~
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

  // ChopJS Element
  // ---------------
  var chopEl = {
    // Keep an reference to the DOM element.
    el: undefined,
    _views: [],
    // __focus()__
    //
    // Call to get the ChopJS element focused.
    // ~~~javascript
    // var e = $ch.find('input[type=text]');
    // e.focus();
    // ~~~
    focus: function () {
      this.el.focus();
      return this;
    },

    // __val([`value`])__
    //
    // If `value` is presented, set value to `value`.
    // Otherwise, return current value.
        // ~~~javascript
    // var e = $ch.find('input[type=text]');
    // e.val('Hello world!!!');
    // return e.val(); // 'Hello world!!!'
    // ~~~
    val: function (val) {
      if (val !== undefined) {
        this.el.value = val;
        return this;
      } else {
        return this.el.value;
      }
    },

    // __html([`html`])__
    //
    // If `html` is presented, set inner HTML to `html`.
    // Otherwise, return current inner HTML.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.html('<div>Banner</div>');
    // return e.html(); // '<div>Banner</div>'
    // ~~~
    html: function (html) {
      if (html !== undefined) {
        this.el.innerHTML = html;
        return this;
      } else {
        return this.el.innerHTML;
      }
    },

    // __content(`data`)__
    //
    // If `data` is presented, set text content to `data`.
    // Otherwise, return current text content.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.content('This is a banner.');
    // return e.content(); // 'This is a banner.'
    // ~~~
    content: function (data) {
      if (data === undefined) {
        return this.el.textContent;
      } else {
        this.el.textContent = data;
        return this;
      }
    },

    // __append(`html`)__
    //
    // Append `html` to inner HTML.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.html('<div>Banner</div>');
    // e.append('<div>ChopJS</div>');
    // return e.html(); // '<div>Banner</div><div>ChopJS</div>'
    // ~~~
    append: function (html) {
      if (html !== undefined) {
        this.el.innerHTML = this.el.innerHTML + html;
      }
      return this;
    },

    // __prepend(`html`)__
    //
    // Prepend `html` to inner HTML.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.html('<div>Banner</div>');
    // e.prepend('<div>ChopJS</div>');
    // return e.html(); // '<div>ChopJS</div><div>Banner</div>'
    // ~~~
    prepend: function (html) {
      if (typeof html === 'string') {
        this.el.innerHTML = html + this.el.innerHTML;
      }
      return this;
    },

    // __appendChild(`element`)__
    //
    // Append `element` as child node.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // var div = document.createElement('div');
    // e.appendChild(div);
    // var span = $ch.element('span');
    // e.appendChild(span);
    // ~~~
    appendChild: function (element) {
      if (element !== undefined) {
        var type = Object.prototype.toString.call(element);
        // If `element` is a ChopJS element, append its `el`.
        // Otherwise, just directly append `element`.
        if (type === '[object Object]') {
          this.el.appendChild(element.el);
        } else {
          this.el.appendChild(element);
        }
      }
      return this;
    },

    // __prependChild(`element`)__
    //
    // Prepend `element` as a child node.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // var div = document.createElement('div');
    // e.prependChild(div);
    // var span = $ch.element('span');
    // e.prependChild(span);
    // ~~~
    prependChild: function (element) {
      var parent = this.el;
      if (element !== undefined && parent !== undefined) {
        var type = Object.prototype.toString.call(element);
        // If `element` is a ChopJS element, prepend its `el`.
        // Otherwise, just directly prepend `element`.
        if (type === '[object Object]') {
          parent.insertBefore(element.el, parent.firstElementChild);
        } else {
          parent.insertBefore(element, parent.firstElementChild);
        }
      }
      return this;
    },

    // __scrollTop(`val`)__
    //
    // If `val` is presented, set scroll top value to `val`.
    // Otherwise, return current scroll top value.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.scrollTop(0);
    // return e.scrollTop(); // 0
    // ~~~
    scrollTop: function (val) {
      if (typeof val === 'number') {
        this.el.scrollTop = val;
        return this;
      } else {
        return this.el.scrollTop;
      }
    },

    // __scrollLeft(`val`)__
    //
    // If `val` is presented, set scroll left value to `val`.
    // Otherwise, return current scroll left value.
    // ~~~javascript
    // var e = $ch.find('#banner');
    // e.scrollLeft(0);
    // return e.scrollLeft(); // 0
    // ~~~
    scrollLeft: function (val) {
      if (typeof val === 'number') {
        this.el.scrollLeft = val;
        return this;
      } else {
        return this.el.scrollLeft;
      }
    },

    // __offset()__
    //
    // Get all offset values, including offset left, top,
    // width, height, and parent.
    // ~~~javascript
    // $ch.find('#banner').offset();
    // ~~~
    offset: function () {
      return {
        left: this.el.offsetLeft,
        top: this.el.offsetTop,
        width: this.el.offsetWidth,
        height: this.el.offsetHeight,
        parent: this.el.offsetParent
      };
    },

    // __addClass(`cls`)__
    //
    // Add class name `cls`.
    // ~~~javascript
    // $ch.find('#banner').addClass('highlight');
    // ~~~
    addClass: function (cls) {
      if (typeof cls === 'string') {
        this.el.className += ' ' + cls;
      }
      return this;
    },

    // __removeClass(`cls)__
    //
    // Remove `cls` from class name.
    // ~~~javascript
    // $ch.find('#banner').removeClass('highlight');
    // ~~~
    removeClass: function (cls) {
      if (typeof cls === 'string') {
        // Use regex to replace all `cls` (with potential
        //  leading and trailing whitespace) to an empty string.
        var reg = new RegExp('\\ ?' + cls + '\\ ?', 'g');
        this.el.className = this.el.className.replace(reg, '');
      }
      return this;
    },

    // __toggleClass(`cls`)__
    //
    // Toggle class `cls`.
    //
    // ~~~javascript
    // $ch.find('#banner').toggleClass('highlight');
    // ~~~
    toggleClass: function (cls) {
      // Same as `addClass` and `removeClass`.
      // Just make sure to detect the existence of `cls` in class name first.
      if (typeof cls === 'string') {
        var reg = new RegExp('\\ ?' + cls + '\\ ?', 'g');
        var hasClass = this.el.className.match(reg) !== null;

        if (hasClass) {
          this.removeClass(cls);
        } else {
          this.addClass(cls);
        }

      }
      return this;
    },

    // __submit()__
    //
    // If this ChopJS element refers to a form element,
    // submit the form. Otherwise, return `false`.
    //
    // ~~~javascript
    // $ch.find('form').submit();
    // ~~~
    submit: function () {
      if (this.el.submit) {
        this.el.submit();
      } else {
        return false;
      }
    },

    // Define the increasing value of each step of animation.
    _animateStep: 10,

    // This API here supposes to be a private method.
    animateAttr: function (element, attrs, duration, step) {
      var shouldSet = true;

      // Set `step` to 0 if it is the first this animation is being proceed.
      if (step === undefined) {
        step = 0;
      }

      // Get the names of all the attributes to be transformed.
      var keys = Object.keys(attrs);
      var that = this;

      // Increase the step counter.
      step += this._animateStep;
      // If step counter is no less than `duration`,
      // set `shouldSet` to `false` to stop the animation.
      if (step >= duration) {
        shouldSet = false;
      }

      // Iterate through all attributes to be transformed,
      // and increase the current value of each of them.
      keys.forEach(function (k) {
        element[k] += attrs[k];
      });

      // If the animation should keep proceeding,
      // set a timeout to the execution of the next step transformation.
      if (shouldSet) {
        setTimeout(function () {
          that.animateAttr(element, attrs, duration, step);
        }, that._animateStep);
      }
    },

    // __animate(`style/attr`, `options`[, `callback`])__
    //
    // Execute an animation on transforming the style or
    // attributes of the ChopJS element.
    // + `style/attr`: either CSS style (e.g. `background`)
    // or DOM attribute (e.g. `scrollTop`) in the form of an object.
    // + `options`: either the animation duration in milliseconds,
    // or an object declaring the duration and CSS easing style (e.g. `ease-out`).
    // + `callback`: a callback function to be fired once the animation is done.
    //
    // ~~~javascript
    // $ch.find('#content').animate({
    //          background: 'orange',
    //          scrollTop: 0}, 2000);
    // ~~~
    animate: function (style, options, callback) {
      if (typeof style === 'object') {
        var buf = [];
        var attrs = {};
        var that = this;
        var duration, easing;
        if (typeof options === 'number') {
          duration = options;
          easing = '';
        }
        else if (typeof options === 'object') {
         duration = options.duration;
         easing = options.easing;
        }

        // Build up the CSS transition declaration,
        // and don't forget those prefixes.
        buf.push('transition: all ' + duration + 'ms ' + easing + ';');
        buf.push('-webkit-transition: all ' + duration + 'ms ' + easing + ';');
        buf.push('-ms-transition: all ' + duration + 'ms ' + easing + ';');
        buf.push('-moz-transition: all ' + duration + 'ms ' + easing + ';');
        // Append the transition style to `cssText`.
        this.el.style.cssText += buf.join('');

        buf = [];
        // Iterate through all `style`.
        // For CSS styles, build up style declaration and push to `buf` buffer.
        // For DOM element attribute, calculate the increasing rate in animation.
        chop.each(style, function (key, value) {
          if (that.el[key] !== undefined && typeof value === 'number') {
            attrs[key] = (value - that.el[key]) / duration * that._animateStep;
          } else {
            buf.push(key + ': ' + value + ';');
          }
        });

        // Append all CSS styles to `cssText`.
        this.el.style.cssText += buf.join('');
        // For DOM element attributes, invoke `animateAttr`.
        var keys = Object.keys(attrs);
        if (keys.length !== 0) {
          this.animateAttr(this.el, attrs, duration);
        }

        // If `callback` is presented, postpone its execution
        // until the animation is finished.
        if (typeof callback === 'function') {
          window.setTimeout(callback, duration);
        }
      }

      return this;
    },

    // __get(`attr`)__
    //
    // Get the attribute value of `attr`.
    //
    // ~~~javascript
    // $ch.find('form').get('className');
    // ~~~
    get: function (item) {
      if (typeof item !== 'string') {
        throw new Error('ChopJS Element "get" expects a string-type parameter.');
      }
      return this.el[item];
    },

    // __set(`attr`, `val`)__
    //
    // Set the value of attribute `attr to `val`.
    //
    // ~~~javascript
    // $ch.find('form').set('action', 'http://www.example.com/submit.php');
    // ~~~
    set: function (item, value) {
      // Check and make sure both `item` and `value` are presented.
      // Otherwise, we got nothing to `set`.
      if (typeof item !== 'string') {
        throw new Error('ChopJS Element "set" expects a string-type parameter to indicate property.');
      }

      if (value === undefined) {
        throw new Error('ChopJS Element "set" does not accept "undefined" as the property value.');
      }

      this.el[item] = value;
      return this;
    },

    // __attr([`key`, `value`])__
    //
    // If `value` is presented, set the value of attribute `key` to `value`.
    // If only `key` is provided, return the value of attribute `key`.
    // Otherwise, return all attributes.
    //
    // ~~~javascript
    // $ch.find('form').attr('method', 'post');
    // $ch.find('form').attr('method');
    // $ch.find('form').attr();
    // ~~~
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

    // __hasAttr(`attr`)__
    //
    // Check if the ChopJS element has attribute `attr`.
    //
    // ~~~javascript
    // $ch.find('form').hasAttr('method');
    // ~~~
    hasAttr: function (key) {
      if (typeof key !== 'string') {
        throw new Error('.hasAttr requires a string type parameter.');
      }

      return this.el.hasAttribute(key);
    },

    // __removeAttr(`attr`)__
    //
    // Remove attribute `attr` from the ChopJS element.
    //
    // ~~~javascript
    // $ch.find('form').removeAttr('action');
    // $ch.find('form').removeAttr(['action', 'method']);
    // ~~~
    removeAttr: function (key) {
      // If `key` is an array of attributes,
      // iterate though all the attributes and remove them.
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

    // __on(`evt`, `callback`[, `useCapture`])__
    //
    // Register listener on event `evt`.
    // + `evt`: the event to be listened, e.g. 'click'.
    // + `callback`: event callback.
    // + `useCapture`: determine if event capture should be applied.
    // By default, `false`.
    //
    // ~~~javascript
    // $ch.find('#btn').on('click', function () {
    //    console.log('Clicked');
    // });
    // ~~~
    on: function (evt, callback, capture) {
      if (arguments.length < 2) {
        throw new Error('$ch.on requires at least an event and a callback parameter.');
      }

      if (capture === undefined) {
        capture = false;
      }

      this.el.addEventListener(evt, callback, capture);
      return this;
    },

    // __detach(`evt`, `callback`)__
    //
    // Remove an event listener from the ChopJS element.
    // + `evt`: event name.
    // + `callback`: event callback.
    //
    // ~~~javascript
    // var cb = function () {
    //    // do something
    // };
    // var e = $ch.find('#btn');
    // e.on('click', cb);
    // e.detach('click', cb);
    // ~~~
    detach: function (evt, callback) {
      if (arguments.length !== 2) {
        throw new Error('$ch.detach requires two parameters.');
      }

      this.el.removeEventListener(evt, callback);
      return this;
    },

    // __delegate(`evt`, `callback`, `element1`[, `element2`...])__
    //
    // Add event listener to all `element` inside the ChopJS element.
    // + `evt`: event name.
    // + `callback`: event callback.
    // + `element`: CSS selector to element.
    //
    // ~~~javascript
    // var cb = function () {
    //    // do something
    // };
    // $ch.find('body').delegate('click', cb, 'div.btn', 'div#okay-btn');
    // ~~~
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

    // __click([`callback`])__
    //
    // If `callback` is presented, set the `click` event callback
    // of this ChopJS element to `callback`.
    // Otherwise, trigger `click` event.
    //
    // ~~~javascript
    // $ch.find('btn').click(function () {
    //    // do something
    // });
    //
    // $ch.find('btn').click();
    // ~~~
    click: function (callback) {
      if (callback === undefined) {
        this.el.click();
      } else {
        this.el.addEventListener('click', callback);
        return this;
      }
    },

    // __keypress(`callback`)__
    //
    // Set the `keypress` event callback to `callback`.
    //
    // ~~~javascript
    // $ch.find('input[type=text]').keypress(function () {
    //    // do something
    // });
    // ~~~
    keypress: function (callback) {
      if (callback === undefined) {
        throw new Error('$ch.keypress requires a parameter.');
      } else {
        this.el.addEventListener('keypress', callback);
        return this;
      }
    },

    // __change(`callback`)__
    //
    // Set the `change` event callback to `callback`.
    //
    // ~~~javascript
    // $ch.find('select').change(function () {
    //    // do something
    // });
    // ~~~
    change: function (callback) {
      if (callback === undefined) {
        throw new Error('$ch.change requires a parameter.');
      } else {
        this.el.addEventListener('change', callback);
        return this;
      }
    },

    // Make the CSS style to be DOM API friendly.
    // E.g. for `border-radius`, make it to be `borderRadius`.
    _cssReplacer: function (match, p1) {
      p1 = p1.replace(/-/g, '');
      return p1.toUpperCase();
    },

    // __css([`name`, `val`])__
    //
    // If both `name` and `val` is presented, set the CSS style `name` to `val`.
    // If only `name` is provided, get current value of CSS rule `name`.
    // Otherwise, return `cssText` of the ChopJS element.
    //
    // ~~~javascript
    // $ch.find('#btn').css('color', '#fff');
    // $ch.find('#btn').css('color'); // '#fff'
    // $ch.find('#btn').css(); // 'color:#fff'
    // ~~~
    css: function (key, value) {
      if (arguments.length === 0) {
        return this.el.style.cssText;
      }

      if (arguments.length === 1) {
        return this.el.style[key];
      }

      if (arguments.length === 2) {
        // Make the CSS name `key` to be DOM cssText friendly.
        key = key.replace(/(-[a-z])/g, this._cssReplacer);
        this.el.style[key] = value;
        return this;
      }
    },

    // __view(`v`)__
    //
    // Add ChopJS View element to the ChopJS element, and load the view(s).
    // `v` can be either a ChopJS View element or an array of ChopJS View elements.
    //
    // ~~~javascript
    // $ch.find('#container').view(aView);
    // ~~~
    view: function (v) {
      if (v) {
        // `baseElement` here is to set the context of the later view loading.
        var baseElement = this.el;
        baseElement.innerHTML = '';
        // If `v` is an array, all its contained views
        // need to be appended to each other.
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
        // Now load the added views.
        chop._loadView(baseElement);
      }
      return this;
    },

    _addView: function (baseElement, v, isAppending) {
      var result;
      // If the `html` of view `v` is a function,
      // fire the function to get its returned HTML string.
      if (typeof v.html === 'function') {
        result = v.html();
      } else {
        result = v.html;
      }
      if (result !== undefined) {
        // If `isAppending` is `true`, append View HTMLs to each other.
        if (isAppending === true) {
          baseElement.innerHTML += result;
        } else {
          baseElement.innerHTML = result;
        }
      }
      // Finally, push `v` to Views list of the ChopJS element.
      this._views.push(v);
    },

    // __inline([`data`])__
    //
    // Render the inline template of the ChopJS element.
    // If `data` is presented, render the inline template according to `data`.
    //
    // ~~~javascript
    // $ch.find('#inline-div').inline();
    // $ch.find('#inline-div').inline([{
    //    name: 'Tom',
    //    age: 10
    //  }, {
    //    name: 'Daniel',
    //    age: 20
    // }]);
    // ~~~
    inline: function (source) {
      // Keep an reference to the host DOM element.
      var element = this.el;
      // Each inline template __MUST__ has an `id` attribute.
      // Get the `id` value here.
      var id = element.id;
      // If no `id` attributes found, throw an error.
      if (id === undefined || chop._inlineTemplates['#' + id] === undefined) {
        throw new Error('ID attribute is mandatory for chop.js inline template.');
      }

      // Retrieve the inline template from the template buffer according to `id`.
      var template = chop._inlineTemplates['#' + id];
      var html = '';
      var founds, found, obj, i, ii;
      if (arguments.length === 0) {
        var inlineStr = element.getAttribute('ch-inline');
        // Split `ch-inline` value by `|` for filter.
        var substr = inlineStr.split('|');
        // Retrieve the name of the ChopJS source.
        var src = substr[0].trim();
        var filter;
        if (substr.length > 1) {
          for (var fi = 1; fi !== substr.length; ++fi) {
            // Try to get filter name.
            // A filter can be applied in the form of:
            // ~~~html
            // <div id="inline-div" ch-inline="animals | filter: canFly"></div>
            // ~~~
            if (substr[fi].trim().match(/filter\:.+/g)) {
              filter = substr[fi].trim().replace(/filter\:\ */g, '');
            }
          }
        }

        // If the inline template has an filter applied,
        // screen the retrieved ChopJS source.
        if (filter === undefined) {
          source = chop.source(src);
        } else {
          source = chop.filter(chop.source(src), window[filter]);
        }

      }

      // If the source at this point of time is an array,
      // iterate through it and apply each object it contains
      // to template.
      if (_isArray(source)) {
        for (i = 0; i !== source.length; ++i) {
          html += template;
          obj = source[i];
          // Find all substrings surrounded by `{{` and `}}`.
          founds = template.match(/{{[^{]{1,}}}/g);

          // For each of the substrings found, remove `{{` and `}}`,
          // and replace the placeholder between `{{` and `}}` with
          // the corresponding data in source.
          for (ii = 0; ii !== founds.length; ++ii) {
            found = founds[ii].replace(/{/g, '');
            found = found.replace(/}/g, '');
            html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
          }

        }
      // If the source at this point of time is not an array,
      // just directly apply its contents to inline template.
      } else {
        html = template;
        // Find all substrings surrounded by `{{` and `}}`.
        founds = template.match(/{{[^{]{1,}}}/g);
        obj = source;

        // For each of the substrings found, remove `{{` and `}}`,
        // and replace the placeholder between `{{` and `}}` with
        // the corresponding data in source.
        for (ii = 0; ii !== founds.length; ++ii) {
          found = founds[ii].replace(/{/g, '');
          found = found.replace(/}/g, '');
          html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
        }
      }

      // Use `\{` and '\}' to escape `{` and `}`.
      html = html.replace(/\\{/g, '{');
      html = html.replace(/\\}/g, '}');
      // Update the innerHTML of the ChopJS element.
      this.el.innerHTML = html;
      // Reload the view.
      chop._loadView(this.el);
      return this;
    },

    // __serialize()__
    // To serialize a form element.
    //
    //      $ch.find('form').serialize();
    //
    serialize: function () {
      var form = this.el;
      return _serializeForm.call(this, form);
    }
  };

  // ChopJS Core
  // -----------
  var chop = {
    // Keep an reference of the defined module versions.
    MODULE_VERSION: MODULE_VERSION,
    _path: '',
    els: [],
    _chopEls: [],
    modules: {},
    sources: {},
    _misc: {},

    // Alias of `_isArray`.
    _isArray: _isArray,
    // __isArray(`obj`)__
    //
    // Check is `obj` is an array.
    //
    // ~~~javascript
    // $ch.isArray({name: 'Tom', age: 10}); // false
    // $ch.isArray([1, 2, 3]); // true
    // ~~~
    isArray: _isArray,

    // Find the index of a ChopJS element in `_chopEls` buffer.
    indexOfElement: function (element) {
      for (var index = 0, len = this._chopEls.length; index !== len; ++index) {
        var chel = this._chopEls[index];
        if (chel.el === element) {
          return index;
        }
      }
      // If nothing found, return -1.
      return -1;
    },

    // __element(`el`)__
    //
    // If `el` is a string, create a ChopJS element.
    // If `el` is a DOM element, convert it into a ChopJS element.
    //
    // ~~~javascript
    // var div = document.createElement('div');
    // div = $ch.element(div);
    // // equals to:
    // var div = $ch.element('div');
    // ~~~
    element: function () {
      // This method is actually an alias to `chopEl`.
      return this.chopEl.apply(this, arguments);
    },

    // `chopEl` is now __deprecated__.
    // Use `__element(`el`)_` instead.
    chopEl: function (htmlElement) {
      // If no valid parameter provided, return `undefined`.
      if (htmlElement === undefined) {
        return undefined;
      }

      var elt;

      // If `htmlElement` is a string, create a ChopJS element.
      if (typeof htmlElement === 'string') {
        var el = document.createElement(htmlElement);
        return this.chopEl(el);
      }

      // Otherwise, if `htmlElement` is not exist in `_chopEls` buffer,
      // create a ChopJS element and push it to the buffer.
      var elementIndex = this.indexOfElement(htmlElement);
      if (elementIndex === -1) {
        elt = Object.create(chopEl);
        elt.el = htmlElement;
        this._chopEls.push(elt);
      // Otherwise, just retrieve the ChopJS element from the buffer.
      } else {
        elt = this._chopEls[elementIndex];
      }
      return elt;
    },

    // __find(`selector`[, `context`])__
    //
    // Find an DOM element according to `selector`,
    // and create a ChopJS element upon it.
    // + `selector`: CSS selector to the element.
    // + `context`: research context. By default, `document`.
    //
    // ~~~javascript
    // var div = $ch.find('#my-div');
    // var context = div;
    // var divInContext = $ch.find('#another-div', context.el);
    // ~~~
    find: function (query, context) {
      if (query !== undefined) {
        if (context === undefined) {
          context = document;
        }

        var htmlElement = context.querySelector(query);
        // If nothing found, return undefined.
        if (!htmlElement) {
          return undefined;
        }

        // Otherwise, create a ChopJS element.
        var elt = this.chopEl(htmlElement);

        return elt;
      } else {
        throw new Error('$ch.find requires a parameter.');
      }
    },

    // __findAll(`selector`[, `context`])__
    //
    // Find all DOM elements according to `selector`,
    // and create an array of ChopJS elements.
    // + `selector`: CSS selector to the elements.
    // + `context`: research context. By default, `document`.
    //
    // ~~~javascript
    // var div = $ch.find('#my-div');
    // var context = div;
    // var divsInContext = $ch.findAll('div', context.el);
    // ~~~
    findAll: function (query, context) {
      if (query !== undefined) {
        if (context === undefined) {
          context = document;
        }

        var els = context.querySelectorAll(query);
        var elts = [];
        // Iterate through all the elements found,
        // and create ChopJS elements.
        for (var index = 0; index !== els.length; ++index) {
          var elt = this.chopEl(els[index]);
          elts[index] = elt;
        }
        return elts;
      } else {
        throw new Error('$ch.findAll requires a parameter.');
      }
    },

    // __view(`data`)__
    //
    // Create a ChopJS View object.
    // `data` should be an object, which contains
    // at least a `html` key assigned to either a
    // HTML string or a function returns a HTML string.
    //
    // ~~~javascript
    // var myView = $ch.view({
    //    html: function () {
    //        return $ch.find('#banner').html();
    //    }
    // });
    // ~~~
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

    // __tempalte(`html`, `data`)__
    //
    // Process a template and return the final HTML.
    // + `html`: template HTML.
    // + `data`: the data to be processed against.
    //
    // ~~~javascript
    // var tmpl = '<div>{{name}}</div>';
    // return $ch.template(tmpl, {name: 'ChopJS'}); // '<div>ChopJS</div>'
    // ~~~
    template: function (html, data) {
      if (!html && !data) {
        throw new Error('invalid parameters for $ch.template.');
      }

      if (!data) {
        return html;
      }

      // Find all placeholders wrapped by `{{` and `}}`.
      var founds = html.match(/{{[^{]{1,}}}/g);
      if (founds) {
        // Iterate through the placeholder found,
        // and replace their content with the
        // corresponding data in `data`.
        founds.forEach(function (found) {
          var key = found.replace(/{/g, '');
          key = key.replace(/}/g, '');
          if (data[key] !== undefined) {
            html = html.replace(found, data[key]);
          }
        });
      }

      // Escape '\{' for '{' and '\}' for '}'.
      html = html.replace(/\\{/g, '{');
      html = html.replace(/\\}/g, '}');
      return html;
    },

    // Add event listener.
    _addEvent: function (baseElement, attr, evt) {
      // Find all elements to be registered, and iterate through them.
      var elements = baseElement.querySelectorAll('[' + attr + ']');
      for (var index = 0; index !== elements.length; ++index) {

        // Retrieve the event callback from the attribute value of
        // current element.
        var callback = elements[index].getAttribute(attr);
        // `$$event` is used as a short hand of `arguments[0]`.
        callback = callback.replace(/\$\$event/g, 'arguments[0]');

        // Find all substrings surrounded by `{{`` and `}}`,
        // and iterate through them.
        var founds = callback.match(/{{[^{]{1,}}}/g);
        if (founds) {
          for (var i = 0; i !== founds.length; ++i) {
            var found = founds[i];
            var key = found.replace(/{/g, '');
            key = key.replace(/}/g, '');
            // Check if using pipe operations e.g. filter
            var parts = key.split('|');
            if (parts.length === 1) {
              callback = callback.replace(found, '$ch.sources.' + key + '.data');
            } else {
              key = parts[0].trim();
              // Iterate through pipe operations
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
        // Escape '\{' and '\}'.
        callback = callback.replace(/\\{/g, '{');
        callback = callback.replace(/\\}/g, '}');

        var func = new Function (callback);
        elements[index][evt] = func;
      }
    },
    // Register events in the context of `baseElement`.
    _registerEvents: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }

      // Event: click
      this._addEvent(baseElement, 'ch-click', 'onclick');
      // Event: dbclick
      this._addEvent(baseElement, 'ch-dbclick', 'ondbclick');

      // Event: keypress
      this._addEvent(baseElement, 'ch-keypress', 'onkeypress');
      // Event: keydown
      this._addEvent(baseElement, 'ch-keydown', 'onkeydown');
      // Event: keyup
      this._addEvent(baseElement, 'ch-keyup', 'onkeyup');

      // Event: change
      this._addEvent(baseElement, 'ch-change', 'onchange');

      // Event: mousedown
      this._addEvent(baseElement, 'ch-mousedown', 'onmousedown');
      // Event: mouseup
      this._addEvent(baseElement, 'ch-mouseup', 'onmouseup');
      // Event: mouseenter
      this._addEvent(baseElement, 'ch-mouseenter', 'onmouseenter');
      // Event: mousemove
      this._addEvent(baseElement, 'ch-mousemove', 'onmousemove');
      // Event: mouseout
      this._addEvent(baseElement, 'ch-mouseout', 'onmouseout');
      // Event: mouseover
      this._addEvent(baseElement, 'ch-mouseover', 'onmouseover');
      // Event: mouseleave
      this._addEvent(baseElement, 'ch-mouseleave', 'onmouseleave');
      // Event: mousewheel
      this._addEvent(baseElement, 'ch-mousewheel', 'onmousewheel');
      // Event: drag
      this._addEvent(baseElement, 'ch-drag', 'ondrag');
      // Event: dragenter
      this._addEvent(baseElement, 'ch-dragenter', 'ondragenter');
      // Event: dragend
      this._addEvent(baseElement, 'ch-dragend', 'ondragend');
      // Event: dragstart
      this._addEvent(baseElement, 'ch-dragstart', 'ondragstart');
      // Event: dragover
      this._addEvent(baseElement, 'ch-dragover', 'ondragover');
      // Event: drop
      this._addEvent(baseElement, 'ch-drop', 'ondrop');
    },

    // ChopJS inline template buffer.
    _inlineTemplates: {},
    _renderInline: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }

      // Find all inline templates indicate by `ch-inline`,
      // and iterate through them.
      var elements = baseElement.querySelectorAll('[ch-inline]');
      var element, renderStr, source;
      var i;
      for (var index = 0; index !== elements.length; ++index) {
        element = elements[index];
        // Only the elements come with `id` are valid.
        var id = element.getAttribute('id');
        if (id === undefined) {
          continue;
        }

        // Check if the inline template is using pipe operations, e.g. filter.
        renderStr = element.getAttribute('ch-inline');
        renderStr = renderStr.replace(/{{/g, '');
        renderStr = renderStr.replace(/}}/g, '');
        var parts = renderStr.split('|');

        // Get the source data.
        source = chop.source(parts[0].trim()) || [];

        if (parts.length > 1) {
          for (i = 1; i !== parts.length; ++i) {
            var part = parts[i].trim();
            // If a filter is applied, screen the retrieved source data.
            var isFilter = part. match(/filter\:.+/g) !== null;
            if (isFilter) {
              part = part.replace(/filter\:\ */g, '');
              source = chop.filter(source, window[part]);
            }
          }
        }

        // The template content is the `innerHTML` of
        // the DOM element at this time point.
        var template = element.innerHTML;
        var html = '';
        var founds, found, obj, ii;
        // If the retrieved source data is an array,
        // iterate through it and apply its content
        // to the template according to data placeholders.
        if (_isArray(source)) {
          for (i = 0; i !== source.length; ++i) {
            html += template;
            obj = source[i];
            // Get all data placeholders.
            founds = template.match(/{{[^{]{1,}}}/g);

            for (ii = 0; ii !== founds.length; ++ii) {
              found = founds[ii].replace(/{/g, '');
              found = found.replace(/}/g, '');
              html = html.replace(new RegExp(founds[ii], 'g'), obj[found]);
            }
          }
        // Otherwise, directly apply the retrieved source data
        // to each data placeholders in the template.
        } else {
          html = template;
          // Find all data placeholders.
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

        // Reload the view.
        chop._loadView(element);
      }
    },

    // Add inline templates in the context of `baseElement`
    // to inline template buffer.
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

    // Execute all `ch-init` to initialized ChopJS data sources.
    _loadInit: function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }

      // Find all `ch-init` declarations.
      var elements = baseElement.querySelectorAll('[ch-init]');
      for (var index = 0, len = elements.length; index !== len; ++index) {
        var element = elements[index];
        // Get the value of `ch-init`.
        var str = element.getAttribute('ch-init');
        if (str === undefined) {
          return;
        }
        // ';' is used to separate data sources in `ch-init`.
        //
        // E.g. `ch-init="version = '1.0'; items = [];"`
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

    // Load the main file declared by `ch-main`.
    _loadMain: function () {
      chop._loadInit();
      chop._addInlineTemplate();

      // Load `ch-use` first.
      var requires = document.querySelector('script[ch-use]');
      if (requires !== null) {
        requires = requires.getAttribute('ch-use');
        requires = requires.split(/;/g);

        // Trim all the requires module names.
        requires = requires.map(function (item) {
          return item.trim();
        });

        var reqs = [];
        this.each(requires, function (r) {
          if (r !== '') {
            reqs.push(r);
          }
        });

        this.use(reqs);
      }

      var element = document.querySelector('script[ch-main]');
      if (element === null) {
        chop._loadView();
        return;
      }

      var script = element.getAttribute('ch-main');
      // Update `_path` to the root path of the `ch-main` file.
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
      // Show everything until ChopJS view is fully loaded.
      var htmlCss = document.querySelector('html').style.cssText;
      var reg = new RegExp('\ ?display:\ ?none;?\ ?', 'g');
      document.querySelector('html').style.cssText = htmlCss.replace(reg, '');
      return true;
    },
    // Load all ChopJS View in the context of `baseElement`.
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

    // Encode the data to be sent by `$ch.http`.
    _encodeHttpData: function (key, item) {
      var result = '';
      var that = this;
      if (this._isArray(item)) {
        this.each(item, function (value, index) {
          if (typeof value === 'object') {
            result += that._encodeHttpData(key + '[' + index + ']', value);
          } else {
            result += key + '[' + index + ']=' + value + '&';
          }
        });
      }
      else if (typeof item === 'object') {
        this.each(item, function (k, value) {
          if (typeof value === 'object') {
            result += that._encodeHttpData(key + '[' + k + ']', value);
          } else {
            result += key + '[' + k + ']=' + value + '&';
          }
        });
      } else {
        result += key + '=' + item + '&';
      }
      return result;
    },

    _httpCache: [],
    // Append cached AJAX request result to `_httlCache` buffer.
    _appendHttpCache: function (shouldCache, obj) {
      if (shouldCache) {
        this._httpCache.push({
          url: obj.url,
          method: obj.method,
          headers: obj.headers,
          async: obj.async,
          responseType: obj.responseType,
          mimeType: obj.mimeType,
          data: obj.data,
          response: obj.response
        });
      }

    },

    // __http(`url`, `options`)__
    //
    // Start an AJAX call to `url`.
    //
    // `options` is an object and can contain:
    // + `method`: AJAX method. e.g. 'GET', 'POST', 'PUT'.
    // + `data`: the data to be sent in the form of an object.
    // + `async`: `true`/`false` indicates if the AJAX call is asynchronous.
    // + `responseType`: the response type of the AJAX call.
    // + `header`: headers of the AJAX call.
    // + `mimeType`: MIME type.
    // + `cache`: `true`/`false` indicates if the result should be cached.
    http: function (u, param) {
      var url;
      if (arguments.length === 1) {
        param = u;
        url = '';

        if (!param.url) {
          throw new Error('URL parameter not found for $ch.http.');
        } else {
          url = param.url;
        }
      }
      else {
        url = u;
      }

      var method = param.method || 'GET';
      var responseType = param.responseType;
      var headers = param.header;
      var mimeType = param.mimeType;
      method = method.toUpperCase();
      var data = param.data || {};
      var tempData = '';
      var httpCache = param.cache || false;
      var that = this;
      this.each(data, function (key, value) {
        tempData += that._encodeHttpData(key, value);
      });
      data = tempData.slice(0, -1);

      var callback = param.done || function () {return false;};
      if (param.async === undefined) {
        param.async = true;
      }
      var async = param.async;

      // Check if should load from HTTP cache
      var loadedCache = false;
      var cacheData;
      for (var index = 0; index !== this._httpCache.length; ++index) {
        var cache = this._httpCache[index];

        loadedCache = cache.url === url && cache.method === method
        && cache.headers === headers && cache.responseType === responseType
        && cache.mimeType === mimeType && cache.data === data;

        if (loadedCache) {
          cacheData = cache.response;
          break;
        }
      }

      // If loaded from HTTP cache, return
      if (loadedCache) {
        if (async === true) {
          callback(cacheData);
          return;
        } else {
          return cacheData;
        }
      }


      var isIE8 = false;
      var ajax;
      if (window.XDomainRequest) {
        ajax = new window.XDomainRequest();
        isIE8 = true;
      }
      else if (window.XMLHttpRequest) {
        ajax = new XMLHttpRequest();
      } else {
        ajax = new ActiveXObject('Microsoft.XMLHTTP');
      }
      ajax.open(method, url, async);
      if (responseType !== undefined) {
        ajax.responseType = responseType;
      }

      if (isIE8) {
        // Setttings for IE8 XDomainRequest
        ajax.onload = function () {
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

          that._appendHttpCache(httpCache, {
            url: url,
            method: method,
            headers: headers,
            async: async,
            responseType: responseType,
            mimeType: mimeType,
            data: data,
            response: o
          });

          callback(o);
        }

      };

      } else {
        // Setttings for XMLHttpRequest
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

            that._appendHttpCache(httpCache, {
              url: url,
              method: method,
              headers: headers,
              async: async,
              responseType: responseType,
              mimeType: mimeType,
              data: data,
              response: o
            });

            callback(o);
          }
        };

      }


      if (mimeType !== undefined) {
        ajax.overrideMimeType(mimeType);
      }

      var hasHeadersToSet = headers !== undefined && headers.length !== 0;
      if (hasHeadersToSet) {
        this.each(headers, function (header, value) {
          ajax.setRequestHeader(header, value);
        });
      }

      var hasDataToSend = method &&
          method.toUpperCase() !== 'GET' && data.length !== 0;
      if (hasDataToSend) {
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        ajax.send(data);
      } else {
        ajax.send();
      }

      if (!async) {
        this._appendHttpCache(httpCache, {
          url: url,
          method: method,
          headers: headers,
          async: async,
          responseType: responseType,
          mimeType: mimeType,
          data: data,
          response: ajax
        });

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
          cache: true,
          async: false
        }).responseText;

        return data;
      } else if (typeof callback === 'function') {
        this.http({
          url: url,
          cache: true,
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

    define: function (name, modules, callback) {
      var originalPath = this._path;
      this._path = this._currentPath.replace(/\/\w+$/, '/');

      if (typeof modules === 'function') {
        callback = modules;
        modules = [];
      }

      if (typeof modules === 'string') {
        modules = [modules];
      }

      var buffer = [];
      var that = this;
      modules.forEach(function (md) {
        buffer.push(that.use(md));
      });

      var result = callback.apply(this, buffer);
      this.modules[name] = result;

      this._path = originalPath;
      return result;
    },

    _executeRequireCallback: function (srcs, loadingBuffer, callback) {
      var buffer = [];
      srcs.forEach(function (src) {
        buffer.push(loadingBuffer[src]);
      });
      callback.apply(this, buffer);
    },

    _loaded: {},
    _currentPath: '',
    _useModuleAsync: function (srcs, useLoader, callback) {
      var loadingBuffer = {};
      var loadingCounter = 0;
      var loadingTarget = 0;
      if (typeof srcs === 'string') {
        srcs = [srcs];
      }
      loadingTarget = srcs.length;
      var that = this;

      srcs.forEach(function (src) {
        var url = that._path + src + '.js';
        var originalCurrentPath = that._currentPath;
        that._currentPath = that._path + src;

        if (useLoader === true) {
          if (src.indexOf('/') === -1) {
            var tokens = src.split('@');
            src = tokens[0];
            var version = tokens.length === 2
                ? tokens[1]
                : that.MODULE_VERSION[src] || 'latest';
            // url = MODULE_LOADER + src;
            url = MODULE_LOADER + 'chopjs-' + src +
              '/' + version + '/' + src + '.min.js';
          }
        }

        var result;
        var hasScriptLoaded = Object.keys(that._loaded).indexOf(url) !== -1;
        if (!hasScriptLoaded) {
          // asynchronously download script
          that.http({
            url: url,
            method: 'get',
            done: function (res) {
              if (res.status === 200 || res.status === 304) {
                result = eval(res.responseText);
                that._loaded[url] = result;
                loadingBuffer[src] = result;
                ++loadingCounter;
                if (loadingCounter === loadingTarget) {
                  that._executeRequireCallback(srcs, loadingBuffer, callback);
                }
              } else {
                throw new Error('ChopJS cannot load "' + src + '".');
              }
            }
          });

        } else {
          loadingBuffer[src] = that._loaded[url];
          ++loadingCounter;
          if (loadingCounter === loadingTarget) {
            that._executeRequireCallback(srcs, loadingBuffer, callback);
          }
        }

        that._currentPath = originalCurrentPath;
      });
    },

    _useModule: function (src, useLoader) {
      var url = this._path + src + '.js';
      var originalCurrentPath = this._currentPath;
      this._currentPath = this._path + src;

      if (useLoader === true) {
        if (src.indexOf('/') === -1) {
         var tokens = src.split('@');
         src = tokens[0];
         var version = tokens.length === 2
              ? tokens[1]
              : this.MODULE_VERSION[src] || 'latest';
          // url = MODULE_LOADER + src;
          url = MODULE_LOADER + 'chopjs-' + src +
          '/' + version + '/' + src + '.min.js';

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

    // `require` is now replaced by `use`.
    _require: function (srcs, useLoader, callback) {
      if (!srcs) {
        return false;
      }

      if (typeof useLoader !== 'boolean') {
        callback = useLoader;
        useLoader = true;
      }

      // check if should be a synchonous require
      if (callback === undefined) {
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
      } else { // asynchronous require
        this._useModuleAsync(srcs, useLoader, callback);
      }

      return false;
    },

    // __require(...)__ is now __deprecated__.
    // Use __use(...)__ instead.
    require: function () {
      // Show deprecation message.
      console.warn('$ch.require is deprecated. Use $ch.use instead.');
      return this._require.apply(this, arguments);
    },

    use: function () {
      return this._require.apply(this, arguments);
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
            // that.source(this.getAttribute('ch-source'), this.value);
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

    // __deserialize(`formQuery`)__
    //  To deserialize a form string.
    //
    //       var query = 'name=chopjs&version=0.1';
    //       $ch.deserialize(query); // returns {name: 'chopjs', version: '0.1'}
    //
    deserialize: function (query) {
      var pairs, i, keyValuePair, key, value, map = {};
      // remove leading question mark if its there
      if (query.slice(0, 1) === '?') {
        query = query.slice(1);
      }
      if (query !== '') {
        pairs = query.split('&');
        for (i = 0; i < pairs.length; i += 1) {
          keyValuePair = pairs[i].split('=');
          key = decodeURIComponent(keyValuePair[0]);
          value = (keyValuePair.length > 1) ? decodeURIComponent(keyValuePair[1]) : undefined;
          map[key] = value;
        }
      }
      return map;
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

  // Shim function for serializing form elements.
  // Acknowledgment:
  // https://code.google.com/p/form-serialize/source/browse/trunk/serialize-0.1.js
  //
  function _serializeForm (form) {
    if (!form || form.nodeName !== "FORM") {
      return;
    }
    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
      if (form.elements[i].name === "") {
        continue;
      }
      switch (form.elements[i].nodeName) {
        case 'INPUT':
        switch (form.elements[i].type) {
          case 'text':
          case 'hidden':
          case 'password':
          case 'button':
          case 'reset':
          case 'submit':
          q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
          break;
          case 'checkbox':
          case 'radio':
          if (form.elements[i].checked) {
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
          }
          break;
        }
        break;
        case 'file':
        break;
        case 'TEXTAREA':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        break;
        case 'SELECT':
        switch (form.elements[i].type) {
          case 'select-one':
          q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
          break;
          case 'select-multiple':
          for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
            if (form.elements[i].options[j].selected) {
              q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
            }
          }
          break;
        }
        break;
        case 'BUTTON':
        switch (form.elements[i].type) {
          case 'reset':
          case 'submit':
          case 'button':
          q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
          break;
        }
        break;
      }
    }
    return q.join("&");
  }

  root.$ch = chop;
  root.$$CHOP = chop;
  root.$$CHOPEL = chopEl;
  root.$$CHOPVIEW = chopView;

  root.onload = function () {
    // hide everything until ChopJS is completely initialized.
    document.querySelector('html').style.cssText += 'display: none';

    chop._loadMain();
  };
}(window));
