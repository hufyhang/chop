/* global $ch, $$CHOP */
$ch.define('event', function () {
  'use strict';
  var events = {};

  $$CHOP.event = {};

  $$CHOP.event = {
    listen: function (evt, callback) {
      if (arguments.length === 0) {
        throw new Error('$ch.event.listen requires at least one parameter.');
      }
      else if (arguments.length === 1) {
        var result;
        if (events[evt] !== undefined) {
          result = events[evt]._callback;
        } else {
          result = undefined;
        }
        return result;
      }

      events[evt] = {};
      events[evt]._event = evt;
      events[evt]._callback = callback;
    },

    emit: function (evt) {
      if (arguments.length === 0) {
        throw new Error('$ch.event.emit requires one parameter.');
      }

      if (events[evt] === undefined) {
        return undefined;
      }

      events[evt]._callback();
    }
  };
});
