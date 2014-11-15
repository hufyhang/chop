// ChopJS Scope Module
// ==================

/* global $ch, $$CHOP */

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
    $$CHOP.scopes[name] = {};

    // Retrieve elements inside scope `name` from DOM.
    retriveScope(name);

    // Apply `$$CHOP.scopes[name]` to `callback` to
    // make everything defined in `callback` can be
    // attached to `$$CHOP.scopes[name]` scope.
    callback.call(this, $$CHOP.scopes[name]);

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
        // Find all `ch-name`.
        var names = scp.querySelectorAll('[ch-name]');
        if (names !== null && names !== undefined) {
          names.forEach(function (element) {
            // Get name from `ch-name`.
            var n = element.getAttribute('ch-name');
            store[n] = $$CHOP.element(element);
          });
        }
      });
    }
  }

});