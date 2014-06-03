chop.js promise module
======================

Dependences
-----------

None

$ch.promise.defer()
-------------------

Returns a chop.js promise object.

.resolve(`data`)
----------------

Resolves the promise with `data`.

.reject(`data`)
-----------------

Rejects the promise with `data`.

.then(`resolve`, `reject`)
--------------------------

Defines the `resolve` function as the callback on promise resolved and `reject` as
the callback on reject.

`reject` is optional.

Usage example
-------------

~~~~~~
var ajax = function () {
    var promise = $ch.promise.defer();
    $ch.http({
        url: 'http://example.com',
        done: function (res) {
            if (res.statusCode === 200) {
                promise.resolve(res);
            } else {
             
                promise.reject(res);
            }
        }
    });

    return promise;
};

...

ajax().then(function (res) {
    console.log(res.data);
    return res.data.toUpperCase();
}).then(function (data) {
    console.log('Upper: ' + data);     
}, function (data) {
    console.log('Error: ' + data.statusCode);
});
~~~~~~

