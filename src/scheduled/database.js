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

async function createScheduled(db, payload) {
  const client = await connect(db);
  try {
    await client
      .db()
      .collection("scheduled")
      .insertOne(payload);
    debug("Scheduled operation succesfully added to DB");
    await client.close();
    /* successful creation is a 'true' */
    return true;
  } catch(error) {
    await client.close();
    if(error.code === 11000) {
      /* duplication of an unique key */
      return false;
    }
    debug("Error in createScheduled: %s", error.message);
    throw new Error(`createScheduled: ${error.message}`);
  }
}

module.exports = {
  queryScheduled,
  createScheduled,
}
