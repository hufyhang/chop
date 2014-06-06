chop.js intl (internationalization) module
==========================================

Dependences
-----------

None

HTML attribute
--------------

`ch-intl`

~~~
<div ch-intl="message"></div>
~~~

$ch.intl.init(`lang`, `prefs`)
------------------------------

Loads internationalization data from object `prefs`, and initializes Chop.js intl module with language `lang`.

~~~
$ch.require('intl');
$ch.intl.init('en', {
    en: 'en.prefs',
    cn: 'cn.prefs',
    jp: 'jp.prefs'
});
~~~

Sample prefs file:

~~~
## This is a sample Chop.js Internationalization prefs file

name = Chop.js Framework
message = Welcome to Chop.js!!!
~~~

$ch.intl.lang(`lang`)
-----------------------

If `lang` is not provided, returns current language. Otherwise, sets current
language to `lang`.

$ch.intl.get([`lang`,] `key`)
---------------------------

If only `key` provided, returns the value of `key` in current language.
Otherwise, returns from language `lang`.

