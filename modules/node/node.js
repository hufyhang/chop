/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('node', function () {
  'use strict';

  var createNode = function () {
    var nodeTemplate = {
      _node: undefined,

      context: function () {
        return this._node;
      },

      parent: function () {
        var n = createNode();
        n._node = this._node.parentNode;
        return n;
      },

      child: function () {
        var nodes = this._node.childNodes;
        var n = [];
        $$CHOP.each(nodes, function (item) {
          var obj = createNode();
          obj._node = item;
          n.push(obj);
        });
        return n;
      },

      contains: function (node) {
        if (arguments.length === 0) {
          throw new Error('.contains requires a chop.js node parameter.');
        }
        var children = this.child();
        var result = false;
        if (children.indexOf(node) !== -1) {
          result = true;
        }
        return result;
      },

      next: function () {
        var n = createNode();
        n._node = this._node.nextElementSibling;
        return n;
      },

      previous: function () {
        var n = createNode();
        n._node = this._node.previousElementSibling;
        return n;
      },

      html: function (html) {
        if (arguments.length === 0) {
          return this._node.innerHTML;
        }
        this._node.innerHTML = html;
        $$CHOP._loadView(this._node);
        return this;
      },

      append: function (html) {
        if (html !== undefined) {
          this.html(this._node.innerHTML + html);
        }
        return this;
      },

      prepend: function (html) {
        if (html !== undefined) {
          this.html(html + this._node.innerHTML);
        }
        return this;
      },

      className: function (name) {
        if (name !== undefined) {
          var result = true;
          if ($$CHOP.isArray(name)) {
            var that = this;
            $$CHOP.each(name, function (item) {
              if (that._node.className.indexOf(item) === -1) {
                result = false;
              }
            });
          } else {
            if (this._node.className.indexOf(name) === -1) {
              result = false;
            }
          }
          return result;
        }

        return this._node.className;
      },

      addClass: function (cls) {
        if (cls !== undefined) {
          if ($$CHOP.isArray(cls)) {
            var that = this;
            $$CHOP.each(cls, function (item) {
              that._node.className += item + ' ';
            });
          } else {
            this._node.className += cls + ' ';
          }
        }
        return this;
      },

      removeClass: function (cls) {
        if (cls !== undefined) {
          var className;
          if ($$CHOP.isArray(cls)) {
            className = this._node.className;
            $$CHOP.each(cls, function (item) {
              className = className.replace(item, '');
            });
            this._node.className = className.replace(cls, '');
          } else {
            className = this._node.className;
            this._node.className = className.replace(cls, '');
          }
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
    $$CHOP._loadView(this.el);
  };

  $$CHOPEL.removeNode = function (node) {
    if (arguments.length === 0) {
      throw new Error('.removeNode requires a node parameter.');
    }
    this.el.removeChild(node._node);
    $$CHOP._loadView(this.el);
  };
});
