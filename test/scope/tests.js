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

  it('should support data placeholder.', function () {
    var msg = 'This is a scope-data.';
    var scp;
    $ch.scope('myScope', function($$) {
      scp = $$;
      $$.message.set(msg);
    });
    expect($ch.find('#my-scope-message').content()).to.equal(msg);
  });

  it('should allow nested scopes.', function () {
    $ch.scope('Main', function ($$) {
      $$.timeOfDay.set('morning');
      $$.name.set('Nikki');
    });

    $ch.scope('Child', function ($$) {
      $$.timeOfDay.set('afternoon');
      $$.name.set('Mattie');
    });

    $ch.scope('GrandChild', function ($$) {
      $$.timeOfDay.set('evening');
      $$.name.set('Gingerbread Baby');
    });

    var main = $ch.scope('Main').msg.content();
    var child = $ch.scope('Child').msg.content();
    var grandchild = $ch.scope('GrandChild').msg.content();
    expect(main).to.not.equal(child);
    expect(main).to.not.equal(grandchild);
    expect(child).to.not.equal(grandchild);
  });

  it('should support ch-data binding.', function () {
    var name = 'ChopJS';
    $ch.scope('bindingScope', function ($$) {
      $$.username.set(name);
    });

    $ch.scope('nestedbindingScope', function ($$) {
      $$.username.set('Nested');
    });

  });

  it('should support events pub/sub.', function () {
    var eventName = 'update';
    var data1 = 100;
    var data2 = 'Hello world';
    $ch.scope('eventScope', function ($scope, $event) {
      $scope.message.set('Event Scope');
      $event.listen(eventName, function (time, msg) {
        console.log(time, msg);
        expect(time).to.equal(data1);
        expect(msg).to.equal(data2);
      });

      $event.emit(eventName, data1, data2);
    });
  });

  it('should handle events in nested scopes.', function () {
    var eventName = 'update';
    var data1 = 100100;
    var data2 = 'Hello nested world';
    $ch.scope('nestedEventScope', function ($scope, $event) {
      $scope.message.set('Nested Event Scope');
      $event.listen(eventName, function (time, msg) {
        console.log(time, msg);
        expect(time).to.equal(data1);
        expect(msg).to.equal(data2);
      });

      $event.emit(eventName, data1, data2);
    });
  });

  it('should support object property ch-data placeholder.', function () {
    var person = {
      firstname: 'Bruce',
      lastname: 'Wayne',
      product: {
        batwing: {
          speed: 'fast'
        },
        chopjs: {
          'test-mode': 'BDD',
          version: 'Edge'
        }
      }
    };

    $ch.scope('objScope', function ($scope) {
      $scope.person.set(person);
      expect($scope.first.content()).to.equal(person.firstname);
      expect($scope.last.content()).to.equal(person.lastname);
      expect($scope.ver.content()).to.equal(person.product.chopjs.version);
    });
  });

  it('should load scopes from updated HTML.', function () {
    $ch.scope('loadScope', function ($scope) {
      var load = function () {
        $ch.scope('dataScope', function (scp) {
          scp.data.set({
            name: 'ChopJS',
            author: 'ChopJS Author'
          });
        });
      };

      $scope.template = $ch.find('#template').html();
      $scope.loadBtn.on('click', function () {
        $scope.container.html($scope.template);
        load();
      });
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
