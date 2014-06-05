/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('node', function () {
  'use strict';

  var createNode = function () {
    var nodeTemplate = {
      _node: undefined,

      html: function (html) {
        if (arguments.length === 0) {
          return this._node.innerHTML;
        }
        this._node.innerHTML = html;
        return this;
      },

      append: function (html) {
        if (html !== undefined) {
          this.html(this._node.innerHTML + html);
        }
        return this;
      },

      classList: function () {
        return this._node.classList;
      },

      addClass: function (cls) {
        if (cls !== undefined) {
          this._node.className += cls + ' ';
        }
        return this;
      },

      removeClass: function (cls) {
        if (cls !== undefined) {
          var className = this._node.className;
          this._node.className = className.replace(cls, '');
        }
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
    return nodeTemplate;
  };

  $$CHOPEL.node = function () {
    var nodeObj = createNode();
    nodeObj._node = this.el;
    return nodeObj;
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
    var nodeObj = createNode();
    nodeObj._node = node;
    return nodeObj;
  };

  $$CHOPEL.appendNode = function (node) {
    if (arguments.length === 0) {
      throw new Error('.appendNode requires a node parameter.');
    }
    this.el.appendChild(node._node);
  };

  $$CHOPEL.removeNode = function (node) {
    if (arguments.length === 0) {
      throw new Error('.removeNode requires a node parameter.');
    }
    this.el.removeChild(node._node);
  };
});
