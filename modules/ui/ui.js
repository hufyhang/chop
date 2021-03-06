/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('ui', function () {
  'use strict';
  // var UI_CSS = 'http://feifeihang.info/chop/style.php?q=chopjs-ui-style';
  // var UI_CSS = 'https://cdn.jsdelivr.net/chopjs-ui/latest/chopjs-ui-style.css';
  var UI_CSS = 'https://cdn.jsdelivr.net/chopjs-ui/' + $$CHOP.MODULE_VERSION.ui
             + '/chopjs-ui-style.css';

  var originalLoadView = $$CHOP._loadView;
  $$CHOP._loadView = function (baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }

    var context = baseElement;
    renderUI(context);

    originalLoadView(baseElement);
  };

  function renderUI(baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }

    var context = baseElement;

    // load from directives
    var els = $$CHOP.findAll('[ch-ui-button]', context);
    $$CHOP.each(els, function (e) {
      e.button();
    });

    els = $$CHOP.findAll('[ch-ui-video-background]', context);
    $$CHOP.each(els, function (e) {
      e.videoBackground();
    });

    els = $$CHOP.findAll('[ch-ui-select]', context);
    $$CHOP.each(els, function (e) {
      e.selectbox();
    });

    els = $$CHOP.findAll('[ch-ui-pager]', context);
    $$CHOP.each(els, function (e) {
      e.pager();
    });

    els = $$CHOP.findAll('[ch-ui-tabs]', context);
    $$CHOP.each(els, function (e) {
      e.tabs();
    });

    els = $$CHOP.findAll('[ch-ui-tile]', context);
    $$CHOP.each(els, function (e) {
      e.tile();
    });

  }

  // add ChopJS UI CSS
  var hasStyle = $$CHOP.find('.chopjs-ui-style-css') !== undefined;
  if (!hasStyle) {
    var node = document.createElement('style');
    node.className += ' chopjs-ui-style-css';
    node.innerHTML = $$CHOP.http({url: UI_CSS, async: false}).responseText;
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

  // video background
  $$CHOPEL.videoBackground = function () {
    this.el.className += 'chopjs-ui-video-background';
    return this;
  };

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

    // this.el.addEventListener('click', function (e) {
    //   var element = e.target || e.srcElement;
    //   var ink = document.createElement('span');
    //   ink.className += ' chopjs-ui-ink';
    //   element.appendChild(ink);
    // });

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

  // tabs//{{{
  $$CHOPEL.tabs = function () {
    var e = this.el;
    var htmls = {};
    var index, len;
    var tabs = e.querySelectorAll('[ch-tab]');
    var tab;
    for (index = 0, len = tabs.length; index !== len; ++index) {
      tab = tabs[index];
      var name = tab.getAttribute('ch-tab');
      if (name === null || name === undefined) {
        continue;
      }
      htmls[name] = tab.innerHTML;
    }

    var html = [];
    var firstHtml;
    html.push('<div class="chopjs-ui-tabs">');
    var names = Object.keys(htmls);
    for (index = 0, len = names.length; index !== len; ++index) {
      var activeTag = index === 0 ? ' chopjs-ui-active' : '';
      if (index === 0) {
        firstHtml = htmls[names[index]];
      }

      var chopEvent = '';
      var evt = tabs[index].getAttribute('ch-click');
      if ( evt !== null) {
        chopEvent += 'ch-click="' + evt + '" ';
      }

      html.push('<div class="chopjs-ui-tab ' + activeTag + '" ch-tab="' + names[index] + '" ' + chopEvent + '>' + names[index] + '</div>');
    }
    html.push('</div>');

    var content = ['<div class="chopjs-ui-tabs-content">'];
    content.push(firstHtml);
    content.push('</div>');

    e.innerHTML = html.join('') + content.join('');

    tabs = e.querySelectorAll('.chopjs-ui-tab');
    for (index = 0, len = tabs.length; index !== len; ++index) {
      tab = tabs[index];
      tab.addEventListener('click', function () {
        // remove all the contained ch-source from $ch.sources first
        var srcs = e.querySelectorAll('.chopjs-ui-tabs-content [ch-source]');
        $$CHOP.each(srcs, function (item) {
          var name = item.getAttribute('ch-source');
          var index;
          if (name !== null && name !== undefined && name.trim() !== '') {
            index = $$CHOP.sources[name].els.indexOf(item);
            if (index !== -1) {
              $$CHOP.sources[name].els.splice(index, 1);
            }
          } else {
            var id = item.id;
            var names = $$CHOP._inlineSource[id].match(/{{[^{]{1,}}}/g);
            if (names !== null) {
              $$CHOP.each(names, function (n) {
                name = n.replace(/{/g, '');
                name = name.replace(/}/g, '').trim();
                index = $$CHOP.sources[name].els.indexOf(item);
                if (index !== -1) {
                  $$CHOP.sources[name].els.splice(index, 1);
                }
              });
            }
          }
        });


        for (var i = 0, l = tabs.length; i !== l; ++i) {
          tabs[i].className = tabs[i].className.replace(/chopjs-ui-active/g, '');
        }
        this.className += ' chopjs-ui-active';
        var tabName = this.getAttribute('ch-tab');
        var ce = e.querySelector('.chopjs-ui-tabs-content');
        ce.innerHTML = htmls[tabName];
        $$CHOP._loadView(ce);
      });
    }

    return this;
  };
//}}}

  // resize//{{{
  $$CHOPEL.resize = function () {
    this.el.className += ' chopjs-ui-resize';
  };
//}}}

  // tile //{{{
  $$CHOPEL.tile = function () {
    this.el.className += ' chopjs-ui-tile';

    var header = this.el.querySelector('[ch-ui-tile-header]');
    if (header !== null && header !== undefined) {
      header.className += ' chopjs-ui-tile-header';
    }

    var footer = this.el.querySelector('[ch-ui-tile-footer]');
    if (footer !== null && footer !== undefined) {
      footer.className += ' chopjs-ui-tile-footer';
    }

    return this;
  };
//}}}

  // render UI
  renderUI();

});
