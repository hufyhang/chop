/* global $ch */
$ch.require(['ui', 'widget', 'string']);

var MAP_URL = 'http://m.osmtools.de/?';

$ch.widget.register({
  'map': function (data) {
    'use strict';
    var lon = data.longitude;
    var lat = data.latitude;

    var buffer = $ch.string.buffer();
    var url;
    buffer.append('lon=' + lon);
    buffer.append('lat=' + lat);
    buffer.append('zoom=17');
    buffer.append('mlon=' + lon);
    buffer.append('mlat=' + lat);
    buffer.append('icon=4');
    buffer.append('iframe=1');
    url = MAP_URL + buffer.toString('&');

    var v = $ch.view({
      html: '<iframe frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="700" height="500" src="' + url + '"></iframe>'
    });
    return v;
  }
});

