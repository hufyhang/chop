/* global $ch, $$CHOP */
$ch.define('promise', function () {
  'use strict';

  $$CHOP.promise = {};
  $$CHOP.promise = {
    defer: function () {
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
          var that = this;
          $$CHOP.each(this.callbacks, function (callback) {
            that.data = callback(that.data);
          });
        }
      };
      return promise;
    }
  };

});
