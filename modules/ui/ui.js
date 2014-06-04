/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('ui', function () {
  'use strict';

  $$CHOPEL.button = function (callback) {
    var element = this.el;
    element.style.backgroundImage = 'linear-gradient(#8a9196, #7a8288 60%, #70787d)';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.borderColor = 'rgba(0, 0, 0, 0.6)';
    element.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.3)';
    element.style.color = '#ffffff';
    element.style.backgroundColor = '#7a8288';
    element.style.display = 'inline-block';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.verticalAlign = 'middle';
    element.style.whiteSpace = 'no-wrap';
    element.style.cursor = 'pointer';
    element.style.padding = '8px 12px';
    element.style.fontSize = '14px';
    element.style.borderRadius = '4px';
    element.style.border = '1px solid transparent';
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.mozUserSelect = 'none';
    element.style.msUserSelect = 'none';
    element.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';



    if (callback !== undefined) {
      this.on('click', callback);
    }

    this.on('mouseover', function () {
      element.style.backgroundImage = 'linear-gradient(#404448, #4e5458 40%, #585e62)';
    });

    this.on('mouseout', function () {
      element.style.backgroundImage = 'linear-gradient(#8a9196, #7a8288 60%, #70787d)';
    });

    return this;
  };
});
