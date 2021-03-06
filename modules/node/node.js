/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('node', function () {
  'use strict';

  var createNode = function () {
    var nodeTemplate = {
      _node: undefined,
      _chopel: undefined,

      context: function () {
        return this._node;
      },

      chopEl: function () {
        return this._chopel;
      },

      parent: function () {
        var n = createNode();
        n._node = this._node.parentNode;
        return n;
      },

      child: function () {
        var nodes = this._node.childNodes;
        var n = [];
        for (var index = 0, len = nodes.length; index !== len; ++index) {
          var node = nodes[index];
          var obj = createNode();
          obj._node = node;
          n.push(obj);
        }
        return n;
      },

      remove: function () {
        this._node.remove();
        return this;
      },

      contains: function (node) {
        if (arguments.length === 0) {
          throw new Error('.contains requires a chop.js node parameter.');
        }
        var children = this._node.childNodes;
        var result = false;
        for (var index = 0, len = children.length; index !== len; ++index) {
          var child = children[index];
          if (child === node._node) {
            result = true;
          }
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

      class: function (name) {
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
        var par = this._node.parentNode;
        if (par !== null && par !== undefined) {
          $$CHOP._loadView(par);
        }
        return this;
      },

      prependNode: function (node) {
        if (arguments.length === 0) {
          throw new Error('.prependNode requires a node parameter.');
        }

        var nodes = this.child();
        if (nodes.length !== 0) {
          this._node.insertBefore(node._node, nodes[0]._node);
        } else {
          this._node.appendChild(node._node);
        }
        $$CHOP._loadView(this._node);
        return this;
      },

      appendNode: function (node) {
        if (arguments.length === 0) {
          throw new Error('.appendNode requires a node parameter.');
        }
        this._node.appendChild(node._node);
        $$CHOP._loadView(this._node);
        return this;
      },

      insert: function (content, where) {
        if (where === undefined) {
          where = 'after';
        }

        if (typeof content !== 'string' && $$CHOP.isArray(content) === false) {
          content = content.html();
        }

        where = where.toUpperCase();
        if (where !== 'AFTER' && where !== 'BEFORE') {
          where = 'AFTER';
        }

        if (where === 'AFTER') {
          this.html(this.html() + content);
        }
        else if (where === 'BEFORE') {
          this.html(content + this.html());
        }
        return this;
      },

      removeNode: function (node) {
        if (arguments.length === 0) {
          throw new Error('.removeNode requires a node parameter.');
        }
        this._node.removeChild(node._node);
        $$CHOP._loadView(this._node);
        return this;
      }
    };
    return nodeTemplate;
  };

  $$CHOPEL.node = function () {
    var nodeObj = createNode();
    nodeObj._node = this.el;
    nodeObj._chopel = this;
    return nodeObj;
  };

  $$CHOPEL.child = function () {
    var nodes = this.el.childNodes;
    var n = [];
    for (var index = 0, len = nodes.length; index !== len; ++index) {
      var node = nodes[index];
      var obj = createNode();
      obj._node = node;
      n.push(obj);
    }
    return n;
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
    return this;
  };

  $$CHOPEL.removeNode = function (node) {
    if (arguments.length === 0) {
      throw new Error('.removeNode requires a node parameter.');
    }
    this.el.removeChild(node._node);
    $$CHOP._loadView(this.el);
    return this;
  };
});
