/*
 * this file implement the I/O for the database,
 * at the moment it supports only mongodb, but this
 * might also wrap other ORM in the case new database type
 * would be supported.
 */

const { connect } = require('./mongo');
const debug = require('debug')('utils:database');

async function querySubmission(db, filter) {
  const client = await connect(db);
  let r = [];
  try {
    r = await client
      .db()
      .collection("submission")
      .find(filter)
      .toArray();
    debug("Submissions by %O = %d", filter, r.length);
  } catch(error) {
    debug("Error in querySubmission: %s", error.message);
    throw new Error(`querySubmission: ${error.message}`);
  }
  await client.close();
  return r;
}

async function createSubmission(db, payload) {
  const client = await connect(db);
  try {
    await client
      .db()
      .collection("submission")
      .insertOne(payload);
    debug("submission succesfully added to DB");
  } catch(error) {
    debug("Error in createSubmission: %s", error.message);
  }
  await client.close();
}

module.exports = {
  querySubmission,
  createSubmission,
}
