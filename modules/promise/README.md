chop.js promise module
======================

Dependences
-----------

None

$ch.promise.defer()
-------------------

Returns a chop.js promise object.

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
}).save(function (res) {
    console.log('Error: ' + res.statuscode);     
});
~~~~~~

