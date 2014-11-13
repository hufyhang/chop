// ChopJS offline database BDD test
// ================================

/* jshint multistr:true */
/* global describe, it, chai, $ch */

// Make a shorthand for chai.expect.
var expect = chai.expect;

// Define some constant value of database information
var WEBSQL = {
  name: 'mochaTest',
  version: '1.0',
  sampleVersion: '2.0',
  desc: 'Mocha Test WebSQL DB',
  size: 5 * 1024 * 1024,

  createTable: 'CREATE TABLE IF NOT EXISTS foo (id unique, text)',
  insertTable: 'INSERT INTO foo (id, text) VALUES (1, "Foo")',
  insertTableData: 'INSERT INTO foo (id, text) VALUES (?, ?)',
  insertTableDataData: [2, 'Bar'],
  selectFromTable: 'SELECT * FROM foo',
  dropTable: 'DROP TABLE foo',

  sampleCreateTable: 'CREATE TABLE IF NOT EXISTS bar (id unique, text)',
  sampleInsertTable: 'INSERT INTO bar (id, text) VALUES (1, "Foo")',
  sampleSelectFromTable: 'SELECT * FROM bar',
  sampleDropTable: 'DROP TABLE bar',
};


// Desceibe what module is about to be tested.
describe('ChopJS Offline database module', function () {
  'use strict';

  // Since db module is already loaded via `script`,
  // db namespace should has been attached to $ch.
  // In other words, `$ch.db` here should not be `undefined`.
  it('Should attached to $ch namespace', function () {
    expect($ch.db).to.not.equal(undefined);
  });

  // Let's fistly talk about WebSQL.
  describe('WebSQL', function () {

    // Going to be assigned ChopJS WebSQL object later.
    var websql;
    // To be assigned a vanilla WebSQL object.
    var db;

    // constructor
    // ----------
    describe('constructor', function () {
      // An error should be thrown if browser does not support WebSQl.
      // To test this, let's set `window.openDatabase` to `undefined` first.
      var openDb = window.openDatabase;
      window.openDatabase = undefined;
      it('Should throw error if WebSQL is not supported', function () {
        expect($ch.db.websql).to.throw(Error);
      });

      // Now, reset `window.openDatabase` to bring WebSQL back.
      window.openDatabase = openDb;

      // An error should be thrown if no parameters
      // presented when calling `$ch.db.websql`.
      it('Should throw error if no parameters presented', function () {
        expect($ch.db.websql).to.throw(Error);
      });

      // If sufficient parameters are provideed,
      // a ChopJS WebSQL object should be created
      // by calling `$ch.db.websql`, which means
      // `websql` here should not be undefined.
      websql = $ch.db.websql(WEBSQL.name, WEBSQL.version,
                             WEBSQL.desc, WEBSQL.size);
      it('Should create a ChopJS WebSQL object once \
         sufficient parameters are provided', function () {
          expect(websql).to.not.equal(undefined);
         });

    });

    // To be assigned the result of vanilla WebSQL transaction.
    var sampleResult;

    // Now open another database with the same configurations of `websql`,
    // and assign it to `db`.
    db = openDatabase(WEBSQL.name, WEBSQL.version, WEBSQL.desc, WEBSQL.size);
    // Execute sample queries to be checked against later by ChopJS WebSQL object.
    db.transaction(function (tx) {
      tx.executeSql(WEBSQL.sampleCreateTable);
      tx.executeSql(WEBSQL.sampleInsertTable);
      tx.executeSql(WEBSQL.sampleSelectFromTable, [], function (tx, result) {
        sampleResult = result;
      });
    });

    // #query, #done
    // ----------
    describe('#query & #done', function () {
      // Calling `query` should bring the same result as invoking
      // vanilla WebSQL exetureSql method.
      it('Should lead to the same execuration result as \
         vanilla WebSQL executeSql does', function () {
          // Create a table first
          websql.query(WEBSQL.createTable);
          websql.query(WEBSQL.insertTable);
          websql.query(WEBSQL.selectFromTable)
          .done(function (tx, rows) {
            // Iterate through all `rows`, and check against `sampleResult`.
            $ch.each(rows, function (row, index) {
              var sampleRow = sampleResult.rows.item(index);
              console.log(sampleRow, row);
              expect(row.id).to.equal(sampleRow.id);
              expect(row.text).to.equal(sampleRow.text);
            });
          });

          // Drop testing table.
          websql.query(WEBSQL.dropTable);
        });

        // `query` should also be chainable.
        it('Should be chainable', function () {
          // Same SQL statements, but chained together this time.
          websql.query(WEBSQL.createTable)
          .query(WEBSQL.insertTable)
          .query(WEBSQL.selectFromTable)
          .done(function (tx, rows) {
            // Iterate through all `rows`, and check against `sampleResult`.
            $ch.each(rows, function (row, index) {
              var sampleRow = sampleResult.rows.item(index);
              console.log(sampleRow, row);
              expect(row.id).to.equal(sampleRow.id);
              expect(row.text).to.equal(sampleRow.text);
            });
          });

          // Drop testing table.
          websql.query(WEBSQL.dropTable);
        });
      });

    // Remove the sample table.
    db.transaction(function (tx) {
      tx.executeSql(WEBSQL.sampleDropTable);
    });

  });
});

