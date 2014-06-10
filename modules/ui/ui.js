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

  // colorful//{{{
  $$CHOPEL.normal = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-color-\w+/g, '');
    return this;
  };

  $$CHOPEL.warning = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-color-\w+/g, '');
    this.el.className += ' chopjs-ui-color-warning';
    return this;
  };

  $$CHOPEL.danger = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-color-\w+/g, '');
    this.el.className += ' chopjs-ui-color-danger';
    return this;
  };

  $$CHOPEL.success = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-color-\w+/g, '');
    this.el.className += ' chopjs-ui-color-success';
    return this;
  };

  $$CHOPEL.information = function () {
    this.el.className = this.el.className.replace(/chopjs-ui-color-\w+/g, '');
    this.el.className += ' chopjs-ui-color-information';
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

    if (e.getAttribute('multiple') === null) {
      this.el.className += ' chopjs-ui-select-drop';
    }

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
        if (sub.el.getAttribute('ch-logo') !== null) {
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

  // tabs
  $$CHOPEL.tabs = function (active) {
    var e = this.el;
    var htmls = {};
    var index, len;
    var tabs = e.querySelectorAll('[ch-tab]');
    for (index = 0, len = tabs.length; index !== len; ++index) {
      var tab = tabs[index];
      var name = tab.getAttribute('ch-tab');
      if (name === null || name === undefined) {
        continue;
      }
      htmls[name] = tab.innerHTML;
    }

    var html = [];
    html.push('<div class="chopjs-ui-tabs">');
    var names = Object.keys(htmls);
    for (index = 0, len = names.length; index !== len; ++index) {
      html.push('<div class="chopjs-ui-tab">' + names[index] + '</div>');
    }
    html.push('</div>');

    var content = ['<div class="chopjs-ui-tabs-content">'];
    if (typeof active === 'string' && htmls[active] !== undefined) {
      content.push(htmls[active]);
    } else {
      content.push(htmls[names[0]]);
    }
    content.push('</div>');

    e.innerHTML = html.join('') + content.join('');

    $$CHOP._loadView(e);
    return this;
  };

});
