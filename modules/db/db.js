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
    this.dbDesc = desc || 'A WebSQL database manipulated via ChopJS';
    this.dbSize = size || WEBSQL_SIZE;
    // If `version` is a number, make it into a string.
    if (typeof this.dbVersion === 'number') {
      this.dbVersion = this.dbVersion + '';
    }

    // If `size` is a string, make it into a number (integer).
    if (typeof this.dbSize === 'string') {
      this.dbSize = parseInt(this.dbSize, 10);
    }

    // Now open the WebSQL database
    this.db = openDatabase(this.dbName, this.dbVersion,
                           this.dbDesc, this.dbSize);
  }

  // Now let's attach methods to WebSQL prototype.
  // By `WebSQL`, I mean the ChopJS WebSQL object.
  WebSQL.prototype = {

    // Let's call `executeSql` method `query` for short.
    // `query` takes a SQL string and an optional data array as parameters.
    query: function (sql, data) {
      // If no parameter presented, throw an error.
      if (arguments.length === 0) {
        throw new Error('ChopJS WebSQL query requires a parameter.');
      }

      // If the type of `sql` is not string, throw an error.
      if (typeof sql !== 'string') {
        throw new Error('ChopJS WebSQL query requires a string-type SQL parameter.');
      }

      // If no `data` presented, make it an empty array.
      if (!data) {
        data = [];
      }

      // Create a WebSQL callback object.
      var callback = new WebSQLCallback();

      // Start WebSQL transaction.
      this.db.transaction(function (tx) {
        // Error callback.
        var errorCb = function (tx, error) {
          // Invoke error callback.
          callback.errorCb.apply(this, [tx, error]);
        };

        // Success callback.
        var successCb = function (tx, result) {
          // Convert query results into an array.
          var results = [];
          var len = result.rows.length;
          for (var i = 0; i !== len; ++i) {
            results.push(result.rows.item(i));
          }

          // Invoke success callback.
          callback.successCb.apply(this, [tx, results]);
        };

        // Execute SQL now.
        tx.executeSql(sql, data, successCb, errorCb);
      });

      // Return WebSQL Callback object to allow `done` invocation.
      return callback;
    }
  };

  // WebSQL Callback
  function WebSQLCallback() {
    this.errorCb = function () {return;};
    this.successCb = function () {return;};
  }

  // Attach `done` method to WebSQL Callback prototype.
  WebSQLCallback.prototype = {
    // `done` takes a success callback and
    // an optional error callback as parameters.
    done: function (success, error) {
      if (success) {
        this.successCb = success;
      }
      if (error) {
        this.errorCb = error;
      }
    }
  };

});
