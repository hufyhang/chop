/* global $ch */
$ch.define('addon', function () {
  'use strict';
  $ch.addon = function () {
    console.log('This message is sent from an addon module.');
  };
});
