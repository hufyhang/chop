/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('ui', function () {
  'use strict';
  var UI_CSS = 'http://feifeihang.info/chop/style.php?q=chopjs-ui-style';

  var hasStyle = $$CHOP.find('.chopjs-ui-style-css') !== undefined;
  if (!hasStyle) {
    var node = document.createElement('style');
    node.className += ' chopjs-ui-style-css';
    node.innerHTML = $$CHOP.http({url: UI_CSS, async: false});
    document.head.appendChild(node);
  }

  // hide and show//{{{
  $$CHOPEL.hide = function () {
    this.el.className += ' chopjs-ui-hide';
    return this;
  };

  $$CHOPEL.show = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-hide/g, '');
    return this;
  };
//}}}

  // height//{{{
  $$CHOPEL.height = function () {
    return this.el.offsetHeight;
  };
//}}}

  // width//{{{
  $$CHOPEL.width = function () {
    return this.el.offsetWidth;
  };
//}}}

  // scrollTop//{{{
  $$CHOPEL.scrollTop = function () {
    var doc = this.el;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
  };
//}}}

  // full size//{{{
  $$CHOPEL.full = function () {
    var e = this.el;
    e.className += ' chopjs-ui-full';
    return this;
  };

  $$CHOPEL.fullHeight = function () {
    var e = this.el;
    e.className += ' chopjs-ui-full-height';
    return this;
  };

  $$CHOPEL.fullWidth = function () {
    var e = this.el;
    e.className += ' chopjs-ui-full-width';
    return this;
  };
//}}}

  // disable & enable//{{{
  $$CHOPEL.disable = function () {
    this.attr('disabled', 'disabled');
    this.el.className += ' chopjs-ui-disable';
    return this;
  };

  $$CHOPEL.enable = function () {
    this.removeAttr('disabled');
    this.el.className = this.el.className.replace(/chopjs-ui-disable/g, '');
    return this;
  };
//}}}

  // click button//{{{
  $$CHOPEL.button = function (callback) {
    this.el.className += ' chopjs-ui-button';

    if (callback !== undefined) {
      this.on('click', callback);
    }

    return this;
  };
//}}}

  // input & textarea //{{{
  $$CHOPEL.input = function (callback) {
    this.el.className += ' chopjs-ui-input';

    if (callback !== undefined) {
      this.on('keyup', callback);
    }

    return this;
  };

  $$CHOPEL.textarea = $$CHOPEL.input;
//}}}

  // dropbox & selectbox //{{{
  $$CHOPEL.dropbox = function (callback) {
    var e = this.el;
    this.el.className += ' chopjs-ui-select';

    if (callback !== undefined) {
      this.on('change', function () {
        callback(e.value);
      });
    }

    return this;
  };

  $$CHOPEL.selectbox = $$CHOPEL.dropbox;
//}}}

  // pager button//{{{
  $$CHOPEL.pager = function (callback) {
    this.el.className += ' chopjs-ui-pager';

    if (callback !== undefined) {
      this.on('click', callback);
    }

    return this;
  };
//}}}

  // topbar//{{{
  $$CHOPEL.topbar = function (zindex, next) {
    var e = this.el;
    if (typeof zindex !== 'number') {
      next = zindex;
      zindex = 1;
    }

    e.className += ' chopjs-ui-topbar';
    e.style.zindex = zindex;


    var subs = $ch.findAll('*', e);
    $ch.each(subs, function (sub) {
      var tagName = sub.el.tagName.toUpperCase();
      if (tagName === 'DIV' || tagName === 'SPAN') {
        if (sub.el.getAttribute('ch-logo') === null) {
          sub.button();
        } else {
          sub.el.className += ' ch-topbar-img';
        }
      }
      sub.el.className += ' ch-topbar-element';
    });

    if (next !== undefined) {
      var margin = this.height() + 5 + 'px';
      next.css('margin-top', margin);
    }

    return this;
  };
//}}}

});
