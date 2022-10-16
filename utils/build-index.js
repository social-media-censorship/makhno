/*
 * this file ensure there are the corret indexes, and it is 
 * executed at the start of every service that uses MongoDB.
 *
 * it has also the helpful side effect to verify if the DB 
 * is running or not.
 */

const { connect } = require('./mongo');
const _ = require('lodash');
const debug = require('debug')('utils:build-index');
const fsx = require('fs-extra');
const path = require('path');

async function ensureIndex(db, filter) {
  /* filter, if present as an array, select with are the
   * only collection to be considered. by default is all the 
   * few configured in config/database.json, but this decision
   * can be controlled by the invoker */
  const dbfile = await fsx.readJson(path.join('config', 'database.json'));

  const indexes = _.compact(_.map(dbfile, function(info, cName) {

    if(filter.length && !_.includes(filter, cName))
      return null;

    if(!info.index)
      return null;

    return {
      collection: cName,
      index: info.index,
    };
  }));
  debug("Collections/Indexes considered: %d", indexes.length);

  const client = await connect(db);

  const createdIndexes = {};
  try {
    for(const collection of indexes) {
      debug("Checkingx & configuring index %s (%d)",
        collection.collection, collection.index.length);
      for(const index of collection.index) {
        r = await client
          .db()
          .collection(collection.collection)
          .createIndex(index.key, index.options || {});
        debug("Index %s OK", _.keys(index.key));
      }
      createdIndexes[collection.collection] = collection.index.length;
    }
  } catch(error) {
    debug("Error in createIndex: %s", error.message);
    return false;
  }
  await client.close();
  return createdIndexes;
}

module.exports = {
  ensureIndex,
}
