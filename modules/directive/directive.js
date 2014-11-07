/* global $ch, $$CHOP */
$ch.define('directive', function () {
  'use strict';
  // $ch.require('event');

  $$CHOP.directive = {};
  $$CHOP.directive = {
    updateEvents: {},
    add: function (tag, template, callback) {
      if (arguments.length < 2) {
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

      var onCreated, onUpdated, onAttribute, onAttached, onDetached;
      var that = this;
      if (typeof callback === 'function') {
        onCreated = callback;
        onUpdated = function () {return;};
        onAttribute = function () {return;};
        onAttached = function () {return;};
        onDetached = function() {return;};
      } else {
        onCreated = callback.onCreated || function () {return;};
        onUpdated = callback.onUpdated || function () {return;};
        onAttribute = callback.onAttribute || function () {return;};
        onAttached = callback.onAttached || function () {return;};
        onDetached = callback.onDetached || function () {return;};
      }

      var customCreated = onCreated;

      onCreated = function () {
        if (this.createShadowRoot) {
          var shadow = this.createShadowRoot();
          shadow.appendChild(template.content.cloneNode(true));
        } else {
          this.appendChild(template.content.cloneNode(true));
        }

        customCreated.apply(this);

        var id = this.getAttribute('id');
        if (id !== null) {
          $$CHOP.directive.updateEvents[id] = {
            el: this,
            shadow: shadow,
            onUpdate: onUpdated
          };
        }
      };

      prototype.createdCallback = onCreated;
      prototype.attachedCallback = onAttached;
      prototype.detachedCallback = onDetached;
      prototype.attributeChangedCallback = onAttribute;

      document.registerElement(tag, {
        prototype: prototype
      });
      return this;
    },

    update: function (id, data) {
      if (arguments.length !== 2) {
        throw new Error('$ch.directive.update requires two parameters.');
      }

      var entity = this.updateEvents[id];
      if (entity === undefined) {
        throw new Error('No onUpdated events registered for "' + id + '".');
      }

      entity.el.innerHTML = data;
      entity.onUpdate(data, entity.el, entity.shadow);
    }

  };
});