/*
 * this file implement the I/O for the database,
 * at the moment it supports only mongodb, but this
 * might also wrap other ORM in the case new database type
 * would be supported.
 */

const { connect } = require('../../utils/mongo');
const debug = require('debug')('results:database');

async function queryResults(db, filter) {
  const client = await connect(db);
  try {
    let r = await client
      .db()
      .collection("results")
      .find(filter)
      .toArray();
    debug("results query by %O = %d", filter, r.length);
    await client.close();
    return r;
  } catch(error) {
    debug("Error in queryResults: %s", error.message);
    await client.close();
    throw new Error(`queryResults: ${error.message}`);
  }
}

async function createResults(db, listofobjs) {
  const client = await connect(db);
  let inserted = 0;
  for(const entry of listofobjs) {
    entry.testTime = new Date(entry.testTime);
    try {
      await client
        .db()
        .collection("results")
        .insertOne(entry);
      inserted++;
    } catch(error) {
      await client.close();
      debug("Error in createResults: %s", error.message);
      throw new Error(`createResults: ${error.message}`);
    }
  }
  debug("createResults inserted %d", inserted)
  await client.close();
  return inserted;
}

async function removeResults(db, testId) {
  if(testId?.length !== 40) {
    throw new Error(`Attempt to remove a testId with invalid size (${testId?.length})`);
  }

  const client = await connect(db);
  try {
    await client
      .db()
      .collection("results")
      .deleteMany({ testId });
    await client.close();
    return true;
  } catch(error) {
    debug("Error in removeResults %s: %s", testId, error.message);
    await client.close();
    return false;
  }
}

module.exports = {
  queryResults,
  createResults,
  removeResults,
}
