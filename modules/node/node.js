/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('node', function () {
  'use strict';

  var Node = {
    _node: undefined,

    html: function (html) {
      if (arguments.length === 0) {
        return this._node.innerHTML;
      }
      this._node.innerHTML = html;
      return this;
    },

    attr: function (key, value) {
      if (arguments.length === 0) {
        return this._node.attributes;
      }

      if (arguments.length === 1) {
        return this._node.getAttribute(key);
      }
      this._node.setAttribute(key, value);
      return this;
    }
  };

  $$CHOPEL.node = function () {
    return this.el;
  };

  $$CHOPEL.child = function () {
    return this.el.childNodes;
  };

  $$CHOP.node = function (tag, html) {
    if (arguments.length === 0) {
      throw new Error('$ch.node requires at least one tag-name parameter.');
    }
    var node = document.createElement(tag);
    if (html !== undefined) {
      node.innerHTML = html;
    }
    var nodeObj = Object.create(Node);
    nodeObj._node = node;
    return nodeObj;
  };

  $$CHOPEL.appendNode = function (node) {
    if (arguments.length === 0) {
      throw new Error('.appendNode requires a node parameter.');
    }
    this.el.appendChild(node._node);
  };
});
