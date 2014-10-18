/* global describe, it, chai, $ch */
var expect = chai.expect;

var errorMsg = 'Argument does not accept undefined.';

function targetFunc (str) {
  'use strict';
  if (str === undefined) {
    throw new Error(errorMsg);
  }

  return str;
}

describe('ChopJS Aspect Module', function () {
  'use strict';

  describe('Aspect Module', function () {
    it('Should attached to $ch', function () {
      expect($ch).to.not.equal(undefined);
    });
  });

  describe('Aspect Before', function () {
    it('Should pushs the arguments passed to original function to an array', function () {
      var arg = 'Hello world';
      var result = [];
      $ch.aspect.before(window, 'targetFunc', function () {
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function (item) {
          result.push(item);
        });
      });

      targetFunc(arg);

      expect(result).to.deep.equal([arg]);
    });
  });


  describe('Aspect After', function () {
    it('Should returns the result of orignal function prepended "Hello, "', function () {
      var arg = 'world';
      var result = '';
      $ch.aspect.after(window, 'targetFunc', function (res, arg) {
        result = 'Hello, ' + res;
      });

      targetFunc(arg);

      expect(result).to.equal('Hello, ' + arg);
    });
  });


  describe('Aspect AfterReturn', function () {
    it('Should only work after the target function returns successfully.', function () {
      var arg;
      var result;
      $ch.aspect.afterReturn(window, 'targetFunc', function (res) {
        result = res;
      });

      expect(targetFunc.bind(targetFunc, arg)).to.throw(Error);

      arg = 'Hello';
      targetFunc(arg);
      expect(result).to.equal(arg);
    });
  });


  describe('Aspect AfterThrow', function () {
    it('Should returns a random value after the target function throwing errors.', function () {
      $ch.aspect.afterThrow(window, 'targetFunc', function (err, msg) {
        expect(err).to.be.an.instanceOf(Error);
        expect(msg).to.equal(errorMsg);
      });
    });
  });


  describe('Aspect Around', function () {
    it('Should surround the target function.', function () {
      var arg = 'Hello';
      $ch.aspect.around(window, 'targetFunc', function(func, arg) {
        expect(arg).to.equal('Hello');
        arg = func(arg + ' world');
        expect(arg).to.equal('Hello world');
      });

      targetFunc(arg);
    });
  });


});
