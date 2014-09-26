/* global $ch */
$ch.define('badge', function () {
  'use strict';

  $ch.require('directive');

  var template = $ch.http({
    url: './badge.html',
    async: false
  }).responseText;

  $ch.directive.add('name-badge', template, function (com, shadow) {
    var color = com.getAttribute('color');
    console.log('COLOR: ' + color);
    $ch.find('.name', shadow).on('click', function (evt) {
      console.log(com);
    });
  });
});
