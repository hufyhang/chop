/* global $ch */
$ch.define('gangnam-style/main', function () {
  'use strict';

  $ch.require('directive');

  var template = $ch.readFile('template.html');

  $ch.directive.add('gangnam-style', template, function (com, shadow) {
    var audio = new Audio();
    audio.src= 'gangnam-style/gangnam.ogg';
    audio.autoplay = false;
    audio.loop = true;
    audio.load();

    $ch.find('#sig', shadow).on('mouseover', function () {
      audio.play();
    }).on('mouseout', function () {
      audio.pause();
    });
  });

});