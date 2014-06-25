/* global $ch, $$CHOP */
$ch.define('import', function () {
  'use strict';

  var originalLoadView = $$CHOP._loadView;
  $$CHOP._loadView = function (baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }
    originalLoadView(baseElement);

    searchImport(baseElement);
  };

  var importHtml = function (url, element, query) {
    var html = $$CHOP.http({
      url: url,
      method: 'GET',
      async: false
    });
    if (typeof query === 'string') {
      var node = document.createElement('div');
      node.innerHTML = html;
      var el = node.querySelector(query);
      if (el !== undefined || el !== null) {
        html = el.innerHTML;
      }
    }
    element.innerHTML += html;
    $$CHOP._loadView(element);
  };

  var searchImport = function (baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }

    var elements = baseElement.querySelectorAll('ch-import');
    $$CHOP.each(elements, function (element) {
      var url = element.getAttribute('src');
      var query = element.getAttribute('query');
      if (url !== null) {
        importHtml(url, element.parentNode, query);
      }
    });
  };

  $$CHOPEL.import = function (url, query) {
    if (typeof url !== 'string') {
      throw new Error('import requires a string-type parameter.');
    }
    var el = this.el;
    importHtml(url, el, query);
  };

});
