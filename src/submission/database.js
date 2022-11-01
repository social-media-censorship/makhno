/*
 * this file implement the I/O for the database,
 * at the moment it supports only mongodb, but this
 * might also wrap other ORM in the case new database type
 * would be supported.
 */

const { connect } = require('../../utils/mongo');
const debug = require('debug')('utils:database');

async function querySubmission(db, filter) {
  const client = await connect(db);
  try {
    let r = await client
      .db()
      .collection("submission")
      .find(filter)
      .toArray();
    debug("Submissions by %O = %d", filter, r.length);
    await client.close();
    return r;
  } catch(error) {
    debug("Error in querySubmission: %s", error.message);
    await client.close();
    throw new Error(`querySubmission: ${error.message}`);
  }
}

async function createSubmission(db, payload) {
  const client = await connect(db);
  payload.creationTime = new Date(payload.creationTime);
  try {
    await client
      .db()
      .collection("submission")
      .insertOne(payload);
    debug("submission succesfully added to DB");
    await client.close();
    /* successful creation is a 'true' */
    return true;
  } catch(error) {
    await client.close();
    if(error.code === 11000) {
      /* duplication of an unique key */
      return false;
    }
    debug("Error in createSubmission: %s", error.message);
    throw new Error(`createSubmission: ${error.message}`);
  }
}

module.exports = {
  querySubmission,
  createSubmission,
}
