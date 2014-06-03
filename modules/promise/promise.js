/* global $ch, $$CHOP */
$ch.define('promise', function () {
  'use strict';

  var promise = {
    promise: this,
    data: undefined,
    callbacks: [],

    then: function (callback) {
      this.callbacks.push(callback);
      return this;
    },

    resolve: function (data) {
      this.data = data;
      $$CHOP.each(this.callbacks, function (callback) {
        this.data = callback(this.data);
      });
    }
  };

  $$CHOP.promise = {};
  $$CHOP.promise = {
    defer: function () {
      return Object.create(promise);
    }
  };

});
