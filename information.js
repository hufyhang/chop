/* global $ch */
$ch.add('information', function () {
  'use strict';
  console.log('Information');
  return {
    msg: 'A very simple AMD module'
  };
});
