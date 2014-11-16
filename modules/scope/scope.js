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
//            $scope.message = 'ChopJS Scope module';
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
      _data_entities: []
    };

    // Retrieve elements inside scope `name` from DOM.
    retriveScope(name);

    // Apply `$$CHOP.scopes[name]` to `callback` to
    // make everything defined in `callback` can be
    // attached to `$$CHOP.scopes[name]` scope.
    callback.call(this, $$CHOP.scopes[name]);

    // Process data placeholders.
    processPlaceholder(name);

    // Append the invocation of `retriveScope`
    // in the context of `name to `$$CHOP._loadView`.
    var _loadView = $$CHOP._loadView;
    $$CHOP._loadView = function (baseElement) {
      if (baseElement === undefined || baseElement === null) {
        baseElement = document;
      }

      retriveScope(name);
      _loadView(baseElement);

    };

    // return `$$CHOP` to enabld chainable operations.
    return $$CHOP;
  };

  // Private method to retrieve all scoped elements from DOM.
  function retriveScope(baseElement, name) {
    if (typeof baseElement === 'string') {
      name = baseElement;
      baseElement = document;
    }

    var context = baseElement;

    // Find all scopes named `name`.
    var scopes = context.querySelectorAll('[ch-scope=' + name + ']');
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
              if (store._data_entities === undefined) {
                store._data_entities = [id];
              } else {
                store._data_entities.push(id);
              }
            }

          });
        }

      });
    }
  }

  // Privat method to process data placeholders.
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
      var el = document.querySelector('#' + id);
      var html = el.innerHTML;

      // Find all placeholders surrounded by `{{` and `}}`.
      var founds = el.innerHTML.match(/{{[^{]{1,}}}/g);

      // For each of the substrings found, remove `{{` and `}}`,
      // and replace the placeholder between `{{` and `}}` with
      // the corresponding data.
      for (var i = 0; i !== founds.length; ++i) {
        var found = founds[i].replace(/{/g, '');
        found = found.replace(/}/g, '');
        html = html.replace(new RegExp(founds[i], 'g'), scope[found]);
      }

      // Now, replace the innerHTML of
      // the processed element with the new content.
      el.innerHTML = html;

      // Reload view on this element.
      $$CHOP._loadView(el);
    });
  }

});