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

  var importHtml = function (url, element) {
    var html = $$CHOP.http({
      url: url,
      method: 'GET',
      async: false
    });
    element.innerHTML = html;
    $$CHOP._loadView(element);
  };

  var searchImport = function (baseElement) {
    if (baseElement === undefined || baseElement === null) {
      baseElement = document;
    }

    var elements = baseElement.querySelectorAll('ch-import');
    $$CHOP.each(elements, function (element) {
      var url = element.getAttribute('src');
      if (url !== null) {
        importHtml(url, element);
      }
    });
  };

  $$CHOPEL.import = function (url) {
    if (typeof url !== 'string') {
      throw new Error('import requires a string-type parameter.');
    }
    var el = this.el;
    importHtml(url, el);
  };

});
