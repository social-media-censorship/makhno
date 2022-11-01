/*
 * this file implement the I/O for the database,
 * at the moment it supports only mongodb, but this
 * might also wrap other ORM in the case new database type
 * would be supported.
 */

const { connect } = require('../../utils/mongo');
const debug = require('debug')('scheduled:database');

async function queryScheduled(db, filter) {
  const client = await connect(db);
  try {
    let r = await client
      .db()
      .collection("scheduled")
      .find(filter)
      .toArray();
    debug("Scheduled query by %O = %d", filter, r.length);
    await client.close();
    return r;
  } catch(error) {
    debug("Error in queryScheduled: %s", error.message);
    await client.close();
    throw new Error(`queryScheduled: ${error.message}`);
  }
}

async function createScheduled(db, listofobjs) {
  const client = await connect(db);
  const results = { inserted: 0, duplicated: 0, testId: [] };
  for(const entry of listofobjs) {
    debug("Inserting %s (%s)", entry.testId, entry.vantagePoint);
    entry.testTime = new Date(entry.testTime);
    try {
      await client
        .db()
        .collection("scheduled")
        .insertOne(entry);
      results.inserted++;
      results.testId.push(entry.testId);
    } catch(error) {
      if(error.code === 11000) {
        /* duplication of an unique key */
        results.duplicated++;
      } else {
        await client.close();
        debug("Error in createScheduled: %s", error.message);
        throw new Error(`createScheduled: ${error.message}`);
      }
    }
  }
  await client.close();
  return results;
}

async function removeScheduled(db, testId) {
  if(testId?.length !== 40) {
    throw new Error(`Attempt to remove a testId with invalid size (${testId?.length})`);
  }

  const client = await connect(db);
  try {
    await client
      .db()
      .collection("scheduled")
      .deleteOne({ testId });
    await client.close();
    return true;
  } catch(error) {
    debug("Error in removeScheduled %s: %s", testId, error.message);
    await client.close();
    return false;
  }
}

module.exports = {
  queryScheduled,
  createScheduled,
  removeScheduled,
}
