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
  const results = { inserted: 0, duplicated: 0, testId: [] };
  for(const entry of listofobjs) {
    entry.testTime = new Date(testTime);
    debug("Inserting %s (%s)", entry.testId, entry.vantagePoint);
    try {
      await client
        .db()
        .collection("results")
        .insertOne(entry);
      results.inserted++;
      results.testId.push(entry.testId);
    } catch(error) {
      if(error.code === 11000) {
        /* duplication of an unique key */
        results.duplicated++;
      } else {
        await client.close();
        debug("Error in createResults: %s", error.message);
        throw new Error(`createResults: ${error.message}`);
      }
    }
  }
  await client.close();
  return results;
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
      .deleteOne({ testId });
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
