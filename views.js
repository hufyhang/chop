/* global $ch */
$ch.add('views', function () {
  'use strict';
  var tail = $ch.view({
    html: '<hr/><br/>&copy; 2012-2014 Chop.js <input type="button" value="CLICK" ch-click="sayHi"/>'
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
