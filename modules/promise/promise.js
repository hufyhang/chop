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
        saveCallback: undefined,

        then: function (callback) {
          this.callbacks.push(callback);
          return this;
        },

        save: function (callback) {
          this.saveCallback = callback;
          return this;
        },

        resolve: function (data) {
          this.data = data;
          var that = this;
          $$CHOP.each(this.callbacks, function (callback) {
            that.data = callback(that.data);
          });
        },

        reject: function (data) {
          this.data = data;
          this.saveCallback(this.data);
        }
      };
      return promise;
    }
  };

});
