/* global $ch, $$CHOP */
// ChopJS Offline Database Module
// ------------------------------
$ch.define('db', function () {
  'use strict';

  // Default size of WebSQL is 5MB.
  var WEBSQL_SIZE = 5 * 1024 * 1024;

  // Attach db module to ChopJS global object.
  // Make sure `$$CHOP.db` is not occupied by other stuff.
  $$CHOP.db = {};

  $$CHOP.db = {
    // Here goes WebSQL
    websql: function (name, version, desc, size) {
      return new WebSQL(name, version, desc, size);
    }
  };

  // WebSQL
  // -------
  // WebSQL constructor takes `name`, `version`, `description`,
  // and `size in MB` as parameters.
  function WebSQL(name, version, desc, size) {
    // If browser doesn't support WebSQL, throw error.
    if (!openDatabase) {
      throw new Error('WebSQL is not supported by the browser.');
    }

    // It is not good if there is no parameters presented.
    // In that case, throw an error.
    if (arguments.length === 0) {
      throw new Error('$ch.db.websql requires at least one parameter.');
    }

    // Set WebSQL information.
    this.dbName = name;
    this.dbVersion = version || '1.0';
    this.dbDesc = desc || 'A WebSQL database manupulated via ChopJS';
    this.dbSize = size || WEBSQL_SIZE;
    // If `version` is a number, makes it into a string.
    if (typeof this.dbVersion === 'number') {
      this.dbVersion = this.dbVersion + '';
    }

    // Now open the WebSQL database
    this.db = openDatabase(this.dbName, this.dbVersion,
                           this.dbDesc, this.dbSize);
  }

  // Now let's attach methods to WebSQL prototype.
  // By `WebSQL`, I mean the ChopJS WebSQL object.
  WebSQL.prototype = {

    // Let's call `executeSql` method `query` for short.
    // Also, `query` should either take an object-type
    // or an array of objects as parameter.
    // Below is an example of an acceptable parameter.
    // ~~~javascript
    // {'SELECT * FROM ?': {
    //      data: ['foo'],
    //      done: function (tx, error, rows) {
    //        if (error) {
    //          console.log(error.message);
    //        }
    //        console.log(rows[0].bar);
    //      }
    //    }
    // }
    // ~~~
    query: function (param) {
      // If no parameter presented, throw an error.
      if (arguments.length === 0) {
        throw new Error('ChopJS WebSQL query requires a parameter.');
      }

      // If parameter is not an array, make it be.
      if (!$$CHOP._isArray(param)) {
        param = [param];
      }

      // Start WebSQL transaction.
      this.db.transaction(function (tx) {
        // Now iterate through all queries.
        $$CHOP.each(param, function (q) {
          // Get the query by `Object.keys`
          var sql = Object.keys(q)[0];
          // Get query data. If not provided, set it to empty array.
          var data = q[sql].data || [];
          // Get query callback. If not provided, set to empty return function.
          var done = q[sql].done || function () {return;};
          // Error callback.
          var errorCb = function (tx, error) {
            // Call `done` and pass `error`.
            done.apply(this, [tx, error]);
          };

          // Success callback.
          var successCb = function (tx, result) {
            // Convert query results into an array.
            var results = [];
            var len = result.rows.length;
            for (var i = 0; i !== len; ++i) {
              results.push(result.rows.item(i));
            }

            // Call `done`.
            // Pass `undefined` for no errors.
            done.apply(this, [tx, undefined, results]);
          };

          // Execute SQL now.
          tx.executeSql(sql, data, successCb, errorCb);
        });
      });

    }
  };

});
