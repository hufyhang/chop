/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('directive', function () {
  'use strict';
  $ch.require('event');

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

      prototype.createdCallback = function() {
        var shadow = this.createShadowRoot();
        shadow.appendChild(template.content.cloneNode(true));

        var onCreated, onUpdate;
        if (callback !== undefined) {
          var that = this;
          if (typeof callback === 'function') {
            onCreated = callback;
            onUpdate = function () {return;};
          } else {
            onCreated = callback.onCreated || function () {return;};
            onUpdate = callback.onUpdated || function () {return;};
          }

          $ch.event.nextTick(function () {
            onCreated.apply(that, [that, shadow]);
          });
        } else {
          onUpdate = function () {return;};
        }

        var id = this.getAttribute('id');
        if (id !== null) {
          $$CHOP.directive.updateEvents[id] = {
            el: this,
            shadow: shadow,
            onUpdate: onUpdate
          };
        }
      };

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