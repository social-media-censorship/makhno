/*
 * this file implement the I/O for the database,
 * at the moment it supports only mongodb, but this
 * might also wrap other ORM in the case new database type
 * would be supported.
 */


async function querySubmission(db, filter) {
  console.log("querySubmission", db, filter);
}

async function createSubmission(db, payload) {
  console.log("createSubmission", db, payload);
}

module.exports = {
  querySubmission,
  createSubmission,
}
