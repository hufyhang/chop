// ChopJS scope database BDD test
// ================================

/* jshint multistr:true */
/* global describe, it, chai, $ch */

// Make a shorthand for chai.expect.
var expect = chai.expect;

// Testing body
// -----------
describe('ChopJS Scope Module', function () {
  'use strict';

  it('should retrieve all ch-scope and ch-name annotations from DOM.', function () {
    var info = 'ChopJS';
    var details = 'Scope module';

    $ch.scope('information', function ($$) {
      expect($$.message.content()).to.equal(info);
    });

    $ch.scope('footer-information', function ($$) {
      expect($$.details.content()).to.equal(details);
    });

  });

  // $ch.scope
  // ---------
  describe('$ch.scope', function () {
    it('should define and retrieve ChopJS scopes.', function () {
      var scopeName = 'mochaTest';
      var message = 'Mocha BDD';

      // Use `$ch.scope(name, callback)` to define a scope.
      $ch.scope(scopeName, function (scp) {
          scp.name = message;
          scp.getName = function () {
            return scp.name;
          };
      });

      // Now use `$ch.scope(name)` to retrieve a scope.
      var scope = $ch.scope(scopeName);
      expect(scope.getName()).to.equal(message);
    });
  });
});
