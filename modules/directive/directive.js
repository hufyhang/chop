/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('directive', function () {
  'use strict';
  $ch.require('event');

  $$CHOP.directive = {};
  $$CHOP.directive = {
    updateEvents: [],
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

        $$CHOP.directive.updateEvents.push({
          el: this,
          shadow: shadow,
          onUpdate: onUpdate
        });
      };

      document.registerElement(tag, {
        prototype: prototype
      });
      return this;
    },

    update: function (el, data) {
      if (arguments.length !== 2) {
        throw new Error('$ch.directive.update requires two parameters.');
      }

      if (el === undefined) {
        throw new Error('No such element in the current DOM.');
      }

      el.innerHTML = data;
      var callback, shadow;
      $$CHOP.each(this.updateEvents, function (item) {
        if (item.el === el) {
          callback = item.onUpdate;
          shadow = item.shadow;
        }
      });

      if (callback !== undefined) {
        callback(data, el, shadow);
      }
    }

  };
});