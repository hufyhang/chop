/* global $ch */
$ch.define('views', function () {
  'use strict';
  var html = '';
  html += '<hr/><br/>&copy; 2012-2014 Chop.js';
  html += '<br/><input type="button" value="CLICK" ch-click="sayHi"/>';
  html += '<br/><input type="button" value="ADVERT" ch-click="gotoAdvert"/>';

  var tail = $ch.view({
    html: html
  });

  var banner = $ch.view({
    html: function () {
      var template = $ch.find('#banner-template').html();
      return $ch.template(template);
    }
  });

  return {
    tail: tail,
    banner: banner
  };
});
