chop.js context module
======================

Dependences
-----------

None

$ch.context.language
--------------------

The language of the Web browser.

$ch.context.userAgent
--------------------

User agent inforamtion

$ch.context.browser
-------------------

Web browser information in the form of:

~~~javascript
  {
    name: 'browser name (e.g. Chrome)',
    fullVersion: 'browser full version (e.g 37.0.2062.122)',
    majorVersion: 'browser major version (e.g. 37)',
    isMobile: false
  };
~~~

Major browser name list:

- Chrome
- Safari
- Firefox
- Opera
- Internet Explorer

$ch.context.geolocation(`callback`)
-----------------------------------

Gets geolocation information and passes the data to `callback`.

