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
        var shadowRoot;
        if (this.createShadowRoot) {
          var shadow = this.createShadowRoot();
          shadow.appendChild(template.content.cloneNode(true));
          shadowRoot = shadow;
        } else {
          this.appendChild(template.content.cloneNode(true));

          // use this as ShadowRoot
          shadowRoot = this;

          // now sets all styles in ShadowRoot to only apply on the custom element
          // var styles = this.querySelectorAll('style');
          // for (var i = 0; i !== styles.length; ++i) {
          //   var content = styles[i].innerHTML;
          //   // match all CSS rules
          //   var rules = content.match(/\w.*?{\n?.+?\n?}/g) || [];
          //   content = '';
          //   rules.forEach(function (rule) {
          //     console.log(rule);
          //     // only process the rules that does not start with @
          //     if (rule.trim()[0] !== '@') {
          //       content += tag + ' ' + rule;
          //     }
          //   });
          //   styles[i].innerHTML = content;
          // }
        }

        customCreated.apply(this, [this, shadowRoot]);

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