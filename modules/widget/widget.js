/* global $ch, $$CHOP */
$ch.define('widget', function () {
  'use strict';
  // bring in router module
  $ch.require('router');

  var DATA_TUNNEL = '_chopjs_widget_data_tunnel_';

  $$CHOP.widget = {};

  $$CHOP.widget = {
    _widgets: {},
    _tunnel: {},
    register: function (obj) {
      var that = this;
      $$CHOP.each(obj, function (name, viewFunction) {
        that._widgets[name] = {
          name: name,
          view: viewFunction
        };
      });
    },

    tunnel: {
      set: function (name, obj) {
        if (arguments.length !== 2) {
          throw new Error('$ch.widget.tunnel.set requires two parameters.');
        }

        var str = JSON.stringify(obj);
        str = encodeURIComponent(str);
        $$CHOP.widget._tunnel[name] = str;
      },

      get: function (widget, key) {
        if (arguments.length === 0) {
          throw new Error('$ch.widget.tunnel.get requires at least one parameter.');
        }

        if (document.getElementById(widget) === null) {
          return undefined;
        }
        var name = document.getElementById(widget).getAttribute('widget');
        var doc = document.getElementById(widget).querySelector('iframe').contentWindow.document;
        doc = doc.getElementById(DATA_TUNNEL + name);
        if (doc === null) {
          return undefined;
        }
        var value = doc.getAttribute('value');
        if (value === null) {
          return undefined;
        }

        value = decodeURIComponent(value);
        var obj = JSON.parse(value);
        if (typeof key === 'string') {
          return obj[key];
        } else {
          return obj;
        }
      }

    }
  };

  $$CHOP.router.add({
    '_chopjs_widget/:name/:data': function (param) {
      var data = {};
      var input = param.data.split('&');
      $$CHOP.each(input, function (item) {
        var key = item.split('=')[0].trim();
        var value = item.split('=')[1].trim();
        data[key] = value;
      });

      var widget = $$CHOP.widget._widgets[param.name];
      var view;
      if (widget === undefined) {
        view = $$CHOP.view({html: 'Oops! No such Chop.js widget.'});
      } else {
        view = widget.view(data);
      }
      var styles = document.querySelectorAll('body style');
      var scripts = document.querySelectorAll('body script');
      $$CHOP.find('body').view(view);
      $$CHOP.each(styles, function (style) {
        document.body.appendChild(style);
      });
      $$CHOP.each(scripts, function (script) {
        document.body.appendChild(script);
      });

      $$CHOP.each($$CHOP.widget._tunnel, function (name, str) {
        var node = document.createElement('ch-widget-data-tunnel');
        node.setAttribute('id', DATA_TUNNEL + name);
        node.setAttribute('style', 'display: none');
        node.setAttribute('value', str);
        document.body.appendChild(node);
      });

    }
  });


  // search and process Chop.js widget in HTML
  var loadWidget = function (baseElement) {
    var widgets = baseElement.querySelectorAll('ch-widget');
    $$CHOP.each(widgets, function (element) {
      // do nothing is already contains iframe
      if (element.querySelector('iframe') !== null) {
        return;
      }

      var url = element.getAttribute('src').trim();
      var name = element.getAttribute('widget').trim();
      var pre;

      if (url.slice(-1) === '/') {
        pre = '#/_chopjs_widget/';
      } else {
        pre = '/#/_chopjs_widget/';
      }

      url = url + pre + name;

      var data = [];
      var dataEls = element.querySelectorAll('ch-data');
      $$CHOP.each(dataEls, function (dataEl) {
        var key = dataEl.getAttribute('key').trim();
        var value = dataEl.innerHTML;
        data.push(key + '=' + value);
      });

      url += '/' + data.join('&');
      element.innerHTML = '<iframe src="' + url + '"></iframe>';
    });
  };

  loadWidget(document);
  var originalLoadView = $$CHOP._loadView;
  $$CHOP._loadView = function (baseElement) {
    var shouldLoadWidget = true;
    if (baseElement === undefined) {
      baseElement = document;
      shouldLoadWidget = false;
    }

    originalLoadView(baseElement);
    if (shouldLoadWidget) {
      loadWidget(baseElement);
    }
  };

});
