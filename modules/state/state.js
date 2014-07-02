/* global $ch, $$CHOP */
$ch.define('state', function () {
  'use strict';

  $$CHOP.state = {};
  $$CHOP.state = {
    create: function (obj) {
      var state = {
        states: {},
        current: '_init_',
        length: 0,

        add: function (states) {
          if (states !== undefined) {
            var that = this;
            $$CHOP.each(states, function (st, callback) {
              that.states[st] = callback;
              ++that.length;
            });
          }

          return this;
        },

        remove: function (states) {
          var that = this;
          if ($$CHOP.isArray(states)) {
            $$CHOP.each(states, function (st) {
              if (that.states[st] !== undefined) {
                delete that.states[st];
                --that.length;
              }
            });
          } else {
            if (that.states[states] !== undefined) {
              delete that.states[states];
              --that.length;
            }
          }

          return this;
        },

        goto: function (state, data) {
          var callback = this.states[state];
          if (callback !== undefined) {
            this.current = state;
            callback(data);
          }
        },

        state: function (st) {
          if (arguments.length === 0) {
            return this.current;
          } else {
            if (this.states[st] !== undefined) {
              return this.states[st];
            }
          }

          return undefined;
        }

      };

      state.add(obj);

      return state;
    }
  }

});
