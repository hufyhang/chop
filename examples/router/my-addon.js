/* global $ch */
$ch.define('my-addon', function () {
  'use strict';
  $ch.addon = function (message) {
    console.log('From Addon: ' + message);
  };

  return {
    name: 'Chop.js Framework'
  };
});
