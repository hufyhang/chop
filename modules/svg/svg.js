/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('svg', function () {
  'use strict';

  var NAMESPACE = 'http://www.w3.org/2000/svg';

  $$CHOP.svg = {};

  $$CHOPEL.svg = function (w, h) {
    var e = this.el;
    var svg = {};
    var node = document.createElementNS(NAMESPACE, 'svg');
    if (typeof w === 'number') {
      node.setAttribute('width', w);
    }

    if (typeof h === 'number') {
      node.setAttribute('height', h);
    }

    svg = {
      node: node,
      text: function (text, attr, style) {
        if (arguments.length < 2) {
          throw new Error('Chop.js svg.text requires at least two parameters.');
        }

        var n = document.createElementNS(NAMESPACE, 'text');
        var g = this.node;
        if (typeof attr === 'object') {
          $$CHOP.each(attr, function (key, value) {
            if (key === 'g') {
              g = value;
            } else {
              n.setAttribute(key, value);
            }
          });
        }

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        n.innerHTML = text;
        g.appendChild(n);
        return this;
      },

      rect: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.rect requires at least one parameters.');
        }
        var n = document.createElementNS(NAMESPACE, 'rect');
        var g = this.node;

        if (typeof attr === 'object') {
          $$CHOP.each(attr, function (key, value) {
            if (key === 'g') {
              g = value;
            } else {
              n.setAttribute(key, value);
            }
          });
        }

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      g: function (style) {
        var g = document.createElementNS(NAMESPACE, 'g');
        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          g.setAttribute('style', styles.join(';'));
        }
        this.node.appendChild(g);
        return g;
      },

      circle: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.circle requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'circle');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      ellipse: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.ellipse requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'ellipse');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      line: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.line requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'line');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      path: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.path requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'path');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      polyline: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.polyline requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'polyline');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      },

      polygon: function (attr, style) {
        if (arguments.length === 0) {
          throw new Error('Chop.js svg.polygon requires at least one parameter.');
        }
        var n = document.createElementNS(NAMESPACE, 'polygon');
        var g = this.node;

        $$CHOP.each(attr, function (key, value) {
          if (key === 'g') {
            g = value;
          } else {
            n.setAttribute(key, value);
          }
        });

        if (typeof style === 'object') {
          var styles = [];
          $$CHOP.each(style, function (key, value) {
            styles.push(key + ': ' + value);
          });
          n.setAttribute('style', styles.join(';'));
        }
        g.appendChild(n);
        return this;
      }

    };

    e.appendChild(svg.node);
    return svg;
  };



});
