/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('directive', function () {
  'use strict';

  $$CHOP.directive = {};
  $$CHOP.directive = {

    add: function (tag, template) {
      if (arguments.length !== 2) {
        throw new Error('$ch.directive.add requires two parameters.');
      }
      if (typeof tag !== 'string') {
        throw new Error('$ch.directive.add requires a string-type parameter for the cutomized directive.');
      }

      if (typeof template === 'string') {
        var dom = document.createElement('template');
        dom.innerHTML = template;
        template = dom;
      }

      var prototype = Object.create(HTMLElement.prototype);
      prototype.createdCallback = function() {
        var shadow = this.createShadowRoot();
        shadow.appendChild(template.content.cloneNode(true));
      };
      document.registerElement(tag, {
        prototype: prototype
      });
      return this;
    },
  };

  $$CHOPEL.content = function (data) {
    if (data === undefined) {
      return $$CHOPEL.el.textContent;
    } else {
      $$CHOPEL.el.textContent = data;
      return this;
    }
  };

});