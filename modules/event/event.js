/* global $ch, $$CHOP */
$ch.define('event', function () {
  'use strict';
  var events = {};
  var watches = {};

  $$CHOP.originalSourceFunction = $$CHOP.source;

  var objLength = function (obj) {
    var num = 0;
    for (var item in obj) {
      if (obj.hasOwnProperty(item)) {
        ++num;
      }
    }

    return num;
  };

  var getEventType = function (element) {
    var event = 'change';
    if (element.tagName.toUpperCase() === 'TEXTAREA') {
      event = 'keyup';
    }
    else if (element.tagName.toUpperCase() === 'INPUT') {
      var typeAttribute = element.getAttribute('type').toUpperCase();
      var isTextInput = typeAttribute === 'TEXT' || typeAttribute === 'PASSWORD';
      if (isTextInput) {
        event = 'keyup';
      }
    }
    return event;
  };

  $$CHOP.event = {};

  $$CHOP.event = {
    watches: watches,

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

    emit: function (evt, data) {
      if (arguments.length === 0) {
        throw new Error('$ch.event.emit requires at least one parameter.');
      }

      if ($$CHOP._isArray(evt) === false) {
        if (events[evt] === undefined) {
          return undefined;
        }
        events[evt]._callback(data);
      } else {
        for (var index = 0, len = evt.length; index !== len; ++index) {
          events[evt[index]]._callback(data);
        }
      }

    },

    watch: function (name, callback) {
      if (arguments.length !== 2) {
        throw new Error('$ch.event.watch requires two parameters. i.e. data-source name, callback.');
      }

      var data = $$CHOP.sources[name].data;
      var value;
      if ($$CHOP._isArray(data)) {
        value = data.slice(0);
      }
      else if (typeof data === 'object') {
        value = Object.create(data);
      }
      else {
        value = data;
      }

      watches[name] = {
        source: name,
        old: value,
        callback: callback
      };

      var watchChange = function () {
        if ($$CHOP.sources[name].data === watches[name].old) {
          return;
        }

        var changes = {};
        var current = $$CHOP.sources[name].data;
        changes.current = current;
        changes.old = watches[name].old;
        callback(changes);
        watches[name].old = current;
      };

      watches[name].watchChange = watchChange;

      for (var index = 0, len = $$CHOP.sources[name].els.length; index !== len; ++index) {
        var element = $$CHOP.sources[name].els[index];
        var event = getEventType(element);
        element.addEventListener(event, watchChange);
      }
    },

    unwatch: function (name) {
      if (arguments.length !== 1) {
        throw new Error('$ch.event.unwatch has to be given a data-source name parameter.');
      }

      for (var index = 0, len = $$CHOP.sources[name].els.length; index !== len; ++index) {
        var element = $$CHOP.sources[name].els[index];
        var event = getEventType(element);
        element.removeEventListener(event, watches[name].watchChange);
      }
      delete watches[name];
    },

    queue: function () {
      var q = {
        callbacks: [],
        current: 0,
        length: 0,
        data: undefined,

        add: function (callback) {
          if (callback !== undefined) {
            if ($$CHOP.isArray(callback)) {
              var that = this;
              $$CHOP.each(callback, function (call) {
                that.callbacks.push(call);
                ++that.length;
              });
            } else {
              this.callbacks.push(callback);
              ++this.length;
            }
          }
          return this;
        },

        remove: function (callback) {
          if (callback !== undefined) {
            var index;
            if ($$CHOP.isArray(callback)) {
              var that = this;
              $$CHOP.each(callback, function (fn) {
                index = that.callbacks.indexOf(fn);
                if (index !== -1) {
                  that.callbacks.splice(index, 1);
                  --that.length;
                }
              });
            } else {
              index = this.callbacks.indexOf(callback);
              if (index !== -1) {
                this.callbacks.splice(index, 1);
                --this.length;
              }
            }
          }
          return this;
        },

        promote: function (callback) {
          if (callback !== undefined) {
            var index = this.callbacks.indexOf(callback);
            if (index !== -1) {
              var fn = this.callbacks.splice(index, 1)[0];
              this.callbacks.unshift(fn);
            }
          }
          return this;
        },

        reset: function () {
          this.current = 0;
          return this;
        },

        run: function (data) {
          if (arguments.length !== 0) {
            this.data = data;
          }

          if (this.current < this.callbacks.length) {
            this.data = this.callbacks[this.current](this.data);
            ++this.current;
          } else {
            this.current = 0;
          }
          return this.data;
        },

        next: this.run,

        stop: function () {
          this.current = 0;
          var result = this.data;
          this.data = undefined;
          return result;
        }
      };

      $$CHOP.each(arguments, function (arg, fn) {
        q.add(fn);
      });

      return q;
    }
  };

  var checkWath = function (key) {
    var item = watches[key];
    if (item === undefined) {
      return undefined;
    }

    var current = $$CHOP.sources[item.source].data;
    var hasChanged = false;
    if (typeof current !== typeof item.old) {
      hasChanged = true;
    }

    else if ($$CHOP._isArray(current)) {
      if (current.length !== item.old.length) {
        hasChanged = true;
      } else {
        for (var index = 0, len = current.length; index !== len; ++index) {
          if (current[index] !== item.old[index]) {
            hasChanged = true;
            break;
          }
        }
      }
    }

    else if (typeof current === 'object' && hasChanged === false) {
      if (objLength(current) !== objLength(item.old)) {
        hasChanged = true;
      } else {
        $$CHOP.each(current, function (key) {
          if (current[key] !== item.old[key]) {
            hasChanged = true;
          }
        });
      }
    }

    else if (current !== item.old && hasChanged === false){
      hasChanged = true;
    }

    if (hasChanged === true) {
      item.current = current;
      item.old = current;
      item.callback(item);
    }

  };

  var eventSource = function (name, data) {
    if (arguments.length === 0) {
      return $$CHOP.originalSourceFunction();
    }
    else if (arguments.length === 1) {
      return $$CHOP.originalSourceFunction(name);
    }
    else {
      $$CHOP.originalSourceFunction(name, data);
      checkWath(name);
    }
  };

  $$CHOP.source = eventSource;
});
