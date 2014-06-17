/* global $ch, $$CHOP */
$ch.define('service', function () {
  'use strict';
  // bring in router module
  $ch.require('router');

  $$CHOP.service = {};

  $$CHOP.service = {
    _services: {},
    add: function (name, viewFunction) {
      this._services[name] = {
        name: name,
        view: viewFunction
      };
    }
  };

  $$CHOP.router.add({
    '_chopjs_service/:name/:data': function (param) {
      var data = {};
      var input = param.data.split('&');
      $$CHOP.each(input, function (item) {
        var key = item.split('=')[0].trim();
        var value = item.split('=')[1].trim();
        data[key] = value;
      });

      var service = $$CHOP.service._services[param.name];
      var view;
      if (service === undefined) {
        view = $$CHOP.view({html: 'Oops! No such Chop.js service.'});
      } else {
        view = service.view(data);
      }
      $$CHOP.find('html').view(view);
    }
  });


  // search and process Chop.js service in HTML
  var services = $$CHOP.findAll('ch-service');
  $$CHOP.each(services, function (element) {
    element = element.el;
    var url = element.getAttribute('src').trim();
    var name = element.getAttribute('service').trim();
    var pre;

    if (url.slice(-1) === '/') {
      pre = '#/_chopjs_service/';
    } else {
      pre = '/#/_chopjs_service/';
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
});
