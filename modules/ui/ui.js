/* global $ch, $$CHOP, $$CHOPEL */
$ch.define('ui', function () {
  'use strict';
  $$CHOP.find('html').css('fontFamily', 'Arial, sans-serif');
  // var hrs = $$CHOP.findAll('hr');
  // $$CHOP.each(hrs, function (hr) {
  //   hr.css('height', '1px').css('border', '0')
  //   .css('border-top', '1px solid #ccc').css('margin', '1em').css('padding', '0');
  // });

  // height//{{{
  $$CHOPEL.height = function () {
    return this.el.offsetHeight;
  };
//}}}

  // width//{{{
  $$CHOPEL.width = function () {
    return this.el.offsetWidth;
  };
//}}}

  // scrollTop//{{{
  $$CHOPEL.scrollTop = function () {
    var doc = this.el;
    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    return top;
  };
//}}}

  // full size//{{{
  $$CHOPEL.full = function () {
    var e = this.el;
    e.style.width = '100%';
    e.style.height = '100%';
    return this;
  };

  $$CHOPEL.fullHeight = function () {
    var e = this.el;
    e.style.height = '100%';
    return this;
  };

  $$CHOPEL.fullWidth = function () {
    var e = this.el;
    e.style.width = '100%';
    return this;
  };
//}}}

  // disable & enable//{{{
  $$CHOPEL.disable = function () {
    this.attr('disabled', 'disabled');
    this.css('cursor', 'not-allowed');
    return this;
  };

  $$CHOPEL.enable = function () {
    this.removeAttr('disabled');
    this.css('cursor', 'initial');
    return this;
  };
//}}}

  // click button//{{{
  $$CHOPEL.button = function (callback) {
    var element = this.el;

    element.style.borderColor = 'rgba(0, 0, 0, 0.6)';
    element.style.textShadow = '1px 1px 1px rgba(0, 0, 0, 0.3)';
    element.style.color = '#ffffff';
    element.style.background = '#4391e3';
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
    element.style.fontFamily = 'Arial, sans-serif';

    if (callback !== undefined) {
      this.on('click', callback);
    }

    this.on('mouseover', function () {
      element.style.background = '#539DEB';
    });

    this.on('mouseout', function () {
      element.style.background = '#4391e3';
    });

    return this;
  };
//}}}

  // input & textarea //{{{
  $$CHOPEL.input = function (callback) {
    var e = this.el;

    e.style.display = 'inline-block';
    e.style.padding = '8px 12px';
    e.style.fontSize = '14px';
    e.style.color = '#555555';
    e.style.backgroundColor = '#ffffff';
    e.style.backgroundImage = 'none';
    e.style.border = '1px solid #cccccc';
    e.style.borderRadius = '4px';
    e.style.fontFamily = 'Arial, sans-serif';

    if (callback !== undefined) {
      this.on('keyup', callback);
    }

    this.on('focus', function () {
      e.style.borderColor = '#66afe9';
      e.style.outline = 0;
    }).on('blur', function () {
      e.style.borderColor = '#cccccc';
      e.style.outline = 0;
    });
    return this;
  };

  $$CHOPEL.textarea = $$CHOPEL.input;
//}}}

  // dropbox & selectbox //{{{
  $$CHOPEL.dropbox = function (callback) {
    var e = this.el;

    e.style.padding = '8px 12px';
    e.style.fontSize = '14px';
    e.style.color = '#555555';
    e.style.backgroundColor = '#ffffff';
    e.style.backgroundImage = 'none';
    e.style.border = '1px solid #cccccc';
    e.style.borderRadius = '4px';

    if (callback !== undefined) {
      this.on('change', function () {
        callback(e.value);
      });
    }

    this.on('focus', function () {
      e.style.borderColor = '#66afe9';
      e.style.outline = 0;
    }).on('blur', function () {
      e.style.borderColor = '#cccccc';
      e.style.outline = 0;
    });

    return this;
  };

  $$CHOPEL.selectbox = $$CHOPEL.dropbox;
//}}}

  // pager button//{{{
  $$CHOPEL.pager = function (callback) {
    var element = this.el;

    element.style.color = '#2fa4e7';
    element.style.textShadow = 'none';
    element.style.background = '#ffffff';
    element.style.display = 'inline-block';
    element.style.fontWeight = 'normal';
    element.style.textAlign = 'center';
    element.style.verticalAlign = 'middle';
    element.style.whiteSpace = 'no-wrap';
    element.style.cursor = 'pointer';
    element.style.padding = '8px 20px';
    element.style.fontSize = '14px';
    element.style.borderRadius = '15px';
    element.style.border = '1px solid #dddddd';
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.mozUserSelect = 'none';
    element.style.msUserSelect = 'none';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.lineHeight = '1em';

    if (callback !== undefined) {
      this.on('click', callback);
    }

    this.on('mouseover', function () {
      element.style.background = '#dddddd';
      element.style.color = '#157ab5';
    }).on('mouseout', function () {
      element.style.background = '#ffffff';
      element.style.color = '#2fa4e7';
    });

    this.on('focus', function () {
      element.style.borderColor = '#66afe9';
      element.style.outline = 0;
    }).on('blur', function () {
      element.style.borderColor = '#cccccc';
      element.style.outline = 0;
    });

    return this;
  };
//}}}

  // topbar//{{{
  $$CHOPEL.topbar = function (zindex, next) {
    var e = this.el;
    if (typeof zindex !== 'number') {
      next = zindex;
      zindex = 1;
    }

    e.style.position = 'fixed';
    e.style.display = 'inline-block';
    e.style.zindex = zindex;
    e.style.top = '0';
    e.style.left = '0';
    e.style.right = '0';
    e.style.background = 'rgb(67, 145, 227)';
    e.style.color = 'white';
    e.style.border = '1px solid transparent';
    e.style.paddingTop = '5px';
    e.style.paddingBottom = '5px';
    e.style.boxShadow = '0px 1px 1px #3b5998';

    var subs = $ch.findAll('*', e);
    $ch.each(subs, function (sub) {
      var tagName = sub.el.tagName.toUpperCase();
      if (tagName === 'DIV' || tagName === 'SPAN') {
        if (sub.el.getAttribute('ch-logo') === null) {
          sub.button();
        } else {
          $ch.find('img', sub.el).css('max-height', '30px');
        }
      }
      sub.el.style.fontSize = '20px';
      sub.el.style.display = 'table-cell';
      sub.el.style.padding = '2px 3px';
    });

    if (next !== undefined) {
      var margin = this.height() + 5 + 'px';
      next.css('margin-top', margin);
    }

    return this;
  };
//}}}

});
