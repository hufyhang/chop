/* global $ch */
$ch.define('events', function () {
  'use strict';
  var doClick = function () {
    var from = $ch.find('#from-input').val();
    var to = $ch.find('#to-input').val();
    var data = {name: to, sender: from};

    var msg = $ch.view({
      html: function () {
        var template = $ch.find('#msg-template').html();
        return $ch.template(template, data);
      }
    });

    $ch.find('.message').view(msg);
  };

  var doKeypress = function (evt) {
    doClick();
  };

  var sayHi = function (name, age) {
    alert('Hi...' + name + ' @ ' + age);
  };

  return {
    doClick: doClick,
    doKeypress: doKeypress,
    sayHi: sayHi
  };
});
