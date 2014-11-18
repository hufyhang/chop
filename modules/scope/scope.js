// ChopJS Scope Module
// ==================

/* global $ch, $$CHOP */

//
// Each scope element could be formed in the form of:
//
//       <div ch-scope="myScope">
//          <div id="msg-div" ch-name="msg-div" ch-data>{{message}}</div>
//       </div>
//
// Meantime in JavaScript:
//
//        $ch.scope('myScope', function ($scope) {
//            $scope.message.set('ChopJS Scope module');
//            $scope['msg-div'].css('font-weight', 'bold');
//
//        });


$ch.define('scope', function () {
  'use strict';

  // Keep an reference of all the defined ChopJS scopes.
  $$CHOP.scopes = {};

  // __$ch.scope(`name`[, `callback`])__
  //
  // If `callback` is presented, define a ChopJS scope named `name`,
  // and put it in `$ch.scope`.
  // Otherwise, return the defined scope.
  //
  //     $ch.scope('myScope', function (scp) {
  //         scp.name = 'My ChopJS scope';
  //         scp.getName = function () {
  //             return scp.name;
  //         };
  //     });
  //
  //     return $ch.scope('myScope');
  //     // {name: 'My ChopJS scope', getName: function () {...}}
  $$CHOP.scope = function scope(name, callback) {
    // If no valid parameters provided, throw an error.
    if (typeof name !== 'string') {
      throw new Error('$ch.scope requires at least a string-type name parameter.');
    }

    // If only `name` provided, return the defined `name` scope.
    if (callback === undefined) {
      return $$CHOP.scopes[name];
    }

    // Otherwise, define a new scope.
    $$CHOP.scopes[name] = {
      _els: [],
      _data_entities: [],
      _data: {},
      _events: {}
    };

    // Apply event sub/pub mechanism.
    var eventHandler = new EventHandler($$CHOP.scopes[name]);

    $$CHOP.scopes[name]._eventHandler = eventHandler;

    // Retrieve elements inside scope `name` from DOM.
    retriveScope(name);

    // Process data placeholders.
    processPlaceholder(name);

    // Reload view and inline templates.
    var scopes = document.querySelectorAll('[ch-scope=' + name + ']') || [];
    scopes.forEach(function (base) {
      $$CHOP._addInlineTemplate(base);
      $$CHOP._loadView(base);
    });

    // Apply `$$CHOP.scopes[name]` to `callback` to
    // make everything defined in `callback` can be
    // attached to `$$CHOP.scopes[name]` scope.
    callback.apply(this, [$$CHOP.scopes[name], eventHandler]);


    // Append the invocation of `retriveScope`
    // in the context of `name to `$$CHOP._loadView`.
    // var _loadView = $$CHOP._loadView;
    // $$CHOP._loadView = function (baseElement) {
    //   if (baseElement === undefined || baseElement === null) {
    //     baseElement = document;
    //   }

    //   retriveScope(name);
    //   _loadView(baseElement);

    // };

    // return `$$CHOP` to enabld chainable operations.
    return $$CHOP;
  };

  // Private method to retrieve all scoped elements from DOM.
  function retriveScope(baseElement, name) {
    var hasBaseElement = true;
    if (typeof baseElement === 'string') {
      hasBaseElement = false;
      name = baseElement;
      baseElement = document;
    }

    var context = baseElement;

    // If no `baseElement` set in parameter,
    // find all scopes named `name`.
    // Otherwise, make `baseElement` to be `scopes` in array.
    var scopes;
    if (hasBaseElement) {
      scopes = [baseElement];
    } else {
      scopes = context.querySelectorAll('[ch-scope=' + name + ']');
    }

    // Iterate through the scopes found,
    // and convert all `ch-name` elements into
    // ChopJS elements and attach them to the
    // scope object.

    // First, keep an reference of scope.
    var store = $$CHOP.scope(name);
    if (scopes !== undefined && scopes !== null) {
      scopes.forEach(function (scp) {
        // Keep an reference of this scope.
        var original = scp;
        // Psuh current scope element to `$$CHOP.scopes[name]._els`.
        if (store._els === undefined) {
          store._els = [scp];
        } else {
          store._els.push(scp);
        }

        // Make a clone of the scope.
        scp = scp.cloneNode(true);

        // Clear up all the scopes unexpectedly nested.
        var fakeScopes = scp.querySelectorAll('[ch-scope]');
        if (fakeScopes !== null && fakeScopes !== undefined) {
          fakeScopes.forEach(function (fake) {
            fake.parentNode.removeChild(fake);
          });
        }

        // Find all `ch-name`.
        var names = scp.querySelectorAll('[ch-name]');
        if (names !== null && names !== undefined) {
          names.forEach(function (element) {
            // Get ID and name from `ch-name`.
            var n = element.getAttribute('ch-name');
            var id = element.getAttribute('id');
            if (id && n) {
              store[n] = $$CHOP.element(original.querySelector('#' + id));
            }
          });
        }

        // Find all `ch-data`.
        var entities = scp.querySelectorAll('[ch-data]');
        if (entities !== null && entities !== undefined) {
          entities.forEach(function (element) {
            // Get ID attribute for data placeholders.
            var id = element.getAttribute('id');
            if (id) {
              id = id.trim();
              if (store._data_entities === undefined) {
                store._data_entities = [id];
              } else {
                store._data_entities.push(id);
              }
            }

          });
        }

        // Register scope events.
        //
        // Scope events are declared in the form of:
        //
        //      <input type="text" ch-event="click: clickEvent, log; keypress: handleKeypress"/>
        //
        // To listen scope event:
        //
        //      $ch.scope('myScope', function ($scope, $event) {
        //        $event.listen('log', function (evt) {
        //          console.log(evt.target);
        //        });
        //      });
        //
        var eventHandler = store._eventHandler;
        var eventElements = scp.querySelectorAll('[ch-event]') || [];
        eventElements.forEach(function (element) {
          var id = element.getAttribute('id');
          // Get all events first.
          var events = element.getAttribute('ch-event') || '';
          events = events.split(';').map(function (item) {return item.trim();});

          // Split by `:` to bind correct event listener.
          events.forEach(function (event) {
            var parts = event.split(':').map(function (item) {return item.trim();});
            var eventType = parts[0];
            // Split by `,` to retrieve all event names.
            var eventNames = parts[1].split(',').map(function (item) {return item.trim();});

            // Register event listener.
            document.querySelector('#' + id).addEventListener(eventType, function (evt) {
              eventNames.forEach(function (evtName) {
                eventHandler.emit(evtName, evt);
              });
            }, false);
          });
        });

      });
    }
  }

  // Private method to process data placeholders.
  //
  // `name` here is scope's name.
  function processPlaceholder(name) {
    var scope = $$CHOP.scope(name);
    // If no such scope, return.
    if (!scope) {
      return;
    }

    // If scope _els is not ready (i.e. is not an array), return.
    if (scope._els === undefined || $$CHOP.isArray(scope._els) === false) {
      return;
    }

    var ids = scope._data_entities;
    ids.forEach(function (id) {
      var isInlineElement = true;
      var el = document.querySelector('#' + id);
      var dataName = el.getAttribute('ch-data');
      // If ch-data="xxx", directly add data.
      if (dataName !== null && dataName !== '') {
        isInlineElement = false;
        addDateToScope(name, dataName, el, false);
      // Otherwise, find all placeholders and add data.
      } else {
        var holders = el.innerHTML.match(/{{[^{]{1,}}}/g);
        if (holders !== null) {
          for (var i = 0, l = holders.length; i !== l; ++i) {
            dataName = holders[i];
            dataName = dataName.split('|')[0];
            dataName = dataName.replace(/{{/g, '');
            dataName = dataName.replace(/}}/g, '');
            dataName = dataName.trim();
            addDateToScope(name, dataName, el, true);
          }
        }
      }

      // Add event listeners.
      var eventType = 'keyup';
      var type = el.getAttribute('type');
      if (type !== null) {
        type = type.toUpperCase();
        if (type === 'RANGE' || el.tagName.toUpperCase() === 'SELECT') {
          eventType = 'change';
        }
      }

      var tagName = el.tagName.toUpperCase();
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        el.addEventListener(eventType, function (evt) {
          evt = evt || window.event;
          dataName = dataName.trim();
          var target = evt.target || evt.srcElement;
          var val = target.value;
          var old = $$CHOP.scopes[name][dataName].get();
          if (val !== old) {
            $$CHOP.scopes[name][dataName].set(val);
          }
        }, false);
      }

      // If this is an inline ch-data, innerHTML has to be updated.
      if (isInlineElement) {
        var html = el.innerHTML;

        // Find all placeholders surrounded by `{{` and `}}`.
        var founds = el.innerHTML.match(/{{[^{]{1,}}}/g);

        // For each of the substrings found, remove `{{` and `}}`,
        // and replace the placeholder between `{{` and `}}` with
        // the corresponding data.
        for (var i = 0; i !== founds.length; ++i) {
          var found = founds[i].replace(/{/g, '');
          found = found.replace(/}/g, '');
          var pipes = found.split('|').map(function (item) {return item.trim();});
          found = pipes[0].trim();
          found = found.split('.')[0];
          found = scope[found].get();
          // Iterate through `pipes` to apply pipe operations.
          for (var pi = 1, li = pipes.length; pi !== li; ++pi) {
            var pipe = pipes[pi].trim();
            pipe = scope[pipe] || function (a) {return a;};
            found = pipe.call(this, found);
          }
          html = html.replace(new RegExp(founds[i], 'g'), found);
        }

        // Now, replace the innerHTML of
        // the processed element with the new content.
        el.innerHTML = html;

        // Reload view on this element.
        $$CHOP._loadView(el);
      }
    });
  }

  function addDateToScope(scopeName, dataName, element, isInline) {
    // Keep an reference to the scope.
    var scope = $$CHOP.scope(scopeName);
    dataName = dataName.split('.')[0];
    // First, check if this `ch-data` has already been initialized.
    if (scope._data[dataName] === undefined) {
      scope._data[dataName] = {
        // `_els` should be like:
        //        [{
        //            _isInline: 'indicates if this is an inline `ch-data` element',
        //            _html: 'the original innerHTML',
        //            _id: 'the ID of the element'
        //        }]
        _els: [],
        _val: undefined,
        // __get()__
        //
        // Get the value of this ChopJS Scope data.
        //
        // For example, in HTML:
        //
        //        <div ch-scope="myScope">
        //            <span id="message-span" ch-data>{{message}}</span>
        //        </div>
        //
        // Meanwhile in JavaScript:
        //
        //        $ch.scope('myScope', function ($scope) {
        //            var msg = $scope.message.get();
        //        });
        //
        get: function get() {
          return this._val;
        },
        // __set(`val`)__
        //
        // Set the value of this ChopJS Scope data to `val`.
        //
        // For example, in HTML:
        //
        //        <div ch-scope="myScope">
        //            <span id="message-span" ch-data>{{message}}</span>
        //        </div>
        //
        // Meanwhile in JavaScript:
        //
        //        $ch.scope('myScope', function ($scope) {
        //            $scope.message.set('Hello world!!!');
        //        });
        //
        set: function set(val) {
          if (arguments.length === 0) {
            return false;
          }

          this._val = val;
          var that = this;
          // Iterate through `_els`, and update all the related elements.
          this._els.forEach(function (el) {
            // If this is an inline ch-data, update its innerHTML.
            var isInlineElement = el._isInline;
            if (isInlineElement) {
              var html = el._html;
              // Find all placeholders from `html`, and replace all of them.
              var holders = html.match(/{{[^{]{1,}}}/g) || [];
              holders.forEach(function (holder) {
                var pipes, pipe;
                holder = holder.replace(/{/g, '');
                holder = holder.replace(/}/g, '');
                holder = holder.trim();
                // If the placeholder doesn't contains `.`, just replace placeholders.
                if (holder.indexOf('.') === -1) {
                  pipes = holder.split('|').map(function (item) {return item.trim();});
                  var value = scope._data[pipes[0]].get();
                  for (var i = 1, l = pipes.length; i !== l; ++i) {
                    pipe = pipes[i].trim();
                    pipe = scope[pipe] || function (a) {return a;};
                    value = pipe.call(this, value);
                  }
                  html = replacePlaceHolder(html, holder, value);
                // Otherwise, incrementally retrieve the appropriate data.
                } else {
                  // To this end, split `holder` by `.` fist.
                  // Then, iterate through the tokens and
                  // trace the final value.
                  pipes = holder.split('|').map(function (item) {return item.trim();});
                  var parts = pipes[0].split('.');
                  var value = scope._data[parts[0]].get();
                  for (var i = 1, l = parts.length; i !== l; ++i) {
                    value = value[parts[i]];
                  }

                  for (i = 1, l = pipes.length; i !== l; ++i) {
                    pipe = pipes[i].trim();
                    pipe = scope[pipe] || function (a) {return a;};
                    value = pipe.call(this, value);
                  }

                  // Replace placeholder with the retrieve value.
                  html = replacePlaceHolder(html, holder, value);
                }
              });
              // Now, update the innerHTML of this element in DOM.
              document.querySelector('#' + el._id).innerHTML = html;

            // If this is not an inline ch-data, directly update its `value`.
            } else {
              $$CHOP.find('#' + el._id).val(that._val);
            }
          });
        }

      };
    }

    // Now add a new ch-data entity.
    // If `dataName` is in the form of `something.data`,
    // only keep the first property, i.e. `something`.
    dataName = dataName.split('.')[0];
    var id = element.getAttribute('id');
    scope._data[dataName]._els.push({
      _isInline: isInline,
      _id: id,
      _html: element.innerHTML
    });

    // Attach an reference to `$ch.scope`.
    $$CHOP.scopes[scopeName][dataName] = scope._data[dataName];
  }

  // Private method to replace data placeholders.
  function replacePlaceHolder(str, holder, value) {
    holder = holder.trim();
    // Escape `|` pipe.
    holder = holder.replace(/\|/g, '\\|');
    var reg = new RegExp('{{[\\ ]*?' + holder + '[\\ ]*?}}', 'g');
    return str.replace(reg, value);
  }

  // Event Handler
  function EventHandler(scope) {
    this.scope = scope;
  }

  // Attach `listen` and `emit` to Event Handler prototype.
  EventHandler.prototype = {
    // __listen(`evt`, `callback`)__
    //
    // Listen event `evt`. When `evt` is emitted, fire `callback`.
    //
    //        $ch.scope('myScope', function ($scope, $event) {
    //            $event.listen('new message', function (from, msg) {
    //                console.log(from, msg);
    //            });
    //        });
    listen: function listen(name, callback) {
      // If `name` is not a string or `callback` is not a functoin,
      // throw an error.
      if (typeof name !== 'string' || typeof callback !== 'function') {
        throw new Error('ChopJS Scope event "listen" requires a string-type name parameter and a callback function.');
      }

      this.scope._events[name] = callback;
      return this;
    },

    // __emit(`evt`[, `data`, `data2`...])__
    //
    // Emit event `evt`, and pass `data` as parameters.
    //
    //        $ch.scope('myScope', function ($scope, $event) {
    //            $event.emit('new message', 'ChopJS', 'Hello world!!!');
    //        });
    emit: function emit(name) {
      // If no valid parameters, throw an error.
      if (typeof name !== 'string') {
        throw new Error('ChopJS Scope event "emit" requires at least a string-type event name parameter.');
      }

      var callback = this.scope._events[name];
      if (typeof callback === 'function') {
        // Retrieve all data parameters from arguments.
        var args = [];
        for (var i = 1; i !== arguments.length; ++i) {
          args.push(arguments[i]);
        }

        callback.apply(this, args);
      }

      return this;
    }

  };

});