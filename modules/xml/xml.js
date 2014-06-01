/* global $ch, $$CHOP */
$ch.define('xml', function () {
  'use strict';
  $$CHOP.xml = {};

  $$CHOP.xml._toJSON = function (xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType === 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) === "undefined") {
          obj[nodeName] = this._toJSON(item);
        } else {
          if (typeof(obj[nodeName].push) === "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this._toJSON(item));
        }
      }
    }
    return obj;
  };

  $$CHOP.xml.toJSON = function (data) {
    var doc;
    if (arguments.length === 0) {
      throw new Error('$ch.xmlToJson requires a parameter.');
    }

    if (typeof data === 'string') {
      if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(data);
      } else {
        var parser = new DOMParser();
        doc = parser.parseFromString(data,'text/xml');
      }
    } else {
      doc = data;
    }

    return this._toJSON(doc);
  };

});
